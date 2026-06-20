import React, { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import { useCurrentUser } from '../../hooks/usePatientData';
import { SkeletonCard } from '../../components';
import { formatDateTime } from '../../utils';
import { supabase } from '../../lib/supabase';

interface DoctorConsent {
  id: string;
  health_id: string;
  doctor_name: string;
  doctor_id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  request_date: string;
  updated_at: string;
}

export function ConsentCentre() {
  const { profile, loading: authLoading } = useCurrentUser();
  const healthId = profile?.health_id || null;
  const [consents, setConsents] = useState<DoctorConsent[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!healthId) {
      setLoading(false);
      return;
    }
    async function fetchConsents() {
      const { data } = await supabase
        .from('doctor_consents')
        .select('*')
        .eq('health_id', healthId)
        .order('request_date', { ascending: false });
      setConsents(data || []);
      setLoading(false);
    }
    fetchConsents();
  }, [healthId]);

  const handleApprove = async (id: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('doctor_consents')
      .update({ status: 'Approved', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'Approved' } : c))
      );
    }
    setUpdatingId(null);
  };

  const handleReject = async (id: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('doctor_consents')
      .update({ status: 'Rejected', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'Rejected' } : c))
      );
    }
    setUpdatingId(null);
  };

  const isLoading = authLoading || loading;
  const pending = consents.filter((c) => c.status === 'Pending');
  const approved = consents.filter((c) => c.status === 'Approved');
  const rejected = consents.filter((c) => c.status === 'Rejected');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard lines={1} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={1} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Consent Centre</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage which doctors can access your health records
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card-solid p-4 text-center">
          <p className="text-3xl font-bold text-warning-500">{pending.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Requests</p>
        </div>
        <div className="glass-card-solid p-4 text-center">
          <p className="text-3xl font-bold text-emerald-500">{approved.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
        </div>
        <div className="glass-card-solid p-4 text-center">
          <p className="text-3xl font-bold text-danger-500">{rejected.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
        </div>
        <div className="glass-card-solid p-4 text-center">
          <p className="text-3xl font-bold text-primary-500">{consents.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
        </div>
      </div>

      {/* Pending Consent Requests */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-warning-500" />
          Pending Doctor Requests
        </h2>
        {pending.length > 0 ? (
          <div className="space-y-4">
            {pending.map((request) => (
              <div key={request.id} className="glass-card-solid p-4 border-l-4 border-warning-500">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-5 h-5 text-primary-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {request.doctor_name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        Doctor
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Requested access on {formatDateTime(request.request_date)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={updatingId === request.id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={updatingId === request.id}
                      className="px-4 py-2 bg-danger-600 hover:bg-danger-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card-solid p-8 text-center">
            <Shield className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No pending doctor requests</p>
          </div>
        )}
      </div>

      {/* Approved Doctors */}
      {approved.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Approved Doctors
          </h2>
          <div className="space-y-4">
            {approved.map((request) => (
              <div key={request.id} className="glass-card-solid p-4 border-l-4 border-emerald-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{request.doctor_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Approved on {formatDateTime(request.updated_at)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    Active Access
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Requests */}
      {rejected.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-danger-500" />
            Rejected Requests
          </h2>
          <div className="space-y-4">
            {rejected.map((request) => (
              <div key={request.id} className="glass-card-solid p-4 border-l-4 border-danger-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-danger-600 dark:text-danger-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{request.doctor_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Rejected on {formatDateTime(request.updated_at)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400">
                    Denied Access
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
