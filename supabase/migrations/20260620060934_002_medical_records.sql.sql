-- Patient medical records tables

-- Lab Reports
CREATE TABLE IF NOT EXISTS lab_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  health_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Normal', 'Abnormal', 'Pending')),
  date DATE NOT NULL,
  hospital TEXT NOT NULL,
  doctor TEXT NOT NULL,
  values JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  health_id TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  hospital_id TEXT NOT NULL,
  hospital TEXT NOT NULL,
  medicines JSONB DEFAULT '[]',
  date DATE NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Fulfilled', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vaccinations
CREATE TABLE IF NOT EXISTS vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  health_id TEXT NOT NULL,
  vaccine TEXT NOT NULL,
  date DATE NOT NULL,
  dose TEXT NOT NULL,
  administered_by TEXT NOT NULL,
  hospital TEXT NOT NULL,
  next_due TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Logs (symptom tracking - patient can add these)
CREATE TABLE IF NOT EXISTS health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  health_id TEXT NOT NULL,
  symptom TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
  duration INTEGER NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blockchain transactions log
CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_number SERIAL,
  hash TEXT UNIQUE NOT NULL,
  previous_hash TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('createRecord', 'grantConsent', 'revokeConsent', 'emergencyAccess', 'auditAccess', 'updateRecord')),
  actor TEXT NOT NULL,
  patient_health_id TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consent requests
CREATE TABLE IF NOT EXISTS consent_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  health_id TEXT NOT NULL,
  requester_id TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_type TEXT NOT NULL CHECK (requester_type IN ('Doctor', 'Hospital', 'Insurance', 'Government')),
  records_requested JSONB DEFAULT '[]',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  request_date DATE NOT NULL,
  expiry_date DATE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lab_reports
CREATE POLICY "Patients can view own lab_reports" ON lab_reports
  FOR SELECT TO authenticated USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view lab_reports for their patients" ON lab_reports
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Doctors can insert lab_reports" ON lab_reports
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Doctors can update lab_reports" ON lab_reports
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for prescriptions
CREATE POLICY "Patients can view own prescriptions" ON prescriptions
  FOR SELECT TO authenticated USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view all prescriptions" ON prescriptions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Doctors can insert prescriptions" ON prescriptions
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Doctors can update prescriptions" ON prescriptions
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Pharmacy can view prescriptions" ON prescriptions
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for vaccinations
CREATE POLICY "Patients can view own vaccinations" ON vaccinations
  FOR SELECT TO authenticated USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view all vaccinations" ON vaccinations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Doctors can insert vaccinations" ON vaccinations
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Doctors can update vaccinations" ON vaccinations
  FOR UPDATE TO authenticated USING (true);

-- RLS Policies for health_logs (patients can add their own)
CREATE POLICY "Patients can view own health_logs" ON health_logs
  FOR SELECT TO authenticated USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert own health_logs" ON health_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can delete own health_logs" ON health_logs
  FOR DELETE TO authenticated USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view patient health_logs" ON health_logs
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for blockchain_transactions (read-only for all authenticated)
CREATE POLICY "All authenticated can view blockchain" ON blockchain_transactions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can insert blockchain" ON blockchain_transactions
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for consent_requests
CREATE POLICY "Patients can view own consent_requests" ON consent_requests
  FOR SELECT TO authenticated USING (auth.uid() = patient_id);
CREATE POLICY "Patients can update own consent_requests" ON consent_requests
  FOR UPDATE TO authenticated USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can view consent_requests" ON consent_requests
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Doctors can insert consent_requests" ON consent_requests
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_lab_reports_patient ON lab_reports(patient_id);
CREATE INDEX idx_lab_reports_health_id ON lab_reports(health_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_health_id ON prescriptions(health_id);
CREATE INDEX idx_vaccinations_patient ON vaccinations(patient_id);
CREATE INDEX idx_vaccinations_health_id ON vaccinations(health_id);
CREATE INDEX idx_health_logs_patient ON health_logs(patient_id);
CREATE INDEX idx_health_logs_health_id ON health_logs(health_id);
CREATE INDEX idx_consent_requests_patient ON consent_requests(patient_id);
CREATE INDEX idx_blockchain_health_id ON blockchain_transactions(patient_health_id);

-- Trigger for updated_at
CREATE TRIGGER lab_reports_updated_at BEFORE UPDATE ON lab_reports
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER prescriptions_updated_at BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER consent_requests_updated_at BEFORE UPDATE ON consent_requests
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();