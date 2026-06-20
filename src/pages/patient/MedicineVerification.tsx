import React, { useState } from 'react';
import { Search, Camera, QrCode, Pill, AlertTriangle, CheckCircle, Info, AlertCircle, Barcode } from 'lucide-react';
import { medicines } from '../../data';
import { StatusBadge } from '../../components';
import { formatDate, getDaysRemaining, isExpired, isExpiringSoon } from '../../utils';
import { calculateMedicineRiskScore, getMedicineVerificationFlags } from '../../utils/riskScorer';
import type { Medicine } from '../../types';

type TabType = 'manual' | 'qr' | 'photo';

export function MedicineVerification() {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = medicines.filter(
        m =>
          m.brandName.toLowerCase().includes(query.toLowerCase()) ||
          m.genericName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleQRScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * medicines.length);
      setSelectedMedicine(medicines[randomIndex]);
      setIsScanning(false);
    }, 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * medicines.length);
        setSelectedMedicine(medicines[randomIndex]);
        setIsScanning(false);
      }, 3000);
    }
  };

  const getStatusStyles = (status: Medicine['verificationStatus']) => {
    switch (status) {
      case 'Verified':
        return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'Suspicious':
        return 'border-warning-500 bg-warning-50 dark:bg-warning-900/20';
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    if (riskLevel === 'Low') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (riskLevel === 'Medium') return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
    return 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400';
  };

  const flags = selectedMedicine ? getMedicineVerificationFlags(selectedMedicine) : [];
  const riskScore = selectedMedicine ? calculateMedicineRiskScore(selectedMedicine) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medicine Verification</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Verify medicine authenticity and detect counterfeits
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-card-solid p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'manual', label: 'Manual Entry', icon: Search },
            { id: 'qr', label: 'QR/Barcode Scan', icon: QrCode },
            { id: 'photo', label: 'Photo Upload', icon: Camera },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Manual Search */}
        {activeTab === 'manual' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicine name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-10">
                {searchResults.slice(0, 5).map((medicine) => (
                  <button
                    key={medicine.id}
                    onClick={() => {
                      setSelectedMedicine(medicine);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{medicine.brandName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{medicine.genericName}</p>
                    </div>
                    <StatusBadge status={medicine.verificationStatus} size="sm" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QR Scan */}
        {activeTab === 'qr' && (
          <div className="text-center">
            {isScanning ? (
              <div className="py-12">
                <div className="animate-spin w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Scanning barcode...</p>
              </div>
            ) : (
              <button
                onClick={handleQRScan}
                className="inline-flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
              >
                <Barcode className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Click to scan QR/Barcode</span>
              </button>
            )}
          </div>
        )}

        {/* Photo Upload */}
        {activeTab === 'photo' && (
          <div className="text-center">
            {isScanning ? (
              <div className="py-12">
                <div className="animate-spin w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Analyzing medicine image...</p>
              </div>
            ) : (
              <label className="inline-flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors cursor-pointer">
                <Camera className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Upload medicine photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            )}
          </div>
        )}
      </div>

      {/* Verification Result */}
      {selectedMedicine && (
        <div className={`glass-card-solid p-6 border-l-4 ${getStatusStyles(selectedMedicine.verificationStatus)}`}>
          {/* Status Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {selectedMedicine.verificationStatus === 'Verified' ? (
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              ) : selectedMedicine.verificationStatus === 'Suspicious' ? (
                <AlertTriangle className="w-8 h-8 text-warning-500" />
              ) : (
                <Info className="w-8 h-8 text-gray-500" />
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMedicine.brandName}</h2>
                <p className="text-gray-500 dark:text-gray-400">{selectedMedicine.genericName}</p>
              </div>
            </div>
            <StatusBadge status={selectedMedicine.verificationStatus} size="lg" />
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Manufacturer</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedMedicine.manufacturer}</p>
              <p className={`text-xs mt-1 ${selectedMedicine.licenceStatus === 'Valid' ? 'text-emerald-600' : 'text-danger-600'}`}>
                Licence: {selectedMedicine.licenceStatus}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Batch Number</p>
              <p className="font-mono font-medium text-gray-900 dark:text-white">{selectedMedicine.batchNumber}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mfg: {formatDate(selectedMedicine.manufactureDate)}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Expiry Date</p>
              <p className={`font-medium ${
                isExpired(selectedMedicine.expiryDate) ? 'text-danger-600' :
                isExpiringSoon(selectedMedicine.expiryDate) ? 'text-warning-600' :
                'text-gray-900 dark:text-white'
              }`}>
                {formatDate(selectedMedicine.expiryDate)}
              </p>
              <p className="text-xs mt-1">
                {isExpired(selectedMedicine.expiryDate)
                  ? 'EXPIRED'
                  : `${getDaysRemaining(selectedMedicine.expiryDate)} days remaining`}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Dosage Strength</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedMedicine.dosageStrength}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Price Comparison</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 dark:text-white">Brand: Rs.{selectedMedicine.brandPrice}</span>
                <span className="text-xs text-emerald-600">(Rs.{selectedMedicine.genericPrice} generic)</span>
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                {Math.round((1 - selectedMedicine.genericPrice / selectedMedicine.brandPrice) * 100)}% savings with generic
              </p>
            </div>
          </div>

          {/* AI Risk Analysis */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary-500" />
              AI Risk Analysis
            </h3>
            <ul className="space-y-2">
              {flags.map((flag, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2 text-sm ${
                    selectedMedicine.verificationStatus === 'Verified'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : flag.includes('No issues')
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-danger-600 dark:text-danger-400'
                  }`}
                >
                  <span className="mt-0.5">{selectedMedicine.verificationStatus === 'Verified' ? '✓' : flag.includes('No issues') ? '✓' : '⚠'}</span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>

          {/* Warning Banner for Suspicious/Unknown */}
          {(selectedMedicine.verificationStatus === 'Suspicious' || selectedMedicine.verificationStatus === 'Unknown') && (
            <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-danger-500 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-danger-800 dark:text-danger-300">Potential Counterfeit Medicine Detected</h4>
                  <p className="text-sm text-danger-700 dark:text-danger-400 mt-1">
                    Please consult your pharmacist or healthcare provider before use. Do not consume if seal is broken or packaging looks suspicious.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Risk Level */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Overall Risk Level</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedMedicine.riskLevel)}`}>
              {selectedMedicine.riskLevel} Risk
            </span>
          </div>
        </div>
      )}

      {/* Clear button */}
      {selectedMedicine && (
        <button
          onClick={() => setSelectedMedicine(null)}
          className="w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Clear and scan another medicine
        </button>
      )}
    </div>
  );
}
