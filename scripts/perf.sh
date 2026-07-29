#!/bin/bash
set -e

# Page to test, defaults to the home page. Ex: pnpm perf /bookshelf/
PATH_ARG="${1:-/}"
[[ "$PATH_ARG" == /* ]] || PATH_ARG="/$PATH_ARG"

# Turn the path into something usable in a filename. "/" -> "home"
SLUG=$(echo "$PATH_ARG" | sed 's|^/||; s|/$||; s|/|-|g')
SLUG="${SLUG:-home}"

REPORT="./perf-reports/${SLUG}_$(date +%Y-%m-%d_%H-%M-%S)"
PORT=9999

pnpm build
mkdir -p perf-reports

npx -y serve dist -l $PORT &
SERVER_PID=$!
sleep 2

npx -y lighthouse "http://localhost:$PORT$PATH_ARG" --preset=desktop --output=html --output-path="$REPORT.html"
open -a "Google Chrome" "$REPORT.html"

kill $SERVER_PID 2>/dev/null || true
