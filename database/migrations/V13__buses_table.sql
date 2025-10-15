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
        CREATE TYPE buses_status AS ENUM ('active', 'inactive', 'under_maintenance', ' pending_approval', 'decommissioned', 'scrapped', 'sold', 'leased', 'reserved', 'in_service', 'out_of_service', 'other');
    END IF;
END
$$;

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
    id UUID PRIMARY KEY ,
    registration_number VARCHAR(20) NOT NULL,
    make VARCHAR(36),
    model VARCHAR(36),
    year_of_manufacture DATE,
    capacity INT,
    type_id UUID REFERENCES mst_bus_types(id),
    fuel_type buses_fuel_type NOT NULL DEFAULT 'diesel',
    status buses_status NOT NULL,
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
    comments TEXT,
    UNIQUE (registration_number)
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
