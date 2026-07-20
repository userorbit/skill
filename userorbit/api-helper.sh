#!/bin/bash
# ABOUTME: Userorbit API helper — makes authenticated POST requests using env vars
# ABOUTME: Requires USERORBIT_API_KEY and USERORBIT_TEAM_ID to be set in environment
ENDPOINT="$1"
if [ -n "$2" ]; then BODY="$2"; else BODY='{}'; fi
BASE_URL="${USERORBIT_API_BASE_URL:-https://api.userorbit.com/api/v1}"
BASE_URL="${BASE_URL%/}"
exec curl -s -X POST "${BASE_URL}/${ENDPOINT}" \
  -H "Authorization: Bearer ${USERORBIT_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "x-team-id: ${USERORBIT_TEAM_ID}" \
  -d "${BODY}"
