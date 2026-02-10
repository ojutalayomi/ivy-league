#!/usr/bin/env bash
set -euo pipefail

echo "Checking for unallowed files in commits..."

git fetch origin main || true

# Get the list of changed files compared to main branch
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  CHANGED_FILES=$(git diff --name-only origin/main...HEAD 2>/dev/null || echo "")
else
  # If main doesn't exist remotely, check files in the last commit
  CHANGED_FILES=$(git diff --name-only HEAD~1..HEAD 2>/dev/null || git ls-tree -r --name-only HEAD || echo "")
fi

if [ -z "$CHANGED_FILES" ]; then
  # If no diff available, check all tracked files
  CHANGED_FILES=$(git ls-files)
fi

WHITELIST=(
  ".env.example"
)

# Patterns for unallowed files (use anchors where appropriate)
UNALLOWED_PATTERNS=(
  '^\.env($|\.)'                 # .env or .env.*
  '\.pem$'
  '\.key$'
  '\.p12$'
  '\.pfx$'
  '(^|/)(id_rsa|id_dsa)$'
  '\.crt$'
  '\.cer$'
  '\.der$'
  'dump\.rdb$'
  '\.log$'
  '^dist/'
  '^dist-ssr/'
)

VIOLATIONS=""

# helper: check if a file is whitelisted
is_whitelisted() {
  local f="$1"
  for w in "${WHITELIST[@]}"; do
    if [ "$f" = "$w" ]; then
      return 0
    fi
  done
  return 1
}

# Check each changed file against unallowed patterns
while IFS= read -r file; do
  if [ -z "$file" ]; then
    continue
  fi

  # Skip .git directories
  if echo "$file" | grep -qE "(^|/)\.git(/|$)"; then
    continue
  fi

  # Fail immediately if node_modules is in the change set
  if echo "$file" | grep -qE "(^|/)node_modules(/|$)"; then
    VIOLATIONS="${VIOLATIONS}  - $file (contains disallowed node_modules directory)\n"
    continue
  fi

  # Skip whitelisted filenames
  if is_whitelisted "$file"; then
    continue
  fi

  for pattern in "${UNALLOWED_PATTERNS[@]}"; do
    if echo "$file" | grep -qE "$pattern"; then
      VIOLATIONS="${VIOLATIONS}  - $file\n"
      break
    fi
  done

  # Check file size if file exists (10MB limit)
  if [ -f "$file" ]; then
    FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
    if [ "$FILE_SIZE" -gt 10485760 ]; then
      SIZE_MB=$((FILE_SIZE / 1048576))
      VIOLATIONS="${VIOLATIONS}  - $file (size: ${SIZE_MB}MB, exceeds 10MB limit)\n"
    fi
  fi
done <<< "$CHANGED_FILES"

if [ -n "$VIOLATIONS" ]; then
  echo "❌ ERROR: Unallowed files detected in commit!"
  echo ""
  echo "The following files violate the merge policy:"
  printf '%b' "$VIOLATIONS"
  echo ""
  echo "Please remove these files before merging."
  exit 1
fi

echo "✅ No unallowed files detected. Proceeding with merge..."