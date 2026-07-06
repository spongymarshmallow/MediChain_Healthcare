-- Add password field to registered_doctors with default value
ALTER TABLE registered_doctors ADD COLUMN password TEXT NOT NULL DEFAULT 'doctor123';
