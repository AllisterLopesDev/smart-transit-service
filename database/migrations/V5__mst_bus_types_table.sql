-- ==============================================
-- Flyway migration: Create mst_bus_types table
-- ==============================================

-- Create ENUM type if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'mst_bus_types_status'
    ) THEN
        CREATE TYPE mst_bus_types_status AS ENUM ('active', 'inactive');
    END IF;
END
$$;

-- Create mst_bus_types table
CREATE TABLE IF NOT EXISTS mst_bus_types (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(255),
    has_ac BOOLEAN NOT NULL DEFAULT FALSE,
    has_sleeper_berths BOOLEAN NOT NULL DEFAULT FALSE,
    max_capacity INT NOT NULL,
    amenities TEXT[],
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
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_mst_bus_types_updated_at'
    ) THEN
        CREATE TRIGGER update_mst_bus_types_updated_at
        BEFORE UPDATE ON mst_bus_types
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
