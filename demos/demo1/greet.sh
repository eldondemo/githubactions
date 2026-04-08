#!/bin/bash
# greet.sh — A simple script used in Demo 1 to show 'run:' steps
# For actions workshop
# Usage: ./scripts/greet.sh [name]

NAME="${1:-World}"
echo "Hello, ${NAME}! 👋"
echo "This script was run at: $(date -u)"
echo "Running on: $(uname -s) $(uname -m)"
