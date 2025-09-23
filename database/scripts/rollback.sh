#!/bin/bash
set -e

source ../.env
MIGRATIONS_DIR="../migrations"
STATE_FILE="../.migrations_state"

if [ ! -f "$STATE_FILE" ]; then
  echo "No migrations applied."
  exit 1
fi

CURRENT_VERSION=$(cat $STATE_FILE)
DOWN_FILE=$(printf "%03d" $CURRENT_VERSION)_*_down.sql
FILE="$MIGRATIONS_DIR/$DOWN_FILE"

if [ -f "$FILE" ]; then
  echo "Rolling back migration $FILE ..."
  psql $DATABASE_URL -f $FILE
  PREV_VERSION=$((CURRENT_VERSION - 1))
  echo $PREV_VERSION > $STATE_FILE
else
  echo "No rollback script for version $CURRENT_VERSION"
fi
