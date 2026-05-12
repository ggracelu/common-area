#!/bin/bash
# CI-style verification script for Trustworthy Server MVP Foundation
# This script runs all verification checks before deployment

set -e

echo "🔍 Running CI-style verification for Trustworthy Server MVP Foundation"
echo "======================================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
FAILED=0

# Function to run a check and report results
run_check() {
  local name="$1"
  local command="$2"

  echo ""
  echo "📋 Running: $name"
  echo "----------------------------------------"

  if eval "$command"; then
    echo -e "${GREEN}✓ $name passed${NC}"
  else
    echo -e "${RED}✗ $name failed${NC}"
    FAILED=1
  fi
}

# 1. Typecheck
run_check "Typecheck" "npm run typecheck"

# 2. Lint
run_check "Lint" "npm run lint"

# 3. Build
run_check "Build" "npm run build"

# 4. Local tests
run_check "Local E2E tests" "npm run test"

# 5. Grader tests (if credentials are configured)
if [ -n "$GRADER_CLERK_EMAIL" ] && [ -n "$GRADER_CLERK_PASSWORD" ]; then
  run_check "Grader E2E tests" "npm run test:grader"
else
  echo ""
  echo -e "${YELLOW}⚠ Skipping grader tests (GRADER_CLERK_EMAIL and GRADER_CLERK_PASSWORD not set)${NC}"
fi

# 6. Preview tests (if preview URL is configured)
if [ -n "$PLAYWRIGHT_BASE_URL" ]; then
  run_check "Preview smoke tests" "npm run test:preview"
else
  echo ""
  echo -e "${YELLOW}⚠ Skipping preview tests (PLAYWRIGHT_BASE_URL not set)${NC}"
fi

# Final status
echo ""
echo "======================================================================"
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All verification checks passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some verification checks failed${NC}"
  exit 1
fi
