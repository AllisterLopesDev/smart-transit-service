-- ==============================================
-- Flyway migration: Create bus_locations table
-- ==============================================

-- Create bus_locations table
CREATE TABLE IF NOT EXISTS bus_locations (
    id VARCHAR(36) PRIMARY KEY,
    bus_id VARCHAR(36) NOT NULL,
    trip_id VARCHAR(36) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    speed_kmph DECIMAL(5,2),
    heading smallint,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by CHAR(36),
    deleted_at TIMESTAMP,
    FOREIGN KEY (id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE    
);


-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_bus_locations_updated_at'
    ) THEN
        CREATE TRIGGER updated_at_bus_locations_updated_at
        BEFORE UPDATE ON bus_locations
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;