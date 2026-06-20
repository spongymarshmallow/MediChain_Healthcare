import type { Vaccination } from '../types';

export const vaccinations: Vaccination[] = [
  // Patient 1
  { id: 'vax-001', patientId: 'pat-001', vaccine: 'BCG', date: '1992-03-15', dose: 'Single', administeredBy: 'Dr. Sharma', hospital: 'Safdarjung Hospital' },
  { id: 'vax-002', patientId: 'pat-001', vaccine: 'Hepatitis B', date: '1992-03-15', dose: 'Dose 1', administeredBy: 'Dr. Sharma', hospital: 'Safdarjung Hospital', nextDue: 'Completed' },
  { id: 'vax-003', patientId: 'pat-001', vaccine: 'COVID-19 (Covaxin)', date: '2021-05-10', dose: 'Dose 1', administeredBy: 'Dr. Gupta', hospital: 'Apollo Hospital' },
  { id: 'vax-004', patientId: 'pat-001', vaccine: 'COVID-19 (Covaxin)', date: '2021-06-15', dose: 'Dose 2', administeredBy: 'Dr. Gupta', hospital: 'Apollo Hospital', nextDue: 'Due: Booster' },
  { id: 'vax-005', patientId: 'pat-001', vaccine: 'Influenza 2025', date: '2025-10-15', dose: 'Annual', administeredBy: 'Dr. Rajesh Gupta', hospital: 'Apollo Hospital', nextDue: 'Oct 2026' },

  // Patient 2
  { id: 'vax-006', patientId: 'pat-002', vaccine: 'BCG', date: '1998-07-22', dose: 'Single', administeredBy: 'Dr. Patel', hospital: 'Government Hospital, Vadodara' },
  { id: 'vax-007', patientId: 'pat-002', vaccine: 'Hepatitis B', date: '1998-07-22', dose: 'Complete', administeredBy: 'Dr. Patel', hospital: 'Government Hospital, Vadodara', nextDue: 'Completed' },
  { id: 'vax-008', patientId: 'pat-002', vaccine: 'MMR', date: '1999-01-15', dose: 'Dose 1', administeredBy: 'Dr. Patel', hospital: 'Government Hospital, Vadodara' },
  { id: 'vax-009', patientId: 'pat-002', vaccine: 'COVID-19 (Covishield)', date: '2021-04-20', dose: 'Dose 1', administeredBy: 'Dr. Menon', hospital: 'Fortis Hospital' },
  { id: 'vax-010', patientId: 'pat-002', vaccine: 'COVID-19 (Covishield)', date: '2021-07-22', dose: 'Dose 2', administeredBy: 'Dr. Menon', hospital: 'Fortis Hospital' },
  { id: 'vax-011', patientId: 'pat-002', vaccine: 'HPV', date: '2024-02-10', dose: 'Dose 1', administeredBy: 'Dr. Verma', hospital: 'Apollo Hospital', nextDue: 'Aug 2024' },

  // Patient 3
  { id: 'vax-012', patientId: 'pat-003', vaccine: 'BCG', date: '1981-08-05', dose: 'Single', administeredBy: 'Dr. Reddy', hospital: 'Osmania Hospital' },
  { id: 'vax-013', patientId: 'pat-003', vaccine: 'Hepatitis B', date: '2005-03-20', dose: 'Complete', administeredBy: 'Dr. Reddy', hospital: 'NIMS Hospital' },
  { id: 'vax-014', patientId: 'pat-003', vaccine: 'Influenza 2025', date: '2025-11-10', dose: 'Annual', administeredBy: 'Dr. Priya Menon', hospital: 'Fortis Hospital', nextDue: 'Nov 2026' },

  // Patient 4
  { id: 'vax-015', patientId: 'pat-004', vaccine: 'BCG', date: '1959-02-28', dose: 'Single', administeredBy: 'Govt. Hospital', hospital: 'General Hospital, Chennai' },
  { id: 'vax-016', patientId: 'pat-004', vaccine: 'Hepatitis B', date: '2010-05-15', dose: 'Complete', administeredBy: 'Dr. Krishnan', hospital: 'Apollo Hospital' },
  { id: 'vax-017', patientId: 'pat-004', vaccine: 'Influenza 2025', date: '2025-09-20', dose: 'Annual', administeredBy: 'Dr. Meena Iyer', hospital: 'AIIMS Delhi', nextDue: 'Sep 2026' },
  { id: 'vax-018', patientId: 'pat-004', vaccine: 'Pneumococcal', date: '2024-03-10', dose: 'Single', administeredBy: 'Dr. Meena Iyer', hospital: 'AIIMS Delhi' },

  // Patient 5
  { id: 'vax-019', patientId: 'pat-005', vaccine: 'BCG', date: '1974-06-12', dose: 'Single', administeredBy: 'Dr. Singh', hospital: 'PGIMER' },
  { id: 'vax-020', patientId: 'pat-005', vaccine: 'Hepatitis B', date: '2015-08-20', dose: 'Complete', administeredBy: 'Dr. Kumar', hospital: 'AIIMS Delhi' },
  { id: 'vax-021', patientId: 'pat-005', vaccine: 'COVID-19 (Covaxin)', date: '2021-04-01', dose: 'Dose 1', administeredBy: 'Dr. Rajesh Gupta', hospital: 'AIIMS Delhi' },
  { id: 'vax-022', patientId: 'pat-005', vaccine: 'COVID-19 (Covaxin)', date: '2021-05-15', dose: 'Dose 2', administeredBy: 'Dr. Rajesh Gupta', hospital: 'AIIMS Delhi' },
  { id: 'vax-023', patientId: 'pat-005', vaccine: 'COVID-19 Booster', date: '2022-12-10', dose: 'Booster', administeredBy: 'Dr. Rajesh Gupta', hospital: 'AIIMS Delhi' },

  // Patient 7
  { id: 'vax-024', patientId: 'pat-007', vaccine: 'BCG', date: '2003-01-10', dose: 'Single', administeredBy: 'Dr. Nair', hospital: 'Kerala Government Hospital' },
  { id: 'vax-025', patientId: 'pat-007', vaccine: 'Hepatitis B', date: '2003-01-10', dose: 'Complete', administeredBy: 'Dr. Nair', hospital: 'Kerala Government Hospital', nextDue: 'Completed' },
  { id: 'vax-026', patientId: 'pat-007', vaccine: 'MMR', date: '2004-06-15', dose: 'Complete', administeredBy: 'Dr. Nair', hospital: 'Kerala Government Hospital' },
  { id: 'vax-027', patientId: 'pat-007', vaccine: 'COVID-19', date: '2022-03-20', dose: 'Dose 1', administeredBy: 'Dr. Thomas', hospital: 'Apollo Hospital' },
  { id: 'vax-028', patientId: 'pat-007', vaccine: 'COVID-19', date: '2022-04-25', dose: 'Dose 2', administeredBy: 'Dr. Thomas', hospital: 'Apollo Hospital' },
  { id: 'vax-029', patientId: 'pat-007', vaccine: 'Typhoid', date: '2025-01-15', dose: 'Single', administeredBy: 'Dr. Anil Sharma', hospital: 'Apollo Hospital', nextDue: 'Jan 2027' },

  // Additional entries for other patients
  { id: 'vax-030', patientId: 'pat-006', vaccine: 'Hepatitis B', date: '2020-02-10', dose: 'Complete', administeredBy: 'Dr. Agarwal', hospital: 'Fortis Hospital', nextDue: 'Completed' },
  { id: 'vax-031', patientId: 'pat-006', vaccine: 'COVID-19', date: '2021-05-10', dose: 'Dose 1', administeredBy: 'Dr. Agarwal', hospital: 'Fortis Hospital' },
  { id: 'vax-032', patientId: 'pat-006', vaccine: 'COVID-19', date: '2021-06-20', dose: 'Dose 2', administeredBy: 'Dr. Agarwal', hospital: 'Fortis Hospital' },

  { id: 'vax-033', patientId: 'pat-008', vaccine: 'Influenza 2025', date: '2025-10-05', dose: 'Annual', administeredBy: 'Dr. Khan', hospital: 'Apollo Hospital', nextDue: 'Oct 2026' },
  { id: 'vax-034', patientId: 'pat-008', vaccine: 'Hepatitis B', date: '2018-04-15', dose: 'Complete', administeredBy: 'Dr. Khan', hospital: 'Apollo Hospital' },

  { id: 'vax-035', patientId: 'pat-009', vaccine: 'COVID-19', date: '2021-06-01', dose: 'Dose 1', administeredBy: 'Dr. Mehta', hospital: 'AIIMS Delhi' },
  { id: 'vax-036', patientId: 'pat-009', vaccine: 'COVID-19', date: '2021-07-15', dose: 'Dose 2', administeredBy: 'Dr. Mehta', hospital: 'AIIMS Delhi' },

  { id: 'vax-037', patientId: 'pat-010', vaccine: 'Influenza 2025', date: '2025-09-15', dose: 'Annual', administeredBy: 'Dr. Deshmukh', hospital: 'Fortis Hospital', nextDue: 'Sep 2026' },
  { id: 'vax-038', patientId: 'pat-010', vaccine: 'Pneumococcal', date: '2023-03-20', dose: 'Single', administeredBy: 'Dr. Deshmukh', hospital: 'Fortis Hospital' },
];

export function getVaccinationsByPatient(patientId: string): Vaccination[] {
  return vaccinations.filter(v => v.patientId === patientId);
}
