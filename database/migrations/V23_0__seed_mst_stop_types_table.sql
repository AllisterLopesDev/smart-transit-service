-- ==============================================
-- Flyway Migration: Seed mst_stop_types table
-- Description: Insert initial data into mst_stop_types table
-- ==============================================

INSERT INTO mst_stop_types (id, type_name, created_by, created_at)
VALUES
    ('43937ce5-c0d6-447f-9e5e-6016ebd2b0c7', 'Depot', 'System', NOW()),
    ('43937ce5-c0d6-447f-9e5e-6016ebd2b0c8', 'Stop', 'System', NOW()),
    ('43937ce5-c0d6-447f-9e5e-6016ebd2b0c9', 'Terminal', 'System', NOW());