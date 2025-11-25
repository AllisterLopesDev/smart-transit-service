-- ==============================================
-- Flyway Migration: Remove NOT NULL constraint from users.created_by
-- Description: Allow null values in the created_by column of users table
-- ==============================================s

ALTER TABLE users
ALTER COLUMN created_by DROP NOT NULL;