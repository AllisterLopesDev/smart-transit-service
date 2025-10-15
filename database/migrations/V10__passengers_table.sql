-- ==============================================
-- Flyway migration: Create passengers table
-- ==============================================

-- Create ENUM type for driver_status if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'passenger_travel_frequency_status'
    ) THEN
        CREATE TYPE passenger_travel_frequency_status AS ENUM ('daily', 'weekly', 'monthly', 'occasionally');
    END IF;
END
$$;


-- Create passengers table
CREATE TABLE IF NOT EXISTS passengers (
    id UUID PRIMARY KEY,
    loyalty_points INT DEFAULT 0,
    preferred_payment_method UUID,
    preferred_bus_type UUID,
    travel_frequency passenger_travel_frequency_status NOT NULL DEFAULT 'occasionally',
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    special_needs TEXT,
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (preferred_payment_method) REFERENCES mst_payment_methods(id),
    FOREIGN KEY (preferred_bus_type) REFERENCES mst_bus_types(id)
);


-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_passengers_updated_at'
    ) THEN
        CREATE TRIGGER update_passengers_updated_at
        BEFORE UPDATE ON passengers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
