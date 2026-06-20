import type { Doctor } from '../types';

export const doctors: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Rajesh Gupta',
    specialty: 'General Physician',
    license: 'MCI-2005-DL-01234',
    hospital: 'Apollo Hospital',
    experience: 18,
  },
  {
    id: 'doc-002',
    name: 'Dr. Priya Menon',
    specialty: 'Cardiologist',
    license: 'MCI-2010-KL-05678',
    hospital: 'Fortis Hospital',
    experience: 13,
  },
  {
    id: 'doc-003',
    name: 'Dr. Arun Thomas',
    specialty: 'Pulmonologist',
    license: 'MCI-2008-KL-03456',
    hospital: 'AIIMS Delhi',
    experience: 15,
  },
  {
    id: 'doc-004',
    name: 'Dr. Sunita Verma',
    specialty: 'Allergist',
    license: 'MCI-2012-MH-07890',
    hospital: 'Apollo Hospital',
    experience: 11,
  },
  {
    id: 'doc-005',
    name: 'Dr. Anil Sharma',
    specialty: 'Pediatrician',
    license: 'MCI-2007-RJ-04567',
    hospital: 'Fortis Hospital',
    experience: 16,
  },
  {
    id: 'doc-006',
    name: 'Dr. Meena Iyer',
    specialty: 'Orthopaedic',
    license: 'MCI-2011-TN-06789',
    hospital: 'AIIMS Delhi',
    experience: 12,
  },
];

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find(d => d.id === id);
}

export function getDoctorsByHospital(hospitalId: string): Doctor[] {
  const hospitalMap: Record<string, string> = {
    'hosp-001': 'Apollo Hospital',
    'hosp-002': 'Fortis Hospital',
    'hosp-003': 'AIIMS Delhi',
  };
  return doctors.filter(d => d.hospital === hospitalMap[hospitalId]);
}
