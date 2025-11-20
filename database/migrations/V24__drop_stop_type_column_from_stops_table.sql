-- ==============================================
-- Flyway Migration: Seed mst_stop_types table
-- Description: Insert initial data into mst_stop_types table
-- ==============================================

ALTER TABLE stops
DROP CONSTRAINT stops_stop_type_fkey,
DROP COLUMN stop_type;