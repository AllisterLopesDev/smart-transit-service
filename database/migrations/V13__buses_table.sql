-- ==============================================
-- Flyway migration: Create buses table
-- ==============================================

-- create enum type for buses_fuel_type if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'buses_fuel_type'
    ) THEN
        CREATE TYPE buses_fuel_type AS ENUM ('diesel', 'electric', 'hybrid', 'cng');
    END IF;
END
$$;

-- create enum type for buses_status if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'buses_status'
    ) THEN
        CREATE TYPE buses_status AS ENUM ('active', 'inactive', 'under_maintenance');
    END IF;
END
$$;

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
    id VARCHAR(36) PRIMARY KEY ,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    make VARCHAR(50),
    model VARCHAR(50),
    year_of_manufacture DATE,
    capacity INT,
    type_id VARCHAR(36) REFERENCES mst_bus_types(id),
    fuel_type buses_fuel_type NOT NULL,
    status buses_status NOT NULL DEFAULT 'active',
    approved_by CHAR(36),
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by CHAR(36),
    deleted_at TIMESTAMP,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    is_insured BOOLEAN NOT NULL DEFAULT FALSE,
    depot VARCHAR(100),
    comments TEXT
);


-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_buses_updated_at'
    ) THEN
        CREATE TRIGGER update_buses_updated_at
        BEFORE UPDATE ON buses
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
