#!/bin/bash
set -e

source ../.env
MIGRATIONS_DIR="../migrations"
STATE_FILE="../.migrations_state"

if [ ! -f "$STATE_FILE" ]; then
  echo "0" > $STATE_FILE
fi

CURRENT_VERSION=$(cat $STATE_FILE)
UP_MIGRATIONS=$(ls $MIGRATIONS_DIR/*_up.sql | sort)

for FILE in $UP_MIGRATIONS; do
  VERSION=$(basename $FILE | cut -d'_' -f1)
  if [ "$VERSION" -gt "$CURRENT_VERSION" ]; then
    echo "Applying migration $FILE ..."
    psql $DATABASE_URL -f $FILE
    echo $VERSION > $STATE_FILE
  fi
done

echo "All migrations applied successfully."
