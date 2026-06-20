import type { Hospital } from '../types';

export const hospitals: Hospital[] = [
  {
    id: 'hosp-001',
    name: 'Apollo Hospital',
    type: 'Multi-Specialty',
    address: 'Sarita Vihar, Mathura Road, New Delhi - 110076',
    departments: [
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Oncology',
      'Emergency',
      'ICU',
    ],
    totalBeds: 700,
    availableBeds: 125,
  },
  {
    id: 'hosp-002',
    name: 'Fortis Hospital',
    type: 'Private',
    address: 'Sector 62, Noida, Uttar Pradesh - 201301',
    departments: [
      'Cardiac Sciences',
      'Neurosciences',
      'Gastroenterology',
      'Nephrology',
      'Orthopedics',
      'Emergency',
    ],
    totalBeds: 450,
    availableBeds: 78,
  },
  {
    id: 'hosp-003',
    name: 'AIIMS Delhi',
    type: 'Government',
    address: 'Ansari Nagar, New Delhi - 110029',
    departments: [
      'Cardio-Thoracic Sciences',
      'Neurosciences',
      'Gastroenterology',
      'Endocrinology',
      'Pulmonary Medicine',
      'Emergency',
      'Trauma Centre',
    ],
    totalBeds: 2400,
    availableBeds: 412,
  },
];

export function getHospitalById(id: string): Hospital | undefined {
  return hospitals.find(h => h.id === id);
}
