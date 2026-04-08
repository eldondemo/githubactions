#!/bin/sh

# Docker actions receive inputs as INPUT_<NAME> environment variables (uppercased)
NAME="${INPUT_NAME}"
STYLE="${INPUT_STYLE}"

if [ "$STYLE" = "formal" ]; then
  GREETING="Good day, ${NAME}. Welcome to the GitHub Actions workshop."
else
  GREETING="Hey ${NAME}! 👋 Greetings from inside a Docker container!"
fi

# Set output for the caller workflow
echo "greeting=${GREETING}" >> "$GITHUB_OUTPUT"

# Print to logs
echo "🐳 Running inside: $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)"
echo "📦 Container greeting: ${GREETING}"
