-- ==============================================
-- Flyway migration: Create role_permissions table
-- ==============================================


-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID,
    permission_id UUID,
    is_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by CHAR(36) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
