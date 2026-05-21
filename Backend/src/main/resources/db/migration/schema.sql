-- Purpose: MySQL schema for filemagic.io — users, subscriptions, files, usage, payments.
-- Relationships: users → subscription_plans; files → users; file_history → users & files;
--                payments → users & plans; usage_daily tracks guest fingerprint or user id.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS payment_events;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS usage_daily;
DROP TABLE IF EXISTS file_history;
DROP TABLE IF EXISTS stored_files;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subscription_plans;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- subscription_plans: tier definitions (limits enforced in application layer)
-- ---------------------------------------------------------------------------
CREATE TABLE subscription_plans (
    id              TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(32) NOT NULL UNIQUE COMMENT 'FREE, INDIVIDUAL, BUSINESS, etc.',
    display_name    VARCHAR(64) NOT NULL,
    max_file_bytes  BIGINT UNSIGNED NOT NULL,
    max_batch_files INT UNSIGNED NOT NULL DEFAULT 1,
    ops_per_day     INT UNSIGNED NOT NULL,
    history_days    INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0 = no server-side history',
    ads_enabled     TINYINT(1) NOT NULL DEFAULT 1,
    price_usd       DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subscription_plans_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO subscription_plans (code, display_name, max_file_bytes, max_batch_files, ops_per_day, history_days, ads_enabled, price_usd) VALUES
('GUEST',       'Guest',            52428800,    1,    10,   0, 1, 0.00),
('FREE',        'Free',             104857600,   1,    25,   0, 1, 0.00),
('INDIVIDUAL',  'Individual',       5368709120,  25,   3000, 7, 0, 9.99),
('BUSINESS',    'Business',         53687091200, 500, 50000, 15, 0, 49.99);

-- ---------------------------------------------------------------------------
-- users: registered accounts (guests are not stored here)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email                VARCHAR(255) NOT NULL UNIQUE,
    password_hash        VARCHAR(255) NOT NULL,
    display_name         VARCHAR(120) NULL,
    subscription_plan_id TINYINT UNSIGNED NOT NULL DEFAULT 2,
    plan_expires_at      DATETIME NULL COMMENT 'NULL = no expiry for FREE',
    stripe_customer_id   VARCHAR(128) NULL,
    is_active            TINYINT(1) NOT NULL DEFAULT 1,
    created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_plan FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans (id),
    INDEX idx_users_email (email),
    INDEX idx_users_plan (subscription_plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- stored_files: metadata for uploads / processed outputs (paths on disk or S3 key)
-- ---------------------------------------------------------------------------
CREATE TABLE stored_files (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NULL COMMENT 'NULL for anonymous guest processing',
    original_name   VARCHAR(512) NOT NULL,
    content_type    VARCHAR(128) NULL,
    byte_size       BIGINT UNSIGNED NOT NULL,
    storage_path    VARCHAR(1024) NOT NULL COMMENT 'Relative path or object key',
    checksum_sha256 CHAR(64) NOT NULL,
    operation_type  VARCHAR(32) NOT NULL COMMENT 'COMPRESS, DECOMPRESS, CONVERT',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      DATETIME NULL COMMENT 'For premium history retention',
    CONSTRAINT fk_stored_files_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_stored_files_user_created (user_id, created_at),
    INDEX idx_stored_files_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- file_history: premium re-download index (points to stored_files rows)
-- ---------------------------------------------------------------------------
CREATE TABLE file_history (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    stored_file_id  BIGINT UNSIGNED NOT NULL,
    label           VARCHAR(255) NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_file_history_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_file_history_file FOREIGN KEY (stored_file_id) REFERENCES stored_files (id) ON DELETE CASCADE,
    INDEX idx_file_history_user_created (user_id, created_at),
    INDEX idx_file_history_file (stored_file_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- usage_daily: rate limits per calendar day (UTC). subject_key = 'u:{userId}' or 'g:{sha256}'
-- ---------------------------------------------------------------------------
CREATE TABLE usage_daily (
    id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usage_date         DATE NOT NULL,
    subject_key        VARCHAR(128) NOT NULL COMMENT 'u:123 or g:sha256(guest_token)',
    operation_count    INT UNSIGNED NOT NULL DEFAULT 0,
    updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_usage_subject_day (usage_date, subject_key),
    INDEX idx_usage_date (usage_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- payments: Stripe and future gateways
-- ---------------------------------------------------------------------------
CREATE TABLE payments (
    id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id            BIGINT UNSIGNED NOT NULL,
    subscription_plan_id TINYINT UNSIGNED NOT NULL,
    gateway            VARCHAR(32) NOT NULL DEFAULT 'STRIPE',
    gateway_order_id   VARCHAR(128) NOT NULL COMMENT 'Stripe Session ID or Intent ID',
    gateway_payment_id VARCHAR(128) NULL,
    amount_paise       BIGINT UNSIGNED NOT NULL,
    currency           VARCHAR(8) NOT NULL DEFAULT 'USD',
    status             VARCHAR(32) NOT NULL COMMENT 'CREATED, PAID, FAILED',
    raw_payload_json   JSON NULL,
    created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_plan FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans (id),
    INDEX idx_payments_user (user_id),
    INDEX idx_payments_gateway_order (gateway, gateway_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payment_events (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    payment_id   BIGINT UNSIGNED NOT NULL,
    event_type   VARCHAR(64) NOT NULL,
    payload_json JSON NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_events_payment FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE CASCADE,
    INDEX idx_payment_events_payment (payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- refresh_tokens: httpOnly cookie session backing store (optional rotation)
-- ---------------------------------------------------------------------------
CREATE TABLE refresh_tokens (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED NOT NULL,
    token_hash   CHAR(64) NOT NULL COMMENT 'SHA-256 of opaque token',
    expires_at   DATETIME NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at   DATETIME NULL,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY uk_refresh_token_hash (token_hash),
    INDEX idx_refresh_tokens_user (user_id),
    INDEX idx_refresh_tokens_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
