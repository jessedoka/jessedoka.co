#!/bin/bash
# Wrapper script to run R2 analysis with environment variables

# Load environment variables from .env.local if it exists
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Set NODE_ENV if not already set
export NODE_ENV=${NODE_ENV:-development}

# Run the analysis script
node scripts/analyze-r2.mjs

