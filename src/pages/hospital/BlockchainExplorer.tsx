import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Blocks, Link2, ArrowRight, ChevronDown, ChevronUp, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { blockchainLedger, getTransactionStats } from '../../data';
import { BlockchainBlock, StatusBadge } from '../../components';
import { useBlockchainStore } from '../../store';
import { formatDateTime, truncateHash } from '../../utils';
import type { BlockchainTransaction } from '../../types';

const transactionTypes = [
  { id: 'createRecord', label: 'Create Record' },
  { id: 'grantConsent', label: 'Grant Consent' },
  { id: 'revokeConsent', label: 'Revoke Consent' },
  { id: 'emergencyAccess', label: 'Emergency Access' },
  { id: 'auditAccess', label: 'Audit Access' },
  { id: 'updateRecord', label: 'Update Record' },
];

export function BlockchainExplorer() {
  const { addTransaction } = useBlockchainStore();
  const [selectedType, setSelectedType] = useState<BlockchainTransaction['transactionType'] | 'all'>('all');
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  const allTransactions = blockchainLedger;
  const stats = getTransactionStats();

  const filteredTransactions = selectedType === 'all'
    ? allTransactions
    : allTransactions.filter(t => t.transactionType === selectedType);

  const handleAddTransaction = (type: BlockchainTransaction['transactionType']) => {
    addTransaction({
      timestamp: new Date().toISOString(),
      transactionType: type,
      actor: 'Apollo Hospital',
      patientId: 'MC-2026-00000001',
      details: `${type} operation performed by Apollo Hospital`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blockchain Explorer</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Immutable record of all healthcare transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="glass-card-solid p-4 text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
          </div>
        ))}
      </div>

      {/* Smart Contract Simulator */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-primary-500" />
          Smart Contract Functions (Demo)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {transactionTypes.map(type => (
            <button
              key={type.id}
              onClick={() => handleAddTransaction(type.id as BlockchainTransaction['transactionType'])}
              className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 border border-primary-200 dark:border-primary-800 transition-colors text-center"
            >
              <p className="text-sm font-medium text-primary-700 dark:text-primary-400">{type.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Blockchain visualization */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Blocks className="w-5 h-5 text-primary-500" />
          Recent Blocks
        </h2>
        <div className="flex overflow-x-auto pb-4 gap-4">
          {allTransactions.slice(-10).reverse().map((block, i) => (
            <div key={block.hash} className="flex items-center flex-shrink-0">
              <div className="w-64">
                <BlockchainBlock
                  blockNumber={block.blockNumber}
                  hash={block.hash}
                  previousHash={block.previousHash}
                  timestamp={block.timestamp}
                  transactionType={block.transactionType}
                  actor={block.actor}
                />
              </div>
              {i < 9 && <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-card-solid p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Transaction History</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedType === 'all' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              All
            </button>
            {transactionTypes.slice(0, 4).map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as BlockchainTransaction['transactionType'])}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedType === type.id ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.slice().reverse().slice(0, 15).map(tx => {
            const isExpanded = expandedBlock === tx.hash;
            return (
              <div
                key={tx.hash}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setExpandedBlock(isExpanded ? null : tx.hash)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">#{tx.blockNumber}</span>
                    <span className="font-mono text-xs text-primary-600 dark:text-primary-400">{truncateHash(tx.hash, 16)}</span>
                    <StatusBadge status={tx.transactionType === 'emergencyAccess' ? 'Suspicious' : tx.transactionType === 'grantConsent' ? 'Approved' : 'Verified'} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span className="text-xs">{formatDateTime(tx.timestamp)}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">{tx.transactionType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Actor</p>
                      <p className="font-medium text-gray-900 dark:text-white">{tx.actor}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Patient ID</p>
                      <p className="font-mono text-gray-900 dark:text-white">{tx.patientId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Previous Hash</p>
                      <p className="font-mono text-xs text-gray-600 dark:text-gray-400">{truncateHash(tx.previousHash, 16)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 dark:text-gray-400">Details</p>
                      <p className="text-gray-900 dark:text-white">{tx.details}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
