-- ==============================================
-- Flyway migration: Create stops table
-- ==============================================


-- Create stops table
CREATE TABLE IF NOT EXISTS stops (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    stop_type VARCHAR(36) NOT NULL REFERENCES mst_stop_types(id), -- Using foreign key to mst_stop_types table for stop type reference 
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    address VARCHAR(255),
    facilities TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by CHAR(36),
    deleted_at TIMESTAMP
); 


-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_stops_updated_at'
    ) THEN
        CREATE TRIGGER update_stops_updated_at
        BEFORE UPDATE ON stops
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
