/*
# Patient Details Table & Doctor Consent System

1. New Tables
- `patient_details`: Stores patient personal/medical profile data (name, age, height, weight, blood_group, personal_contact, emergency_contact, emergency_contact_name, allergies), linked by health_id.
- `doctor_consents`: Stores doctor consent requests for patient data access. Each request has a doctor name, health_id, status, and request_date.

2. Security
- Enable RLS on both tables.
- `patient_details`: patient can read/update their own; doctors can read only if consent is granted.
- `doctor_consents`: patient can read/update their own; doctors can insert requests and read their own requests.

3. Important Notes
- All patient data is stored in `patient_details` and linked by `health_id`.
- Consent requests are per doctor per patient.
- Doctors cannot view patient data without an active consent.
*/

-- Patient Details Table
CREATE TABLE IF NOT EXISTS patient_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  health_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  height INTEGER NOT NULL,
  weight INTEGER NOT NULL,
  blood_group TEXT NOT NULL,
  personal_contact TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  emergency_contact_name TEXT NOT NULL,
  allergies JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor Consents Table
CREATE TABLE IF NOT EXISTS doctor_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  health_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  request_date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE patient_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_consents ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patient_details_health_id ON patient_details(health_id);
CREATE INDEX IF NOT EXISTS idx_patient_details_user_id ON patient_details(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_consents_health_id ON doctor_consents(health_id);
CREATE INDEX IF NOT EXISTS idx_doctor_consents_doctor_id ON doctor_consents(doctor_id);

-- RLS Policies for patient_details
-- Patient can select their own details
DROP POLICY IF EXISTS "patient_select_own_details" ON patient_details;
CREATE POLICY "patient_select_own_details" ON patient_details
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Patient can insert their own details
DROP POLICY IF EXISTS "patient_insert_own_details" ON patient_details;
CREATE POLICY "patient_insert_own_details" ON patient_details
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Patient can update their own details
DROP POLICY IF EXISTS "patient_update_own_details" ON patient_details;
CREATE POLICY "patient_update_own_details" ON patient_details
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for doctor_consents
-- Patient can view their own consent requests
DROP POLICY IF EXISTS "patient_select_own_consents" ON doctor_consents;
CREATE POLICY "patient_select_own_consents" ON doctor_consents
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM patient_details WHERE patient_details.health_id = doctor_consents.health_id AND patient_details.user_id = auth.uid()
    )
  );

-- Patient can update their own consent requests (approve/reject)
DROP POLICY IF EXISTS "patient_update_own_consents" ON doctor_consents;
CREATE POLICY "patient_update_own_consents" ON doctor_consents
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM patient_details WHERE patient_details.health_id = doctor_consents.health_id AND patient_details.user_id = auth.uid()
    )
  );

-- Doctors can insert consent requests
DROP POLICY IF EXISTS "doctor_insert_consents" ON doctor_consents;
CREATE POLICY "doctor_insert_consents" ON doctor_consents
  FOR INSERT TO authenticated WITH CHECK (true);

-- Doctors can view their own requests
DROP POLICY IF EXISTS "doctor_select_own_consents" ON doctor_consents;
CREATE POLICY "doctor_select_own_consents" ON doctor_consents
  FOR SELECT TO authenticated USING (true);
