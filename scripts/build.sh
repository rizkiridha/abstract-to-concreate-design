#!/bin/bash
# Builds dist/ for each platform target from source/
cd "$(dirname "$0")/.." || exit 1

set -e

PLATFORMS=("claude-code" "opencode")
SOURCE_DIR="source"
DIST_DIR="dist"

echo "Validating source..."
bash scripts/validate.sh

for platform in "${PLATFORMS[@]}"; do
  echo "Building for $platform..."
  TARGET="$DIST_DIR/$platform"

  # Clean and recreate target
  rm -rf "$TARGET"
  mkdir -p "$TARGET/skills"
  mkdir -p "$TARGET/docs"

  # Copy skills
  cp -r "$SOURCE_DIR/skills/"* "$TARGET/skills/"

  # Copy docs
  cp -r "$SOURCE_DIR/docs/"* "$TARGET/docs/"

  # Copy plugin config
  cp ".claude-plugin/plugin.json" "$TARGET/"
  cp ".claude-plugin/marketplace.json" "$TARGET/"

  echo "Built $platform -> $TARGET"
done

echo "Build complete."
