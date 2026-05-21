-- Purpose: Reference seed data (also embedded in schema.sql). Re-run only on empty DB.
-- Use: mysql ... < database/schema.sql  OR  flyway/liquibase migrations.

SET NAMES utf8mb4;

INSERT INTO subscription_plans (code, display_name, max_file_bytes, max_batch_files, ops_per_day, history_days, ads_enabled) VALUES
('GUEST',       'Guest',            52428800,    1,    10,   0, 1),
('FREE',        'Free',             104857600,   1,    25,   0, 1),
('INDIVIDUAL',  'Individual',       5368709120,  25,   3000, 7, 0),
('BUSINESS',    'Business',         53687091200, 500, 50000, 15, 0)
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name);
