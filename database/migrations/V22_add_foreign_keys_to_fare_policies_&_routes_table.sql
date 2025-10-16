-- ==============================================
-- Flyway Migration: Add Foreign Keys to fare_policies
-- ==============================================


-- Add Foreign Key Constraints
ALTER TABLE fare_policies
ADD CONSTRAINT fk_fare_policies_route
FOREIGN KEY (route_id) REFERENCES routes(id),
ADD CONSTRAINT fk_fare_policies_bus_type
FOREIGN KEY (bus_type_id) REFERENCES mst_bus_types(id);


-- Add Foreign Key Constraints
ALTER TABLE routes
ADD CONSTRAINT fk_routes_origin_destination
FOREIGN KEY (origin) REFERENCES stops(id),
ADD CONSTRAINT fk_routes_destination_stop
FOREIGN KEY (destination) REFERENCES stops(id);



