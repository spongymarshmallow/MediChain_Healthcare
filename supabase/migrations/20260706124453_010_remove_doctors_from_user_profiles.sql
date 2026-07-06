-- Remove doctor entries from user_profiles (doctors are stored in registered_doctors only)
DELETE FROM user_profiles WHERE name LIKE 'Dr.%';
