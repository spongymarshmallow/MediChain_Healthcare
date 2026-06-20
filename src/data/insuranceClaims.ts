import type { InsuranceClaim } from '../types';

export const insuranceClaims: InsuranceClaim[] = [
  {
    id: 'clm-001',
    patientId: 'pat-003',
    patientName: 'Arjun Reddy',
    treatment: 'Cardiac Catheterization and Stent Placement',
    amount: 485000,
    status: 'Approved',
    submissionDate: '2026-05-20',
    hospitalId: 'hosp-002',
    hospitalName: 'Fortis Hospital',
    documents: ['Discharge Summary', 'Procedure Report', 'Billing Invoice'],
  },
  {
    id: 'clm-002',
    patientId: 'pat-005',
    patientName: 'Vikram Singh',
    treatment: 'Dialysis Session (12 sessions)',
    amount: 156000,
    status: 'Pending',
    submissionDate: '2026-06-15',
    hospitalId: 'hosp-003',
    hospitalName: 'AIIMS Delhi',
    documents: ['Dialysis Records', 'Lab Reports', 'Treatment Plan'],
  },
  {
    id: 'clm-003',
    patientId: 'pat-001',
    patientName: 'Rahul Sharma',
    treatment: 'Diabetic Ketoacidosis Treatment',
    amount: 85000,
    status: 'Approved',
    submissionDate: '2026-03-26',
    hospitalId: 'hosp-001',
    hospitalName: 'Apollo Hospital',
    documents: ['Discharge Summary', 'Lab Reports'],
  },
  {
    id: 'clm-004',
    patientId: 'pat-009',
    patientName: 'Deepak Mehta',
    treatment: 'Epilepsy Treatment and EEG Monitoring',
    amount: 72000,
    status: 'Approved',
    submissionDate: '2026-04-17',
    hospitalId: 'hosp-003',
    hospitalName: 'AIIMS Delhi',
    documents: ['EEG Report', 'Treatment Summary'],
  },
  {
    id: 'clm-005',
    patientId: 'pat-004',
    patientName: 'Meera Krishnan',
    treatment: ' Hip Replacement Surgery',
    amount: 320000,
    status: 'Approved',
    submissionDate: '2026-02-14',
    hospitalId: 'hosp-003',
    hospitalName: 'AIIMS Delhi',
    documents: ['Surgical Report', 'Implant Details', 'Discharge Summary'],
  },
  {
    id: 'clm-006',
    patientId: 'pat-007',
    patientName: 'Karthik Nair',
    treatment: 'Emergency Anaphylaxis Treatment',
    amount: 18000,
    status: 'Pending',
    submissionDate: '2026-06-19',
    hospitalId: 'hosp-001',
    hospitalName: 'Apollo Hospital',
    documents: ['Emergency Report', 'Billing Invoice'],
  },
  {
    id: 'clm-007',
    patientId: 'pat-008',
    patientName: 'Fatima Begum',
    treatment: 'Mastectomy and Reconstruction',
    amount: 450000,
    status: 'Approved',
    submissionDate: '2026-01-19',
    hospitalId: 'hosp-001',
    hospitalName: 'Apollo Hospital',
    documents: ['Surgical Report', 'Pathology Report', 'Treatment Plan'],
  },
  {
    id: 'clm-008',
    patientId: 'pat-010',
    patientName: 'Gauri Deshmukh',
    treatment: 'Parkinsons Disease Management',
    amount: 125000,
    status: 'Fraud Flagged',
    submissionDate: '2026-06-17',
    hospitalId: 'hosp-002',
    hospitalName: 'Fortis Hospital',
    documents: ['Admission Summary', 'Billing Invoice'],
  },
  {
    id: 'clm-009',
    patientId: 'pat-010',
    patientName: 'Gauri Deshmukh',
    treatment: 'Diabetes Management',
    amount: 45000,
    status: 'Rejected',
    submissionDate: '2026-06-10',
    hospitalId: 'hosp-002',
    hospitalName: 'Fortis Hospital',
    documents: ['Lab Reports', 'Prescription'],
  },
  {
    id: 'clm-010',
    patientId: 'pat-006',
    patientName: 'Sunita Agarwal',
    treatment: 'Migraine Treatment and Neuroimaging',
    amount: 38000,
    status: 'Approved',
    submissionDate: '2026-04-25',
    hospitalId: 'hosp-002',
    hospitalName: 'Fortis Hospital',
    documents: ['MRI Report', 'Consultation Notes'],
  },
];

export function getClaimsByPatient(patientId: string): InsuranceClaim[] {
  return insuranceClaims.filter(c => c.patientId === patientId);
}

export function getPendingClaims(): InsuranceClaim[] {
  return insuranceClaims.filter(c => c.status === 'Pending');
}

export function getFraudFlaggedClaims(): InsuranceClaim[] {
  return insuranceClaims.filter(c => c.status === 'Fraud Flagged');
}

export function getApprovedClaims(): InsuranceClaim[] {
  return insuranceClaims.filter(c => c.status === 'Approved');
}

export function getTotalClaimAmount(): number {
  return insuranceClaims.reduce((sum, c) => sum + c.amount, 0);
}
