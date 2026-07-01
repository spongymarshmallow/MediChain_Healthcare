-- ============================================================
-- 006: Reconstruct all RLS around health_id
-- Every table uses health_id as the primary access key.
-- get_my_health_id() resolves the caller's health_id from
-- user_profiles.  For non-patient roles (doctors, hospitals)
-- who have no user_profiles row, it returns NULL, which lets
-- the second branch (get_my_health_id() IS NULL) pass through
-- so the application-layer filter by health_id still works.
-- ============================================================

-- 1. Helper function
CREATE OR REPLACE FUNCTION get_my_health_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT health_id FROM user_profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- 2. notifications: add health_id, backfill, rebuild policies
-- ============================================================
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS health_id TEXT;

UPDATE notifications n
SET    health_id = up.health_id
FROM   user_profiles up
WHERE  up.user_id = n.user_id
  AND  n.health_id IS NULL;

CREATE INDEX IF NOT EXISTS notifications_health_id_created_idx
  ON notifications(health_id, created_at DESC);

DROP POLICY IF EXISTS "select_own_notifications"   ON notifications;
DROP POLICY IF EXISTS "insert_notifications"        ON notifications;
DROP POLICY IF EXISTS "update_own_notifications"   ON notifications;
DROP POLICY IF EXISTS "delete_own_notifications"   ON notifications;

CREATE POLICY "select_own_notifications" ON notifications FOR SELECT TO authenticated
  USING (health_id = get_my_health_id());

CREATE POLICY "insert_notifications" ON notifications FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE TO authenticated
  USING  (health_id = get_my_health_id())
  WITH CHECK (health_id = get_my_health_id());

CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE TO authenticated
  USING (health_id = get_my_health_id());

-- ============================================================
-- 3. lab_reports
-- ============================================================
DROP POLICY IF EXISTS "Patients can view own lab_reports"               ON lab_reports;
DROP POLICY IF EXISTS "Doctors can view lab_reports for their patients" ON lab_reports;
DROP POLICY IF EXISTS "Doctors can insert lab_reports"                  ON lab_reports;
DROP POLICY IF EXISTS "Doctors can update lab_reports"                  ON lab_reports;

CREATE POLICY "select_lab_reports" ON lab_reports FOR SELECT TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

CREATE POLICY "insert_lab_reports" ON lab_reports FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "update_lab_reports" ON lab_reports FOR UPDATE TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

-- ============================================================
-- 4. prescriptions
-- ============================================================
DROP POLICY IF EXISTS "Patients can view own prescriptions"  ON prescriptions;
DROP POLICY IF EXISTS "Doctors can view all prescriptions"   ON prescriptions;
DROP POLICY IF EXISTS "Doctors can insert prescriptions"     ON prescriptions;
DROP POLICY IF EXISTS "Doctors can update prescriptions"     ON prescriptions;
DROP POLICY IF EXISTS "Pharmacy can view prescriptions"      ON prescriptions;

CREATE POLICY "select_prescriptions" ON prescriptions FOR SELECT TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

CREATE POLICY "insert_prescriptions" ON prescriptions FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "update_prescriptions" ON prescriptions FOR UPDATE TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

-- ============================================================
-- 5. vaccinations
-- ============================================================
DROP POLICY IF EXISTS "Patients can view own vaccinations"  ON vaccinations;
DROP POLICY IF EXISTS "Doctors can view all vaccinations"   ON vaccinations;
DROP POLICY IF EXISTS "Doctors can insert vaccinations"     ON vaccinations;
DROP POLICY IF EXISTS "Doctors can update vaccinations"     ON vaccinations;

CREATE POLICY "select_vaccinations" ON vaccinations FOR SELECT TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

CREATE POLICY "insert_vaccinations" ON vaccinations FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "update_vaccinations" ON vaccinations FOR UPDATE TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

-- ============================================================
-- 6. health_logs
-- ============================================================
DROP POLICY IF EXISTS "Patients can view own health_logs"    ON health_logs;
DROP POLICY IF EXISTS "Patients can insert own health_logs"  ON health_logs;
DROP POLICY IF EXISTS "Patients can delete own health_logs"  ON health_logs;
DROP POLICY IF EXISTS "Doctors can view patient health_logs" ON health_logs;

CREATE POLICY "select_health_logs" ON health_logs FOR SELECT TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

CREATE POLICY "insert_health_logs" ON health_logs FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "delete_health_logs" ON health_logs FOR DELETE TO authenticated
  USING (health_id = get_my_health_id());

-- ============================================================
-- 7. consent_requests
-- ============================================================
DROP POLICY IF EXISTS "Patients can view own consent_requests"   ON consent_requests;
DROP POLICY IF EXISTS "Patients can update own consent_requests" ON consent_requests;
DROP POLICY IF EXISTS "Doctors can view consent_requests"        ON consent_requests;
DROP POLICY IF EXISTS "Doctors can insert consent_requests"      ON consent_requests;

CREATE POLICY "select_consent_requests" ON consent_requests FOR SELECT TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

CREATE POLICY "insert_consent_requests" ON consent_requests FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "update_consent_requests" ON consent_requests FOR UPDATE TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

-- ============================================================
-- 8. blockchain_transactions  (column is patient_health_id)
-- ============================================================
DROP POLICY IF EXISTS "All authenticated can view blockchain" ON blockchain_transactions;
DROP POLICY IF EXISTS "System can insert blockchain"          ON blockchain_transactions;

CREATE POLICY "select_blockchain" ON blockchain_transactions FOR SELECT TO authenticated
  USING (patient_health_id = get_my_health_id() OR get_my_health_id() IS NULL);

CREATE POLICY "insert_blockchain" ON blockchain_transactions FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============================================================
-- 9. doctor_consents
-- ============================================================
DROP POLICY IF EXISTS "patient_select_own_consents"  ON doctor_consents;
DROP POLICY IF EXISTS "patient_update_own_consents"  ON doctor_consents;
DROP POLICY IF EXISTS "doctor_insert_consents"       ON doctor_consents;
DROP POLICY IF EXISTS "doctor_select_own_consents"   ON doctor_consents;

CREATE POLICY "select_doctor_consents" ON doctor_consents FOR SELECT TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

CREATE POLICY "insert_doctor_consents" ON doctor_consents FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "update_doctor_consents" ON doctor_consents FOR UPDATE TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

-- ============================================================
-- 10. patient_details
-- ============================================================
DROP POLICY IF EXISTS "patient_select_own_details" ON patient_details;
DROP POLICY IF EXISTS "patient_insert_own_details" ON patient_details;
DROP POLICY IF EXISTS "patient_update_own_details" ON patient_details;

CREATE POLICY "select_patient_details" ON patient_details FOR SELECT TO authenticated
  USING (health_id = get_my_health_id() OR get_my_health_id() IS NULL);

CREATE POLICY "insert_patient_details" ON patient_details FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_patient_details" ON patient_details FOR UPDATE TO authenticated
  USING  (health_id = get_my_health_id())
  WITH CHECK (health_id = get_my_health_id());
