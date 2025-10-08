-- ==============================================
-- Flyway migration: Create drivers table
-- ==============================================

-- Create ENUM type for driver_status if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'driver_status'
    ) THEN
        CREATE TYPE driver_status AS ENUM ('active', 'inactive', 'suspended');
    END IF;
END
$$;


-- Create ENUM type for license_category if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'license_category_status'
    ) THEN
        CREATE TYPE license_category_status AS ENUM ('LMV', 'HMV', 'PSV');
    END IF;
END
$$;

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id VARCHAR(36),
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_category license_category_status NOT NULL,
    license_expiry_date DATE,
    years_of_experience INT,
    shift_start_time TIME,
    shift_end_time TIME,
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
    status driver_status NOT NULL DEFAULT 'active',
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);


-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_drivers_updated_at'
    ) THEN
        CREATE TRIGGER update_drivers_updated_at
        BEFORE UPDATE ON drivers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
