#!/bin/bash
# Run evaluation test with proper environment

cd /Users/manavsehgal/Developer/marketer/.claude/skills/webapp-testing

# Activate virtual environment
source venv/bin/activate

# Install Chromium if needed
playwright install chromium

# Run the test with the server
python3 scripts/with_server.py \
  --server "cd /Users/manavsehgal/Developer/marketer && npm run dev" \
  --port 3000 \
  --timeout 60 \
  -- python3 evaluation_test.py
