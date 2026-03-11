#!/bin/bash
# Validates all SKILL.md files have required sections

ERRORS=0
REQUIRED_SECTIONS=("description" "usage" "output")

while IFS= read -r file; do
  for section in "${REQUIRED_SECTIONS[@]}"; do
    if ! grep -qi "$section" "$file"; then
      echo "ERROR: $file missing required section: $section"
      ERRORS=$((ERRORS + 1))
    fi
  done
  echo "OK: $file"
done < <(find source/skills -name "SKILL.md")

if [ $ERRORS -gt 0 ]; then
  echo "Validation failed with $ERRORS error(s)"
  exit 1
fi

echo "All SKILL.md files valid."
