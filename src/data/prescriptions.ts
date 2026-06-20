import type { Prescription } from '../types';

export const prescriptions: Prescription[] = [
  {
    id: 'rx-001',
    patientId: 'pat-001',
    doctorId: 'doc-001',
    hospitalId: 'hosp-001',
    medicines: [
      {
        medicineId: 'med-001',
        name: 'Metformin 500mg',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Take with meals',
      },
      {
        medicineId: 'med-002',
        name: 'Amlodipine 5mg',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning',
      },
    ],
    date: '2026-06-10',
    status: 'Fulfilled',
    notes: 'Continue lifestyle modifications. Follow up in 2 weeks.',
  },
  {
    id: 'rx-002',
    patientId: 'pat-002',
    doctorId: 'doc-004',
    hospitalId: 'hosp-001',
    medicines: [
      {
        medicineId: 'med-003',
        name: 'Montelukast 10mg',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '14 days',
        instructions: 'Take at bedtime',
      },
      {
        medicineId: 'med-004',
        name: 'Salbutamol Inhaler',
        dosage: '100mcg',
        frequency: 'As needed',
        duration: '30 days',
        instructions: 'Use during asthma attacks',
      },
    ],
    date: '2026-06-12',
    status: 'Fulfilled',
  },
  {
    id: 'rx-003',
    patientId: 'pat-003',
    doctorId: 'doc-002',
    hospitalId: 'hosp-002',
    medicines: [
      {
        medicineId: 'med-005',
        name: 'Atorvastatin 20mg',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take at bedtime',
      },
      {
        medicineId: 'med-006',
        name: 'Clopidogrel 75mg',
        dosage: '75mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take with food',
      },
    ],
    date: '2026-06-08',
    status: 'Fulfilled',
    notes: 'Follow-up cardiac stress test scheduled for next month.',
  },
  {
    id: 'rx-004',
    patientId: 'pat-004',
    doctorId: 'doc-006',
    hospitalId: 'hosp-003',
    medicines: [
      {
        medicineId: 'med-007',
        name: 'Levothyroxine 50mcg',
        dosage: '50mcg',
        frequency: 'Once daily',
        duration: '60 days',
        instructions: 'Take on empty stomach',
      },
      {
        medicineId: 'med-008',
        name: 'Calcium + Vitamin D3',
        dosage: '500mg/400IU',
        frequency: 'Twice daily',
        duration: '60 days',
        instructions: 'Take after meals',
      },
    ],
    date: '2026-06-05',
    status: 'Pending',
  },
  {
    id: 'rx-005',
    patientId: 'pat-005',
    doctorId: 'doc-001',
    hospitalId: 'hosp-003',
    medicines: [
      {
        medicineId: 'med-009',
        name: 'Epoetin Alfa 4000IU',
        dosage: '4000IU',
        frequency: 'Once weekly',
        duration: '30 days',
        instructions: 'Administer subcutaneously',
      },
    ],
    date: '2026-06-15',
    status: 'Pending',
  },
  {
    id: 'rx-006',
    patientId: 'pat-006',
    doctorId: 'doc-001',
    hospitalId: 'hosp-002',
    medicines: [
      {
        medicineId: 'med-010',
        name: 'Sumatriptan 50mg',
        dosage: '50mg',
        frequency: 'As needed',
        duration: '10 tablets',
        instructions: 'Take at onset of migraine',
      },
      {
        medicineId: 'med-011',
        name: 'Sertraline 50mg',
        dosage: '50mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take in morning',
      },
    ],
    date: '2026-06-01',
    status: 'Fulfilled',
  },
  {
    id: 'rx-007',
    patientId: 'pat-007',
    doctorId: 'doc-005',
    hospitalId: 'hosp-001',
    medicines: [
      {
        medicineId: 'med-012',
        name: 'Cetirizine 10mg',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '7 days',
        instructions: 'Take for allergic reaction',
      },
    ],
    date: '2026-06-18',
    status: 'Fulfilled',
    notes: 'Advised to carry epinephrine auto-injector.',
  },
  {
    id: 'rx-008',
    patientId: 'pat-008',
    doctorId: 'doc-002',
    hospitalId: 'hosp-001',
    medicines: [
      {
        medicineId: 'med-013',
        name: 'Lisinopril 10mg',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Monitor blood pressure regularly',
      },
      {
        medicineId: 'med-014',
        name: 'Tamoxifen 20mg',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Continue hormone therapy',
      },
    ],
    date: '2026-06-14',
    status: 'Fulfilled',
  },
  {
    id: 'rx-009',
    patientId: 'pat-009',
    doctorId: 'doc-003',
    hospitalId: 'hosp-003',
    medicines: [
      {
        medicineId: 'med-015',
        name: 'Levetiracetam 500mg',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Do not skip doses',
      },
    ],
    date: '2026-06-11',
    status: 'Fulfilled',
    notes: 'EEG scheduled for follow-up.',
  },
  {
    id: 'rx-010',
    patientId: 'pat-010',
    doctorId: 'doc-001',
    hospitalId: 'hosp-002',
    medicines: [
      {
        medicineId: 'med-016',
        name: 'Levodopa/Carbidopa 100/25mg',
        dosage: '100/25mg',
        frequency: 'Three times daily',
        duration: '30 days',
        instructions: 'Take before meals',
      },
      {
        medicineId: 'med-017',
        name: 'Insulin Glargine',
        dosage: '12 units',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Inject subcutaneously at same time daily',
      },
      {
        medicineId: 'med-018',
        name: 'Latanoprost Eye Drops',
        dosage: '0.005%',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Apply one drop to each affected eye at night',
      },
    ],
    date: '2026-06-16',
    status: 'Pending',
    notes: 'Caregiver education provided for medication administration.',
  },
];

export function getPrescriptionsByPatient(patientId: string): Prescription[] {
  return prescriptions.filter(p => p.patientId === patientId);
}

export function getPrescriptionById(id: string): Prescription | undefined {
  return prescriptions.find(p => p.id === id);
}

export function getPendingPrescriptions(): Prescription[] {
  return prescriptions.filter(p => p.status === 'Pending');
}
