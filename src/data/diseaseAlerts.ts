import type { DiseaseAlert } from '../types';

export const diseaseAlerts: DiseaseAlert[] = [
  {
    id: 'da-001',
    disease: 'Dengue',
    region: 'Delhi NCR',
    cases: 1256,
    trend: 'Rising',
    lastUpdated: '2026-06-19',
  },
  {
    id: 'da-002',
    disease: 'Chikungunya',
    region: 'Maharashtra',
    cases: 834,
    trend: 'Stable',
    lastUpdated: '2026-06-19',
  },
  {
    id: 'da-003',
    disease: 'Malaria',
    region: 'Odisha',
    cases: 2145,
    trend: 'Declining',
    lastUpdated: '2026-06-18',
  },
  {
    id: 'da-004',
    disease: 'Swine Flu (H1N1)',
    region: 'Rajasthan',
    cases: 428,
    trend: 'Rising',
    lastUpdated: '2026-06-19',
  },
  {
    id: 'da-005',
    disease: 'Typhoid',
    region: 'Uttar Pradesh',
    cases: 1892,
    trend: 'Stable',
    lastUpdated: '2026-06-18',
  },
  {
    id: 'da-006',
    disease: 'Tuberculosis',
    region: 'Bihar',
    cases: 3421,
    trend: 'Stable',
    lastUpdated: '2026-06-19',
  },
  {
    id: 'da-007',
    disease: 'Cholera',
    region: 'West Bengal',
    cases: 156,
    trend: 'Declining',
    lastUpdated: '2026-06-17',
  },
  {
    id: 'da-008',
    disease: 'Japanese Encephalitis',
    region: 'Assam',
    cases: 89,
    trend: 'Rising',
    lastUpdated: '2026-06-19',
  },
  {
    id: 'da-009',
    disease: 'Leptospirosis',
    region: 'Gujarat',
    cases: 267,
    trend: 'Stable',
    lastUpdated: '2026-06-18',
  },
  {
    id: 'da-010',
    disease: 'COVID-19',
    region: 'Kerala',
    cases: 548,
    trend: 'Rising',
    lastUpdated: '2026-06-19',
  },
];

export function getActiveAlerts(): DiseaseAlert[] {
  return diseaseAlerts.filter(a => a.trend === 'Rising' || a.cases > 500);
}

export function getAlertsByRegion(region: string): DiseaseAlert[] {
  return diseaseAlerts.filter(a => a.region === region);
}
