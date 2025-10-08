-- ==============================================
-- Flyway migration: Create role_permissions table
-- ==============================================


-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID,
    permission_id VARCHAR(36),
    is_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by CHAR(36) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);


-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_role_permissions_updated_at'
    ) THEN
        CREATE TRIGGER update_role_permissions_updated_at
        BEFORE UPDATE ON role_permissions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
