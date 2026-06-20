// User Roles
export type UserRole = 'patient' | 'doctor' | 'hospital' | 'pharmacy' | 'government' | 'insurance';

// Patient
export interface Patient {
  id: string;
  healthId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  conditions: string[];
  vaccinations: string[];
  insuranceStatus: 'Active' | 'Pending' | 'Inactive';
  healthScore: number;
  avatar?: string;
}

// Doctor
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  license: string;
  hospital: string;
  experience: number;
  avatar?: string;
}

// Hospital
export interface Hospital {
  id: string;
  name: string;
  type: 'Private' | 'Government' | 'Multi-Specialty';
  address: string;
  departments: string[];
  totalBeds: number;
  availableBeds: number;
}

// Prescription
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  medicines: PrescriptionMedicine[];
  date: string;
  status: 'Pending' | 'Fulfilled' | 'Cancelled';
  notes?: string;
}

export interface PrescriptionMedicine {
  medicineId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// Lab Report
export interface LabReport {
  id: string;
  patientId: string;
  testName: string;
  values: LabTestValue[];
  status: 'Normal' | 'Abnormal' | 'Pending';
  date: string;
  hospital: string;
  doctor: string;
}

export interface LabTestValue {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Low' | 'High';
}

// Vaccination
export interface Vaccination {
  id: string;
  patientId: string;
  vaccine: string;
  date: string;
  dose: string;
  administeredBy: string;
  hospital: string;
  nextDue?: string;
}

// Medicine
export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  manufactureDate: string;
  dosageStrength: string;
  verificationStatus: 'Verified' | 'Suspicious' | 'Unknown';
  riskLevel: 'Low' | 'Medium' | 'High';
  brandPrice: number;
  genericPrice: number;
  licenceStatus: 'Valid' | 'Expired' | 'Suspended';
}

// Blockchain Ledger
export interface BlockchainTransaction {
  blockNumber: number;
  hash: string;
  previousHash: string;
  timestamp: string;
  transactionType: 'createRecord' | 'grantConsent' | 'revokeConsent' | 'emergencyAccess' | 'auditAccess' | 'updateRecord';
  actor: string;
  patientId: string;
  details: string;
}

// Health Log
export interface HealthLog {
  id: string;
  patientId: string;
  symptom: SymptomType;
  severity: 'Mild' | 'Moderate' | 'Severe';
  duration: number;
  date: string;
  notes?: string;
}

export type SymptomType =
  | 'Cold'
  | 'Cough'
  | 'Fever'
  | 'Allergy'
  | 'Headache'
  | 'Stomach Infection'
  | 'Seasonal Illness'
  | 'Fatigue'
  | 'Weakness'
  | 'Other';

// Consent Request
export interface ConsentRequest {
  id: string;
  patientId: string;
  requesterId: string;
  requesterName: string;
  requesterType: 'Doctor' | 'Hospital' | 'Insurance' | 'Government';
  recordsRequested: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  expiryDate?: string;
  reason: string;
}

// Consent Access Log
export interface ConsentAccessLog {
  id: string;
  patientId: string;
  accessorId: string;
  accessorName: string;
  accessType: 'View' | 'Edit' | 'Emergency';
  recordsAccessed: string[];
  accessDate: string;
  duration: string;
  reason: string;
  transactionHash: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

export type NotificationType =
  | 'Consent Request'
  | 'Report Uploaded'
  | 'Prescription Created'
  | 'Emergency Access'
  | 'Insurance Claim'
  | 'Vaccination Reminder'
  | 'Medication Reminder'
  | 'Counterfeit Alert'
  | 'Health Pattern Insight';

// Admission
export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  department: string;
  doctorId: string;
  doctorName: string;
  roomNumber: string;
  admissionDate: string;
  dischargeDate?: string;
  status: 'Admitted' | 'Discharged' | 'Transferred';
  condition: string;
}

// Insurance Claim
export interface InsuranceClaim {
  id: string;
  patientId: string;
  patientName: string;
  treatment: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fraud Flagged';
  submissionDate: string;
  hospitalId: string;
  hospitalName: string;
  documents: string[];
}

// Disease Alert
export interface DiseaseAlert {
  id: string;
  disease: string;
  region: string;
  cases: number;
  trend: 'Rising' | 'Stable' | 'Declining';
  lastUpdated: string;
}

// Timeline Event
export interface TimelineEvent {
  id: string;
  patientId: string;
  type: 'Hospital Visit' | 'Diagnosis' | 'Prescription' | 'Lab Report' | 'Vaccination' | 'Surgery';
  date: string;
  title: string;
  description: string;
  hospital?: string;
  doctor?: string;
  details?: Record<string, unknown>;
}

// Consent Rule Type
export type ConsentRuleType = 'One Time' | 'Time Limited' | 'Full' | 'Emergency';

// Emergency Access Request
export interface EmergencyAccessRequest {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  emergencyType: 'Accident' | 'Trauma' | 'Stroke' | 'Cardiac' | 'Unconscious';
  duration: '1h' | '6h' | '24h';
  requestTime: string;
  status: 'Active' | 'Expired' | 'Revoked';
}

// Stats
export interface StatCard {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
}
