-- ==============================================
-- Flyway migration: Create trips table
-- ==============================================

-- Create ENUM type trips_status if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'trips_status'
    ) THEN
        CREATE TYPE trips_status AS ENUM ('scheduled', 'in_progress', 'completed', 'canceled');
    END IF;
END
$$;

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id UUID NOT NULL,
    route_id UUID NOT NULL,
    driver_id UUID NOT NULL,
    conductor_id UUID,
    scheduled_departure_time TIMESTAMP NOT NULL,
    scheduled_arrival_time TIMESTAMP NOT NULL,
    actual_departure_time TIMESTAMP,
    actual_arrival_time TIMESTAMP,
    status trips_status NOT NULL DEFAULT 'scheduled',
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by CHAR(36),
    deleted_at TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (driver_id) REFERENCES users(id),
    FOREIGN KEY (conductor_id) REFERENCES users(id)
);

-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_trips_updated_at'
    ) THEN
        CREATE TRIGGER updated_at_trips_updated_at
        BEFORE UPDATE ON trips
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;