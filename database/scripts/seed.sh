#!/bin/bash
set -e

source ../.env
SEEDS_DIR="../seeds"
STATE_FILE="../.seeds_state"

if [ ! -f "$STATE_FILE" ]; then
  echo "0" > $STATE_FILE
fi

CURRENT_VERSION=$(cat $STATE_FILE)
SEED_FILES=$(ls $SEEDS_DIR/*_seed_*.sql | sort)

for FILE in $SEED_FILES; do
  VERSION=$(basename $FILE | cut -d'_' -f1)
  if [ "$VERSION" -gt "$CURRENT_VERSION" ]; then
    echo "Applying seed $FILE ..."
    psql $DATABASE_URL -f $FILE
    echo $VERSION > $STATE_FILE
  fi
done

echo "All seeds applied successfully."
