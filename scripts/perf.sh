#!/bin/bash
set -e

REPORT="./perf-reports/$(date +%Y-%m-%d_%H-%M-%S)"
PORT=9999

pnpm build
mkdir -p perf-reports

npx -y serve dist -l $PORT &
SERVER_PID=$!
sleep 2

npx -y lighthouse http://localhost:$PORT --preset=desktop --output=html --output-path="$REPORT.html"
open -a "Google Chrome" "$REPORT.html"

kill $SERVER_PID 2>/dev/null || true
