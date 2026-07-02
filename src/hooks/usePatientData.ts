import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Auth hooks
// ---------------------------------------------------------------------------

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ health_id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    async function fetchProfile(userId: string) {
      const { data } = await supabase
        .from('user_profiles')
        .select('health_id, name')
        .eq('user_id', userId)
        .single();
      setProfile(data);
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading };
}

// ---------------------------------------------------------------------------
// Patient detail + records hooks
// ---------------------------------------------------------------------------

export function usePatientDetails(healthId: string | null) {
  const [data, setData] = useState<{
    name: string;
    age: number;
    height: number;
    weight: number;
    blood_group: string;
    personal_contact: string;
    emergency_contact: string;
    emergency_contact_name: string;
    allergies: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!healthId) { setLoading(false); return; }

    supabase
      .from('patient_details')
      .select('*')
      .eq('health_id', healthId)
      .maybeSingle()
      .then(({ data: details }) => {
        setData(details);
        setLoading(false);
      });
  }, [healthId]);

  return { data, loading };
}

export function usePatientRecords(healthId: string | null) {
  const [data, setData] = useState({
    labReports: [] as any[],
    prescriptions: [] as any[],
    vaccinations: [] as any[],
    healthLogs: [] as any[],
    consentRequests: [] as any[],
    blockchainTransactions: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    if (!healthId) { setLoading(false); return; }

    setLoading(true);
    Promise.all([
      supabase.from('lab_reports').select('*').eq('health_id', healthId).order('date', { ascending: false }),
      supabase.from('prescriptions').select('*').eq('health_id', healthId).order('date', { ascending: false }),
      supabase.from('vaccinations').select('*').eq('health_id', healthId).order('date', { ascending: false }),
      supabase.from('health_logs').select('*').eq('health_id', healthId).order('date', { ascending: false }),
      supabase.from('consent_requests').select('*').eq('health_id', healthId).order('request_date', { ascending: false }),
      supabase.from('blockchain_transactions').select('*').eq('patient_health_id', healthId).order('block_number', { ascending: false }),
    ]).then(([labRes, prescRes, vaccRes, logsRes, consentRes, blockchainRes]) => {
      setData({
        labReports: labRes.data ?? [],
        prescriptions: prescRes.data ?? [],
        vaccinations: vaccRes.data ?? [],
        healthLogs: logsRes.data ?? [],
        consentRequests: consentRes.data ?? [],
        blockchainTransactions: blockchainRes.data ?? [],
      });
      setLoading(false);
    });
  }, [healthId, fetchTrigger]);

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);
  return { data, loading, refetch };
}

