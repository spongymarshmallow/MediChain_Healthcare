import type { Admission } from '../types';

export const admissions: Admission[] = [
  {
    id: 'adm-001',
    patientId: 'pat-003',
    patientName: 'Arjun Reddy',
    department: 'Cardiology',
    doctorId: 'doc-002',
    doctorName: 'Dr. Priya Menon',
    roomNumber: 'ICU-204',
    admissionDate: '2026-05-18',
    status: 'Discharged',
    dischargeDate: '2026-05-20',
    condition: 'Acute Coronary Syndrome',
  },
  {
    id: 'adm-002',
    patientId: 'pat-005',
    patientName: 'Vikram Singh',
    department: 'Nephrology',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Gupta',
    roomNumber: 'DIAL-101',
    admissionDate: '2026-06-15',
    status: 'Admitted',
    condition: 'Chronic Kidney Disease - Dialysis',
  },
  {
    id: 'adm-003',
    patientId: 'pat-010',
    patientName: 'Gauri Deshmukh',
    department: 'Geriatrics',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Gupta',
    roomNumber: 'G-305',
    admissionDate: '2026-06-16',
    status: 'Admitted',
    condition: 'Parkinsons Disease Management',
  },
  {
    id: 'adm-004',
    patientId: 'pat-007',
    patientName: 'Karthik Nair',
    department: 'Emergency',
    doctorId: 'doc-004',
    doctorName: 'Dr. Sunita Verma',
    roomNumber: 'ER-012',
    admissionDate: '2026-06-18',
    dischargeDate: '2026-06-18',
    status: 'Discharged',
    condition: 'Severe Allergic Reaction - Anaphylaxis',
  },
  {
    id: 'adm-005',
    patientId: 'pat-008',
    patientName: 'Fatima Begum',
    department: 'Oncology',
    doctorId: 'doc-002',
    doctorName: 'Dr. Priya Menon',
    roomNumber: 'ONC-201',
    admissionDate: '2026-01-15',
    dischargeDate: '2026-01-18',
    status: 'Discharged',
    condition: 'Post-Mastectomy Follow-up',
  },
  {
    id: 'adm-006',
    patientId: 'pat-001',
    patientName: 'Rahul Sharma',
    department: 'General Medicine',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rajesh Gupta',
    roomNumber: 'GM-102',
    admissionDate: '2026-03-22',
    dischargeDate: '2026-03-25',
    status: 'Discharged',
    condition: 'Diabetic Ketoacidosis',
  },
  {
    id: 'adm-007',
    patientId: 'pat-009',
    patientName: 'Deepak Mehta',
    department: 'Neurology',
    doctorId: 'doc-003',
    doctorName: 'Dr. Arun Thomas',
    roomNumber: 'NEU-105',
    admissionDate: '2026-04-10',
    dischargeDate: '2026-04-15',
    status: 'Discharged',
    condition: 'Seizure Monitoring and Medication Adjustment',
  },
  {
    id: 'adm-008',
    patientId: 'pat-004',
    patientName: 'Meera Krishnan',
    department: 'Orthopedics',
    doctorId: 'doc-006',
    doctorName: 'Dr. Meena Iyer',
    roomNumber: 'ORT-203',
    admissionDate: '2026-02-05',
    dischargeDate: '2026-02-12',
    status: 'Discharged',
    condition: 'Hip Fracture Repair',
  },
];

export function getActiveAdmissions(): Admission[] {
  return admissions.filter(a => a.status === 'Admitted');
}

export function getAdmissionsByPatient(patientId: string): Admission[] {
  return admissions.filter(a => a.patientId === patientId);
}

export function getAdmissionsByHospital(hospitalId: string): Admission[] {
  // In real app, this would filter by hospital
  return admissions;
}
