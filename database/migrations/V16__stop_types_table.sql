-- ==============================================
-- Flyway migration: Create stop_types table
-- ==============================================

-- Create stop_types table
CREATE TABLE IF NOT EXISTS stop_types (
    stop_id UUID,
    stop_type_id UUID,
    PRIMARY KEY (stop_id, stop_type_id),
    FOREIGN KEY (stop_id) REFERENCES stops(id),
    FOREIGN KEY (stop_type_id) REFERENCES mst_stop_types(id)
);