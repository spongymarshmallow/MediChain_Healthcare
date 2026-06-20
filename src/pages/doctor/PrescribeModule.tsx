import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pill, Plus, Trash2, Send, AlertTriangle, ArrowLeft } from 'lucide-react';
import { medicines } from '../../data';
import { addPrescription } from '../../hooks/usePatientData';
import { StatusBadge } from '../../components';
import { generateId } from '../../utils';

interface MedicineEntry {
  id: string;
  medicineId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PatientProfile {
  user_id: string;
  health_id: string;
  name: string;
}

export function PrescribeModule() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = (location.state?.patient as PatientProfile) || null;

  const [medicines_list, setMedicines] = useState<MedicineEntry[]>([]);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof medicines>([]);
  const [submitting, setSubmitting] = useState(false);

  const addMedicine = (medicine: typeof medicines[0]) => {
    const entry: MedicineEntry = {
      id: generateId('med-entry'),
      medicineId: medicine.id,
      name: `${medicine.brandName} (${medicine.genericName}) ${medicine.dosageStrength}`,
      dosage: medicine.dosageStrength,
      frequency: 'Twice daily',
      duration: '7 days',
      instructions: '',
    };
    setMedicines([...medicines_list, entry]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines_list.filter(m => m.id !== id));
  };

  const updateMedicine = (id: string, field: keyof MedicineEntry, value: string) => {
    setMedicines(medicines_list.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = medicines.filter(
        m => m.brandName.toLowerCase().includes(query.toLowerCase()) ||
             m.genericName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = async () => {
    if (medicines_list.length === 0 || !patient) return;

    setSubmitting(true);
    await addPrescription(patient.health_id, {
      doctor_name: 'Dr. Rajesh Gupta',
      doctor_id: 'doc-001',
      hospital: 'City Hospital',
      hospital_id: 'hosp-001',
      medicines: medicines_list.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions,
      })),
      date: new Date().toISOString().split('T')[0],
      notes,
    });

    setMedicines([]);
    setNotes('');
    setSubmitting(false);
    navigate('/doctor');
  };

  // Check for drug interactions (simplified)
  const hasInteraction = medicines_list.length > 2;

  if (!patient) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Write Prescription</h1>
          <p className="text-gray-500 dark:text-gray-400">No patient selected</p>
        </div>
        <div className="glass-card-solid p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Please search and select a patient first</p>
          <button
            onClick={() => navigate('/doctor')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/doctor')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Write Prescription</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Patient: {patient.name} ({patient.health_id})
          </p>
        </div>
      </div>

      {/* Medicine Search */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-primary-500" />
          Add Medicine
        </h2>
        <div className="relative">
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicine by brand or generic name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              {searchResults.map(med => (
                <button
                  key={med.id}
                  onClick={() => addMedicine(med)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{med.brandName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{med.genericName} - {med.dosageStrength}</p>
                  </div>
                  <StatusBadge status={med.verificationStatus} size="sm" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Medicine List */}
      {medicines_list.length > 0 && (
        <div className="space-y-4">
          {medicines_list.map((med, i) => (
            <div key={med.id} className="glass-card-solid p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{med.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Medicine #{i + 1}</p>
                </div>
                <button
                  onClick={() => removeMedicine(med.id)}
                  className="p-1 rounded hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-danger-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Frequency</label>
                  <select
                    value={med.frequency}
                    onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <option>Once daily</option>
                    <option>Twice daily</option>
                    <option>Three times daily</option>
                    <option>As needed</option>
                    <option>Four times daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g., Take with food"
                    value={med.instructions}
                    onChange={(e) => updateMedicine(med.id, 'instructions', e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drug Interaction Warning */}
      {hasInteraction && (
        <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-warning-800 dark:text-warning-300">Potential Drug Interaction</p>
              <p className="text-sm text-warning-700 dark:text-warning-400">
                Multiple medications prescribed. Review for potential interactions before finalizing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="glass-card-solid p-6">
        <label className="block font-medium text-gray-900 dark:text-white mb-2">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any special instructions or follow-up notes..."
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={medicines_list.length === 0 || submitting}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            medicines_list.length === 0 || submitting
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          <Send className="w-5 h-5" />
          {submitting ? 'Saving...' : 'Create Prescription'}
        </button>
      </div>
    </div>
  );
}
