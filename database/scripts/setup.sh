#!/bin/bash
set -e

echo "Running migrations..."
./migrate.sh

echo "Seeding data..."
./seed.sh
