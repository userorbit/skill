---
name: userorbit
description: Manage Userorbit resources via the public API. Create and manage feedback, roadmap views, announcements, help center articles, product tours, interactive demos, checklists, surveys, support inbox threads, workflows, subscribers, analytics, and more.
metadata:
  clawdbot:
    requires:
      env:
        - USERORBIT_API_KEY
        - USERORBIT_TEAM_ID
---

# Userorbit API

Manage Userorbit resources programmatically via the REST API.

## Setup

Before the first API call, verify that `USERORBIT_API_KEY` and `USERORBIT_TEAM_ID` environment variables are set. If they are missing, ask the user to provide them (available in Settings → API or from the Userorbit onboarding page).

## Making API calls

- Base URL: `https://api.userorbit.com/api/v1` (override with `USERORBIT_API_BASE_URL` for local testing)
- All endpoints use **POST**
- Endpoint format: `<resource>.<action>` (e.g., `announcements.list`, `feedbacks.create`)
- Success response: `{ "data": ... }`
- List response: `{ "pagination": { "offset", "limit", "total" }, "data": [...] }`
- Error response: `{ "error": "..." }`

API keys are scoped: read-only keys can call list/info/count/search-style actions; read/write keys can call every action documented here. Endpoints outside this document are not available to API keys.

Usage:
```bash
curl -s -X POST "https://api.userorbit.com/api/v1/<endpoint>" \
  -H "Authorization: Bearer $(printenv USERORBIT_API_KEY)" \
  -H "Content-Type: application/json" \
  -H "x-team-id: $(printenv USERORBIT_TEAM_ID)" \
  -d '<json body>'
```

Example:
```bash
curl -s -X POST "https://api.userorbit.com/api/v1/announcements.list" \
  -H "Authorization: Bearer $(printenv USERORBIT_API_KEY)" \
  -H "Content-Type: application/json" \
  -H "x-team-id: $(printenv USERORBIT_TEAM_ID)" \
  -d '{"limit": 5}' | jq '.data'
```

The same surface is also available as a hosted MCP server at `https://api.userorbit.com/mcp` (OAuth). This skill uses the REST API directly.

## Resources

### Feedback

User-submitted feedback with voting, status tracking, and board organization.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `feedbacks.create` | `title` |
| List | `feedbacks.list` | - |
| Get | `feedbacks.info` | `id` |
| Update | `feedbacks.update` | `id` |
| Merge | `feedbacks.merge` | `id`, `targetId` |
| Delete | `feedbacks.delete` | `id` |
| Archive | `feedbacks.archive` | `id` |
| Restore | `feedbacks.restore` | `id` |
| Vote | `feedbacks.vote` | `id` |
| Count | `feedbacks.count` | - |

Statuses: `in_review`, `planned`, `in_progress`, `completed`, `closed`, `rejected`

List filters: `search`, `status`, `boardId`, `sortBy` (`newest`, `top`, `trending`), `from`/`to` (ISO dates), `assignedToMe`

`feedbacks.merge` (admin only) merges a feedback item into another (`targetId`): votes, comments, subscribers, and tags move to the target and the source is archived. `feedbacks.count` returns per-status counts.

Feedback `text` is rendered directly in public feedback and roadmap views. Match existing feedback formatting: use plain prose or the same stored HTML style already present on existing records. Do not use Markdown headings, lists, or other Markdown-only syntax unless the target view is known to render it.

### Feedback Boards

Organize feedback into boards.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `feedback-boards.create` | `name` |
| List | `feedback-boards.list` | - |
| Get | `feedback-boards.info` | `id` |
| Update | `feedback-boards.update` | `id` |
| Delete | `feedback-boards.delete` | `id` |

### Feedback Board Tags

Associate tags with feedback boards.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `feedback-board-tags.create` | `boardId`, `tagId` |
| List | `feedback-board-tags.list` | `boardId` |
| Update | `feedback-board-tags.update` | `boardId`, `oldTagId`, `newTagId` |
| Delete | `feedback-board-tags.delete` | `boardId`, `tagId` |

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

The `meta` object supports: `ctaTitle`, `ctaLink`, `ctaImage`, `description`, `feedback`. It may be empty.

Set `publish: true` to publish immediately. Use `scheduledAt` (ISO date) to schedule.

### Announcement Comments

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `document-comments.create` | `id` (announcementId), `text` |
| List | `document-comments.list` | `id` (announcementId) |
| Update | `document-comments.update` | `id`, `text` |
| Delete | `document-comments.delete` | `id` |

### Roadmap Views

