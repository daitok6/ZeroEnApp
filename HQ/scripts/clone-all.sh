#!/bin/bash
# Clone all ZeroEn client repos into the Clients/ directory
# Run this when setting up on a new machine

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CLIENTS_DIR="$PROJECT_ROOT/Clients"
CLIENTS_JSON="$PROJECT_ROOT/HQ/crm/clients.json"

if [ ! -f "$CLIENTS_JSON" ]; then
  echo "Error: clients.json not found at $CLIENTS_JSON"
  exit 1
fi

mkdir -p "$CLIENTS_DIR"

echo "Cloning all ZeroEn client repos..."
echo ""

# Parse clients.json and clone each repo
# Requires jq to be installed
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed. Install with: brew install jq"
  exit 1
fi

REPOS=$(jq -r '.clients[] | select(.repo != "") | "\(.clientId) \(.repo)"' "$CLIENTS_JSON")

if [ -z "$REPOS" ]; then
  echo "No client repos found in clients.json"
  exit 0
fi

while IFS=' ' read -r clientId repo; do
  CLIENT_DIR="$CLIENTS_DIR/$clientId"
  if [ -d "$CLIENT_DIR" ]; then
    echo "  ✓ $clientId — already exists, skipping"
  else
    echo "  ⟳ $clientId — cloning $repo"
    git clone "$repo" "$CLIENT_DIR"
    echo "  ✓ $clientId — cloned"
  fi
done <<< "$REPOS"

echo ""
echo "Done. All client repos are in $CLIENTS_DIR/"
