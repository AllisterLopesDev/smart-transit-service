-- ==============================================
-- Flyway migration: Create route_stops table
-- ==============================================

-- Create route_stops table
CREATE TABLE IF NOT EXISTS route_stops (
    route_id VARCHAR(36) ,
    stop_id VARCHAR(36),
    sequence_no INT NOT NULL,
    distance_from_start_km DECIMAL(5, 2),
    scheduled_arrival_time TIME,
    scheduled_departure_time TIME,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by CHAR(36),
    deleted_at TIMESTAMP,
    PRIMARY KEY (route_id, stop_id),
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (stop_id) REFERENCES stops(id)
);

-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_route_stops_updated_at'
    ) THEN
        CREATE TRIGGER updated_at_route_stops_updated_at
        BEFORE UPDATE ON route_stops
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;