Public roadmap views. Roadmap items are feedback entries grouped into view columns by status — to add or move an item, create or update feedback with the desired `status`.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `roadmap-views.create` | `name` |
| List | `roadmap-views.list` | - |
| Get | `roadmap-views.info` | `id` |
| Items | `roadmap-views.items` | `id` (feedback in each column) |
| Preview | `roadmap-views.preview` | `id` |
| Update | `roadmap-views.update` | `id` |
| Delete | `roadmap-views.delete` | `id` |

### Roadmap View Columns

Columns within a roadmap view. Columns are filter-defined: each column has `filters` that select which feedback appears in it.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `roadmap-view-columns.create` | `roadmapId` (view ID), `name` |
| Update | `roadmap-view-columns.update` | `id` |
| Delete | `roadmap-view-columns.delete` | `id` |

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
| Create | `subscribers.create` | `email`, `name` |
| List | `subscribers.list` | - |
| Update | `subscribers.update` | `id` |
| Deactivate | `subscribers.deactivate` | `id` |
| Delete | `subscribers.delete` | `id` |
| Count | `subscribers.count` | - |
| Search | `subscribers.search` | `query` (not yet implemented server-side; prefer `subscribers.list`) |

### Contact Properties

Custom properties on subscriber/contact records.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `contact-properties.create` | `name`, `type` |
| List | `contact-properties.list` | - |
| Update | `contact-properties.update` | `id` |
| Delete | `contact-properties.delete` | `id` |

### Projects

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `projects.create` | `name` |
| List | `projects.list` | - |
| Get | `projects.info` | `id` |
| Update | `projects.update` | `id` |
| Delete | `projects.delete` | `id` |

### Product Tours

In-app product tours.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `tours.create` | - |
| List | `tours.list` | - |
| Drafts | `tours.drafts` | - |
| All | `tours.all` | - |
| Count | `tours.count` | - |
| Get | `tours.info` | `id` |
| Update | `tours.update` | `id` (publish state, targeting, theme) |
| Translate | `tours.translate` | `id`, `language` |
| Delete | `tours.delete` | `id` |

### Tour Steps

Steps within a product tour.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `steps.create` | `tourId` |
| List | `steps.list` | `tourId` |
| Get | `steps.info` | `id` |
| Update | `steps.update` | `id` |
| Reorder | `steps.reorder` | `id`, `stepsMoved` |
| Delete | `steps.delete` | `id` |

### Interactive Demos

Interactive product demos. Screen content is captured with the Userorbit Chrome extension; use these endpoints to manage, publish, and analyze demos.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `demos.create` | - (`title` defaults to "Untitled demo") |
| List | `demos.list` | - |
| Count | `demos.count` | - |
| Get | `demos.info` | `id` |
| Update | `demos.update` | `id` (title, description, steps copy) |
| Duplicate | `demos.duplicate` | `id` |
| Publish | `demos.publish` | `id` |
| Unpublish | `demos.unpublish` | `id` |
| Archive | `demos.archive` | `id` |
| Generate help article | `demo-articles.create` | `id` (draft a help center article from the demo) |
| Analytics | `demos.analytics` | `id` |

### Onboarding Checklists

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `checklists.create` | `configuration` (`title` defaults to "Untitled") |
| List | `checklists.list` | - |
| Drafts | `checklists.drafts` | - |
| All | `checklists.all` | - |
| Count | `checklists.count` | - |
| Get | `checklists.info` | `id` |
| Update | `checklists.update` | `id` |
| Delete | `checklists.delete` | `id` |

### Surveys

In-app surveys.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `surveys.create` | `configuration` (`title` defaults to "Untitled") |
| List | `surveys.list` | - |
| Drafts | `surveys.drafts` | - |
| All | `surveys.all` | - |
| Count | `surveys.count` | - |
| Get | `surveys.info` | `id` |
| Update | `surveys.update` | `id` (questions, targeting, publish state) |
| Delete | `surveys.delete` | `id` |

### Workflows

Support automation workflows with a trigger and a step graph.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Create | `workflows.create` | `name` |
| List | `workflows.list` | - |
| Get | `workflows.info` | `id` |
| Update | `workflows.update` | `id` (trigger config, step graph) |
| Publish | `workflows.publish` | `id` |
| Unpublish | `workflows.unpublish` | `id` |
| Run | `workflows.run` | `id`, `threadId` (published manual-trigger workflows only) |
| List runs | `workflow-runs.list` | `id` (workflowId) or `threadId` |
| Delete | `workflows.delete` | `id` |

Trigger types: `manual`, `automatic` (events: `thread_created`, `customer_message_added`, `agent_replied`, `status_changed`, `priority_changed`, `assignee_changed`, `labels_changed`), `scheduled` (`hourly`, `daily`, `weekdays`, `weekly`).

### Support Inbox Threads

