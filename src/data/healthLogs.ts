import type { HealthLog, SymptomType } from '../types';

const symptoms: SymptomType[] = [
  'Cold',
  'Cough',
  'Fever',
  'Allergy',
  'Headache',
  'Stomach Infection',
  'Seasonal Illness',
  'Fatigue',
  'Weakness',
];

const severityLevels: ('Mild' | 'Moderate' | 'Severe')[] = ['Mild', 'Moderate', 'Severe'];

function generateDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export const healthLogs: HealthLog[] = [
  // Patient 1 - Rahul Sharma - 2025 entries
  { id: 'hl-001', patientId: 'pat-001', symptom: 'Cold', severity: 'Mild', duration: 3, date: '2025-01-10' },
  { id: 'hl-002', patientId: 'pat-001', symptom: 'Cough', severity: 'Moderate', duration: 5, date: '2025-02-15' },
  { id: 'hl-003', patientId: 'pat-001', symptom: 'Fever', severity: 'Moderate', duration: 2, date: '2025-03-22' },
  { id: 'hl-004', patientId: 'pat-001', symptom: 'Headache', severity: 'Mild', duration: 1, date: '2025-05-08' },
  { id: 'hl-005', patientId: 'pat-001', symptom: 'Cold', severity: 'Mild', duration: 4, date: '2025-06-18' },
  { id: 'hl-006', patientId: 'pat-001', symptom: 'Fatigue', severity: 'Moderate', duration: 7, date: '2025-08-12' },
  { id: 'hl-007', patientId: 'pat-001', symptom: 'Seasonal Illness', severity: 'Mild', duration: 5, date: '2025-10-20' },
  // Patient 1 - 2026 entries
  { id: 'hl-008', patientId: 'pat-001', symptom: 'Cold', severity: 'Mild', duration: 3, date: '2026-01-05' },
  { id: 'hl-009', patientId: 'pat-001', symptom: 'Cough', severity: 'Moderate', duration: 4, date: '2026-02-10' },
  { id: 'hl-010', patientId: 'pat-001', symptom: 'Headache', severity: 'Mild', duration: 2, date: '2026-03-15' },
  { id: 'hl-011', patientId: 'pat-001', symptom: 'Fever', severity: 'Moderate', duration: 3, date: '2026-04-22' },
  { id: 'hl-012', patientId: 'pat-001', symptom: 'Fatigue', severity: 'Mild', duration: 4, date: '2026-05-08' },
  { id: 'hl-013', patientId: 'pat-001', symptom: 'Cold', severity: 'Mild', duration: 5, date: '2026-06-02' },

  // Patient 2 - Ananya Patel
  { id: 'hl-014', patientId: 'pat-002', symptom: 'Allergy', severity: 'Moderate', duration: 2, date: '2025-03-12' },
  { id: 'hl-015', patientId: 'pat-002', symptom: 'Allergy', severity: 'Moderate', duration: 3, date: '2025-04-08' },
  { id: 'hl-016', patientId: 'pat-002', symptom: 'Cold', severity: 'Mild', duration: 2, date: '2025-05-20' },
  { id: 'hl-017', patientId: 'pat-002', symptom: 'Allergy', severity: 'Severe', duration: 5, date: '2025-06-15' },
  { id: 'hl-018', patientId: 'pat-002', symptom: 'Cough', severity: 'Mild', duration: 3, date: '2025-09-10' },
  { id: 'hl-019', patientId: 'pat-002', symptom: 'Allergy', severity: 'Moderate', duration: 4, date: '2025-10-22' },
  { id: 'hl-020', patientId: 'pat-002', symptom: 'Cold', severity: 'Mild', duration: 2, date: '2026-01-08' },
  { id: 'hl-021', patientId: 'pat-002', symptom: 'Allergy', severity: 'Moderate', duration: 3, date: '2026-03-05' },
  { id: 'hl-022', patientId: 'pat-002', symptom: 'Allergy', severity: 'Severe', duration: 4, date: '2026-04-12' },
  { id: 'hl-023', patientId: 'pat-002', symptom: 'Cough', severity: 'Mild', duration: 2, date: '2026-05-18' },
  { id: 'hl-024', patientId: 'pat-002', symptom: 'Allergy', severity: 'Moderate', duration: 3, date: '2026-06-10' },

  // Patient 3 - Arjun Reddy
  { id: 'hl-025', patientId: 'pat-003', symptom: 'Fatigue', severity: 'Moderate', duration: 7, date: '2025-02-18' },
  { id: 'hl-026', patientId: 'pat-003', symptom: 'Weakness', severity: 'Moderate', duration: 5, date: '2025-05-10' },
  { id: 'hl-027', patientId: 'pat-003', symptom: 'Headache', severity: 'Mild', duration: 2, date: '2025-07-22' },
  { id: 'hl-028', patientId: 'pat-003', symptom: 'Fatigue', severity: 'Severe', duration: 10, date: '2025-09-15' },
  { id: 'hl-029', patientId: 'pat-003', symptom: 'Weakness', severity: 'Moderate', duration: 6, date: '2025-11-08' },
  { id: 'hl-030', patientId: 'pat-003', symptom: 'Headache', severity: 'Moderate', duration: 3, date: '2026-01-20' },
  { id: 'hl-031', patientId: 'pat-003', symptom: 'Fatigue', severity: 'Moderate', duration: 8, date: '2026-03-12' },
  { id: 'hl-032', patientId: 'pat-003', symptom: 'Weakness', severity: 'Mild', duration: 4, date: '2026-05-05' },
  { id: 'hl-033', patientId: 'pat-003', symptom: 'Headache', severity: 'Mild', duration: 2, date: '2026-06-15' },

  // Patient 7 - Karthik Nair (healthy young patient)
  { id: 'hl-034', patientId: 'pat-007', symptom: 'Cold', severity: 'Mild', duration: 2, date: '2025-02-10' },
  { id: 'hl-035', patientId: 'pat-007', symptom: 'Cough', severity: 'Mild', duration: 3, date: '2025-06-08' },
  { id: 'hl-036', patientId: 'pat-007', symptom: 'Cold', severity: 'Mild', duration: 2, date: '2025-12-15' },
  { id: 'hl-037', patientId: 'pat-007', symptom: 'Fever', severity: 'Mild', duration: 1, date: '2026-02-20' },
  { id: 'hl-038', patientId: 'pat-007', symptom: 'Cold', severity: 'Mild', duration: 2, date: '2026-05-12' },

  // Patient 6 - Sunita Agarwal
  { id: 'hl-039', patientId: 'pat-006', symptom: 'Headache', severity: 'Severe', duration: 4, date: '2025-01-15' },
  { id: 'hl-040', patientId: 'pat-006', symptom: 'Headache', severity: 'Moderate', duration: 3, date: '2025-02-20' },
  { id: 'hl-041', patientId: 'pat-006', symptom: 'Headache', severity: 'Severe', duration: 5, date: '2025-04-10' },
  { id: 'hl-042', patientId: 'pat-006', symptom: 'Fatigue', severity: 'Moderate', duration: 6, date: '2025-05-22' },
  { id: 'hl-043', patientId: 'pat-006', symptom: 'Headache', severity: 'Moderate', duration: 2, date: '2025-07-08' },
  { id: 'hl-044', patientId: 'pat-006', symptom: 'Headache', severity: 'Severe', duration: 4, date: '2025-09-18' },
  { id: 'hl-045', patientId: 'pat-006', symptom: 'Fatigue', severity: 'Mild', duration: 3, date: '2025-11-12' },
  { id: 'hl-046', patientId: 'pat-006', symptom: 'Headache', severity: 'Moderate', duration: 2, date: '2026-01-05' },
  { id: 'hl-047', patientId: 'pat-006', symptom: 'Headache', severity: 'Severe', duration: 3, date: '2026-03-20' },
  { id: 'hl-048', patientId: 'pat-006', symptom: 'Headache', severity: 'Moderate', duration: 2, date: '2026-05-10' },
  { id: 'hl-049', patientId: 'pat-006', symptom: 'Fatigue', severity: 'Mild', duration: 4, date: '2026-06-08' },

  // Patient 9 - Deepak Mehta
  { id: 'hl-050', patientId: 'pat-009', symptom: 'Headache', severity: 'Moderate', duration: 2, date: '2025-03-10' },
  { id: 'hl-051', patientId: 'pat-009', symptom: 'Fatigue', severity: 'Moderate', duration: 5, date: '2025-05-18' },
  { id: 'hl-052', patientId: 'pat-009', symptom: 'Weakness', severity: 'Mild', duration: 3, date: '2025-08-22' },
  { id: 'hl-053', patientId: 'pat-009', symptom: 'Headache', severity: 'Moderate', duration: 2, date: '2025-10-15' },
  { id: 'hl-054', patientId: 'pat-009', symptom: 'Fatigue', severity: 'Mild', duration: 4, date: '2025-12-08' },
  { id: 'hl-055', patientId: 'pat-009', symptom: 'Headache', severity: 'Mild', duration: 1, date: '2026-02-12' },
  { id: 'hl-056', patientId: 'pat-009', symptom: 'Weakness', severity: 'Mild', duration: 2, date: '2026-04-05' },
  { id: 'hl-057', patientId: 'pat-009', symptom: 'Headache', severity: 'Mild', duration: 2, date: '2026-05-28' },

  // Patient 5 - Vikram Singh
  { id: 'hl-058', patientId: 'pat-005', symptom: 'Fatigue', severity: 'Severe', duration: 10, date: '2025-01-20' },
  { id: 'hl-059', patientId: 'pat-005', symptom: 'Weakness', severity: 'Moderate', duration: 8, date: '2025-04-12' },
  { id: 'hl-060', patientId: 'pat-005', symptom: 'Fatigue', severity: 'Moderate', duration: 12, date: '2025-07-28' },
  { id: 'hl-061', patientId: 'pat-005', symptom: 'Weakness', severity: 'Severe', duration: 10, date: '2025-10-05' },
  { id: 'hl-062', patientId: 'pat-005', symptom: 'Fatigue', severity: 'Moderate', duration: 7, date: '2025-12-18' },
  { id: 'hl-063', patientId: 'pat-005', symptom: 'Weakness', severity: 'Moderate', duration: 5, date: '2026-02-08' },
  { id: 'hl-064', patientId: 'pat-005', symptom: 'Fatigue', severity: 'Moderate', duration: 8, date: '2026-04-22' },
  { id: 'hl-065', patientId: 'pat-005', symptom: 'Weakness', severity: 'Mild', duration: 4, date: '2026-06-05' },
];

export function getHealthLogsByPatient(patientId: string): HealthLog[] {
  return healthLogs.filter(l => l.patientId === patientId);
}

export function getHealthLogsByDateRange(patientId: string, startDate: string, endDate: string): HealthLog[] {
  return healthLogs.filter(
    l => l.patientId === patientId && l.date >= startDate && l.date <= endDate
  );
}

export function getSymptomCountsByPatient(patientId: string): Record<SymptomType, number> {
  const logs = getHealthLogsByPatient(patientId);
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
  logs.forEach(log => {
    counts[log.symptom]++;
  });
  return counts;
}

export function calculateImmunityScore(patientId: string): number {
  const logs = getHealthLogsByPatient(patientId);
  const recentLogs = logs.filter(l => {
    const logDate = new Date(l.date);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return logDate >= oneYearAgo;
  });

  let penalty = 0;
  recentLogs.forEach(log => {
    const severityPenalty = log.severity === 'Mild' ? 1 : log.severity === 'Moderate' ? 3 : 5;
    penalty += severityPenalty;
  });

  return Math.max(0, Math.min(100, 100 - penalty));
}
