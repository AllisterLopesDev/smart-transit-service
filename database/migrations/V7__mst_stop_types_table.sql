-- ==============================================
-- Flyway migration: Create mst_stop_types table
-- ==============================================

-- Create ENUM type if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'mst_stop_types_status'
    ) THEN
        CREATE TYPE mst_stop_types_status AS ENUM ('active', 'inactive');
    END IF;
END
$$;

-- Create mst_stop_types table
CREATE TABLE IF NOT EXISTS mst_stop_types (
    id VARCHAR(36) PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
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
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_mst_stop_types_updated_at'
    ) THEN
        CREATE TRIGGER update_mst_stop_types_updated_at
        BEFORE UPDATE ON mst_stop_types
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