Customer support conversations.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| List | `support-threads.list` | - |
| Get | `support-threads.info` | `id` (full timeline and customer context) |
| Create | `support-threads.create` | `subject` or `body`/`message` |
| Update | `support-threads.update` | `id` |
| Reply / note | `support-messages.create` | `threadId`, `body`, `messageType` |
| Set labels | `support-thread-labels.update` | `id`, `labelIds` |
| Set assignees | `support-thread-assignees.update` | `id`, `assigneeIds` |
| Merge | `support-threads.merge` | `id`, `targetThreadId` |
| Mark read | `support-thread-read-status.update` | `id` |

List filters: `queue` (`todo`, `mine`, `unassigned`, `snoozed`, `done`, `all` — default `todo`), `status`, `priority`, `assigneeId` (UUID, `"me"`, or `"unassigned"`), `labelId`, `search`, `supportAccountId`, `tier`, `sourceChannel`, `sort` (`{ field, direction }`).

Thread statuses: `needs_first_response`, `needs_next_response`, `waiting_for_customer`, `investigating`, `close_the_loop`, `paused_for_later`, `done`, `ignored`. Priorities: `low`, `normal`, `high`, `urgent`.

`support-messages.create` `messageType`: `"agent_reply"` (customer-visible) or `"private_note"` (internal).

`support-threads.update` supports: `subject`, `status`, `priority`, `assigneeId`, `supportAccountId`, `snoozedUntil`, `locked`, `metadata`.

### Support Side Discussions

Internal email or Slack side discussions attached to a support thread.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| List | `support-discussions.list` | `threadId` |
| Get | `support-discussions.info` | `id` |
| Create | `support-discussions.create` | `threadId`, `channelType`, `message` |
| Reply | `support-discussion-messages.create` | `id` (discussionId), `body` |
| Resolve | `support-discussions.resolve` | `id` |
| Reopen | `support-discussions.reopen` | `id` |

`channelType`: `"email"` (also requires `toAddresses`) or `"slack"` (requires `slackChannelId` and `slackIntegrationId`).

### Support Labels

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| List | `support-labels.list` | - |
| Create | `support-labels.create` | `name` |
| Update | `support-labels.update` | `id` |
| Delete | `support-labels.delete` | `id` |

### Support Snippets

Canned reply snippets for support.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| List | `support-snippets.list` | - |
| Create | `support-snippets.create` | `name`, `body` |
| Update | `support-snippets.update` | `id` |
| Delete | `support-snippets.delete` | `id` |

### Analytics (read-only)

Query product analytics.

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| List projects | `analytics.projects` | - |
| Event catalog | `analytics.catalog` | `projectId` |
| Run query | `analytics.query` | `projectId`, query payload |

### Workspace

| Operation | Endpoint | Required fields |
|-----------|----------|-----------------|
| Get workspace | `teams.info` | - |
| Get current user | `users.info` | - |

## Common Workflows

### Create and publish an announcement
1. Call `collections.list` to find the right `collectionId`
2. Call `announcements.create` with `collectionId`, `title`, `text`, `meta`, and `publish: true`

### Add an item to the roadmap
1. Call `feedbacks.create` with `title`, optional `text`, and the target `status`
2. Use `status: "in_review"` for review, `"planned"` for planned work, `"in_progress"` for active work, or `"completed"` for shipped work
3. To move an existing item, call `feedbacks.update` with the feedback `id` and new `status`
4. Call `roadmap-views.items` with the view `id` to verify placement

### Publish a help center article
1. Call `article-collections.list` to find collection IDs
2. Call `articles.create` with `title`, `text`, and `collectionIds`
3. Call `articles.publish` with the article `id`

### Triage the support inbox
1. Call `support-threads.list` with `queue: "todo"` to see open threads
2. Call `support-threads.info` with a thread `id` for the full timeline
3. Reply with `support-messages.create` (`threadId`, `body`, `messageType: "agent_reply"`), or leave an internal note with `messageType: "private_note"`
4. Call `support-threads.update` to set `status`, `priority`, or `assigneeId`

### Publish an interactive demo and document it
1. Call `demos.list` to find the demo `id`
2. Call `demos.update` to polish title, description, or step copy
3. Call `demos.publish` with the `id`
4. Call `demo-articles.create` with the `id` to draft a help center article from the demo, then review and publish it via `articles.publish`

### Automate support with a workflow
1. Call `workflows.create` with a `name`
2. Call `workflows.update` with the trigger config and step graph
3. Call `workflows.publish` to activate, then `workflow-runs.list` to monitor runs

### Query product analytics
1. Call `analytics.projects` to find the `projectId`
2. Call `analytics.catalog` with `projectId` to see available events
3. Call `analytics.query` with `projectId` and a query payload

## Detailed API Reference

For full request/response schemas with all optional fields, see `references/api.md`.
