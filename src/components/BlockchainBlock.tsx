import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime, truncateHash } from '../utils';

interface BlockchainBlockProps {
  blockNumber: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  transactionType: string;
  actor: string;
  onClick?: () => void;
  linkTo?: string;
}

const transactionColors: Record<string, string> = {
  createRecord: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  grantConsent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  revokeConsent: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400',
  emergencyAccess: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
  auditAccess: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  updateRecord: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400',
};

export function BlockchainBlock({
  blockNumber,
  hash,
  previousHash,
  timestamp,
  transactionType,
  actor,
  onClick,
  linkTo,
}: BlockchainBlockProps) {
  const content = (
    <div
      className="glass-card-solid p-4 transition-all duration-200 hover:shadow-xl cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-gray-900 dark:text-white">#{blockNumber}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${transactionColors[transactionType] || transactionColors.updateRecord}`}
        >
          {transactionType}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Hash:</span>
          <span className="ml-2 font-mono text-primary-600 dark:text-primary-400">{truncateHash(hash, 16)}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Prev:</span>
          <span className="ml-2 font-mono text-gray-600 dark:text-gray-300">{truncateHash(previousHash, 16)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">{formatDateTime(timestamp)}</span>
          <span className="text-gray-900 dark:text-white font-medium">{actor}</span>
        </div>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
