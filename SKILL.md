---
name: userorbit
description: Manage Userorbit resources via the public API. Create and manage feedback, announcements, roadmap topics, help center articles, boards, tags, subscribers, and more. Use when asked to interact with Userorbit, create announcements, manage feedback, update roadmaps, or publish help center articles. Requires USERORBIT_API_KEY environment variable.
---

# Userorbit API

Manage Userorbit resources programmatically via a helper script that wraps the REST API.

## Bootstrap (run once per machine)

Before the first API call, check that both files below exist. If either is missing, create them.

**1. Credentials file `~/.userorbit-secrets`** — if missing, ask the user for their API key and team ID, then create:

```
export USERORBIT_API_KEY="<key>"
export USERORBIT_TEAM_ID="<team-id>"
```

**2. Helper script `~/.userorbit-secrets-api.sh`** — if missing, create it with these exact contents and `chmod +x`:

```bash
#!/bin/bash
source ~/.userorbit-secrets
ENDPOINT="$1"
if [ -n "$2" ]; then BODY="$2"; else BODY='{}'; fi
exec curl -s -X POST "https://api.userorbit.com/api/v1/${ENDPOINT}" \
  -H "Authorization: Bearer ${USERORBIT_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "x-team-id: ${USERORBIT_TEAM_ID}" \
  -d "${BODY}"
```

## API Convention

Every call uses the helper script. Pass the endpoint as arg 1, optional JSON body as arg 2:

```bash
~/.userorbit-secrets-api.sh <resource>.<action> '<json-body>' | jq '.'
```

Examples:
```bash
~/.userorbit-secrets-api.sh announcements.list | jq '.data'
~/.userorbit-secrets-api.sh announcements.list '{"limit": 5}' | jq '.data'
~/.userorbit-secrets-api.sh announcements.info '{"id": "some-uuid"}' | jq '.data'
~/.userorbit-secrets-api.sh feedbacks.create '{"title": "My feedback"}' | jq '.data'
```

All endpoints use **POST**. Responses return `{ "data": ... }` on success or `{ "error": "..." }` on failure. List endpoints include `{ "pagination": { "offset", "limit", "total" }, "data": [...] }`.

## Resources

### Feedback

User-submitted feedback with voting, status tracking, and board organization.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `feedbacks.create` | `title` |
| List | `feedbacks.list` | - |
| Get | `feedbacks.info` | `id` |
| Update | `feedbacks.update` | `id` |
| Delete | `feedbacks.delete` | `id` |
| Archive | `feedbacks.archive` | `id` |
| Restore | `feedbacks.restore` | `id` |
| Vote | `feedbacks.vote` | `id` |

Statuses: `in_review`, `planned`, `in_progress`, `completed`, `closed`

Sort modes for list: `newest`, `top` (by votes), `trending` (activity)

### Feedback Boards

Organize feedback into boards.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `feedback-boards.create` | `name` |
| List | `feedback-boards.list` | - |
| Get | `feedback-boards.info` | `id` |
| Update | `feedback-boards.update` | `id` |
| Delete | `feedback-boards.delete` | `id` |

### Feedback Comments

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `feedback-comments.create` | `id` (feedbackId), `text` |
| List | `feedback-comments.list` | - |
| Update | `feedback-comments.update` | `id`, `text` |
| Delete | `feedback-comments.delete` | `id` |

Comments support `type`: `"public"` or `"private"` (internal notes).

### Announcements

Product updates and changelogs. Require a `collectionId` (category).

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `announcements.create` | `collectionId`, `title`, `text`, `meta` |
| List | `announcements.list` | - |
| Get | `announcements.info` | `id` |
| Update | `announcements.update` | `id` |
| Delete | `announcements.delete` | `id` |
| Search | `announcements.search` | `query` |
| Archive | `announcements.archive` | `id` |
| Restore | `announcements.restore` | `id` |
| Pin | `announcements.pin` | `id` |
| Unpin | `announcements.unpin` | `id` |

The `meta` object supports: `ctaTitle`, `ctaLink`, `ctaImage`, `description`, `feedback`.

Set `publish: true` to publish immediately. Use `scheduledAt` (ISO date) to schedule.

### Announcement Comments

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `announcement-comments.create` | `id` (announcementId), `text` |
| List | `announcement-comments.list` | `id` (announcementId) |
| Update | `announcement-comments.update` | `id`, `text` |
| Delete | `announcement-comments.delete` | `id` |

### Roadmaps

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `roadmaps.create` | `name` |
| List | `roadmaps.list` | - |
| Get | `roadmaps.info` | `id` |
| Update | `roadmaps.update` | `id` |
| Delete | `roadmaps.delete` | `id` |
| Stages | `roadmaps.stages` | `id` |

### Stages

