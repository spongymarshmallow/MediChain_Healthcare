import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

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
    if (!healthId) {
      setLoading(false);
      return;
    }
    async function fetchDetails() {
      const { data: details } = await supabase
        .from('patient_details')
        .select('*')
        .eq('health_id', healthId)
        .maybeSingle();
      setData(details);
      setLoading(false);
    }
    fetchDetails();
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
    if (!healthId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      const [labReportsRes, prescriptionsRes, vaccinationsRes, healthLogsRes, consentRes, blockchainRes] = await Promise.all([
        supabase.from('lab_reports').select('*').eq('health_id', healthId).order('date', { ascending: false }),
        supabase.from('prescriptions').select('*').eq('health_id', healthId).order('date', { ascending: false }),
        supabase.from('vaccinations').select('*').eq('health_id', healthId).order('date', { ascending: false }),
        supabase.from('health_logs').select('*').eq('health_id', healthId).order('date', { ascending: false }),
        supabase.from('consent_requests').select('*').eq('health_id', healthId).order('request_date', { ascending: false }),
        supabase.from('blockchain_transactions').select('*').eq('patient_health_id', healthId).order('block_number', { ascending: false }),
      ]);
      setData({
        labReports: labReportsRes.data ?? [],
        prescriptions: prescriptionsRes.data ?? [],
        vaccinations: vaccinationsRes.data ?? [],
        healthLogs: healthLogsRes.data ?? [],
        consentRequests: consentRes.data ?? [],
        blockchainTransactions: blockchainRes.data ?? [],
      });
      setLoading(false);
    }

    fetchData();
  }, [healthId, fetchTrigger]);

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

  return { data, loading, refetch };
}

// Real-time hook specifically for health logs
export function useHealthLogs(healthId: string | null) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!healthId) {
      setLoading(false);
      return;
    }

    async function fetchLogs() {
      const { data } = await supabase
        .from('health_logs')
        .select('*')
        .eq('health_id', healthId)
        .order('date', { ascending: false });
      setLogs(data ?? []);
      setLoading(false);
    }

    fetchLogs();

    const channel = supabase
      .channel(`health_logs:${healthId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'health_logs', filter: `health_id=eq.${healthId}` },
        (payload) => setLogs((prev) => [payload.new, ...prev])
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'health_logs', filter: `health_id=eq.${healthId}` },
        (payload) => setLogs((prev) => prev.map((l) => (l.id === payload.new.id ? payload.new : l)))
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'health_logs', filter: `health_id=eq.${healthId}` },
        (payload) => setLogs((prev) => prev.filter((l) => l.id !== payload.old.id))
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [healthId]);

  return { logs, loading };
}

// --- Notification helpers ---

async function getPatientUserId(healthId: string): Promise<string | null> {
  const { data } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('health_id', healthId)
    .maybeSingle();
  return data?.user_id ?? null;
}

async function notifyPatient(
  healthId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  const userId = await getPatientUserId(healthId);
  if (!userId) return;
  await supabase.from('notifications').insert({
    user_id: userId,
    health_id: healthId,
    type,
    title,
    message,
    link: link ?? null,
  });
}

// --- Doctor consent ---

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
    if (existing.status === 'Rejected') {
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
    return { data: existing, error: null };
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

// --- Medical record helpers ---

export async function addLabReport(healthId: string, report: {
  test_name: string;
  status: string;
  date: string;
  hospital: string;
  doctor: string;
  values: Array<{ parameter: string; value: string; unit: string; referenceRange: string; status: string }>;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('lab_reports')
    .insert({ patient_id: user?.id, health_id: healthId, ...report, values: report.values })
    .select()
    .single();

  if (!error && data) {
    await addBlockchainTransaction('updateRecord', 'Doctor', healthId, `Lab report added: ${report.test_name}`);
    await notifyPatient(healthId, 'Report Uploaded', 'Lab Report Available',
      `Your ${report.test_name} results have been uploaded by ${report.doctor}.`, '/patient/timeline');
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
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('prescriptions')
    .insert({ patient_id: user?.id, health_id: healthId, ...prescription, medicines: prescription.medicines })
    .select()
    .single();

  if (!error && data) {
    await addBlockchainTransaction('createRecord', prescription.doctor_name, healthId,
      `Prescription created with ${prescription.medicines.length} medicines`);
    await notifyPatient(healthId, 'Prescription Created', 'New Prescription',
      `${prescription.doctor_name} has prescribed ${prescription.medicines.length} medication(s) for you.`, '/patient/timeline');
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
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('vaccinations')
    .insert({ patient_id: user?.id, health_id: healthId, ...vaccination })
    .select()
    .single();

  if (!error && data) {
    await addBlockchainTransaction('updateRecord', vaccination.administered_by, healthId, `Vaccination added: ${vaccination.vaccine}`);
    await notifyPatient(healthId, 'Vaccination Reminder', 'Vaccination Recorded',
      `${vaccination.vaccine} (${vaccination.dose}) has been administered at ${vaccination.hospital}.`, '/patient/timeline');
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
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('health_logs')
    .insert({ patient_id: user?.id, health_id: healthId, ...log })
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
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('consent_requests')
    .insert({
      patient_id: user?.id,
      health_id: healthId,
      ...request,
      records_requested: request.records_requested,
      request_date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (!error && data) {
    await addBlockchainTransaction('grantConsent', request.requester_name, healthId, `Consent requested: ${request.reason}`);
    // Notify the patient themselves about the consent request
    if (user?.id) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        health_id: healthId,
        type: 'Consent Request',
        title: 'New Consent Request',
        message: `${request.requester_name} (${request.requester_type}) is requesting access to your records: ${request.reason}`,
        link: '/patient/consent',
      });
    }
  }
  return { data, error };
}

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
    .single();

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
