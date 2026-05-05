#!/bin/bash

# Gamification Migration Runner
# This script helps apply the gamification database schema and seed data

set -e

echo "🎮 Common Area Gamification Migration Runner"
echo "============================================"
echo ""

# Check if SUPABASE_SECRET_KEY is set
if [ -z "$SUPABASE_SECRET_KEY" ]; then
  echo "❌ Error: SUPABASE_SECRET_KEY environment variable is not set"
  echo ""
  echo "Please set it by running:"
  echo "  export SUPABASE_SECRET_KEY=your_secret_key"
  echo ""
  echo "Or add it to your .env.local file:"
  echo "  SUPABASE_SECRET_KEY=your_secret_key"
  echo ""
  exit 1
fi

# Check if SUPABASE_URL is set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL environment variable is not set"
  echo ""
  echo "Please add it to your .env.local file:"
  echo "  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
  echo ""
  exit 1
fi

echo "✅ Environment variables found"
echo ""

# Function to run SQL file
run_sql() {
  local file=$1
  local description=$2

  echo "📝 Running: $description"
  echo "   File: $file"

  if [ ! -f "$file" ]; then
    echo "❌ Error: File not found: $file"
    exit 1
  fi

  # Run the SQL using psql or curl
  if command -v psql &> /dev/null; then
    # Use psql if available
    psql "$NEXT_PUBLIC_SUPABASE_URL" -c "\i $file"
  else
    # Fallback to curl (requires Supabase REST API)
    echo "⚠️  psql not found. Please install PostgreSQL client or use Supabase Dashboard"
    echo ""
    echo "Alternative: Run the SQL manually in Supabase Dashboard:"
    echo "  1. Go to https://app.supabase.com"
    echo "  2. Select your project"
    echo "  3. Go to SQL Editor"
    echo "  4. Copy and paste the contents of: $file"
    echo "  5. Click 'Run'"
    echo ""
    exit 1
  fi

  echo "✅ Completed: $description"
  echo ""
}

# Ask user what to do
echo "What would you like to do?"
echo "  1) Apply gamification schema migration"
echo "  2) Seed gamification data"
echo "  3) Both (schema + seed)"
echo "  4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    run_sql "supabase/migrations/202605040001_gamification_foundation.sql" "Gamification Schema Migration"
    echo "✨ Schema migration completed!"
    ;;
  2)
    run_sql "supabase/seed_gamification.sql" "Gamification Data Seeding"
    echo "✨ Data seeding completed!"
    ;;
  3)
    run_sql "supabase/migrations/202605040001_gamification_foundation.sql" "Gamification Schema Migration"
    run_sql "supabase/seed_gamification.sql" "Gamification Data Seeding"
    echo "✨ Both schema and data completed!"
    ;;
  4)
    echo "👋 Exiting..."
    exit 0
    ;;
  *)
    echo "❌ Invalid choice. Please run again and select 1-4."
    exit 1
    ;;
esac

echo ""
echo "🎉 Migration completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Verify the tables in Supabase Dashboard"
echo "  2. Test the /bingo page"
echo "  3. Connect authentication to use real user data"
echo ""