Columns within a roadmap (e.g., "Planned", "In Progress", "Done").

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `stages.create` | `title`, `roadmapId` |
| List | `stages.list` | `roadmapId` |
| Get | `stages.info` | `id` |
| Update | `stages.update` | `id` |
| Delete | `stages.delete` | `id` |

### Topics (Roadmap Items)

Items that live on a roadmap stage.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `topics.create` | `title` |
| List | `topics.list` | `roadmapId`, `stageId` |
| Get | `topics.info` | `id` |
| Update | `topics.update` | `id` |
| Delete | `topics.delete` | `id` |
| Count | `topics.count` | - |

### Topic Comments

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `topic-comments.create` | `id` (topicId), `text` |
| List | `topic-comments.list` | `id` (topicId) |
| Update | `topic-comments.update` | `id`, `text` |
| Delete | `topic-comments.delete` | `id` |

### Articles (Help Center)

Knowledge base articles with publishing workflow.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `articles.create` | `title`, `text`, `collectionIds` |
| List | `articles.list` | - |
| Get | `articles.info` | `id` |
| Update | `articles.update` | `id` |
| Delete | `articles.delete` | `id` |
| Search | `articles.search` | `query` |
| Publish | `articles.publish` | `id` |
| Unpublish | `articles.unpublish` | `id` |
| Archive | `articles.archive` | `id` |
| Revisions | `articles.revisions` | `id` |
| Restore | `articles.restore` | `id`, `revisionId` |

Article statuses: `draft`, `published`, `archived`

### Article Collections (Help Center Categories)

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `article-collections.create` | `name` |
| List | `article-collections.list` | - |
| Get | `article-collections.info` | `id` |
| Update | `article-collections.update` | `id` |
| Delete | `article-collections.delete` | `id` |

### Article Votes

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Get | `article-votes.info` | `id` (articleId) |
| Vote | `article-votes.create` | `id` (articleId), `value` (`helpful` or `not_helpful`) |
| Remove | `article-votes.delete` | `id` (articleId) |

### Collections (Announcement Categories)

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `collections.create` | `name` |
| List | `collections.list` | - |
| Get | `collections.info` | `id` |
| Update | `collections.update` | `id` |
| Delete | `collections.delete` | `id` |

### Tags

Labels for organizing feedback.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `tags.create` | `name` |
| List | `tags.list` | - |
| Get | `tags.info` | `id` |
| Update | `tags.update` | `id`, `name` |
| Delete | `tags.delete` | `id` |

### Subscribers

Public users who interact with your product.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `subscribers.create` | `email`, `name`, `password` |
| List | `subscribers.list` | - |
| Update | `subscribers.update` | `id` |
| Delete | `subscribers.delete` | `id` |
| Count | `subscribers.count` | - |
| Search | `subscribers.search` | - |

### Projects

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `projects.create` | `name` |
| List | `projects.list` | - |
| Get | `projects.info` | `id` |
| Update | `projects.update` | `id` |
| Delete | `projects.delete` | `id` |

### Feedback Board Tags

Associate tags with feedback boards.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `feedback-board-tags.create` | `boardId`, `tagId` |
| List | `feedback-board-tags.list` | `boardId` |
| Update | `feedback-board-tags.update` | `boardId`, `oldTagId`, `newTagId` |
| Delete | `feedback-board-tags.delete` | `boardId`, `tagId` |

## Common Workflows

### Create an announcement and publish it

```bash
# 1. List categories to find the right collectionId
~/.userorbit-secrets-api.sh collections.list | jq '.data[] | {id, name}'

# 2. Create and publish
~/.userorbit-secrets-api.sh announcements.create '{"collectionId": "<id>", "title": "Dark Mode", "text": "We shipped dark mode...", "meta": {"description": "Dark mode is here"}, "publish": true}' | jq '.data'
```

### Add a topic to a roadmap

```bash
# 1. List roadmaps
~/.userorbit-secrets-api.sh roadmaps.list | jq '.data[] | {id, name}'

# 2. Get stages
~/.userorbit-secrets-api.sh roadmaps.stages '{"id": "<roadmap-id>"}' | jq '.data[] | {id, title}'

# 3. Create topic
~/.userorbit-secrets-api.sh topics.create '{"title": "API v2", "roadmapId": "<id>", "stageId": "<id>", "publish": true}' | jq '.data'
```

### Publish a help center article

```bash
# 1. List collections
~/.userorbit-secrets-api.sh article-collections.list | jq '.data[] | {id, name}'

# 2. Create article
~/.userorbit-secrets-api.sh articles.create '{"title": "Getting Started", "text": "# Getting Started\n\nWelcome to...", "collectionIds": ["<id>"]}' | jq '.data.id'

# 3. Publish
~/.userorbit-secrets-api.sh articles.publish '{"id": "<article-id>"}' | jq '.data'
```

## Detailed API Reference

For full request/response schemas with all optional fields, see `references/api.md`.
