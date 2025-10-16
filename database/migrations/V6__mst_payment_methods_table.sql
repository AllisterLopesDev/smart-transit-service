-- ==============================================
-- Flyway migration: Create mst_payment_methods table
-- ==============================================



-- Create mst_payment_methods table
CREATE TABLE IF NOT EXISTS mst_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    provider VARCHAR(100),
    supports_refunds BOOLEAN NOT NULL DEFAULT FALSE,
    transaction_fee_percent DECIMAL(5, 2) DEFAULT 0.0,
    is_online BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by CHAR(36),
    deleted_at TIMESTAMP,
    UNIQUE (code)
);


-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_mst_payment_methods_updated_at'
    ) THEN
        CREATE TRIGGER update_mst_payment_methods_updated_at
        BEFORE UPDATE ON mst_payment_methods
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
