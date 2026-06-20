import type { Medicine, HealthLog, Patient } from '../types';
import { getDaysRemaining, isExpiringSoon, isExpired } from './dateUtils';

export function calculateMedicineRiskScore(medicine: Medicine): number {
  let score = 0;

  // Verification status
  if (medicine.verificationStatus === 'Verified') score += 0;
  else if (medicine.verificationStatus === 'Suspicious') score += 40;
  else score += 25;

  // Licence status
  if (medicine.licenceStatus === 'Expired' || medicine.licenceStatus === 'Suspended') score += 30;

  // Expiry
  if (isExpired(medicine.expiryDate)) score += 35;
  else if (isExpiringSoon(medicine.expiryDate)) score += 15;

  // Batch number format check
  const batchPattern = /^[A-Z]{3}-[A-Z]{4}-\d{4}-\d{3,4}$/;
  if (!batchPattern.test(medicine.batchNumber)) score += 10;

  // Price anomaly (if price is significantly lower than generic)
  if (medicine.brandPrice < medicine.genericPrice * 0.8) score += 15;

  return Math.min(100, score);
}

export function getMedicineVerificationFlags(medicine: Medicine): string[] {
  const flags: string[] = [];

  if (medicine.verificationStatus === 'Suspicious') {
    flags.push('Medicine flagged in counterfeit database');
  }

  if (medicine.licenceStatus !== 'Valid') {
    flags.push(`Manufacturer licence status: ${medicine.licenceStatus}`);
  }

  if (isExpired(medicine.expiryDate)) {
    flags.push('Medicine has expired');
  } else if (isExpiringSoon(medicine.expiryDate)) {
    flags.push(`Expiry date is within 30 days (${getDaysRemaining(medicine.expiryDate)} days remaining)`);
  }

  const batchPattern = /^[A-Z]{3}-[A-Z]{4}-\d{4}-\d{3,4}$/;
  if (!batchPattern.test(medicine.batchNumber) && medicine.verificationStatus !== 'Verified') {
    flags.push('Batch number format does not match manufacturer standards');
  }

  if (medicine.brandPrice < medicine.genericPrice * 0.8) {
    flags.push('Price anomaly detected: Price significantly lower than market average');
  }

  if (medicine.manufacturer.includes('Unknown') || medicine.manufacturer.includes('Unregistered')) {
    flags.push('Manufacturer not found in Central Drugs Standard Control Organisation database');
  }

  if (flags.length === 0) {
    flags.push('No issues detected. Medicine appears genuine.');
  }

  return flags;
}

export function calculateImmunityScore(logs: HealthLog[]): number {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const recentLogs = logs.filter(log => new Date(log.date) >= oneYearAgo);

  let penalty = 0;
  recentLogs.forEach(log => {
    const severityPenalty = log.severity === 'Mild' ? 1 : log.severity === 'Moderate' ? 3 : 5;
    const durationPenalty = Math.min(log.duration, 14) * 0.2;
    penalty += severityPenalty + durationPenalty;
  });

  // Bonus for fewer episodes
  if (recentLogs.length < 5) penalty -= 5;

  return Math.max(0, Math.min(100, 100 - penalty));
}

export function calculateHealthScore(patient: Patient, healthLogs: HealthLog[]): number {
  let baseScore = 100;

  // Deduct for chronic conditions
  baseScore -= patient.conditions.length * 5;

  // Deduct for allergies
  baseScore -= patient.allergies.length * 2;

  // Deduct for insurance status
  if (patient.insuranceStatus === 'Inactive') baseScore -= 10;
  else if (patient.insuranceStatus === 'Pending') baseScore -= 5;

  // Factor in immunity score
  const immunityScore = calculateImmunityScore(healthLogs.filter(l => l.patientId === patient.id));
  const adjustedScore = (baseScore * 0.6) + (immunityScore * 0.4);

  return Math.max(0, Math.min(100, Math.round(adjustedScore)));
}

export function getHealthRiskLevel(score: number): 'Low' | 'Medium' | 'High' {
  if (score >= 70) return 'Low';
  if (score >= 40) return 'Medium';
  return 'High';
}

export function getImmunityRiskLevel(score: number): 'Good' | 'Moderate' | 'Weak' {
  if (score >= 70) return 'Good';
  if (score >= 40) return 'Moderate';
  return 'Weak';
}
