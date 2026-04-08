#!/bin/bash
# PreToolUse — Bash
# Blocks destructive commands that could cause data loss

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('tool_input', {}).get('command', ''))" 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Patterns to block
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \$HOME"
  "DROP TABLE"
  "DROP DATABASE"
  "DELETE FROM.*WHERE.*1=1"
  "git reset --hard HEAD"
  "git clean -fd"
  "git push --force"
  "git push -f"
  "chmod -R 777"
  "truncate.*--yes"
)

for PATTERN in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$PATTERN"; then
    echo "BLOCKED: Destructive command detected: '$PATTERN'" >&2
    echo "Command: $COMMAND" >&2
    echo "If you're sure, run this manually in the terminal." >&2
    exit 2  # exit code 2 = block the tool call
  fi
done

exit 0
