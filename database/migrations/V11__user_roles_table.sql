-- ==============================================
-- Flyway migration: Create passengers table
-- ==============================================


-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID,
    role_id UUID,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
