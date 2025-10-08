-- ==============================================
-- Flyway migration: Create fare policies table
-- ==============================================


-- Create fare_policies table
CREATE TABLE IF NOT EXISTS fare_policies (
    id VARCHAR(36) PRIMARY KEY,
    route_id VARCHAR(36) NOT NULL,
    bus_type_id VARCHAR(36) NOT NULL,
    base_fare DECIMAL(8, 2) NOT NULL,
    per_km_rate DECIMAL(8, 2) NOT NULL,
    weekend_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
    time_of_day_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
    currency_code CHAR(3) NOT NULL,
    effective_from TIMESTAMP NOT NULL,
    effective_to TIMESTAMP,
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
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_fare_policies_updated_at'
    ) THEN
        CREATE TRIGGER update_fare_policies_updated_at
        BEFORE UPDATE ON fare_policies
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
