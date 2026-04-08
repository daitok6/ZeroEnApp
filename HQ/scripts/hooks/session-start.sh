#!/bin/bash
# SessionStart hook
# Detects if we're working in a client project and surfaces their context

INPUT=$(cat)
CWD=$(pwd)
ZEROEN_ROOT="$HOME/repos/ZeroEn"
CLIENTS_DIR="$ZEROEN_ROOT/Clients"

# Check if we're inside a client project
if [[ "$CWD" == "$CLIENTS_DIR"* ]]; then
  # Extract clientId from path
  RELATIVE="${CWD#$CLIENTS_DIR/}"
  CLIENT_ID=$(echo "$RELATIVE" | cut -d'/' -f1)

  if [ -n "$CLIENT_ID" ]; then
    PROFILE="$ZEROEN_ROOT/HQ/crm/clients/$CLIENT_ID/profile.md"

    echo ""
    echo "=== ZeroEn Client Context ==="
    echo "Client: $CLIENT_ID"

    if [ -f "$PROFILE" ]; then
      # Show key fields from profile
      echo ""
      grep -E "^\*\*(Phase|App name|Domain|Platform fee|Last report)\*\*" "$PROFILE" | head -8
    fi

    echo "=============================="
    echo ""
  fi
fi

# Pass through the original input unchanged
printf "%s" "$INPUT"
exit 0
