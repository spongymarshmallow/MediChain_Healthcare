import React, { useState } from 'react';
import { Building2, UserPlus, FileText, Users, LayoutGrid, BedDouble, Stethoscope, FolderUp, AlertCircle } from 'lucide-react';
import { patients, hospitals, doctors, admissions, generateHealthId } from '../../data';
import { StatCard } from '../../components';

export function HospitalDashboard() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
  });
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  const currentHospital = hospitals[0]; // Apollo Hospital for demo
  const activeAdmissions = admissions.filter(a => a.status === 'Admitted');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const healthId = generateHealthId();
    setRegisteredId(healthId);
    setShowRegistration(false);
    setNewPatient({ name: '', age: '', gender: 'Male', bloodGroup: 'O+' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hospital Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">{currentHospital.name} - {currentHospital.type}</p>
        </div>
        <button
          onClick={() => setShowRegistration(!showRegistration)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Register Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Patients" value={patients.length} iconColor="text-primary-500 bg-primary-100 dark:bg-primary-900/30" />
        <StatCard icon={<BedDouble className="w-5 h-5" />} label="Active Admissions" value={activeAdmissions.length} iconColor="text-warning-500 bg-warning-100 dark:bg-warning-900/30" />
        <StatCard icon={<Stethoscope className="w-5 h-5" />} label="Doctors" value={doctors.filter(d => d.hospital === currentHospital.name).length} iconColor="text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30" />
        <StatCard icon={<FileText className="w-5 h-5" />} label="Records" value="1,245" iconColor="text-blue-500 bg-blue-100 dark:bg-blue-900/30" />
        <StatCard icon={<BedDouble className="w-5 h-5" />} label="Available Beds" value={currentHospital.availableBeds} iconColor="text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30" />
        <StatCard icon={<AlertCircle className="w-5 h-5" />} label="Pending Access" value="3" iconColor="text-danger-500 bg-danger-100 dark:bg-danger-900/30" />
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card-solid p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary-500" />
              Register New Patient
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  placeholder="Patient's full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    min={1} max={120}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
                <select
                  value={newPatient.bloodGroup}
                  onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistration(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Success */}
      {registeredId && (
        <div className="glass-card-solid p-6 border-l-4 border-emerald-500">
          <div className="flex items-start gap-4">
            <FolderUp className="w-6 h-6 text-emerald-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Patient Registered Successfully</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Health ID generated: <span className="font-mono font-bold text-primary-600">{registeredId}</span>
              </p>
              <button
                onClick={() => setRegisteredId(null)}
                className="text-xs text-gray-500 dark:text-gray-400 mt-2 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admissions Table */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary-500" />
          Active Admissions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Department</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Doctor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Room</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Since</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {activeAdmissions.map(adm => (
                <tr key={adm.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{adm.patientName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{adm.department}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{adm.doctorName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{adm.roomNumber}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{adm.admissionDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{adm.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
