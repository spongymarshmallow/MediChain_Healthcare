import React, { useState } from 'react';
import { Store, FileCheck, Search, Pill, AlertTriangle, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { prescriptions, medicines, doctors, hospitals } from '../../data';
import { StatusBadge } from '../../components';
import { usePrescriptionStore } from '../../store';
import { formatDate } from '../../utils';

export function PharmacyDashboard() {
  const [selectedRx, setSelectedRx] = useState<typeof prescriptions[0] | null>(null);
  const { updatePrescriptionStatus } = usePrescriptionStore();

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending');

  const handleDispense = (id: string) => {
    updatePrescriptionStatus(id, 'Fulfilled');
    setSelectedRx(null);
  };

  const getMedicineDetails = (name: string) => {
    return medicines.find(m => m.brandName.toLowerCase().includes(name.split(' ')[0].toLowerCase()));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pharmacy Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Apollo Pharmacy - Verified Medicine Dispensary</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card-solid p-4 text-center">
          <p className="text-3xl font-bold text-warning-500">{pendingPrescriptions.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Prescriptions</p>
        </div>
        <div className="glass-card-solid p-4 text-center">
          <p className="text-3xl font-bold text-emerald-500">{prescriptions.filter(p => p.status === 'Fulfilled').length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Fulfilled</p>
        </div>
        <div className="glass-card-solid p-4 text-center">
          <p className="text-3xl font-bold text-primary-500">98%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Verification Rate</p>
        </div>
        <div className="glass-card-solid p-4 text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">Rs.45,200</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Potential Savings</p>
        </div>
      </div>

      {/* Prescription Queue */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Store className="w-5 h-5 text-primary-500" />
          Prescription Queue
        </h2>
        <div className="space-y-4">
          {pendingPrescriptions.length > 0 ? pendingPrescriptions.map(rx => {
            const doctor = doctors.find(d => d.id === rx.doctorId);
            const hospital = hospitals.find(h => h.id === rx.hospitalId);
            return (
              <div key={rx.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">Rx: {rx.id}</p>
                      <StatusBadge status="Pending" size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rx.medicines.length} medication(s) | {rx.date}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Dr. {doctor?.name} | {hospital?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRx(rx)}
                    className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No pending prescriptions
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {selectedRx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card-solid p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary-500" />
              Verify Prescription
            </h2>

            {/* Verification Checks */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-300">Doctor Verified</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">License: {doctors.find(d => d.id === selectedRx.doctorId)?.license}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-300">Hospital Verified</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">{hospitals.find(h => h.id === selectedRx.hospitalId)?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-300">Prescription Authentic</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">Digital signature verified</p>
                </div>
              </div>
            </div>

            {/* Medicines */}
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Medicines</h3>
            <div className="space-y-3 mb-6">
              {selectedRx.medicines.map((med, i) => {
                const medDetails = getMedicineDetails(med.name);
                return (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">{med.name}</p>
                      {medDetails && (
                        <StatusBadge status={medDetails.verificationStatus} size="sm" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {med.dosage} | {med.frequency} | {med.duration}
                    </p>
                    {medDetails && (
                      <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Generic alternative available
                        </p>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Brand: Rs.{medDetails.brandPrice}</span>
                          <span className="text-gray-600 dark:text-gray-400">Generic: Rs.{medDetails.genericPrice}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Save {Math.round((1 - medDetails.genericPrice / medDetails.brandPrice) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedRx(null)}
                className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDispense(selectedRx.id)}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Dispense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
