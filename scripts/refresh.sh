#!/bin/bash
#
# Admin script for on-demand plugin data refresh
# This script fetches the latest plugin data from XrmToolBox OData feed
# and optionally commits the changes.
#
# Usage:
#   ./scripts/refresh.sh           # Refresh only
#   ./scripts/refresh.sh --commit  # Refresh and commit changes
#

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PLUGINS_FILE="$PROJECT_ROOT/src/data/plugins.json"

echo "🔄 XrmToolBox Plugin Catalog - Data Refresh"
echo "==========================================="
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Run the refresh script
npm run refresh-plugins

# Check if there are changes
if git diff --quiet "$PLUGINS_FILE"; then
  echo ""
  echo "ℹ️  No changes detected - plugin data is up to date"
  exit 0
fi

echo ""
echo "✨ Changes detected in plugin data"

# Show diff stats
ADDED=$(git diff --numstat "$PLUGINS_FILE" | awk '{print $1}')
REMOVED=$(git diff --numstat "$PLUGINS_FILE" | awk '{print $2}')
echo "   Lines: +$ADDED / -$REMOVED"

# If --commit flag is provided, commit the changes
if [ "$1" = "--commit" ]; then
  echo ""
  echo "📝 Committing changes..."

  PLUGIN_COUNT=$(node -p "JSON.parse(require('fs').readFileSync('$PLUGINS_FILE', 'utf8')).value.length")
  COMMIT_MSG="chore: refresh plugin data (${PLUGIN_COUNT} plugins) - manual update"

  git add "$PLUGINS_FILE"
  git commit -m "$COMMIT_MSG"

  echo "✅ Changes committed!"
  echo ""
  echo "To push to remote, run:"
  echo "  git push"
else
  echo ""
  echo "To commit these changes, run:"
  echo "  ./scripts/refresh.sh --commit"
  echo ""
  echo "Or manually:"
  echo "  git add src/data/plugins.json"
  echo "  git commit -m 'chore: refresh plugin data'"
fi

echo ""
echo "Done! 🎉"
