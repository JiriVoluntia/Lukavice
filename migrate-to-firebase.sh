#!/bin/bash

FIREBASE_DB="https://lukavice-288a6-default-rtdb.europe-west1.firebasedatabase.app"

echo "Zahájení migrace dat do Firebase..."

# 1. Migrace zastupitelů
echo "Migrace zastupitelů..."
curl -X PUT "$FIREBASE_DB/councillors.json" \
  -H "Content-Type: application/json" \
  -d @<(jq -s 'map({(.id): .}) | add' data/zastupitele/*.json)

# 2. Migrace stran
echo "Migrace stran..."
curl -X PUT "$FIREBASE_DB/parties.json" \
  -H "Content-Type: application/json" \
  -d @<(jq -s 'map({(.id): .}) | add' data/strany/*.json)

# 3. Migrace návrhů
echo "Migrace návrhů..."
curl -X PUT "$FIREBASE_DB/proposals.json" \
  -H "Content-Type: application/json" \
  -d @<(jq -s 'map({(.id): .}) | add' data/navrhy/*.json)

# 4. Migrace obecních informací
echo "Migrace obecních informací..."
curl -X PUT "$FIREBASE_DB/settings/info.json" \
  -H "Content-Type: application/json" \
  -d "$(jq '.info' data/obecne-info.json)"

curl -X PUT "$FIREBASE_DB/settings/functions.json" \
  -H "Content-Type: application/json" \
  -d "$(jq '.funkce' data/obecne-info.json)"

echo "✓ Migrace dokončena!"
