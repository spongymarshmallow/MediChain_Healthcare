import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface NotificationRow {
  id: string;
  user_id: string;
  health_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  created_at: string;
}

const THREE_MONTHS_AGO = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d.toISOString();
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthId, setHealthId] = useState<string | null>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Resolve this user's health_id from user_profiles
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('health_id')
        .eq('user_id', user.id)
        .maybeSingle();

      const hId = profile?.health_id ?? null;
      setHealthId(hId);
      if (!hId) { setLoading(false); return; }

      // Fetch notifications scoped to this health_id (last 90 days)
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('health_id', hId)
        .gte('created_at', THREE_MONTHS_AGO())
        .order('created_at', { ascending: false });

      setNotifications(data ?? []);
      setLoading(false);

      // Real-time subscription filtered by health_id
      channel = supabase
        .channel(`notifications:${hId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications', filter: `health_id=eq.${hId}` },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const n = payload.new as NotificationRow;
              const cutoff = new Date(THREE_MONTHS_AGO()).getTime();
              if (new Date(n.created_at).getTime() >= cutoff) {
                setNotifications((prev) => [n, ...prev]);
              }
            } else if (payload.eventType === 'UPDATE') {
              setNotifications((prev) =>
                prev.map((n) => (n.id === payload.new.id ? (payload.new as NotificationRow) : n))
              );
            } else if (payload.eventType === 'DELETE') {
              setNotifications((prev) => prev.filter((n) => n.id !== (payload.old as { id: string }).id));
            }
          }
        )
        .subscribe();
    }

    init();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    if (ids.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from('notifications').update({ read: true }).in('id', ids);
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, markAsRead, markAllAsRead, unreadCount, healthId };
}
