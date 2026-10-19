-- Sync database tables with mock data from src/data/*.ts
-- Replaces all stale rows in non-exempt tables with the canonical mock data.
-- Tables left UNTOUCHED: medicines, hospitals, admissions, insurance_claims, disease_alerts.
-- Mapping: pat-001 -> MC-2026-00000001 (zero-padded 8 digits).
-- Idempotent: re-running clears and re-inserts the same rows.

-- 1. patient_details
DELETE FROM patient_details;

INSERT INTO patient_details
  (health_id, name, age, height, weight, blood_group, personal_contact, emergency_contact, emergency_contact_name, allergies)
VALUES
  ('MC-2026-00000001','Rahul Sharma',34,170,72,'O+','+91 98765 43210','+91 98765 43210','Priya Sharma (Spouse)','["Penicillin","Sulfa"]'::jsonb),
  ('MC-2026-00000002','Ananya Patel',28,165,58,'A+','+91 87654 32109','+91 87654 32109','Vikram Patel (Brother)','[]'::jsonb),
  ('MC-2026-00000003','Arjun Reddy',45,172,80,'B+','+91 76543 21098','+91 76543 21098','Lakshmi Reddy (Spouse)','["Aspirin"]'::jsonb),
  ('MC-2026-00000004','Meera Krishnan',67,158,62,'AB-','+91 65432 10987','+91 65432 10987','Ravi Krishnan (Son)','["Latex","Shellfish"]'::jsonb),
  ('MC-2026-00000005','Vikram Singh',52,175,78,'A-','+91 54321 09876','+91 54321 09876','Gurpreet Singh (Brother)','["Ibuprofen"]'::jsonb),
  ('MC-2026-00000006','Sunita Agarwal',41,160,55,'O-','+91 43210 98765','+91 43210 98765','Ramesh Agarwal (Spouse)','[]'::jsonb),
  ('MC-2026-00000007','Karthik Nair',23,178,68,'B-','+91 32109 87654','+91 32109 87654','Sharada Nair (Mother)','["Peanuts"]'::jsonb),
  ('MC-2026-00000008','Fatima Begum',56,155,60,'AB+','+91 21098 76543','+91 21098 76543','Imran Khan (Son)','["Codeine"]'::jsonb),
  ('MC-2026-00000009','Deepak Mehta',38,174,70,'A+','+91 19876 54321','+91 19876 54321','Neha Mehta (Spouse)','["Sulfa","Contrast Dye"]'::jsonb),
  ('MC-2026-00000010','Gauri Deshmukh',72,150,52,'O+','+91 98765 12340','+91 98765 12340','Sanjay Deshmukh (Son)','[]'::jsonb);

-- 2. lab_reports
DELETE FROM lab_reports;

INSERT INTO lab_reports (health_id, test_name, status, date, hospital, doctor, values) VALUES
  ('MC-2026-00000001','Complete Blood Count','Normal','2026-06-10','Apollo Hospital','Dr. Rajesh Gupta','[{"parameter":"Hemoglobin","value":"14.2","unit":"g/dL","referenceRange":"13.5-17.5","status":"Normal"},{"parameter":"WBC Count","value":"7,800","unit":"/µL","referenceRange":"4,000-10,000","status":"Normal"},{"parameter":"Platelet Count","value":"245,000","unit":"/µL","referenceRange":"150,000-400,000","status":"Normal"},{"parameter":"RBC Count","value":"4.8","unit":"million/µL","referenceRange":"4.5-5.5","status":"Normal"}]'::jsonb),
  ('MC-2026-00000001','HbA1c','Abnormal','2026-06-10','Apollo Hospital','Dr. Rajesh Gupta','[{"parameter":"HbA1c","value":"7.8","unit":"%","referenceRange":"4.0-5.6","status":"High"}]'::jsonb),
  ('MC-2026-00000003','Lipid Profile','Abnormal','2026-06-08','Fortis Hospital','Dr. Priya Menon','[{"parameter":"Total Cholesterol","value":"238","unit":"mg/dL","referenceRange":"< 200","status":"High"},{"parameter":"LDL Cholesterol","value":"158","unit":"mg/dL","referenceRange":"< 100","status":"High"},{"parameter":"HDL Cholesterol","value":"45","unit":"mg/dL","referenceRange":"> 40","status":"Normal"},{"parameter":"Triglycerides","value":"175","unit":"mg/dL","referenceRange":"< 150","status":"High"}]'::jsonb),
  ('MC-2026-00000005','Kidney Function Test','Abnormal','2026-06-15','AIIMS Delhi','Dr. Rajesh Gupta','[{"parameter":"Serum Creatinine","value":"2.1","unit":"mg/dL","referenceRange":"0.7-1.3","status":"High"},{"parameter":"Blood Urea Nitrogen","value":"28","unit":"mg/dL","referenceRange":"7-20","status":"High"},{"parameter":"eGFR","value":"42","unit":"mL/min/1.73m²","referenceRange":"> 90","status":"Low"}]'::jsonb),
  ('MC-2026-00000004','Thyroid Profile','Abnormal','2026-06-05','AIIMS Delhi','Dr. Meena Iyer','[{"parameter":"TSH","value":"8.5","unit":"µIU/mL","referenceRange":"0.4-4.0","status":"High"},{"parameter":"T3","value":"85","unit":"ng/dL","referenceRange":"80-200","status":"Normal"},{"parameter":"T4","value":"5.2","unit":"µg/dL","referenceRange":"4.5-12.5","status":"Normal"}]'::jsonb),
  ('MC-2026-00000008','Mammogram','Normal','2026-06-14','Apollo Hospital','Dr. Priya Menon','[{"parameter":"Findings","value":"No suspicious lesions detected","unit":"","referenceRange":"","status":"Normal"}]'::jsonb),
  ('MC-2026-00000009','EEG Report','Abnormal','2026-06-11','AIIMS Delhi','Dr. Arun Thomas','[{"parameter":"Background Activity","value":"Normal background rhythm","unit":"","referenceRange":"","status":"Normal"},{"parameter":"Epileptiform Discharges","value":"Occasional sharp waves in left temporal region","unit":"","referenceRange":"","status":"Abnormal"}]'::jsonb),
  ('MC-2026-00000002','Pulmonary Function Test','Normal','2026-06-12','Apollo Hospital','Dr. Sunita Verma','[{"parameter":"FEV1","value":"82","unit":"% predicted","referenceRange":"> 80","status":"Normal"},{"parameter":"FVC","value":"95","unit":"% predicted","referenceRange":"> 80","status":"Normal"},{"parameter":"FEV1/FVC Ratio","value":"0.78","unit":"","referenceRange":"> 0.75","status":"Normal"}]'::jsonb),
  ('MC-2026-00000003','Cardiac Stress Test','Abnormal','2026-05-25','Fortis Hospital','Dr. Priya Menon','[{"parameter":"Exercise Capacity","value":"8.5","unit":"METs","referenceRange":"> 10","status":"Low"},{"parameter":"Max Heart Rate","value":"142","unit":"bpm","referenceRange":"150-170","status":"Low"},{"parameter":"ECG Changes","value":"ST depression during exercise","unit":"","referenceRange":"","status":"Abnormal"}]'::jsonb),
  ('MC-2026-00000010','Blood Glucose Fasting','Abnormal','2026-06-16','Fortis Hospital','Dr. Rajesh Gupta','[{"parameter":"Fasting Glucose","value":"168","unit":"mg/dL","referenceRange":"70-100","status":"High"}]'::jsonb);

-- 3. prescriptions
DELETE FROM prescriptions;

INSERT INTO prescriptions (health_id, doctor_id, doctor_name, hospital_id, hospital, medicines, date, status, notes) VALUES
  ('MC-2026-00000001','doc-001','Dr. Rajesh Gupta','hosp-001','Apollo Hospital','[{"medicineId":"med-001","name":"Metformin 500mg","dosage":"500mg","frequency":"Twice daily","duration":"30 days","instructions":"Take with meals"},{"medicineId":"med-002","name":"Amlodipine 5mg","dosage":"5mg","frequency":"Once daily","duration":"30 days","instructions":"Take in the morning"}]'::jsonb,'2026-06-10','Fulfilled','Continue lifestyle modifications. Follow up in 2 weeks.'),
  ('MC-2026-00000002','doc-004','Dr. Sunita Verma','hosp-001','Apollo Hospital','[{"medicineId":"med-003","name":"Montelukast 10mg","dosage":"10mg","frequency":"Once daily","duration":"14 days","instructions":"Take at bedtime"},{"medicineId":"med-004","name":"Salbutamol Inhaler","dosage":"100mcg","frequency":"As needed","duration":"30 days","instructions":"Use during asthma attacks"}]'::jsonb,'2026-06-12','Fulfilled',NULL),
  ('MC-2026-00000003','doc-002','Dr. Priya Menon','hosp-002','Fortis Hospital','[{"medicineId":"med-005","name":"Atorvastatin 20mg","dosage":"20mg","frequency":"Once daily","duration":"90 days","instructions":"Take at bedtime"},{"medicineId":"med-006","name":"Clopidogrel 75mg","dosage":"75mg","frequency":"Once daily","duration":"90 days","instructions":"Take with food"}]'::jsonb,'2026-06-08','Fulfilled','Follow-up cardiac stress test scheduled for next month.'),
  ('MC-2026-00000004','doc-006','Dr. Meena Iyer','hosp-003','AIIMS Delhi','[{"medicineId":"med-007","name":"Levothyroxine 50mcg","dosage":"50mcg","frequency":"Once daily","duration":"60 days","instructions":"Take on empty stomach"},{"medicineId":"med-008","name":"Calcium + Vitamin D3","dosage":"500mg/400IU","frequency":"Twice daily","duration":"60 days","instructions":"Take after meals"}]'::jsonb,'2026-06-05','Pending',NULL),
  ('MC-2026-00000005','doc-001','Dr. Rajesh Gupta','hosp-003','AIIMS Delhi','[{"medicineId":"med-009","name":"Epoetin Alfa 4000IU","dosage":"4000IU","frequency":"Once weekly","duration":"30 days","instructions":"Administer subcutaneously"}]'::jsonb,'2026-06-15','Pending',NULL),
  ('MC-2026-00000006','doc-001','Dr. Rajesh Gupta','hosp-002','Fortis Hospital','[{"medicineId":"med-010","name":"Sumatriptan 50mg","dosage":"50mg","frequency":"As needed","duration":"10 tablets","instructions":"Take at onset of migraine"},{"medicineId":"med-011","name":"Sertraline 50mg","dosage":"50mg","frequency":"Once daily","duration":"90 days","instructions":"Take in morning"}]'::jsonb,'2026-06-01','Fulfilled',NULL),
  ('MC-2026-00000007','doc-005','Dr. Sunita Verma','hosp-001','Apollo Hospital','[{"medicineId":"med-012","name":"Cetirizine 10mg","dosage":"10mg","frequency":"Once daily","duration":"7 days","instructions":"Take for allergic reaction"}]'::jsonb,'2026-06-18','Fulfilled','Advised to carry epinephrine auto-injector.'),
  ('MC-2026-00000008','doc-002','Dr. Priya Menon','hosp-001','Apollo Hospital','[{"medicineId":"med-013","name":"Lisinopril 10mg","dosage":"10mg","frequency":"Once daily","duration":"30 days","instructions":"Monitor blood pressure regularly"},{"medicineId":"med-014","name":"Tamoxifen 20mg","dosage":"20mg","frequency":"Once daily","duration":"90 days","instructions":"Continue hormone therapy"}]'::jsonb,'2026-06-14','Fulfilled',NULL),
  ('MC-2026-00000009','doc-003','Dr. Arun Thomas','hosp-003','AIIMS Delhi','[{"medicineId":"med-015","name":"Levetiracetam 500mg","dosage":"500mg","frequency":"Twice daily","duration":"90 days","instructions":"Do not skip doses"}]'::jsonb,'2026-06-11','Fulfilled','EEG scheduled for follow-up.'),
  ('MC-2026-00000010','doc-001','Dr. Rajesh Gupta','hosp-002','Fortis Hospital','[{"medicineId":"med-016","name":"Levodopa/Carbidopa 100/25mg","dosage":"100/25mg","frequency":"Three times daily","duration":"30 days","instructions":"Take before meals"},{"medicineId":"med-017","name":"Insulin Glargine","dosage":"12 units","frequency":"Once daily","duration":"30 days","instructions":"Inject subcutaneously at same time daily"},{"medicineId":"med-018","name":"Latanoprost Eye Drops","dosage":"0.005%","frequency":"Once daily","duration":"30 days","instructions":"Apply one drop to each affected eye at night"}]'::jsonb,'2026-06-16','Pending','Caregiver education provided for medication administration.');

-- 4. vaccinations
DELETE FROM vaccinations;

INSERT INTO vaccinations (health_id, vaccine, date, dose, administered_by, hospital, next_due) VALUES
  ('MC-2026-00000001','BCG','1992-03-15','Single','Dr. Sharma','Safdarjung Hospital',NULL),
  ('MC-2026-00000001','Hepatitis B','1992-03-15','Dose 1','Dr. Sharma','Safdarjung Hospital','Completed'),
  ('MC-2026-00000001','COVID-19 (Covaxin)','2021-05-10','Dose 1','Dr. Gupta','Apollo Hospital',NULL),
  ('MC-2026-00000001','COVID-19 (Covaxin)','2021-06-15','Dose 2','Dr. Gupta','Apollo Hospital','Due: Booster'),
  ('MC-2026-00000001','Influenza 2025','2025-10-15','Annual','Dr. Rajesh Gupta','Apollo Hospital','Oct 2026'),
  ('MC-2026-00000002','BCG','1998-07-22','Single','Dr. Patel','Government Hospital, Vadodara',NULL),
  ('MC-2026-00000002','Hepatitis B','1998-07-22','Complete','Dr. Patel','Government Hospital, Vadodara','Completed'),
  ('MC-2026-00000002','MMR','1999-01-15','Dose 1','Dr. Patel','Government Hospital, Vadodara',NULL),
  ('MC-2026-00000002','COVID-19 (Covishield)','2021-04-20','Dose 1','Dr. Menon','Fortis Hospital',NULL),
  ('MC-2026-00000002','COVID-19 (Covishield)','2021-07-22','Dose 2','Dr. Menon','Fortis Hospital',NULL),
  ('MC-2026-00000002','HPV','2024-02-10','Dose 1','Dr. Verma','Apollo Hospital','Aug 2024'),
  ('MC-2026-00000003','BCG','1981-08-05','Single','Dr. Reddy','Osmania Hospital',NULL),
  ('MC-2026-00000003','Hepatitis B','2005-03-20','Complete','Dr. Reddy','NIMS Hospital',NULL),
  ('MC-2026-00000003','Influenza 2025','2025-11-10','Annual','Dr. Priya Menon','Fortis Hospital','Nov 2026'),
  ('MC-2026-00000004','BCG','1959-02-28','Single','Govt. Hospital','General Hospital, Chennai',NULL),
  ('MC-2026-00000004','Hepatitis B','2010-05-15','Complete','Dr. Krishnan','Apollo Hospital',NULL),
  ('MC-2026-00000004','Influenza 2025','2025-09-20','Annual','Dr. Meena Iyer','AIIMS Delhi','Sep 2026'),
  ('MC-2026-00000004','Pneumococcal','2024-03-10','Single','Dr. Meena Iyer','AIIMS Delhi',NULL),
  ('MC-2026-00000005','BCG','1974-06-12','Single','Dr. Singh','PGIMER',NULL),
  ('MC-2026-00000005','Hepatitis B','2015-08-20','Complete','Dr. Kumar','AIIMS Delhi',NULL),
  ('MC-2026-00000005','COVID-19 (Covaxin)','2021-04-01','Dose 1','Dr. Rajesh Gupta','AIIMS Delhi',NULL),
  ('MC-2026-00000005','COVID-19 (Covaxin)','2021-05-15','Dose 2','Dr. Rajesh Gupta','AIIMS Delhi',NULL),
  ('MC-2026-00000005','COVID-19 Booster','2022-12-10','Booster','Dr. Rajesh Gupta','AIIMS Delhi',NULL),
  ('MC-2026-00000007','BCG','2003-01-10','Single','Dr. Nair','Kerala Government Hospital',NULL),
  ('MC-2026-00000007','Hepatitis B','2003-01-10','Complete','Dr. Nair','Kerala Government Hospital','Completed'),
  ('MC-2026-00000007','MMR','2004-06-15','Complete','Dr. Nair','Kerala Government Hospital',NULL),
  ('MC-2026-00000007','COVID-19','2022-03-20','Dose 1','Dr. Thomas','Apollo Hospital',NULL),
  ('MC-2026-00000007','COVID-19','2022-04-25','Dose 2','Dr. Thomas','Apollo Hospital',NULL),
  ('MC-2026-00000007','Typhoid','2025-01-15','Single','Dr. Anil Sharma','Apollo Hospital','Jan 2027'),
  ('MC-2026-00000006','Hepatitis B','2020-02-10','Complete','Dr. Agarwal','Fortis Hospital','Completed'),
  ('MC-2026-00000006','COVID-19','2021-05-10','Dose 1','Dr. Agarwal','Fortis Hospital',NULL),
  ('MC-2026-00000006','COVID-19','2021-06-20','Dose 2','Dr. Agarwal','Fortis Hospital',NULL),
  ('MC-2026-00000008','Influenza 2025','2025-10-05','Annual','Dr. Khan','Apollo Hospital','Oct 2026'),
  ('MC-2026-00000008','Hepatitis B','2018-04-15','Complete','Dr. Khan','Apollo Hospital',NULL),
  ('MC-2026-00000009','COVID-19','2021-06-01','Dose 1','Dr. Mehta','AIIMS Delhi',NULL),
  ('MC-2026-00000009','COVID-19','2021-07-15','Dose 2','Dr. Mehta','AIIMS Delhi',NULL),
  ('MC-2026-00000010','Influenza 2025','2025-09-15','Annual','Dr. Deshmukh','Fortis Hospital','Sep 2026'),
  ('MC-2026-00000010','Pneumococcal','2023-03-20','Single','Dr. Deshmukh','Fortis Hospital',NULL);

-- 5. health_logs
DELETE FROM health_logs;

INSERT INTO health_logs (health_id, symptom, severity, duration, date, notes) VALUES
  ('MC-2026-00000001','Cold','Mild',3,'2025-01-10',NULL),
  ('MC-2026-00000001','Cough','Moderate',5,'2025-02-15',NULL),
  ('MC-2026-00000001','Fever','Moderate',2,'2025-03-22',NULL),
  ('MC-2026-00000001','Headache','Mild',1,'2025-05-08',NULL),
  ('MC-2026-00000001','Cold','Mild',4,'2025-06-18',NULL),
  ('MC-2026-00000001','Fatigue','Moderate',7,'2025-08-12',NULL),
  ('MC-2026-00000001','Seasonal Illness','Mild',5,'2025-10-20',NULL),
  ('MC-2026-00000001','Cold','Mild',3,'2026-01-05',NULL),
  ('MC-2026-00000001','Cough','Moderate',4,'2026-02-10',NULL),
  ('MC-2026-00000001','Headache','Mild',2,'2026-03-15',NULL),
  ('MC-2026-00000001','Fever','Moderate',3,'2026-04-22',NULL),
  ('MC-2026-00000001','Fatigue','Mild',4,'2026-05-08',NULL),
  ('MC-2026-00000001','Cold','Mild',5,'2026-06-02',NULL),
  ('MC-2026-00000002','Allergy','Moderate',2,'2025-03-12',NULL),
  ('MC-2026-00000002','Allergy','Moderate',3,'2025-04-08',NULL),
  ('MC-2026-00000002','Cold','Mild',2,'2025-05-20',NULL),
  ('MC-2026-00000002','Allergy','Severe',5,'2025-06-15',NULL),
  ('MC-2026-00000002','Cough','Mild',3,'2025-09-10',NULL),
  ('MC-2026-00000002','Allergy','Moderate',4,'2025-10-22',NULL),
  ('MC-2026-00000002','Cold','Mild',2,'2026-01-08',NULL),
  ('MC-2026-00000002','Allergy','Moderate',3,'2026-03-05',NULL),
  ('MC-2026-00000002','Allergy','Severe',4,'2026-04-12',NULL),
  ('MC-2026-00000002','Cough','Mild',2,'2026-05-18',NULL),
  ('MC-2026-00000002','Allergy','Moderate',3,'2026-06-10',NULL),
  ('MC-2026-00000003','Fatigue','Moderate',7,'2025-02-18',NULL),
  ('MC-2026-00000003','Weakness','Moderate',5,'2025-05-10',NULL),
  ('MC-2026-00000003','Headache','Mild',2,'2025-07-22',NULL),
  ('MC-2026-00000003','Fatigue','Severe',10,'2025-09-15',NULL),
  ('MC-2026-00000003','Weakness','Moderate',6,'2025-11-08',NULL),
  ('MC-2026-00000003','Headache','Moderate',3,'2026-01-20',NULL),
  ('MC-2026-00000003','Fatigue','Moderate',8,'2026-03-12',NULL),
  ('MC-2026-00000003','Weakness','Mild',4,'2026-05-05',NULL),
  ('MC-2026-00000003','Headache','Mild',2,'2026-06-15',NULL),
  ('MC-2026-00000007','Cold','Mild',2,'2025-02-10',NULL),
  ('MC-2026-00000007','Cough','Mild',3,'2025-06-08',NULL),
  ('MC-2026-00000007','Cold','Mild',2,'2025-12-15',NULL),
  ('MC-2026-00000007','Fever','Mild',1,'2026-02-20',NULL),
  ('MC-2026-00000007','Cold','Mild',2,'2026-05-12',NULL),
  ('MC-2026-00000006','Headache','Severe',4,'2025-01-15',NULL),
  ('MC-2026-00000006','Headache','Moderate',3,'2025-02-20',NULL),
  ('MC-2026-00000006','Headache','Severe',5,'2025-04-10',NULL),
  ('MC-2026-00000006','Fatigue','Moderate',6,'2025-05-22',NULL),
  ('MC-2026-00000006','Headache','Moderate',2,'2025-07-08',NULL),
  ('MC-2026-00000006','Headache','Severe',4,'2025-09-18',NULL),
  ('MC-2026-00000006','Fatigue','Mild',3,'2025-11-12',NULL),
  ('MC-2026-00000006','Headache','Moderate',2,'2026-01-05',NULL),
  ('MC-2026-00000006','Headache','Severe',3,'2026-03-20',NULL),
  ('MC-2026-00000006','Headache','Moderate',2,'2026-05-10',NULL),
  ('MC-2026-00000006','Fatigue','Mild',4,'2026-06-08',NULL),
  ('MC-2026-00000009','Headache','Moderate',2,'2025-03-10',NULL),
  ('MC-2026-00000009','Fatigue','Moderate',5,'2025-05-18',NULL),
  ('MC-2026-00000009','Weakness','Mild',3,'2025-08-22',NULL),
  ('MC-2026-00000009','Headache','Moderate',2,'2025-10-15',NULL),
  ('MC-2026-00000009','Fatigue','Mild',4,'2025-12-08',NULL),
  ('MC-2026-00000009','Headache','Mild',1,'2026-02-12',NULL),
  ('MC-2026-00000009','Weakness','Mild',2,'2026-04-05',NULL),
  ('MC-2026-00000009','Headache','Mild',2,'2026-05-28',NULL),
  ('MC-2026-00000005','Fatigue','Severe',10,'2025-01-20',NULL),
  ('MC-2026-00000005','Weakness','Moderate',8,'2025-04-12',NULL),
  ('MC-2026-00000005','Fatigue','Moderate',12,'2025-07-28',NULL),
  ('MC-2026-00000005','Weakness','Severe',10,'2025-10-05',NULL),
  ('MC-2026-00000005','Fatigue','Moderate',7,'2025-12-18',NULL),
  ('MC-2026-00000005','Weakness','Moderate',5,'2026-02-08',NULL),
  ('MC-2026-00000005','Fatigue','Moderate',8,'2026-04-22',NULL),
  ('MC-2026-00000005','Weakness','Mild',4,'2026-06-05',NULL);

-- 6. consent_requests
DELETE FROM consent_requests;

INSERT INTO consent_requests (health_id, requester_id, requester_name, requester_type, records_requested, status, request_date, expiry_date, reason) VALUES
  ('MC-2026-00000001','doc-002','Dr. Priya Menon','Doctor','["Lab Reports","Prescription History","Vital Signs"]'::jsonb,'Pending','2026-06-18',NULL,'Cardiology consultation referral from Dr. Rajesh Gupta'),
  ('MC-2026-00000002','hosp-001','Apollo Hospital - Allergy Department','Hospital','["Medical History","Allergy Records","Previous Treatments"]'::jsonb,'Approved','2026-06-10','2026-09-10','Ongoing allergy treatment and monitoring'),
  ('MC-2026-00000003','ins-001','ICICI Lombard Insurance','Insurance','["Hospitalization Records","Cardiac Test Results","Prescription History"]'::jsonb,'Pending','2026-06-19',NULL,'Pre-authorization for cardiac procedure'),
  ('MC-2026-00000004','doc-006','Dr. Meena Iyer','Doctor','["Thyroid Function Tests","Bone Density Reports"]'::jsonb,'Approved','2026-06-05','2026-12-05','Orthopedic consultation for osteoporosis management'),
  ('MC-2026-00000005','gov-001','National Dialysis Program','Government','["Kidney Function Reports","Dialysis Records","Insurance Status"]'::jsonb,'Approved','2026-05-20','2027-05-20','Government health program enrollment and subsidy verification'),
  ('MC-2026-00000006','doc-001','Dr. Rajesh Gupta','Doctor','["Migraine History","Medication Records"]'::jsonb,'Rejected','2026-05-25',NULL,'Initial consultation - patient opted to share verbally'),
  ('MC-2026-00000008','hosp-003','AIIMS Delhi - Oncology Department','Hospital','["Cancer Treatment History","Mammogram Reports","Biopsy Results"]'::jsonb,'Approved','2026-01-10','2026-07-10','Post-cancer treatment follow-up and monitoring'),
  ('MC-2026-00000009','doc-003','Dr. Arun Thomas','Doctor','["EEG Reports","Seizure History","Medication Records"]'::jsonb,'Approved','2026-06-11','2026-12-11','Epilepsy management and follow-up'),
  ('MC-2026-00000010','ins-002','Star Health Insurance','Insurance','["Hospitalization Records","Discharge Summaries","Treatment Costs"]'::jsonb,'Pending','2026-06-17',NULL,'Claim processing for recent admission'),
  ('MC-2026-00000007','hosp-001','Apollo Hospital - Emergency','Hospital','["Allergy Information","Emergency Contact","Blood Group"]'::jsonb,'Approved','2026-06-18','2026-06-18','Emergency allergic reaction treatment'),
  ('MC-2026-00000001','ins-001','ICICI Lombard Insurance','Insurance','["HbA1c Reports","Prescription History"]'::jsonb,'Approved','2026-06-01','2026-09-01','Diabetes management program enrollment verification'),
  ('MC-2026-00000003','doc-002','Dr. Priya Menon','Doctor','["Cardiac Stress Test","Lipid Profile","ECG Reports"]'::jsonb,'Approved','2026-05-01','2026-08-01','Cardiac consultation and monitoring'),
  ('MC-2026-00000002','doc-004','Dr. Sunita Verma','Doctor','["Allergy Test Results","Pulmonary Function Tests"]'::jsonb,'Approved','2026-05-10','2026-11-10','Allergy specialist consultation'),
  ('MC-2026-00000005','hosp-003','AIIMS Delhi - Nephrology','Hospital','["Kidney Function Tests","Dialysis History","Anemia Treatment"]'::jsonb,'Approved','2026-04-15','2026-10-15','Chronic kidney disease management'),
  ('MC-2026-00000004','gov-002','Senior Citizen Health Scheme','Government','["Age Verification","Medical Conditions","Insurance Status"]'::jsonb,'Pending','2026-06-20',NULL,'Senior citizen health benefit enrollment');

-- 7. blockchain_transactions
DELETE FROM blockchain_transactions;

INSERT INTO blockchain_transactions (block_number, hash, previous_hash, timestamp, transaction_type, actor, patient_health_id, details) VALUES
  (1,'0x0000000000000000000000000000000000000000000000000000000000000000','0x0000000000000000000000000000000000000000000000000000000000000000','2026-01-15T10:30:00Z','createRecord','Apollo Hospital','MC-2026-00000001','Initial patient health record created'),
  (2,'0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456','0x0000000000000000000000000000000000000000000000000000000000000000','2026-01-18T14:45:00Z','createRecord','Fortis Hospital','MC-2026-00000003','Initial patient health record created'),
  (3,'0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123457','0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456','2026-02-10T09:15:00Z','grantConsent','Dr. Rajesh Gupta','MC-2026-00000001','Patient granted consent for cardiologist consultation'),
  (4,'0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123458','0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123457','2026-02-22T11:00:00Z','updateRecord','Apollo Hospital','MC-2026-00000001','Lab results added: Complete Blood Count, HbA1c'),
  (5,'0xd4e5f6789012345678901234567890abcdef1234567890abcdef123459','0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123458','2026-03-05T16:30:00Z','createRecord','AIIMS Delhi','MC-2026-00000005','Initial patient health record created'),
  (6,'0xe5f6789012345678901234567890abcdef1234567890abcdef123450','0xd4e5f6789012345678901234567890abcdef1234567890abcdef123459','2026-03-15T08:45:00Z','grantConsent','Dr. Priya Menon','MC-2026-00000003','Patient granted consent for cardiac stress test'),
  (7,'0xf6789012345678901234567890abcdef1234567890abcdef123451','0xe5f6789012345678901234567890abcdef1234567890abcdef123450','2026-03-28T13:20:00Z','auditAccess','Insurance Provider A','MC-2026-00000001','Insurance verification for claim #CLM-2026-001'),
  (8,'0x0789012345678901234567890abcdef1234567890abcdef123452','0xf6789012345678901234567890abcdef1234567890abcdef123451','2026-04-02T10:00:00Z','createRecord','Apollo Hospital','MC-2026-00000002','Initial patient health record created'),
  (9,'0x189012345678901234567890abcdef1234567890abcdef123453','0x0789012345678901234567890abcdef1234567890abcdef123452','2026-04-18T15:45:00Z','revokeConsent','MC-2026-00000004','MC-2026-00000004','Patient revoked consent for previous provider Dr. XYZ'),
  (10,'0x29012345678901234567890abcdef1234567890abcdef123454','0x189012345678901234567890abcdef1234567890abcdef123453','2026-05-01T09:00:00Z','updateRecord','Fortis Hospital','MC-2026-00000003','Cardiac stress test results added'),
  (11,'0x3a12345678901234567890abcdef1234567890abcdef123455','0x29012345678901234567890abcdef1234567890abcdef123454','2026-05-10T12:30:00Z','grantConsent','Dr. Sunita Verma','MC-2026-00000002','Patient granted consent for allergy specialist consultation'),
  (12,'0x4b2345678901234567890abcdef1234567890abcdef123456','0x3a12345678901234567890abcdef1234567890abcdef123455','2026-05-18T14:00:00Z','emergencyAccess','Dr. Priya Menon - Emergency','MC-2026-00000003','Emergency access granted for cardiac event at Fortis Hospital'),
  (13,'0x5c345678901234567890abcdef1234567890abcdef123457','0x4b2345678901234567890abcdef1234567890abcdef123456','2026-05-22T10:15:00Z','updateRecord','Apollo Hospital','MC-2026-00000002','Pulmonary function test results added'),
  (14,'0x6d45678901234567890abcdef1234567890abcdef123458','0x5c345678901234567890abcdef1234567890abcdef123457','2026-05-28T16:45:00Z','auditAccess','Government Health Authority','MC-2026-00000008','Audit access for cancer registry verification'),
  (15,'0x7e5678901234567890abcdef1234567890abcdef123459','0x6d45678901234567890abcdef1234567890abcdef123458','2026-06-02T08:30:00Z','createRecord','AIIMS Delhi','MC-2026-00000009','Initial patient health record created'),
  (16,'0x8f678901234567890abcdef1234567890abcdef123450','0x7e5678901234567890abcdef1234567890abcdef123459','2026-06-05T11:20:00Z','grantConsent','Dr. Meena Iyer','MC-2026-00000004','Patient granted consent for thyroid specialist'),
  (17,'0x9a7901234567890abcdef1234567890abcdef123451','0x8f678901234567890abcdef1234567890abcdef123450','2026-06-08T09:45:00Z','updateRecord','Fortis Hospital','MC-2026-00000003','Lipid profile results added'),
  (18,'0x0b891234567890abcdef1234567890abcdef123452','0x9a7901234567890abcdef1234567890abcdef123451','2026-06-10T13:00:00Z','grantConsent','Dr. Rajesh Gupta','MC-2026-00000001','Patient granted consent for diabetes management program'),
  (19,'0x1c90234567890abcdef1234567890abcdef123453','0x0b891234567890abcdef1234567890abcdef123452','2026-06-12T10:30:00Z','updateRecord','Apollo Hospital','MC-2026-00000001','CBC and HbA1c results added'),
  (20,'0x2d0134567890abcdef1234567890abcdef123454','0x1c90234567890abcdef1234567890abcdef123453','2026-06-14T15:15:00Z','updateRecord','Apollo Hospital','MC-2026-00000008','Mammogram results - clear added'),
  (21,'0x3e124567890abcdef1234567890abcdef123455','0x2d0134567890abcdef1234567890abcdef123454','2026-06-15T09:00:00Z','auditAccess','Insurance Provider B','MC-2026-00000005','Pre-authorization verification'),
  (22,'0x4f23567890abcdef1234567890abcdef123456','0x3e124567890abcdef1234567890abcdef123455','2026-06-16T14:30:00Z','updateRecord','Fortis Hospital','MC-2026-00000010','Patient admission record created'),
  (23,'0x503467890abcdef1234567890abcdef123457','0x4f23567890abcdef1234567890abcdef123456','2026-06-17T11:45:00Z','grantConsent','Dr. Arun Thomas','MC-2026-00000009','Patient granted consent for EEG monitoring'),
  (24,'0x614578901abcdef1234567890abcdef123458','0x503467890abcdef1234567890abcdef123457','2026-06-18T08:20:00Z','updateRecord','AIIMS Delhi','MC-2026-00000005','Kidney function test results added'),
  (25,'0x7256890abdef1234567890abcdef123459','0x614578901abcdef1234567890abcdef123458','2026-06-19T10:00:00Z','revokeConsent','MC-2026-00000007','MC-2026-00000007','Patient revoked consent for previous provider'),
  (26,'0x836790abcdf1234567890abcdef123450','0x7256890abdef1234567890abcdef123459','2026-06-20T09:30:00Z','createRecord','Apollo Hospital','MC-2026-00000010','Fasting blood glucose test added');

-- 8. notifications
DELETE FROM notifications;

INSERT INTO notifications (health_id, type, title, message, read, created_at, link) VALUES
  ('MC-2026-00000001','Consent Request','New Consent Request','Dr. Priya Menon has requested access to your cardiac records for consultation.',false,'2026-06-18T10:30:00Z','/patient/consent'),
  ('MC-2026-00000001','Report Uploaded','Lab Report Available','Your HbA1c and CBC results are now available for viewing.',true,'2026-06-10T14:45:00Z','/patient/timeline'),
  ('MC-2026-00000002','Prescription Created','New Prescription','Dr. Sunita Verma has created a prescription for Montair 10mg and Asthalin Inhaler.',true,'2026-06-12T11:20:00Z','/patient/timeline'),
  ('MC-2026-00000003','Emergency Access','Emergency Access Triggered','Fortis Hospital activated emergency access to your records for cardiac event treatment.',false,'2026-05-18T16:00:00Z','/patient/consent'),
  ('MC-2026-00000005','Insurance Claim','Insurance Claim Update','Your claim CLM-2026-052 has been submitted for processing. Estimated processing time: 7 working days.',true,'2026-06-15T09:30:00Z','/patient'),
  ('MC-2026-00000004','Vaccination Reminder','Vaccination Due','Your annual Influenza vaccination is due. Schedule an appointment at your nearest healthcare center.',false,'2026-06-19T08:00:00Z','/patient/timeline'),
  ('MC-2026-00000001','Medication Reminder','Prescription Refill Reminder','Your Metformin prescription will expire in 5 days. Consider requesting a refill.',false,'2026-06-20T07:00:00Z','/patient/timeline'),
  ('MC-2026-00000007','Counterfeit Alert','Medicine Safety Alert','Potential counterfeit medicine detected: QuickRelief Pain. Please consult your pharmacist.',false,'2026-06-18T15:30:00Z','/patient/verify-medicine'),
  ('MC-2026-00000002','Health Pattern Insight','Health Pattern Alert','Your allergy episodes have increased in frequency. Consider consulting an allergy specialist.',false,'2026-06-17T09:15:00Z','/patient/health-tracker'),
  ('MC-2026-00000003','Report Uploaded','Cardiac Test Results','Your cardiac stress test results are available. Please review with your cardiologist.',true,'2026-05-25T10:00:00Z','/patient/timeline'),
  ('MC-2026-00000006','Medication Reminder','Medication Schedule','Time to take your Sertraline 50mg as prescribed.',true,'2026-06-19T21:00:00Z','/patient'),
  ('MC-2026-00000008','Report Uploaded','Mammogram Results','Your annual mammogram results are clear. No suspicious lesions detected.',true,'2026-06-14T15:00:00Z','/patient/timeline'),
  ('MC-2026-00000009','Consent Request','Consent Request Approved','Your consent request to Dr. Arun Thomas for epilepsy monitoring has been approved.',true,'2026-06-11T12:30:00Z','/patient/consent'),
  ('MC-2026-00000010','Insurance Claim','Claim Rejected','Your insurance claim CLM-2026-101 was rejected due to expired coverage. Contact your insurer.',false,'2026-06-17T14:20:00Z','/patient'),
  ('MC-2026-00000005','Emergency Access','Emergency Access Completed','Emergency access to your records has expired. Review the access log for details.',true,'2026-06-16T00:45:00Z','/patient/consent'),
  ('doc-001','Consent Request','Patient Record Access Granted','Rahul Sharma has granted access to medical records for diabetes management program.',true,'2026-06-10T10:15:00Z','/doctor'),
  ('hosp-001','Report Uploaded','New Patient Record Created','Health record created for patient MC-2026-00000010 at Fortis Hospital.',true,'2026-06-16T10:00:00Z','/hospital/blockchain'),
  ('MC-2026-00000001','Health Pattern Insight','Monthly Health Summary','Your health score this month is 78. Cold and cough episodes have reduced by 25%.',false,'2026-06-01T08:00:00Z','/patient/analytics'),
  ('MC-2026-00000003','Consent Request','Insurance Access Request','ICICI Lombard Insurance has requested access for pre-authorization of cardiac procedure.',false,'2026-06-19T11:45:00Z','/patient/consent'),
  ('MC-2026-00000010','Medication Reminder','Critical Medication Alert','Insulin Glargine stock is running low. Please arrange refills before depletion.',false,'2026-06-20T06:00:00Z','/patient');

-- 9. doctor_consents: no mock source; clear stale rows
DELETE FROM doctor_consents;
