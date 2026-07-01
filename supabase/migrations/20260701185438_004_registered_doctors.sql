CREATE TABLE IF NOT EXISTS registered_doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  license TEXT NOT NULL,
  hospital TEXT NOT NULL,
  experience INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE registered_doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_registered_doctors" ON registered_doctors FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO registered_doctors (id, name, specialty, license, hospital, experience) VALUES
  ('doc-001', 'Dr. Rajesh Gupta',  'General Physician', 'MCI-2005-DL-01234', 'Apollo Hospital', 18),
  ('doc-002', 'Dr. Priya Menon',   'Cardiologist',      'MCI-2010-KL-05678', 'Fortis Hospital', 13),
  ('doc-003', 'Dr. Arun Thomas',   'Pulmonologist',     'MCI-2008-KL-03456', 'AIIMS Delhi',     15),
  ('doc-004', 'Dr. Sunita Verma',  'Allergist',         'MCI-2012-MH-07890', 'Apollo Hospital', 11),
  ('doc-005', 'Dr. Anil Sharma',   'Pediatrician',      'MCI-2007-RJ-04567', 'Fortis Hospital', 16),
  ('doc-006', 'Dr. Meena Iyer',    'Orthopaedic',       'MCI-2011-TN-06789', 'AIIMS Delhi',     12)
ON CONFLICT (id) DO NOTHING;
