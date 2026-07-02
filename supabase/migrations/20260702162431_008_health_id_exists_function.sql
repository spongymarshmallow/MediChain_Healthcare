-- Function to check if a health_id exists in user_profiles (unauthenticated access)
CREATE OR REPLACE FUNCTION health_id_exists(p_health_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM user_profiles WHERE health_id = p_health_id);
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION health_id_exists(TEXT) TO anon, authenticated;
