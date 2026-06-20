import { create } from 'zustand';
import type { HealthLog, SymptomType } from '../types';
import { healthLogs as initialHealthLogs } from '../data';
import { generateId } from '../utils';

interface HealthLogState {
  healthLogs: HealthLog[];
  addHealthLog: (log: Omit<HealthLog, 'id'>) => void;
  getHealthLogsByPatient: (patientId: string) => HealthLog[];
  getSymptomCounts: (patientId: string) => Record<SymptomType, number>;
}

export const useHealthLogStore = create<HealthLogState>((set, get) => ({
  healthLogs: initialHealthLogs,
  addHealthLog: (log) =>
    set((state) => ({
      healthLogs: [...state.healthLogs, { ...log, id: generateId('hl') }],
    })),
  getHealthLogsByPatient: (patientId) =>
    get().healthLogs.filter((l) => l.patientId === patientId),
  getSymptomCounts: (patientId) => {
    const logs = get().healthLogs.filter((l) => l.patientId === patientId);
    const counts: Record<SymptomType, number> = {
      Cold: 0,
      Cough: 0,
      Fever: 0,
      Allergy: 0,
      Headache: 0,
      'Stomach Infection': 0,
      'Seasonal Illness': 0,
      Fatigue: 0,
      Weakness: 0,
      Other: 0,
    };
    logs.forEach((log) => {
      counts[log.symptom]++;
    });
    return counts;
  },
}));
