import { create } from 'zustand';
import type { BlockchainTransaction } from '../types';
import { blockchainLedger as initialLedger } from '../data';
import { generateHash, generateId } from '../utils';

interface BlockchainState {
  ledger: BlockchainTransaction[];
  addTransaction: (tx: Omit<BlockchainTransaction, 'blockNumber' | 'hash' | 'previousHash'>) => void;
  getLatestBlocks: (count: number) => BlockchainTransaction[];
  getTransactionsByPatient: (patientId: string) => BlockchainTransaction[];
}

export const useBlockchainStore = create<BlockchainState>((set, get) => ({
  ledger: initialLedger,
  addTransaction: (tx) =>
    set((state) => {
      const lastBlock = state.ledger[state.ledger.length - 1];
      const newBlock: BlockchainTransaction = {
        ...tx,
        blockNumber: (lastBlock?.blockNumber || 0) + 1,
        hash: generateHash(),
        previousHash: lastBlock?.hash || '0x0000000000000000000000000000000000000000000000000000000000000000',
      };
      return { ledger: [...state.ledger, newBlock] };
    }),
  getLatestBlocks: (count) =>
    [...get().ledger].sort((a, b) => b.blockNumber - a.blockNumber).slice(0, count),
  getTransactionsByPatient: (patientId) =>
    get().ledger.filter((tx) => tx.patientId === patientId),
}));
