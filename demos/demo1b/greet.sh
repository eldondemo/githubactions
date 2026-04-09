#!/bin/bash
# greet.sh — A simple script used in Demo 1b
# Usage: ./greet.sh [name]

NAME="${1:-World}"
echo "Hello, ${NAME}! 👋"
echo "This script was run at: $(date -u)"
echo "Running on: $(uname -s) $(uname -m)"
