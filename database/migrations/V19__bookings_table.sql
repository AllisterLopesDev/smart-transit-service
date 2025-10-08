-- ==============================================
-- Flyway migration: Create bookings table
-- ==============================================

-- Create ENUM type for booking_channel_status if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'booking_channel_status'
    ) THEN
        CREATE TYPE booking_channel_status AS ENUM ('online', 'counter', 'mobile_app');
    END IF;
END
$$;

-- create ENUM type for payment_status if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'payment_status'
    ) THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
    END IF;
END
$$;

-- Create ENUM type for booking_status if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'booking_status'
    ) THEN
        CREATE TYPE booking_status AS ENUM ('active', 'canceled', 'completed');
    END IF;
END
$$;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY,
    pnr_number VARCHAR(20) UNIQUE NOT NULL,
    passenger_id VARCHAR(36) NOT NULL,
    trip_id VARCHAR(36) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    booking_channel booking_channel_status NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    status booking_status NOT NULL DEFAULT 'active',
    booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason VARCHAR(255),
    refunded_amount DECIMAL(10, 2),
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by CHAR(36),
    deleted_at TIMESTAMP,
    FOREIGN KEY (id) REFERENCES routes(id),
    FOREIGN KEY (passenger_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);


-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at'
    ) THEN
        CREATE TRIGGER updated_at_bookings_updated_at
        BEFORE UPDATE ON bookings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;