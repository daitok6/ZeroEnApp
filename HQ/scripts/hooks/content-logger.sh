#!/bin/bash
# PostToolUse — Write|Edit
# Appends build events to the content log for build-in-public posts.

INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null)
FILE=$(echo "$INPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null)

# Skip if no file path
[ -z "$FILE" ] && exit 0

# Skip noise: the log itself, settings, hidden dirs, node_modules
echo "$FILE" | grep -qE "(content-log\.md|/\.claude/|settings\.json|settings\.local\.json|node_modules/|/\.git/|\.DS_Store)" && exit 0

# Determine action
ACTION="edited"
[ "$TOOL" = "Write" ] && ACTION="created"

# Append to content log
LOG="/Users/Daito/repos/ZeroEn/HQ/marketing/content-log.md"
DATE=$(date '+%Y-%m-%d %H:%M')
RELATIVE="${FILE#/Users/Daito/repos/ZeroEn/}"
echo "- [$DATE] $ACTION: \`$RELATIVE\`" >> "$LOG"

exit 0
