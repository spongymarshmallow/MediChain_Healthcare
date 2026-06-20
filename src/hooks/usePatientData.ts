import { useEffect, useState } from 'react';
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
    labReports: [],
    prescriptions: [],
    vaccinations: [],
    healthLogs: [],
    consentRequests: [],
    blockchainTransactions: [],
  });
  const [loading, setLoading] = useState(true);

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
        labReports: labReportsRes.data || [],
        prescriptions: prescriptionsRes.data || [],
        vaccinations: vaccinationsRes.data || [],
        healthLogs: healthLogsRes.data || [],
        consentRequests: consentRes.data || [],
        blockchainTransactions: blockchainRes.data || [],
      });

      setLoading(false);
    }

    fetchData();
  }, [healthId]);

  return { data, loading, refetch: () => setLoading(true) };
}

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
    // If already exists and was rejected, reset to Pending (ask again)
    if (existing.status === 'Rejected') {
      const { data, error } = await supabase
        .from('doctor_consents')
        .update({ status: 'Pending', request_date: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      return { data, error };
    }
    return { data: existing, error: null };
  }

  const { data, error } = await supabase
    .from('doctor_consents')
    .insert({
      health_id: healthId,
      doctor_name: doctorName,
      doctor_id: doctorId,
      status: 'Pending',
      request_date: new Date().toISOString(),
    })
    .select()
    .single();

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
    .insert({
      patient_id: user?.id,
      health_id: healthId,
      ...report,
      values: report.values,
    })
    .select()
    .single();

  if (!error && data) {
    await addBlockchainTransaction(
      'updateRecord',
      'Doctor',
      healthId,
      `Lab report added: ${report.test_name}`
    );
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
    .insert({
      patient_id: user?.id,
      health_id: healthId,
      ...prescription,
      medicines: prescription.medicines,
    })
    .select()
    .single();

  if (!error && data) {
    await addBlockchainTransaction(
      'createRecord',
      prescription.doctor_name,
      healthId,
      `Prescription created with ${prescription.medicines.length} medicines`
    );
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
    .insert({
      patient_id: user?.id,
      health_id: healthId,
      ...vaccination,
    })
    .select()
    .single();

  if (!error && data) {
    await addBlockchainTransaction(
      'updateRecord',
      vaccination.administered_by,
      healthId,
      `Vaccination added: ${vaccination.vaccine}`
    );
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
    .insert({
      patient_id: user?.id,
      health_id: healthId,
      ...log,
    })
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
    await addBlockchainTransaction(
      'grantConsent',
      request.requester_name,
      healthId,
      `Consent requested: ${request.reason}`
    );
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

  const previousHash = lastBlock?.hash || '0x0000000000000000000000000000000000000000000000000000000000000000';
  const blockNumber = (lastBlock?.block_number || 0) + 1;

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
