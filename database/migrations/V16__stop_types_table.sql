-- ==============================================
-- Flyway migration: Create stop_types table
-- ==============================================

-- Create stop_types table
CREATE TABLE IF NOT EXISTS stop_types (
    stop_id VARCHAR(36),
    stop_type_id VARCHAR(36),
    PRIMARY KEY (stop_id, stop_type_id),
    FOREIGN KEY (stop_id) REFERENCES stops(id),
    FOREIGN KEY (stop_type_id) REFERENCES mst_stop_types(id)
);

-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_stop_types_updated_at'
    ) THEN
        CREATE TRIGGER update_stop_types_updated_at
        BEFORE UPDATE ON stop_types
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;