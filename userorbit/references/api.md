# Userorbit API Reference

Base URL: `https://api.userorbit.com/api/v1`

All endpoints use POST. Auth via `Authorization: Bearer $USERORBIT_API_KEY` header. Optionally add `x-team-id` header for multi-team users.

API keys are scoped: read-only keys can call list/info/count/search-style actions; read/write keys can call every endpoint documented here. Endpoints outside this document are not available to API keys.

## Table of Contents

- [Feedbacks](#feedbacks)
- [Feedback Boards](#feedback-boards)
- [Feedback Board Tags](#feedback-board-tags)
- [Feedback Comments](#feedback-comments)
- [Announcements](#announcements)
- [Announcement Comments](#announcement-comments)
- [Collections (Announcement Categories)](#collections)
- [Roadmap Views](#roadmap-views)
- [Roadmap View Columns](#roadmap-view-columns)
- [Articles (Help Center)](#articles)
- [Article Collections](#article-collections)
- [Article Votes](#article-votes)
- [Tags](#tags)
- [Subscribers](#subscribers)
- [Contact Properties](#contact-properties)
- [Projects](#projects)
- [Tours](#tours)
- [Tour Steps](#tour-steps)
- [Interactive Demos](#interactive-demos)
- [Checklists](#checklists)
- [Surveys](#surveys)
- [Workflows](#workflows)
- [Support Threads](#support-threads)
- [Support Labels](#support-labels)
- [Support Snippets](#support-snippets)
- [Support Discussions](#support-discussions)
- [Analytics](#analytics)
- [Workspace](#workspace)
- [Response Objects](#response-objects)

---

## Feedbacks

### feedbacks.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | |
| text | string | no | |
| status | string | no | Default: `in_review`. Values: `in_review`, `planned`, `in_progress`, `completed`, `closed`, `rejected` |
| priority | string | no | Default: `medium`. Values: `low`, `medium`, `high` |
| boardId | UUID | no | |
| tagIds | UUID[] | no | |
| assignee | UUID | no | User ID |
| creatorId | UUID | no | Subscriber ID |
| creatorName | string | no | Used if no creatorId |
| creatorEmail | string | no | Used if no creatorId |

Response: `{ data: { id, title, text, status, priority, boardId, ... } }`

The `text` field is rendered directly in public feedback and roadmap views. Use plain prose or the same stored HTML style already present on existing feedback. Avoid Markdown headings and lists unless the target surface is known to render Markdown.

### feedbacks.list

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| status | string | no | One of the feedback statuses; other values are ignored |
| search | string | no | Case-insensitive match on `text` |
| boardId | UUID | no | |
| sortBy | string | no | Default: `newest`. Values: `newest`, `top` (votes), `trending` (votes + comments, last 7 days) |
| from | ISO date | no | `createdAt >= from` |
| to | ISO date | no | `createdAt <= to` |
| assignedToMe | boolean | no | Requires authenticated user; filters to feedback assigned to the caller |

Archived feedback is always excluded. Response: `{ pagination: { offset, limit, total }, data: [...], count }`

### feedbacks.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### feedbacks.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title | string | no | |
| text | string | no | |
| status | string | no | |
| priority | string | no | |
| boardId | UUID | no | Set null to unassign |
| assignee | UUID | no | Set null to unassign |
| tagIds | UUID[] | no | |
| meta | object | no | |

### feedbacks.merge

Admin only. Merges a feedback item into another: votes, comments, subscribers, and tags move to the target (duplicates removed), and the source is archived with `meta.mergedIntoFeedbackId` set.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Source feedback |
| targetId | UUID | yes | Target feedback; must differ from `id`; neither may be archived |

Response: `{ data: { sourceId, targetId, moved: { votes, comments, subscribers, tags }, target } }`

### feedbacks.count

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| boardId | UUID | no | Scope counts to a board |
| assignedToMe | boolean | no | Requires authenticated user |

Response: `{ data: { all, archived, closed, completed, in_progress, in_review, planned, rejected } }`

### feedbacks.delete / feedbacks.archive / feedbacks.restore

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### feedbacks.vote

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Feedback ID |
| subscriberId | UUID | no | Auto-created from auth user email if omitted |

Response: `{ voted: boolean }`

---

## Feedback Boards

### feedback-boards.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | |
| slug | string | no | |
| configuration | object | no | |
| public | boolean | no | Default: false |

### feedback-boards.list

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| type | string | no | `public` or `private` |
| search | string | no | |
| sortBy | string | no | Default: `name` |
| sortOrder | string | no | Default: `asc` |

### feedback-boards.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### feedback-boards.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | no |
| configuration | object | no |
| public | boolean | no |

### feedback-boards.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Feedback Board Tags

### feedback-board-tags.create

| Field | Type | Required |
|-------|------|----------|
| boardId | UUID | yes |
| tagId | UUID | yes |

### feedback-board-tags.list

| Field | Type | Required |
|-------|------|----------|
| boardId | UUID | yes |

### feedback-board-tags.update

| Field | Type | Required |
|-------|------|----------|
| boardId | UUID | yes |
| oldTagId | UUID | yes |
| newTagId | UUID | yes |

### feedback-board-tags.delete

| Field | Type | Required |
|-------|------|----------|
| boardId | UUID | yes |
| tagId | UUID | yes |

---

## Feedback Comments

### feedback-comments.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Feedback ID |
| text | string | yes | |
| subscriberId | UUID | no | Auto-created from auth user if omitted |
| parentId | UUID | no | For threaded replies |
| source | string | no | Default: `admin` |
| type | string | no | Default: `public`. Values: `public`, `private` |

### feedback-comments.list

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | no | Feedback ID filter |
| sort | string | no | Default: `updatedAt` |
| direction | string | no | `ASC` or `DESC` |

### feedback-comments.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Comment ID |
| text | string | yes | |
| type | string | no | `public` or `private` |

### feedback-comments.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Announcements

### announcements.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| collectionId | UUID | yes | Category ID |
| title | string | no | |
| text | string | no | Markdown content |
| meta | object | yes | `{ ctaTitle, ctaLink, ctaImage, description, feedback }`; may be empty |
| publish | boolean | no | Publish immediately |
| parentAnnouncementId | UUID | no | For nested announcements |
| index | integer | no | Sort order (>= 0) |
| collaboratorIds | UUID[] | no | |

### announcements.list

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| collection | UUID | no | Collection ID filter (also accepts `category`) |
| search | string | no | |
| user | UUID | no | Filter by author |
| from | ISO date | no | Filter by createdAt range |
| to | ISO date | no | |
| sort | string | no | Default: `updatedAt` |
| direction | string | no | `ASC` or `DESC` |

### announcements.info

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | conditional | One of `id` or `shareId` required |
| shareId | UUID | conditional | |

### announcements.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title | string | no | |
| text | string | no | |
| meta | object | no | |
| publish | boolean | no | `true` publishes, `false` unpublishes |
| scheduledAt | ISO date | no | Set null to cancel schedule |
| sendEmailBroadcast | boolean | no | |
| collectionId | UUID | no | Move to different category |
| append | boolean | no | Append text instead of replace |
| collaboratorIds | UUID[] | no | |
| lastRevision | integer | no | Optimistic locking |

### announcements.search

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| query | string | yes | |
| collectionId | UUID | no | |
| userId | UUID | no | |
| includeArchived | string | no | `"true"` or `"false"` |
| dateFilter | string | no | `day`, `week`, `month`, `year` |

### announcements.delete / announcements.archive / announcements.pin / announcements.unpin

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### announcements.restore

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| revisionId | UUID | no | Restore to specific revision |

---

## Announcement Comments

Announcement comments use the `document-comments` endpoint prefix.

### document-comments.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Announcement ID |
| text | string | yes | |
| subscriberId | UUID | no | |
| parentId | UUID | no | For replies |
| source | string | no | Default: `widget` |

### document-comments.list

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| sort | string | no |
| direction | string | no |

### document-comments.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| text | string | yes |

### document-comments.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Collections

Announcement categories.

### collections.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | |
| description | string | no | |
| color | string | no | |

### collections.list

No required fields.

### collections.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### collections.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | no |
| description | string | no |
| color | string | no |

### collections.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Roadmap Views

Public roadmap views. Roadmap items are feedback entries grouped into view columns; to add or move an item, create or update feedback so it matches a column's filters (typically by `status`).

### roadmap-views.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | Also generates a unique slug |
| description | string | no | Default: `""` |
| visibility | string | no | Default: `everyone` |
| publishedType | string | no | Default: `automatic` |
| sortBy | string | no | Default: `latest` |
| isDefault | boolean | no | `true` clears the flag on other views |
| isPublished | boolean | no | Default: true |
| showEtcDate | boolean | no | Default: true |
| showCreatedDate | boolean | no | Default: true |
| showHeaderInEmbed | boolean | no | Default: false |
| baseFilters | array | no | Validated roadmap filters |
| excludedBoardIds | UUID[] | no | |
| settings | object | no | |

### roadmap-views.list

No required fields. Paginated; ordered default view first, then by `updatedAt`. Items include columns.

### roadmap-views.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### roadmap-views.items / roadmap-views.preview

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ data: { ...view, totalItems, columns } }` where each column contains its resolved feedback items.

### roadmap-views.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| name | string | no | Regenerates slug |
| ...all create fields | | no | Applied when present |

### roadmap-views.delete

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Cannot delete the only roadmap view; deleting the default promotes another view |

Response: `{ success: true }`

---

## Roadmap View Columns

Columns are filter-defined: each column's `filters` select which feedback appears in it.

### roadmap-view-columns.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| roadmapId | UUID | yes | Parent roadmap view ID |
| name | string | yes | |
| description | string | no | |
| icon | string | no | |
| color | string | no | |
| filters | array | no | Validated roadmap filters |

Position is auto-assigned at the end.

### roadmap-view-columns.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| name, description, icon, color, position, filters | | no | Applied when present; sibling positions re-normalized |

### roadmap-view-columns.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ success: true }`

---

## Articles

Help center articles.

### articles.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | |
| text | string | yes | Markdown content |
| collectionIds | UUID[] | yes | Non-empty array |
| language | string | no | Default: `en` |
| tags | string[] | no | |
| urlSlug | string | no | Custom URL slug |
| seoTitle | string | no | |
| metaDescription | string | no | |
| authorIds | UUID[] | no | |
| assigneeIds | UUID[] | no | |

### articles.list

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| collectionId | UUID | no | |
| status | string | no | `draft`, `published`, `archived` |
| language | string | no | |
| tags | string[] | no | |
| search | string | no | |
| sort | string | no | Default: `updatedAt` |
| direction | string | no | Default: `DESC` |

### articles.info

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | conditional | ID or urlSlug |
| urlSlug | string | conditional | |

### articles.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title | string | no | |
| text | string | no | |
| collectionIds | UUID[] | no | |
| language | string | no | |
| tags | string[] | no | |
| urlSlug | string | no | |
| authorIds | UUID[] | no | |
| assigneeIds | UUID[] | no | |
| meta | object | no | |
| publish | boolean | no | |
| autosave | boolean | no | Default: false |

### articles.publish / articles.unpublish / articles.archive / articles.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### articles.search

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| query | string | yes | |
| collectionId | UUID | no | |
| status | string | no | Default: `published` |
| language | string | no | |
| tags | string[] | no | |

### articles.revisions

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| sort | string | no | Default: `createdAt` |
| direction | string | no | Default: `DESC` |

### articles.restore

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| revisionId | UUID | yes |

---

## Article Collections

Help center categories.

### article-collections.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | |
| description | string | no | |
| icon | string | no | |
| meta | object | no | |
| privacy | string | no | Default: `public`. Values: `public`, `private` |
| parentId | UUID | no | For nested collections |
| sortOrder | integer | no | Default: 0 |
| language | string | no | Default help center language if omitted |

### article-collections.list

| Field | Type | Required |
|-------|------|----------|
| parentId | UUID | no |
| includeChildren | boolean | no |
| language | string | no |

### article-collections.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### article-collections.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | no |
| description | string | no |
| icon | string | no |
| meta | object | no |
| privacy | string | no |
| sortOrder | integer | no |
| language | string | no |

### article-collections.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Article Votes

### article-votes.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ data: { helpful, not_helpful, hasUserVoted, userVoteValue } }`

### article-votes.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Article ID |
| value | string | yes | `helpful` or `not_helpful` |
| comment | string | no | |

### article-votes.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Tags

### tags.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | 1-50 chars |
| color | string | no | Default: `#3B82F6` |
| description | string | no | |

### tags.list

| Field | Type | Required |
|-------|------|----------|
| search | string | no |

### tags.info / tags.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### tags.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | yes |
| color | string | no |
| description | string | no |

---

## Subscribers

### subscribers.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | string | yes | Normalized (trim + lowercase) |
| name | string | yes | |
| password | string | no | Only required for unauthenticated public signup; not needed for API calls |
| alertSubscribers | boolean | no | Default: true |

Creating an email that already exists (without a password) returns "A contact with this email already exists".

### subscribers.list

| Field | Type | Required |
|-------|------|----------|
| sort | string | no |
| direction | string | no |

### subscribers.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | no |
| email | string | no |

### subscribers.deactivate

Marks a subscriber inactive (`deactivatedAt`) while preserving contact history.

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### subscribers.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### subscribers.count

No required fields. Response: `{ count: integer }`

### subscribers.search

Not yet implemented server-side (returns empty data). Prefer `subscribers.list`.

---

## Contact Properties

Custom properties on subscriber/contact records.

### contact-properties.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | Unique per team |
| type | string | yes | Defaults to `text` if falsy |
| displayName | string | no | Defaults to capitalized name |
| description | string | no | |
| isRequired | boolean | no | Default: false |

### contact-properties.list

No required fields. Response: `{ data: [{ id, name, type, displayName, description, isRequired, teamId, createdAt, updatedAt }] }`

### contact-properties.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | no |
| type | string | no |
| displayName | string | no |
| description | string | no |
| isRequired | boolean | no |

### contact-properties.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ success: true }`

---

## Projects

### projects.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | |
| color | string | no | |
| description | string | no | |

### projects.list

No required fields.

### projects.info / projects.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### projects.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | no |
| color | string | no |
| description | string | no |

---

## Tours

In-app product tours.

### tours.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | no | Default: `Untitled` |
| description | string | no | |
| appUrl | string | no | |
| publish | boolean | no | Publish immediately |
| startsAt | ISO date | no | Schedule window start |
| endsAt | ISO date | no | Must be after `startsAt` |
| triggers | array | no | `[{ event: { id } }]` — event IDs must be valid actions |
| configuration | object | no | Theme, targeting, type, etc. |
| steps | array | no | Steps created inline, ordered |

### tours.list

Paginated. Optional: `user` (creator UUID), `type` (configuration type), `direction`.

### tours.drafts

Paginated, unpublished tours. Optional: `sort` (default `updatedAt`), `direction`.

### tours.all

Paginated, all tours. Optional: `search` (title match).

### tours.count

No required fields. Response: `{ count }`

### tours.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### tours.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title, description, appUrl | string | no | |
| publish | boolean | no | `true` publishes, otherwise a published tour is unpublished |
| autoLaunch | boolean | no | |
| startsAt, endsAt | ISO date | no | |
| state | any | no | |
| configuration | object | no | Picks: theme, themeId, type, announcementId, showStepCount, showAuthor, targeting, progressType, helpPageFilters, localization |
| append | boolean | no | Appends description |
| triggers | array | no | Replaces existing triggers |
| steps | array | no | Updates existing (by id) or creates new |

### tours.translate

AI-translates tour step content into a target language. Stores translations per-step under `configuration.translations[language]`.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| language | string | yes | Target language code |
| overwrite | boolean | no | Default: true. `false` skips steps already translated |

Requires a configured AI model for the workspace.

### tours.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ success: true }`

---

## Tour Steps

### steps.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| tourId | UUID | yes | |
| title | string | no | |
| description | string | no | |
| url | string | no | |
| order | number | no | Appended after last step if omitted |
| isClosable | boolean | no | |
| progression | any | no | |
| pivotSelector | string | no | |
| configuration | object | no | |

### steps.list

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| tourId | UUID | yes | |
| direction | string | no | Default: ASC |

### steps.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### steps.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title, description, url | string | no | |
| order | number | no | |
| isClosable | boolean | no | |
| progression | any | no | |
| pivotSelector | string | no | |
| configuration | object | no | |

### steps.reorder

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Step ID |
| stepsMoved | number | yes | Signed delta: new order = current order + stepsMoved |

Response: reordered step list.

### steps.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ success: true }`

---

## Interactive Demos

Interactive product demos. Screen content is captured with the Userorbit Chrome extension.

### demos.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | no | Default: `Untitled demo` |
| description | string | no | |
| appUrl | string | no | |
| configuration | object | no | |
| flows | array | no | |
| captures | array | no | |
| steps | array | no | |
| publish | boolean | no | Requires `privacyReviewAcknowledged: true` |
| privacyReviewAcknowledged | boolean | no | |

### demos.list

Paginated. Optional: `search`, `archived` (`true` archived only, `"all"` everything), `published` (boolean filter), `direction`.

### demos.count

No required fields. Counts non-archived demos. Response: `{ count }`

### demos.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### demos.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title, description, appUrl | string | no | |
| configuration | object | no | Merged |
| flows, captures, steps | array | no | Upserted |
| publish | boolean | no | `true` publishes, `false` unpublishes |
| privacyReviewAcknowledged | boolean | no | |

### demos.duplicate

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title | string | no | Default: `Copy of <source title>` |

### demos.publish

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| privacyReviewAcknowledged | boolean | yes | Must be `true` |

### demos.unpublish / demos.archive

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### demo-articles.create

Drafts a help center article from a demo's captured steps (queued as an AI task). The demo must have captured steps.

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ data: { articleId, task, existing } }` — `existing: true` when the article was already generated or a task is in flight.

### demos.analytics

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ data: { demoId, sessions, completions, leads, recentLeads, completionRate, eventsByType, steps: [{ views, hotspotClicks, completions, completionRate, dropoffRate }], recentEvents } }`

---

## Checklists

Onboarding checklists.

### checklists.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| configuration | object | yes | `{ targeting, visibility, design }` — may be `{}` |
| title | string | no | Default: `Untitled` |
| label | string | no | |
| subheader | string | no | |
| description | string | no | |
| type | any | no | |
| appUrl | string | no | |
| publish | boolean | no | |
| tasks | array | no | Created inline, ordered |

### checklists.list

Paginated. Optional: `user` (creator UUID), `direction`.

### checklists.drafts

Paginated, unpublished. Optional: `sort` (default `updatedAt`), `direction`.

### checklists.all

Paginated, all checklists.

### checklists.count

No required fields. Response: `{ count }`

### checklists.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### checklists.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title, label | string | no | |
| publish | boolean | no | `true` publishes, otherwise a published checklist is unpublished |
| tasks | array | no | Updates existing (by id) or creates new; fields: title, subheader, type, ctaLabel, ctaType, configuration, order |
| configuration | object | no | Picks: targeting, visibility, completion, dismiss, design (merged) |
| triggers | array | no | Replaces existing triggers |

### checklists.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ success: true }`

---

## Surveys

In-app surveys.

### surveys.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| configuration | object | yes | `{ targeting, design, welcome, ending }` — may be `{}` |
| title | string | no | Default: `Untitled` |
| type | any | no | |
| publish | boolean | no | |
| questions | array | no | Created inline, ordered |

### surveys.list

Paginated. Optional: `user` (creator UUID), `direction`.

### surveys.drafts

Paginated, unpublished. Optional: `sort` (default `updatedAt`), `direction`.

### surveys.all

Paginated. Optional: `search` (title match).

### surveys.count

No required fields. Response: `{ count }`

### surveys.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### surveys.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title | string | no | |
| publish | boolean | no | `true` publishes, otherwise a published survey is unpublished |
| questions | array | no | Questions missing from the payload are deleted; existing updated by id; new created. Fields: title, subheader, type, ctaLabel, ctaType, configuration, order |
| configuration | object | no | Picks: targeting, completion, dismiss, ending, design (merged) |
| triggers | array | no | Replaces existing triggers |

### surveys.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ success: true }`

---

## Workflows

Support automation workflows with a trigger and a step graph.

Trigger types: `manual`, `automatic`, `scheduled`.
Automatic trigger events: `thread_created`, `customer_message_added`, `agent_replied`, `status_changed`, `priority_changed`, `assignee_changed`, `labels_changed`.
Schedule frequencies: `hourly`, `daily`, `weekdays`, `weekly`.
Workflow statuses: `draft`, `published`.

### workflows.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | Max 120 chars |
| description | string | no | |
| triggerType | string | no | Default: `automatic` |
| triggerConfig | object | no | automatic: `{ events: [] }`; scheduled: `{ frequency, time, weekday }` |
| definition | object | no | Step graph |

Created as `draft`.

### workflows.list

No required fields. Response includes each workflow's latest run.

### workflows.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### workflows.update

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| name, description | string | no | |
| triggerType | string | no | |
| triggerConfig | object | no | |
| definition | object | no | |
| enabled | boolean | no | |

### workflows.publish

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Validates the definition; on failure returns `400 { error: "validation_failed", message, errors: [] }`. On success snapshots the published definition and trigger.

### workflows.unpublish

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### workflows.run

Manually triggers a run. Only valid for published workflows with a `manual` trigger.

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| threadId | UUID | yes |

Response: `{ data: WorkflowRun | null }`

### workflow-runs.list

At least one of `id` or `threadId` is required.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | conditional | Workflow ID |
| threadId | UUID | conditional | Support thread ID |

Response: latest 50 runs, newest first.

### workflows.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

Response: `{ success: true }`

---

## Support Threads

Customer support inbox conversations.

Statuses: `needs_first_response`, `needs_next_response`, `waiting_for_customer`, `investigating`, `close_the_loop`, `paused_for_later`, `done`, `ignored`.
Priorities: `low`, `normal`, `high`, `urgent`.
Queues: `todo`, `mine`, `unassigned`, `snoozed`, `done`, `all`.
Source channels: `widget`, `help_center`, `portal`, `email`, `slack`, `api`, `admin`.
Message types: `customer_message`, `agent_reply`, `auto_reply`, `private_note`, `ai_message`, `system_event`.

### support-threads.list

Paginated. All fields optional.

| Field | Type | Notes |
|-------|------|-------|
| queue | string | Default: `todo` |
| status | string | Thread status or `"all"` |
| priority | string | Priority or `"all"` |
| assigneeId | string | UUID, `"me"`, or `"unassigned"` |
| labelId | UUID | |
| supportAccountId | string | UUID or `"none"` |
| sourceChannel | string | Or `"all"` |
| tier | string | Tier name, `"none"`, or `"all"` |
| search | string | Fuzzy across subject, messages, subscriber, account, labels |
| sort | object | `{ field: updatedAt \| createdAt \| lastCustomerMessageAt \| lastAgentMessageAt, direction: asc \| desc }` |

### support-threads.info

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Returns full timeline plus customer context (suggested feedback/articles, previous and similar threads, product events) |

### support-threads.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| subject | string | conditional | `subject` or `body` required |
| body / message | string | conditional | Creates the first message |
| sourceChannel | string | no | Default: `admin` |
| subscriberId | UUID | no | |
| email / subscriberEmail | string | no | Finds or creates a subscriber |
| name / subscriberName | string | no | |
| priority | string | no | Default: `normal` |
| assigneeId | string | no | Defaults to current user; accepts `"me"` |
| metadata | object | no | |

### support-threads.update

At least one update field is required.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| subject | string | no | |
| status | string | no | |
| priority | string | no | |
| assigneeId | string | no | UUID, `"me"`, or empty to unassign |
| supportAccountId | string | no | UUID or empty |
| snoozedUntil | ISO date/null | no | Drives `paused_for_later` |
| locked | boolean | no | |
| metadata | object | no | Merged |

### support-messages.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| threadId | UUID | yes | |
| body | string | yes | |
| messageType | string | no | `"private_note"` makes an internal note; default is a customer-visible agent reply |
| visibility | string | no | `"internal"` also makes a private note |

Fails with 423 if the thread is locked.

### support-thread-labels.update

Replaces the thread's labels.

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| labelIds | UUID[] | no |

### support-thread-assignees.update

Sets co-assignees (excludes the primary assignee).

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| assigneeIds | UUID[] | yes |

### support-threads.merge

Marks the source thread `done` + locked and links both threads as duplicates.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Source thread (also accepts `threadId`) |
| targetThreadId | string | yes | Target thread (also accepts `targetId`); must differ |

### support-thread-read-status.update

Marks a thread read for the team.

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Support Labels

### support-labels.list

No required fields. Response includes per-label thread counts.

### support-labels.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | 409 if it already exists |
| color | string | no | Hex; default `#6b7280` |
| description | string | no | |

### support-labels.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | no |
| color | string | no |
| description | string | no |

### support-labels.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Support Snippets

Canned reply snippets. Visibility: `team` (default) or `private`.

### support-snippets.list

No required fields. Returns team snippets plus the caller's private ones.

### support-snippets.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | |
| body | string | yes | |
| visibility | string | no | `team` or `private` |
| position | number | no | Default: 0 |
| metadata | object | no | |

### support-snippets.update

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |
| name | string | no |
| body | string | no |
| visibility | string | no |
| position | number | no |
| metadata | object | no |

### support-snippets.delete

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Support Discussions

Internal email or Slack side discussions attached to a support thread. Statuses: `open`, `resolved`.

### support-discussions.list

| Field | Type | Required |
|-------|------|----------|
| threadId | UUID | yes |

### support-discussions.info

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

### support-discussions.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| threadId | UUID | yes | |
| channelType | string | yes | `email` or `slack` |
| message | string | yes | |
| toAddresses | string[] | email only | At least one valid email; requires a configured inbound address |
| slackChannelId | string | slack only | |
| slackChannelName | string | slack only | |
| slackIntegrationId | UUID | slack only | Must be a connected team Slack integration |
| attachments | array | no | `[{ url, name, contentType?, size? }]`, max 10 |

### support-discussion-messages.create

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Discussion ID |
| body | string | yes | |
| attachments | array | no | Max 10 |

### support-discussions.resolve

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | Sets `resolved`; nudges the parent thread to `close_the_loop` if open |

### support-discussions.reopen

| Field | Type | Required |
|-------|------|----------|
| id | UUID | yes |

---

## Analytics

Read-only product analytics backed by ClickHouse.

### analytics.projects

No required fields. Response: `{ data: { projects: [{ id, name, timezone }] } }`

### analytics.catalog

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| projectId | UUID | yes | |
| eventNames | string[] | no | Max 10; filters returned properties |

Response: `{ data: { project, events: [{ name, value }], properties: [{ name, origin: "event"|"user", dataType, eventName, description }] } }`

### analytics.query

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| projectId | UUID | yes | |
| from | string | yes | `YYYY-MM-DD`; range max 366 days |
| to | string | yes | `YYYY-MM-DD` |
| interval | string | no | `day`, `week` (default), `month` |
| metrics | array | yes | 1-5 metric objects |
| filters | array | no | Max 10 global filters |
| title | string | no | |
| description | string | no | |
| render | string | no | `none` (default) or `svg` — adds a rendered chart string |

Metric object:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| type | string | yes | `activeUsers` or `newUsers` |
| eventName | string | no | Default `"$*"` (all events); must be a known event otherwise |
| label | string | no | |
| display | string | no | `line` or `bar` |
| filterAndOr | string | no | `and` (default) or `or` |
| filters | array | no | Max 10 metric-scoped filters |

Filter object: `{ property, origin: "event"|"user", dataType: "string"|"number"|"boolean"|"date", operator, value, value2 }`.
Operators by dataType — string: `is`, `isNot`, `contains`, `notContains`, `isSet`, `isNotSet`; number: `equals`, `notEqual`, `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual`, `between`, `notBetween`, `isNumeric`, `isNotNumeric`; date: `on`, `notOn`, `before`, `since`, `between`, `notBetween`; boolean: no operator, `value` true/false.

Response: `{ data: { schemaVersion, chart: { title, project, range, granularity, series: [{ id, label, metric, eventName, unit, mark, points: [{ start, end, value, partial? }] }] } }, svg? }`

---

## Workspace

### teams.info

No required fields. Returns the current workspace. Use the `x-team-id` header to choose the active workspace for team-scoped calls.

### users.info

No required fields. Returns the authenticated user.

---

## Response Objects

### Feedback
```json
{
  "id": "UUID",
  "title": "string",
  "text": "string",
  "status": "in_review|planned|in_progress|completed|closed|rejected",
  "priority": "low|medium|high",
  "boardId": "UUID|null",
  "assigneeId": "UUID|null",
  "creatorId": "UUID",
  "teamId": "UUID",
  "publishedAt": "ISO date|null",
  "archivedAt": "ISO date|null",
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "subscriber": {},
  "board": {},
  "tags": [{ "id": "", "name": "", "color": "" }]
}
```

### Announcement
```json
{
  "id": "UUID",
  "title": "string",
  "text": "string",
  "collectionId": "UUID",
  "teamId": "UUID",
  "publishedAt": "ISO date|null",
  "archivedAt": "ISO date|null",
  "scheduledAt": "ISO date|null",
  "meta": {},
  "revisionCount": 0,
  "collaboratorIds": [],
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "createdBy": {},
  "updatedBy": {}
}
```

### Article (Help Center)
```json
{
  "id": "UUID",
  "title": "string",
  "text": "string",
  "status": "draft|published|archived",
  "language": "en",
  "tags": [],
  "urlSlug": "string",
  "seoTitle": "string|null",
  "metaDescription": "string|null",
  "publishedAt": "ISO date|null",
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "collections": [],
  "authors": [],
  "assignees": []
}
```

### Subscriber
```json
{
  "id": "UUID",
  "email": "string",
  "name": "string",
  "teamId": "UUID",
  "source": "string",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```
