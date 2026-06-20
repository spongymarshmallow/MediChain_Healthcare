import React, { useState } from 'react';
import { Search, AlertTriangle, Pill, FileUp, ShieldCheck, AlertCircle, Activity, Plus, X, Lock, CheckCircle, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { addLabReport, addVaccination, requestDoctorConsent } from '../../hooks/usePatientData';
import { StatusBadge } from '../../components';
import { formatDate } from '../../utils';
import { useAuthStore } from '../../store';

interface PatientProfile {
  user_id: string;
  health_id: string;
  name: string;
}

interface LabReport {
  id: string;
  test_name: string;
  date: string;
  status: string;
  hospital: string;
  doctor: string;
  values: Array<{ parameter: string; value: string; unit: string; referenceRange: string; status: string }>;
}

interface Prescription {
  id: string;
  date: string;
  doctor_name: string;
  hospital: string;
  medicines: Array<{ name: string; dosage: string; frequency: string }>;
}

interface Vaccination {
  id: string;
  vaccine: string;
  date: string;
  dose: string;
  hospital: string;
  next_due?: string;
}

interface ConsentStatus {
  status: 'Pending' | 'Approved' | 'Rejected' | 'NotRequested';
  id?: string;
}

export function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PatientProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [healthLogs, setHealthLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState<ConsentStatus>({ status: 'NotRequested' });
  const [showAddLab, setShowAddLab] = useState(false);
  const [showAddVaccination, setShowAddVaccination] = useState(false);
  const [requestingConsent, setRequestingConsent] = useState(false);
  const { userId } = useAuthStore();

  const doctorName = 'Dr. Rajesh Gupta';
  const doctorId = 'doc-rg-001';

  const [newLab, setNewLab] = useState({
    test_name: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Normal',
    values: [{ parameter: '', value: '', unit: '', referenceRange: '', status: 'Normal' }],
  });

  const [newVaccination, setNewVaccination] = useState({
    vaccine: '',
    date: new Date().toISOString().split('T')[0],
    dose: '1st Dose',
    administered_by: '',
    next_due: '',
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const { data } = await supabase
        .from('user_profiles')
        .select('user_id, health_id, name')
        .or(`health_id.ilike.%${query}%,name.ilike.%${query}%`)
        .limit(5);
      setSearchResults(data || []);
    } else {
      setSearchResults([]);
    }
  };

  const loadPatientRecords = async (healthId: string) => {
    setLoading(true);
    const [labRes, prescRes, vaccRes, logsRes] = await Promise.all([
      supabase.from('lab_reports').select('*').eq('health_id', healthId).order('date', { ascending: false }),
      supabase.from('prescriptions').select('*').eq('health_id', healthId).order('date', { ascending: false }),
      supabase.from('vaccinations').select('*').eq('health_id', healthId).order('date', { ascending: false }),
      supabase.from('health_logs').select('*').eq('health_id', healthId).order('date', { ascending: false }).limit(10),
    ]);
    setLabReports(labRes.data || []);
    setPrescriptions(prescRes.data || []);
    setVaccinations(vaccRes.data || []);
    setHealthLogs(logsRes.data || []);
    setLoading(false);
  };

  const checkConsent = async (healthId: string) => {
    const { data } = await supabase
      .from('doctor_consents')
      .select('*')
      .eq('health_id', healthId)
      .eq('doctor_id', doctorId)
      .maybeSingle();

    if (data) {
      setConsent({ status: data.status, id: data.id });
      if (data.status === 'Approved') {
        loadPatientRecords(healthId);
      }
    } else {
      setConsent({ status: 'NotRequested' });
    }
  };

  const selectPatient = (patient: PatientProfile) => {
    setSelectedPatient(patient);
    setSearchResults([]);
    setSearchQuery(patient.health_id);
    setShowAddLab(false);
    setShowAddVaccination(false);
    checkConsent(patient.health_id);
  };

  const handleRequestConsent = async () => {
    if (!selectedPatient) return;
    setRequestingConsent(true);
    const { data } = await requestDoctorConsent(selectedPatient.health_id, doctorName, doctorId);
    if (data) {
      setConsent({ status: 'Pending', id: data.id });
    }
    setRequestingConsent(false);
  };

  const handleAddLabReport = async () => {
    if (!selectedPatient || !newLab.test_name) return;
    await addLabReport(selectedPatient.health_id, {
      test_name: newLab.test_name,
      date: newLab.date,
      status: newLab.status,
      hospital: 'City Hospital',
      doctor: doctorName,
      values: newLab.values,
    });
    setShowAddLab(false);
    setNewLab({
      test_name: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Normal',
      values: [{ parameter: '', value: '', unit: '', referenceRange: '', status: 'Normal' }],
    });
    loadPatientRecords(selectedPatient.health_id);
  };

  const handleAddVaccination = async () => {
    if (!selectedPatient || !newVaccination.vaccine) return;
    await addVaccination(selectedPatient.health_id, {
      vaccine: newVaccination.vaccine,
      date: newVaccination.date,
      dose: newVaccination.dose,
      administered_by: doctorName,
      hospital: 'City Hospital',
      next_due: newVaccination.next_due || undefined,
    });
    setShowAddVaccination(false);
    setNewVaccination({
      vaccine: '',
      date: new Date().toISOString().split('T')[0],
      dose: '1st Dose',
      administered_by: '',
      next_due: '',
    });
    loadPatientRecords(selectedPatient.health_id);
  };

  const warnings: string[] = [];
  if (selectedPatient && consent.status === 'Approved') {
    if (labReports.some(l => l.status === 'Abnormal')) {
      warnings.push('Patient has abnormal lab results - Review recent reports');
    }
    if (prescriptions.length > 2) {
      warnings.push('Multiple prescriptions on record - Review for drug interactions');
    }
    if (healthLogs.filter(l => l.severity === 'Severe').length > 0) {
      warnings.push('Patient has logged severe health episodes recently');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">{doctorName} - General Physician</p>
        </div>
        <div className="flex gap-2">
          <AlertCircle className="w-5 h-5 text-gray-400" />
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Doctor Mode
          </span>
        </div>
      </div>

      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-primary-500" />
          Search Patient by Health ID or Name
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter Health ID (e.g., MC-2026-00000001) or name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              {searchResults.map((patient) => (
                <button
                  key={patient.user_id}
                  onClick={() => selectPatient(patient)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{patient.health_id}</p>
                  </div>
                  <span className="text-xs text-primary-600 dark:text-primary-400">Select</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPatient && (
        <div className="space-y-6">
          <div className="glass-card-solid p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPatient.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPatient.health_id}</p>
              </div>
              <span className="text-sm px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                Patient Found
              </span>
            </div>
          </div>

          {/* Consent Banner */}
          {consent.status === 'NotRequested' && (
            <div className="glass-card-solid p-6 border-l-4 border-warning-500">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-warning-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Consent Required</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    You need the patient's consent to view their full medical history. Click below to request access.
                  </p>
                  <button
                    onClick={handleRequestConsent}
                    disabled={requestingConsent}
                    className="px-4 py-2 bg-warning-600 hover:bg-warning-700 disabled:bg-warning-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {requestingConsent ? 'Requesting...' : 'Request Consent'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {consent.status === 'Pending' && (
            <div className="glass-card-solid p-6 border-l-4 border-warning-500">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-warning-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Consent Request Pending</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have requested access to this patient's records. The patient has not yet responded. Full medical history is locked until consent is granted.
                  </p>
                </div>
              </div>
            </div>
          )}

          {consent.status === 'Approved' && (
            <div className="glass-card-solid p-6 border-l-4 border-emerald-500">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Consent Granted</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have full access to this patient's medical records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {consent.status === 'Rejected' && (
            <div className="glass-card-solid p-6 border-l-4 border-danger-500">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-danger-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Consent Rejected</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    The patient has denied access to their medical records.
                  </p>
                  <button
                    onClick={handleRequestConsent}
                    disabled={requestingConsent}
                    className="px-4 py-2 bg-danger-600 hover:bg-danger-700 disabled:bg-danger-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {requestingConsent ? 'Requesting...' : 'Ask again'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Full records only shown when consent is approved */}
          {consent.status === 'Approved' && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{labReports.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lab Reports</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{prescriptions.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Prescriptions</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{vaccinations.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vaccinations</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">{healthLogs.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Health Logs</p>
                </div>
              </div>

              {/* AI Medical Assistant */}
              {warnings.length > 0 && (
                <div className="glass-card-solid p-6 border-l-4 border-warning-500">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-warning-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Medical Assistant</h3>
                      <ul className="space-y-2 text-sm">
                        {warnings.map((warning, i) => (
                          <li key={i} className="text-warning-700 dark:text-warning-400">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link
                  to="/doctor/prescribe"
                  state={{ patient: selectedPatient }}
                  className="glass-card-solid p-4 text-center hover:shadow-lg transition-all group"
                >
                  <Pill className="w-8 h-8 mx-auto text-primary-500 group-hover:scale-110 transition-transform" />
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Write Prescription</p>
                </Link>
                <button
                  onClick={() => setShowAddLab(true)}
                  className="glass-card-solid p-4 text-center hover:shadow-lg transition-all group"
                >
                  <FileUp className="w-8 h-8 mx-auto text-emerald-500 group-hover:scale-110 transition-transform" />
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Add Lab Report</p>
                </button>
                <button
                  onClick={() => setShowAddVaccination(true)}
                  className="glass-card-solid p-4 text-center hover:shadow-lg transition-all group"
                >
                  <Activity className="w-8 h-8 mx-auto text-warning-500 group-hover:scale-110 transition-transform" />
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Add Vaccination</p>
                </button>
                <button className="glass-card-solid p-4 text-center hover:shadow-lg transition-all group border-2 border-danger-200 dark:border-danger-800">
                  <ShieldCheck className="w-8 h-8 mx-auto text-danger-500 group-hover:scale-110 transition-transform" />
                  <p className="mt-2 text-sm font-medium text-danger-600 dark:text-danger-400">Emergency Access</p>
                </button>
              </div>

              {/* Add Lab Report Modal */}
              {showAddLab && (
                <div className="glass-card-solid p-6 border-2 border-primary-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Add Lab Report</h3>
                    <button onClick={() => setShowAddLab(false)}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Test Name</label>
                      <input
                        type="text"
                        value={newLab.test_name}
                        onChange={(e) => setNewLab({ ...newLab, test_name: e.target.value })}
                        placeholder="e.g., Complete Blood Count"
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={newLab.date}
                        onChange={(e) => setNewLab({ ...newLab, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Status</label>
                      <select
                        value={newLab.status}
                        onChange={(e) => setNewLab({ ...newLab, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Abnormal">Abnormal</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAddLabReport}
                      disabled={!newLab.test_name}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50"
                    >
                      Submit Lab Report
                    </button>
                  </div>
                </div>
              )}

              {/* Add Vaccination Modal */}
              {showAddVaccination && (
                <div className="glass-card-solid p-6 border-2 border-warning-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Add Vaccination Record</h3>
                    <button onClick={() => setShowAddVaccination(false)}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Vaccine Name</label>
                      <input
                        type="text"
                        value={newVaccination.vaccine}
                        onChange={(e) => setNewVaccination({ ...newVaccination, vaccine: e.target.value })}
                        placeholder="e.g., COVID-19 Vaccine"
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={newVaccination.date}
                        onChange={(e) => setNewVaccination({ ...newVaccination, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Dose</label>
                      <select
                        value={newVaccination.dose}
                        onChange={(e) => setNewVaccination({ ...newVaccination, dose: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <option>1st Dose</option>
                        <option>2nd Dose</option>
                        <option>Booster</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Next Due (optional)</label>
                      <input
                        type="date"
                        value={newVaccination.next_due}
                        onChange={(e) => setNewVaccination({ ...newVaccination, next_due: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAddVaccination}
                      disabled={!newVaccination.vaccine}
                      className="px-4 py-2 bg-warning-600 hover:bg-warning-700 text-white rounded-lg disabled:opacity-50"
                    >
                      Submit Vaccination Record
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Lab Reports */}
              <div className="glass-card-solid p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Lab Reports</h3>
                {labReports.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Test</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Hospital</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {labReports.slice(0, 5).map(report => (
                          <tr key={report.id}>
                            <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{report.test_name}</td>
                            <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{formatDate(report.date)}</td>
                            <td className="px-4 py-2">
                              <StatusBadge status={report.status === 'Normal' ? 'Verified' : 'Suspicious'} size="sm" />
                            </td>
                            <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{report.hospital}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">No lab reports yet</p>
                )}
              </div>

              {/* Recent Prescriptions */}
              <div className="glass-card-solid p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Prescriptions</h3>
                {prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions.slice(0, 3).map(presc => (
                      <div key={presc.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{formatDate(presc.date)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">By {presc.doctor_name} at {presc.hospital}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded">
                            {(presc.medicines as any[]).length} medicines
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(presc.medicines as any[]).map((m: any, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">No prescriptions yet</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {!selectedPatient && searchQuery.length > 2 && searchResults.length === 0 && (
        <div className="glass-card-solid p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No patient found with that Health ID or name</p>
        </div>
      )}
    </div>
  );
}
