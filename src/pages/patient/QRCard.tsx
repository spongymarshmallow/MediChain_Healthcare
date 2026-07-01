import React from 'react';
import { Download, Smartphone, FileText, QrCode, Heart, Phone, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCurrentUser, usePatientRecords } from '../../hooks/usePatientData';
import { SkeletonCard } from '../../components';

const PATIENT_PROFILES: Record<string, { age: number; bloodGroup: string; allergies: string[]; emergencyContact: { name: string; phone: string }; gender: string }> = {
  'MC-2026-00000001': {
    age: 34,
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Sulfa'],
    emergencyContact: { name: 'Priya Sharma', phone: '+91 98765 43210' },
    gender: 'Male',
  },
};

export function QRCard() {
  const { profile, loading: authLoading } = useCurrentUser();
  const healthId = profile?.health_id || null;
  const { data, loading: dataLoading } = usePatientRecords(healthId);

  const loading = authLoading || dataLoading;
  const patientInfo = healthId ? PATIENT_PROFILES[healthId] : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={4} />
      </div>
    );
  }

  if (!profile || !healthId) {
    return (
      <div className="glass-card-solid p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your QR card.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QR Health Card</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your digital health identity card for quick access
        </p>
      </div>

      {/* Health Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-md aspect-[1.6/1] bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative flex h-full">
            {/* Left side - info */}
            <div className="flex-1 space-y-3">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6" />
                <span className="font-bold text-lg">MediChain</span>
              </div>

              {/* Health ID */}
              <div className="space-y-1">
                <p className="text-xs opacity-80">Health ID</p>
                <p className="font-mono font-bold text-sm tracking-wide">{healthId}</p>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <p className="text-xs opacity-80">Name</p>
                <p className="font-semibold">{profile.name}</p>
              </div>

              {/* Blood Group & Age */}
              <div className="flex gap-4">
                <div className="space-y-1">
                  <p className="text-xs opacity-80">Blood</p>
                  <p className="font-bold text-xl">{patientInfo?.bloodGroup || '--'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs opacity-80">Age</p>
                  <p className="font-bold text-xl">{patientInfo?.age || '--'}</p>
                </div>
              </div>
            </div>

            {/* Right side - QR Code */}
            <div className="flex flex-col items-end justify-between">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG
                  value={healthId}
                  size={96}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  level="M"
                />
              </div>
              <p className="text-xs opacity-80 mt-2">Scan for records</p>
            </div>
          </div>

          {/* Emergency info strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur px-4 py-2 flex items-center gap-4 text-xs">
            {patientInfo?.emergencyContact && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{patientInfo.emergencyContact.phone}</span>
              </div>
            )}
            {patientInfo?.allergies && patientInfo.allergies.length > 0 && (
              <div className="flex items-center gap-1 text-warning-300">
                <AlertTriangle className="w-3 h-3" />
                <span>{patientInfo.allergies.slice(0, 2).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Card Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Health ID</span>
              <span className="font-mono text-gray-900 dark:text-white">{healthId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Name</span>
              <span className="text-gray-900 dark:text-white">{profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Blood Group</span>
              <span className="font-bold text-danger-500">{patientInfo?.bloodGroup || 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Age</span>
              <span className="text-gray-900 dark:text-white">{patientInfo?.age ? `${patientInfo.age} years` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Gender</span>
              <span className="text-gray-900 dark:text-white">{patientInfo?.gender || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Emergency Contact</span>
              <span className="text-gray-900 dark:text-white text-xs">{patientInfo?.emergencyContact?.name || 'N/A'}</span>
            </div>
          </div>
        </div>
        {patientInfo?.allergies && patientInfo.allergies.length > 0 && (
          <div className="mt-4 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
            <p className="text-xs font-medium text-warning-800 dark:text-warning-400 mb-1">Allergies</p>
            <div className="flex flex-wrap gap-2">
              {patientInfo.allergies.map((allergy, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-warning-100 dark:bg-warning-900/50 text-warning-700 dark:text-warning-400 rounded-full">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Download Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group">
            <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Download PDF</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Print-friendly format</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group">
            <Smartphone className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wallet Card</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Add to digital wallet</span>
          </button>
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group">
            <QrCode className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">QR Code Only</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Standalone QR image</span>
          </button>
        </div>
      </div>
    </div>
  );
}
