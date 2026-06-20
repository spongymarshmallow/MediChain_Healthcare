import { create } from 'zustand';
import type { ConsentRequest, ConsentAccessLog } from '../types';
import { consentRequests as initialConsentRequests, consentAccessLogs as initialAccessLogs } from '../data';
import { generateId } from '../utils';

interface ConsentState {
  consentRequests: ConsentRequest[];
  accessLogs: ConsentAccessLog[];
  approveConsent: (id: string, expiryDate?: string) => void;
  rejectConsent: (id: string) => void;
  addConsentRequest: (request: Omit<ConsentRequest, 'id'>) => void;
  addAccessLog: (log: Omit<ConsentAccessLog, 'id'>) => void;
  getPendingRequests: (patientId: string) => ConsentRequest[];
  getAccessLogsByPatient: (patientId: string) => ConsentAccessLog[];
}

export const useConsentStore = create<ConsentState>((set, get) => ({
  consentRequests: initialConsentRequests,
  accessLogs: initialAccessLogs,
  approveConsent: (id, expiryDate) =>
    set((state) => ({
      consentRequests: state.consentRequests.map((r) =>
        r.id === id
          ? { ...r, status: 'Approved' as const, expiryDate }
          : r
      ),
    })),
  rejectConsent: (id) =>
    set((state) => ({
      consentRequests: state.consentRequests.map((r) =>
        r.id === id ? { ...r, status: 'Rejected' as const } : r
      ),
    })),
  addConsentRequest: (request) =>
    set((state) => ({
      consentRequests: [...state.consentRequests, { ...request, id: generateId('cons') }],
    })),
  addAccessLog: (log) =>
    set((state) => ({
      accessLogs: [...state.accessLogs, { ...log, id: generateId('acc') }],
    })),
  getPendingRequests: (patientId) =>
    get().consentRequests.filter((r) => r.patientId === patientId && r.status === 'Pending'),
  getAccessLogsByPatient: (patientId) =>
    get().accessLogs.filter((l) => l.patientId === patientId),
}));
