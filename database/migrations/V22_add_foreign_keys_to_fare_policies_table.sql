-- ==============================================
-- Flyway Migration: Add Foreign Keys to fare_policies
-- ==============================================


-- Add Foreign Key Constraints
ALTER TABLE fare_policies
ADD CONSTRAINT fk_fare_policies_route
FOREIGN KEY (route_id) REFERENCES routes(id),
ADD CONSTRAINT fk_fare_policies_bus_type
FOREIGN KEY (bus_type_id) REFERENCES mst_bus_types(id);