# 📚 Database Setup Guide

This folder contains everything needed to manage the **PostgreSQL database schema** and **seed data** for the **Smart Transport System**.  
We use raw SQL migrations and shell scripts (no external migration tools) to keep setup **lightweight and transparent**.

---

## 📂 Directory Structure

db/
├── migrations/ # Schema changes (versioned, raw SQL)
├── seeds/ # Data population scripts (reference + sample data)
├── scripts/ # Shell scripts to manage migrations & seeds
├── .migrations_state # Tracks last applied migration
├── .seeds_state # Tracks last applied seed
├── .env.example # Example DB connection config
└── README.md # This file

yaml
Copy code

---

## ⚙️ Configuration

1. Copy `.env.example` → `.env`
2. Update the database connection string:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/smart_transport
⚠️ Do not commit .env with real credentials. Always use .env.example as a template.

🔨 Migrations
Migrations are used to evolve the database schema (tables, columns, constraints).
Each migration has both an up (apply) and down (rollback) script:

001_init_schema_up.sql → Apply schema changes

001_init_schema_down.sql → Rollback schema changes

Run migrations
bash
Copy code
cd db/scripts
./migrate.sh
Rollback last migration
bash
Copy code
cd db/scripts
./rollback.sh
The state of applied migrations is tracked in .migrations_state.

🌱 Seeds
Seeds populate the DB with initial data (reference data, sample users, vehicles, etc.).
All seed scripts are idempotent (can be re-run safely).

Example:

001_seed_users.sql → Inserts baseline users

002_seed_vehicles.sql → Inserts vehicles

Run seeds
bash
Copy code
cd db/scripts
./seed.sh
The state of applied seeds is tracked in .seeds_state.

🚀 Combined Setup
Run both migrations and seeds in one go:

bash
Copy code
cd db/scripts
./setup.sh
This will:

Apply all pending migrations

Apply all pending seeds

🔄 Resetting the Database (Optional)
If you want to start fresh (useful for development):

Drop and recreate the database manually

Run:

bash
Copy code
./migrate.sh
./seed.sh
👉 A reset.sh script may be added later to automate this.

✅ Best Practices
Keep schema and seeds separate (migrations/ vs seeds/)

Version everything with incremental numbers (001, 002, …)

Never hardcode secrets in migrations or seeds

Use idempotent inserts in seeds (ON CONFLICT DO NOTHING)

Always test migrations locally before merging to main branch
```
