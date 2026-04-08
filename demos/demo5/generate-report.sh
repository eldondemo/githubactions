#!/bin/bash
# generate-report.sh — Generates a sample test report for artifact upload
# Usage: ./generate-report.sh [pass|fail]

MODE="${1:-pass}"
REPORT_DIR="test-reports"
mkdir -p "$REPORT_DIR"

cat > "$REPORT_DIR/test-results.txt" <<EOF
========================================
  Test Report — $(date -u)
  Runner: ${RUNNER_OS:-unknown} / ${RUNNER_ARCH:-unknown}
  Mode: ${MODE}
========================================

  Test 1: Connectivity check ........ PASS
  Test 2: File system access ........ PASS
  Test 3: Environment variables ..... PASS
  Test 4: Critical validation ....... $([ "$MODE" = "fail" ] && echo "FAIL" || echo "PASS")

========================================
  Result: $([ "$MODE" = "fail" ] && echo "FAILED (1 of 4)" || echo "ALL PASSED (4 of 4)")
========================================
EOF

cat > "$REPORT_DIR/environment.txt" <<EOF
OS:       $(uname -s 2>/dev/null || echo "N/A")
Arch:     $(uname -m 2>/dev/null || echo "N/A")
Hostname: $(hostname 2>/dev/null || echo "N/A")
User:     $(whoami 2>/dev/null || echo "N/A")
Shell:    $SHELL
PWD:      $PWD
Date:     $(date -u)
EOF

echo "📄 Reports generated in ${REPORT_DIR}/"

# Exit with failure if mode is fail
if [ "$MODE" = "fail" ]; then
  exit 1
fi
