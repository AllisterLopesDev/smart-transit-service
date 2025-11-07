-- ==============================================
-- Flyway migration: Create drivers table
-- ==============================================

-- Create ENUM type for driver_status if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'driver_status'
    ) THEN
        CREATE TYPE driver_status AS ENUM ('active', 'inactive', 'suspended', 'on_leave', 'retired', 'terminated', 'training', 'probation', 'pending', 'other');
    END IF;
END
$$;


-- Create ENUM type for license_category if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'license_category_status'
    ) THEN
        CREATE TYPE license_category_status AS ENUM ('LMV', 'HMV', 'PSV', 'LMV-TR', 'HMV-TR', 'Commercial');
    END IF;
END
$$;

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY,
    license_number VARCHAR(50) NOT NULL,
    license_category license_category_status NOT NULL DEFAULT 'LMV',
    license_expiry_date DATE,
    years_of_experience INT,
    shift_start_time TIME,
    shift_end_time TIME,
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
    status driver_status NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (license_number)
);

