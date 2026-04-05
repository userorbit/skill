#!/bin/bash
export $(grep -v '^#' ~/.userorbit-secrets | xargs)
ENDPOINT="$1"
if [ -n "$2" ]; then BODY="$2"; else BODY='{}'; fi
exec curl -s -X POST "https://api.userorbit.com/api/v1/${ENDPOINT}" \
  -H "Authorization: Bearer ${USERORBIT_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "x-team-id: ${USERORBIT_TEAM_ID}" \
  -d "${BODY}"
