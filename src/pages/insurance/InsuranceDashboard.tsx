import React, { useState } from 'react';
import { Shield, FileText, AlertTriangle, DollarSign, Search, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { insuranceClaims, patients } from '../../data';
import { StatusBadge, StatCard } from '../../components';

export function InsuranceDashboard() {
  const [selectedClaim, setSelectedClaim] = useState<typeof insuranceClaims[0] | null>(null);

  const totalClaims = insuranceClaims.length;
  const pendingClaims = insuranceClaims.filter(c => c.status === 'Pending').length;
  const approvedAmount = insuranceClaims.filter(c => c.status === 'Approved').reduce((a, b) => a + b.amount, 0);
  const flaggedClaims = insuranceClaims.filter(c => c.status === 'Fraud Flagged').length;

  const handleVerify = (claimId: string) => {
    alert('Claim verified - medical records match the treatment');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">ICICI Lombard Health Insurance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<FileText className="w-5 h-5" />} label="Total Claims" value={totalClaims} iconColor="text-primary-500 bg-primary-100" />
        <StatCard icon={<AlertCircle className="w-5 h-5" />} label="Pending" value={pendingClaims} iconColor="text-warning-500 bg-warning-100" />
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Approved Amount" value={`Rs.${(approvedAmount/1000).toFixed(0)}K`} iconColor="text-emerald-500 bg-emerald-100" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Fraud Flagged" value={flaggedClaims} iconColor="text-danger-500 bg-danger-100" />
      </div>

      {/* Claims Table */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-500" />
          Recent Claims
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Treatment</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Hospital</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {insuranceClaims.map(claim => (
                <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{claim.patientName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">{claim.treatment}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Rs.{claim.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={
                        claim.status === 'Approved' ? 'Approved' :
                        claim.status === 'Rejected' ? 'Rejected' :
                        claim.status === 'Fraud Flagged' ? 'Suspicious' : 'Pending'
                      }
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{claim.hospitalName}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="text-primary-600 dark:text-primary-400 hover:underline text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card-solid p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Claim Details</h2>
              <StatusBadge
                status={
                  selectedClaim.status === 'Approved' ? 'Approved' :
                  selectedClaim.status === 'Rejected' ? 'Rejected' :
                  selectedClaim.status === 'Fraud Flagged' ? 'Suspicious' : 'Pending'
                }
              />
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Patient</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedClaim.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Treatment</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedClaim.treatment}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="font-bold text-xl text-gray-900 dark:text-white">Rs.{selectedClaim.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Submission Date</p>
                  <p className="text-gray-900 dark:text-white">{selectedClaim.submissionDate}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hospital</p>
                <p className="text-gray-900 dark:text-white">{selectedClaim.hospitalName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Documents</p>
                <div className="flex flex-wrap gap-2">
                  {selectedClaim.documents.map(doc => (
                    <span key={doc} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Fraud Detection Alert */}
            {selectedClaim.status === 'Fraud Flagged' && (
              <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger-500" />
                  <div>
                    <p className="font-medium text-danger-800 dark:text-danger-300">Potential Fraud Detected</p>
                    <p className="text-sm text-danger-700 dark:text-danger-400 mt-1">
                      Treatment dates mismatch with hospital records. Duplicate claim suspected.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedClaim(null)}
                className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Close
              </button>
              {selectedClaim.status === 'Pending' && (
                <>
                  <button className="flex-1 py-2 rounded-lg bg-danger-600 hover:bg-danger-700 text-white flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerify(selectedClaim.id)}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