// Real-time hook for health logs
export function useHealthLogs(healthId: string | null) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!healthId) { setLoading(false); return; }

    supabase
      .from('health_logs')
      .select('*')
      .eq('health_id', healthId)
      .order('date', { ascending: false })
      .then(({ data }) => {
        setLogs(data ?? []);
        setLoading(false);
      });

    const channel = supabase
      .channel(`health_logs:${healthId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'health_logs', filter: `health_id=eq.${healthId}` },
        (p) => setLogs((prev) => [p.new, ...prev])
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'health_logs', filter: `health_id=eq.${healthId}` },
        (p) => setLogs((prev) => prev.map((l) => (l.id === p.new.id ? p.new : l)))
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'health_logs', filter: `health_id=eq.${healthId}` },
        (p) => setLogs((prev) => prev.filter((l) => l.id !== p.old.id))
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [healthId]);

  return { logs, loading };
}

// ---------------------------------------------------------------------------
// Notification helper — health_id only, no user lookup needed
// ---------------------------------------------------------------------------

async function notifyPatient(healthId: string, type: string, title: string, message: string, link?: string) {
  await supabase.from('notifications').insert({ health_id: healthId, type, title, message, link: link ?? null });
}

// ---------------------------------------------------------------------------
// Doctor consent
// ---------------------------------------------------------------------------

export async function checkDoctorConsent(healthId: string, doctorId: string) {
  const { data, error } = await supabase
    .from('doctor_consents')
    .select('*')
    .eq('health_id', healthId)
    .eq('doctor_id', doctorId)
    .eq('status', 'Approved')
    .maybeSingle();
  return { granted: !!data && !error, data };
}

export async function requestDoctorConsent(healthId: string, doctorName: string, doctorId: string) {
  const { data: existing } = await supabase
    .from('doctor_consents')
    .select('*')
    .eq('health_id', healthId)
    .eq('doctor_id', doctorId)
    .maybeSingle();

  if (existing) {
    if (existing.status !== 'Rejected') return { data: existing, error: null };

    // Re-request after rejection
    const { data, error } = await supabase
      .from('doctor_consents')
      .update({ status: 'Pending', request_date: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (!error) {
      await notifyPatient(healthId, 'Consent Request', 'Consent Request',
        `${doctorName} is requesting access to your medical records.`, '/patient/consent');
    }
    return { data, error };
  }

  const { data, error } = await supabase
    .from('doctor_consents')
    .insert({ health_id: healthId, doctor_name: doctorName, doctor_id: doctorId, status: 'Pending', request_date: new Date().toISOString() })
    .select()
    .single();

  if (!error) {
    await notifyPatient(healthId, 'Consent Request', 'New Consent Request',
      `${doctorName} is requesting access to your medical records.`, '/patient/consent');
  }
  return { data, error };
}

export async function updateDoctorConsent(id: string, status: 'Approved' | 'Rejected') {
  const { data, error } = await supabase
    .from('doctor_consents')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// ---------------------------------------------------------------------------
// Medical record mutations — no auth.getUser() needed; health_id drives RLS
// ---------------------------------------------------------------------------

export async function addLabReport(healthId: string, report: {
  test_name: string;
  status: string;
  date: string;
  hospital: string;
  doctor: string;
  values: Array<{ parameter: string; value: string; unit: string; referenceRange: string; status: string }>;
}) {
  const { data, error } = await supabase
    .from('lab_reports')
    .insert({ health_id: healthId, ...report })
    .select()
    .single();

  if (!error && data) {
    await Promise.all([
      addBlockchainTransaction('updateRecord', 'Doctor', healthId, `Lab report added: ${report.test_name}`),
      notifyPatient(healthId, 'Report Uploaded', 'Lab Report Available',
        `Your ${report.test_name} results have been uploaded by ${report.doctor}.`, '/patient/timeline'),
    ]);
  }
  return { data, error };
}

export async function addPrescription(healthId: string, prescription: {
  doctor_name: string;
  doctor_id: string;
  hospital: string;
  hospital_id: string;
  medicines: Array<{ name: string; dosage: string; frequency: string; duration: string; instructions?: string }>;
  date: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('prescriptions')
    .insert({ health_id: healthId, ...prescription })
    .select()
    .single();

  if (!error && data) {
    await Promise.all([
      addBlockchainTransaction('createRecord', prescription.doctor_name, healthId,
        `Prescription created with ${prescription.medicines.length} medicines`),
      notifyPatient(healthId, 'Prescription Created', 'New Prescription',
        `${prescription.doctor_name} has prescribed ${prescription.medicines.length} medication(s) for you.`, '/patient/timeline'),
    ]);
  }
  return { data, error };
}

export async function addVaccination(healthId: string, vaccination: {
  vaccine: string;
  date: string;
  dose: string;
  administered_by: string;
  hospital: string;
  next_due?: string;
}) {
  const { data, error } = await supabase
    .from('vaccinations')
    .insert({ health_id: healthId, ...vaccination })
    .select()
    .single();

  if (!error && data) {
    await Promise.all([
      addBlockchainTransaction('updateRecord', vaccination.administered_by, healthId,
        `Vaccination added: ${vaccination.vaccine}`),
      notifyPatient(healthId, 'Vaccination Reminder', 'Vaccination Recorded',
        `${vaccination.vaccine} (${vaccination.dose}) has been administered at ${vaccination.hospital}.`, '/patient/timeline'),
    ]);
  }
  return { data, error };
}

export async function addHealthLog(healthId: string, log: {
  symptom: string;
  severity: string;
  duration: number;
  date: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('health_logs')
    .insert({ health_id: healthId, ...log })
    .select()
    .single();
  return { data, error };
}

export async function updateConsentRequest(id: string, status: 'Approved' | 'Rejected', expiryDate?: string) {
  const { data, error } = await supabase
    .from('consent_requests')
    .update({ status, expiry_date: expiryDate, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function addConsentRequest(healthId: string, request: {
  requester_id: string;
  requester_name: string;
  requester_type: string;
  records_requested: string[];
  reason: string;
}) {
  const { data, error } = await supabase
    .from('consent_requests')
    .insert({
      health_id: healthId,
      ...request,
      request_date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (!error && data) {
    await Promise.all([
      addBlockchainTransaction('grantConsent', request.requester_name, healthId,
        `Consent requested: ${request.reason}`),
      notifyPatient(healthId, 'Consent Request', 'New Consent Request',
        `${request.requester_name} (${request.requester_type}) is requesting access to your records: ${request.reason}`,
        '/patient/consent'),
    ]);
  }
  return { data, error };
}

// ---------------------------------------------------------------------------
// Internal: blockchain audit trail
// ---------------------------------------------------------------------------

async function addBlockchainTransaction(
  transactionType: string,
  actor: string,
  patientHealthId: string,
  details: string
) {
  const { data: lastBlock } = await supabase
    .from('blockchain_transactions')
    .select('hash, block_number')
    .order('block_number', { ascending: false })
    .limit(1)
    .maybeSingle();

  const previousHash = lastBlock?.hash ?? '0x0000000000000000000000000000000000000000000000000000000000000000';
  const blockNumber = (lastBlock?.block_number ?? 0) + 1;
  const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  await supabase.from('blockchain_transactions').insert({
    block_number: blockNumber,
    hash,
    previous_hash: previousHash,
    transaction_type: transactionType,
    actor,
    patient_health_id: patientHealthId,
    details,
  });
}
