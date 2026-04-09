#!/bin/bash
# PreToolUse — Bash
# Reminds to use clientId if running ZeroEn commands without one

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('tool_input', {}).get('command', ''))" 2>/dev/null)

# Check if running a ZeroEn command without a clientId
if echo "$COMMAND" | grep -qE "/(new-client|report|deploy|status)\s*$"; then
  echo "WARNING: ZeroEn command requires a clientId." >&2
  echo "Usage: /new-client <clientId>, /report <clientId>, /deploy <clientId>" >&2
  CLIENTS=$(python3 /Users/Daito/repos/ZeroEn/HQ/scripts/list-clients.py 2>/dev/null || echo 'none yet')
  echo "Available clients: $CLIENTS" >&2
  # exit 0 — warn only, don't block
fi

printf "%s" "$INPUT"
exit 0
