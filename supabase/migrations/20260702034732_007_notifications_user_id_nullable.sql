-- Make user_id optional in notifications so callers only need health_id.
-- health_id is now the single access-control key (via get_my_health_id() RLS).
ALTER TABLE notifications ALTER COLUMN user_id DROP NOT NULL;
