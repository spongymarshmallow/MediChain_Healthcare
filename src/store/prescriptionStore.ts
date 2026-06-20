import { create } from 'zustand';
import type { Prescription, PrescriptionMedicine } from '../types';
import { prescriptions as initialPrescriptions } from '../data';
import { generateId } from '../utils';

interface PrescriptionState {
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  updatePrescriptionStatus: (id: string, status: Prescription['status']) => void;
  getPrescriptionsByPatient: (patientId: string) => Prescription[];
  getPendingPrescriptions: () => Prescription[];
}

export const usePrescriptionStore = create<PrescriptionState>((set, get) => ({
  prescriptions: initialPrescriptions,
  addPrescription: (prescription) =>
    set((state) => ({
      prescriptions: [
        ...state.prescriptions,
        { ...prescription, id: generateId('rx') },
      ],
    })),
  updatePrescriptionStatus: (id, status) =>
    set((state) => ({
      prescriptions: state.prescriptions.map((p) =>
        p.id === id ? { ...p, status } : p
      ),
    })),
  getPrescriptionsByPatient: (patientId) =>
    get().prescriptions.filter((p) => p.patientId === patientId),
  getPendingPrescriptions: () =>
    get().prescriptions.filter((p) => p.status === 'Pending'),
}));
