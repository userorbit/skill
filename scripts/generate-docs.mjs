// ABOUTME: Generates the static GitHub Pages site for github.com/userorbit/skill
// ABOUTME: Emits docs/index.html, one page per feature area, and the blog section
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");
mkdirSync(OUT, { recursive: true });
mkdirSync(join(OUT, "blog"), { recursive: true });

const SITE = "https://userorbit.github.io/skill";

const features = [
  {
    slug: "feedback",
    title: "Feedback Management",
    nav: "Feedback",
    tagline: "Collect, triage, and close the loop on user feedback from your terminal.",
    product: { name: "Userorbit feedback boards", url: "https://userorbit.com/feedback-boards" },
    intro: [
      `Userorbit collects user feedback into boards where users can vote, comment, and follow along. With the skill installed, your coding agent can triage that feedback as part of your normal dev workflow — mark items completed when a fix ships, merge duplicates, or pull up the top-voted requests before planning.`,
      `Feedback items carry a status (<code>in_review</code>, <code>planned</code>, <code>in_progress</code>, <code>completed</code>, <code>closed</code>, <code>rejected</code>), a priority, tags, and an optional board. Statuses also drive the public roadmap, so updating feedback is how roadmap items move.`,
    ],
    prompts: [
      "Show me the top-voted feedback from the last 30 days",
      "We just shipped dark mode — mark the dark mode feedback as completed and reply to the voters",
      "Merge these two duplicate SSO requests",
    ],
    endpoints: [
      ["feedbacks.create", "Create a feedback item (title required)"],
      ["feedbacks.list", "List with filters: search, status, boardId, sortBy (newest/top/trending), from/to, assignedToMe"],
      ["feedbacks.info / update / delete", "Read, edit, or remove an item"],
      ["feedbacks.merge", "Merge one item into another — votes, comments, and tags move over"],
      ["feedbacks.vote", "Vote on behalf of a subscriber"],
      ["feedbacks.archive / restore", "Archive and restore"],
      ["feedbacks.count", "Per-status counts"],
      ["feedback-boards.*", "Create and manage boards"],
      ["feedback-comments.*", "Public replies and private internal notes"],
      ["tags.* / feedback-board-tags.*", "Tag taxonomy and board-tag associations"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/feedbacks.list" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"sortBy": "top", "status": "in_review"}'`,
  },
  {
    slug: "roadmap",
    title: "Public Roadmap",
    nav: "Roadmap",
    tagline: "Keep your public roadmap in sync with what you actually ship.",
    product: { name: "Userorbit product roadmap", url: "https://userorbit.com/product-roadmap" },
    intro: [
      `Userorbit roadmaps are live views over your feedback: each column is defined by filters (typically feedback status), so the roadmap updates itself as work progresses. Your agent can create roadmap views, define columns, and move items by updating the underlying feedback.`,
      `That means "update the roadmap" after a deploy is one prompt: the agent flips the relevant feedback to <code>completed</code> and the public roadmap reflects it immediately.`,
    ],
    prompts: [
      "Add 'AI-powered search' to the roadmap as planned",
      "Move the API v2 item to in progress",
      "Create a roadmap view for the mobile app with Planned / Building / Shipped columns",
    ],
    endpoints: [
      ["roadmap-views.create / list / info", "Manage public roadmap views"],
      ["roadmap-views.items / preview", "List the feedback resolved into each column"],
      ["roadmap-views.update / delete", "Edit or remove views"],
      ["roadmap-view-columns.create", "Add a column (roadmapId, name, filters)"],
      ["roadmap-view-columns.update / delete", "Edit or remove columns"],
      ["feedbacks.update", "Move an item by changing its status"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/roadmap-views.items" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"id": "<view-id>"}'`,
  },
  {
    slug: "announcements",
    title: "Announcements & Changelog",
    nav: "Announcements",
    tagline: "Publish product updates the moment the deploy goes green.",
    product: { name: "Userorbit announcements", url: "https://userorbit.com/announcements" },
    intro: [
      `Announcements are Userorbit's changelog: categorized product updates users see in-app and on your public changelog page. The skill lets your agent draft an announcement from a diff or PR description, attach a CTA, and publish or schedule it — all without leaving the terminal.`,
      `Announcements live in collections (categories), support scheduling via <code>scheduledAt</code>, pinning, and optional email broadcast on publish.`,
    ],
    prompts: [
      "Publish a changelog entry for the dark mode feature we just merged",
      "Draft an announcement for the v2 API, schedule it for Monday 9am",
      "Pin the pricing update announcement",
    ],
    endpoints: [
      ["announcements.create", "Create (collectionId, title, text, meta); publish: true to go live"],
      ["announcements.list / info / search", "Browse and search entries"],
      ["announcements.update", "Edit, publish/unpublish, schedule, email broadcast"],
      ["announcements.pin / unpin", "Pin to the top"],
      ["announcements.archive / restore / delete", "Lifecycle management"],
      ["collections.*", "Manage announcement categories"],
      ["document-comments.*", "Comments on announcements"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/announcements.create" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"collectionId": "<id>", "title": "Dark mode is here", "text": "...", "meta": {}, "publish": true}'`,
  },
  {
    slug: "help-center",
    title: "Help Center Articles",
    nav: "Help Center",
    tagline: "Write and publish documentation with the agent that wrote the code.",
    product: { name: "Userorbit help center", url: "https://userorbit.com/help-center" },
    intro: [
      `The agent that just implemented a feature is the best-placed author for its docs. With the skill, it can draft a help article in Markdown, drop it into the right category, and publish — with revisions tracked so you can restore any earlier version.`,
      `Articles have a draft → published → archived lifecycle, SEO fields (<code>seoTitle</code>, <code>metaDescription</code>, <code>urlSlug</code>), multi-language support, and helpful/not-helpful voting.`,
    ],
    prompts: [
      "Draft a help article explaining how to set up SSO",
      "Update the billing article — we renamed the Plans page to Subscription",
      "Restore the API keys article to its previous revision",
    ],
    endpoints: [
      ["articles.create", "Create (title, text, collectionIds)"],
      ["articles.list / info / search", "Browse and search the knowledge base"],
      ["articles.update / publish / unpublish / archive", "Lifecycle management"],
      ["articles.revisions / restore", "Version history and rollback"],
      ["article-collections.*", "Manage help center categories"],
      ["article-votes.*", "Read and manage helpful votes"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/articles.create" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"title": "Setting up SSO", "text": "## Overview...", "collectionIds": ["<id>"]}'`,
  },
  {
    slug: "tours",
    title: "Product Tours",
    nav: "Tours",
    tagline: "Build, publish, and translate in-app product tours programmatically.",
    product: { name: "Userorbit product tours", url: "https://userorbit.com/product-tours" },
    intro: [
      `Product tours guide users through your UI step by step. The skill gives your agent full control over tours: create them, manage steps and their selectors, schedule start and end dates, wire up triggers, and publish.`,
      `Tours also support one-call AI translation: <code>tours.translate</code> localizes every step's copy into a target language, stored per-step so you can review before it goes live to that locale.`,
    ],
    prompts: [
      "Create a tour for the new dashboard with steps for the sidebar, filters, and export button",
      "Translate the onboarding tour into German and French",
      "Unpublish the old checkout tour",
    ],
    endpoints: [
      ["tours.create", "Create a tour (steps and triggers inline)"],
      ["tours.list / drafts / all / count / info", "Browse tours"],
      ["tours.update", "Edit, publish/unpublish, targeting, theme, schedule"],
      ["tours.translate", "AI-translate step content (id, language)"],
      ["tours.delete", "Remove a tour"],
      ["steps.create / list / info / update / delete", "Manage tour steps"],
      ["steps.reorder", "Move a step (id, stepsMoved delta)"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/tours.translate" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"id": "<tour-id>", "language": "de"}'`,
  },
  {
    slug: "demos",
    title: "Interactive Demos",
    nav: "Demos",
    tagline: "Publish interactive product demos and turn them into documentation.",
    product: { name: "Userorbit interactive demos", url: "https://userorbit.com/interactive-product-demos" },
    intro: [
      `Interactive demos are pixel-perfect, clickable captures of your product recorded with the Userorbit Chrome extension. Once captured, the skill lets your agent do everything else: polish step copy, publish, duplicate for variants, and read engagement analytics.`,
      `The standout: <code>demo-articles.create</code> generates a help center article draft from a demo's captured steps — your demo becomes a how-to guide in one call.`,
    ],
    prompts: [
      "Publish the checkout demo",
      "Generate a help article from the onboarding demo",
      "How is the pricing demo performing? Show sessions, completion rate, and drop-off by step",
    ],
    endpoints: [
      ["demos.create / list / count / info", "Manage demos"],
      ["demos.update", "Edit title, description, step copy; publish/unpublish"],
      ["demos.duplicate", "Clone a demo"],
      ["demos.publish / unpublish / archive", "Lifecycle (publish requires privacyReviewAcknowledged)"],
      ["demo-articles.create", "Generate a help article draft from the demo"],
      ["demos.analytics", "Sessions, completions, leads, per-step drop-off"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/demos.analytics" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"id": "<demo-id>"}'`,
  },
  {
    slug: "checklists",
    title: "Onboarding Checklists",
    nav: "Checklists",
    tagline: "Ship guided onboarding checklists without touching the dashboard.",
    product: { name: "Userorbit checklists", url: "https://userorbit.com/checklists" },
    intro: [
      `Checklists give new users a guided list of setup tasks inside your app. The skill lets your agent create checklists with tasks, targeting, and completion rules, then publish them — useful when a new feature should slot into your onboarding flow the day it ships.`,
    ],
    prompts: [
      "Add a 'Connect your Slack' task to the onboarding checklist",
      "Create a getting-started checklist with tasks for profile, first project, and inviting a teammate",
      "Unpublish the beta checklist",
    ],
    endpoints: [
      ["checklists.create", "Create with tasks, targeting, and design configuration"],
      ["checklists.list / drafts / all / count / info", "Browse checklists"],
      ["checklists.update", "Edit tasks, targeting, publish/unpublish"],
      ["checklists.delete", "Remove a checklist"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/checklists.list" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{}'`,
  },
  {
    slug: "surveys",
    title: "In-App Surveys",
    nav: "Surveys",
    tagline: "Launch targeted in-app surveys from a prompt.",
    product: { name: "Userorbit surveys", url: "https://userorbit.com/surveys" },
    intro: [
      `Surveys let you ask users the right question at the right moment — NPS, CSAT, feature reactions, churn reasons. With the skill, your agent can spin up a survey with questions, targeting, and triggers, publish it, and iterate on the questions later.`,
    ],
    prompts: [
      "Create an NPS survey targeting users active for more than 30 days",
      "Add a follow-up question to the churn survey asking what almost made them stay",
      "Pause the pricing survey",
    ],
    endpoints: [
      ["surveys.create", "Create with questions, targeting, and design configuration"],
      ["surveys.list / drafts / all / count / info", "Browse surveys"],
      ["surveys.update", "Edit questions (add/update/remove), targeting, publish state"],
      ["surveys.delete", "Remove a survey"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/surveys.all" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"search": "NPS"}'`,
  },
  {
    slug: "support",
    title: "Support Inbox",
    nav: "Support",
    tagline: "Triage, reply, and resolve support threads with your agent.",
    product: { name: "Userorbit customer support", url: "https://userorbit.com/customer-support" },
    intro: [
      `The Userorbit support inbox unifies conversations from your widget, help center, portal, email, and Slack. The skill exposes the whole inbox: queues, full thread timelines with customer context, agent replies, private notes, labels, assignees, snoozing, and merging duplicates.`,
      `Side discussions let the agent loop in teammates over email or Slack without leaving the thread — ask engineering about a bug in a linked Slack thread, then resolve the discussion when it's answered.`,
    ],
    prompts: [
      "Go through the support todo queue and summarize each thread",
      "Reply to thread X with the fix instructions, then mark it done",
      "Leave a private note on the billing thread and assign it to Sarah",
      "Start a Slack side discussion with #engineering about this crash report",
    ],
    endpoints: [
      ["support-threads.list", "Queues: todo, mine, unassigned, snoozed, done, all — plus status, priority, label, search filters"],
      ["support-threads.info", "Full timeline + customer context"],
      ["support-threads.create / update", "Open threads, set status, priority, assignee, snooze"],
      ["support-messages.create", "Agent replies and private notes"],
      ["support-thread-labels.update / support-thread-assignees.update", "Labels and co-assignees"],
      ["support-threads.merge", "Merge duplicate threads"],
      ["support-discussions.*", "Email/Slack side discussions with reply, resolve, reopen"],
      ["support-labels.* / support-snippets.*", "Labels and canned reply snippets"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/support-threads.list" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"queue": "todo", "sort": {"field": "updatedAt", "direction": "desc"}}'`,
  },
  {
    slug: "workflows",
    title: "Support Workflows",
    nav: "Workflows",
    tagline: "Automate support with trigger-driven workflow graphs.",
    product: { name: "Userorbit customer support", url: "https://userorbit.com/customer-support" },
    intro: [
      `Workflows automate the support inbox: route by keywords, auto-label, assign, reply, escalate. A workflow has a trigger — manual, automatic (thread created, customer replied, status changed, and more), or scheduled — and a step graph that runs against threads.`,
      `Your agent can build the graph, publish it, trigger manual runs against specific threads, and inspect run history.`,
    ],
    prompts: [
      "Create a workflow that labels threads mentioning 'invoice' as Billing and assigns them to the billing queue",
      "Run the escalation workflow on this thread",
      "Show me the last runs of the auto-triage workflow",
    ],
    endpoints: [
      ["workflows.create", "Create (name, triggerType, triggerConfig, definition)"],
      ["workflows.list / info", "Browse workflows with latest runs"],
      ["workflows.update", "Edit trigger config and step graph"],
      ["workflows.publish / unpublish", "Validate and activate"],
      ["workflows.run", "Manual run against a thread (published manual workflows)"],
      ["workflow-runs.list", "Run history by workflow or thread"],
      ["workflows.delete", "Remove a workflow"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/workflow-runs.list" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"id": "<workflow-id>"}'`,
  },
  {
    slug: "analytics",
    title: "Product Analytics",
    nav: "Analytics",
    tagline: "Query active users, new users, and event trends straight from your agent.",
    product: { name: "Userorbit product analytics", url: "https://userorbit.com/product-analytics" },
    intro: [
      `Userorbit tracks product events, and the skill can query them: active users and new users over time, per event, with property filters over event and user profiles. Ask your agent how a launch is doing and it can pull the actual numbers.`,
      `Queries return structured time series (and optionally a rendered SVG chart), bucketed by day, week, or month, with up to five metrics per query.`,
    ],
    prompts: [
      "How many weekly active users did we have over the last 8 weeks?",
      "Compare new users vs active users for the export feature since launch",
      "Chart signups filtered to the pro plan, by day, for the last month",
    ],
    endpoints: [
      ["analytics.projects", "List analytics projects"],
      ["analytics.catalog", "Events and properties available in a project"],
      ["analytics.query", "Time-series query: metrics (activeUsers/newUsers), filters, day/week/month interval, optional SVG render"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/analytics.query" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"projectId": "<id>", "from": "2026-06-01", "to": "2026-07-20", "interval": "week", "metrics": [{"type": "activeUsers"}]}'`,
  },
  {
    slug: "subscribers",
    title: "Subscribers & Contacts",
    nav: "Subscribers",
    tagline: "Manage the people behind the feedback, votes, and support threads.",
    product: { name: "Userorbit", url: "https://userorbit.com" },
    intro: [
      `Subscribers are your end users inside Userorbit — the people voting on feedback, reading announcements, and opening support threads. The skill manages subscriber records and the custom contact properties you attach to them (plan, role, signup date, anything).`,
    ],
    prompts: [
      "Create a subscriber for jane@acme.com",
      "Deactivate the test accounts",
      "Add a 'plan' contact property so we can segment surveys by plan",
    ],
    endpoints: [
      ["subscribers.create", "Create (email, name)"],
      ["subscribers.list / count", "Browse and count"],
      ["subscribers.update / deactivate / delete", "Manage records"],
      ["contact-properties.create / list / update / delete", "Custom properties on contacts"],
    ],
    example: `curl -s -X POST "https://api.userorbit.com/api/v1/subscribers.create" \\
  -H "Authorization: Bearer $USERORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "x-team-id: $USERORBIT_TEAM_ID" \\
  -d '{"email": "jane@acme.com", "name": "Jane"}'`,
  },
];

const posts = [
  {
    slug: "ai-product-management",
    title: "What Is AI Product Management? A Practical Guide",
    nav: "AI Product Management",
    date: "2026-07-20",
    dateLabel: "Jul 20, 2026",
    description:
      "AI product management explained: how coding agents take on product ops — feedback triage, roadmaps, changelogs, docs, and support — and what stays human.",
    excerpt:
      "Coding agents stopped being autocomplete a while ago. Here's what changes when the agent that ships your feature also triages the feedback, updates the roadmap, and writes the changelog.",
    body: `
      <p>For most of the last decade, "AI in product management" meant a summarize button. You'd get a digest of your feedback, a draft of a PRD, maybe a sentiment score. Useful, but cosmetic — a human still did every actual operation.</p>
      <p>That's not the interesting version anymore. The interesting version is that the same coding agents that now write and ship production code — Claude Code, Codex, Cursor — can also <em>operate</em> the product layer around that code. Not summarize it. Operate it.</p>

      <h2>The definition that actually holds up</h2>
      <p>AI product management is the practice of delegating product <strong>operations</strong> to AI agents while keeping product <strong>judgment</strong> with humans. The split matters:</p>
      <ul>
        <li><strong>Operations</strong> — triaging feedback, merging duplicates, moving roadmap items, publishing changelogs, drafting help articles, answering known support questions, pulling usage numbers. High volume, well-defined, verifiable.</li>
        <li><strong>Judgment</strong> — deciding what to build, how to position it, when to say no, which customer to disappoint. Low volume, ambiguous, strategic.</li>
      </ul>
      <p>Every failed "AI PM" tool tried to automate judgment. Every workflow that actually sticks automates operations. The good news: operations is where product managers lose most of their week.</p>

      <h2>Why coding agents, specifically</h2>
      <p>A dedicated "AI PM assistant" app has a context problem: it doesn't know what you just shipped. Your coding agent does — it wrote the diff. That makes it uniquely positioned to do the product ops that <em>follow</em> from shipping:</p>
      <ul>
        <li>It knows exactly what changed, so its changelog entry is accurate, not vibes.</li>
        <li>It knows which feedback items the change resolves, so it can close the loop with the users who asked.</li>
        <li>It implemented the feature, so it's the best-placed author for the help article.</li>
      </ul>
      <p>The missing piece was a connection between the agent and your product stack. That's what agent skills and MCP servers provide: a map of your product platform's API that the agent can call directly. The <a href="https://github.com/userorbit/skill">Userorbit skill</a> is one example — it teaches any coding agent 150+ endpoints across <a href="../feedback.html">feedback</a>, <a href="../roadmap.html">roadmaps</a>, <a href="../announcements.html">announcements</a>, <a href="../help-center.html">help center</a>, <a href="../support.html">support</a>, and <a href="../analytics.html">analytics</a>.</p>

      <h2>What an agentic product workflow looks like</h2>
      <p>Concretely, here's a post-deploy sequence a coding agent can run today from one prompt:</p>
      <ol>
        <li><strong>Close the loop.</strong> Find the feedback items the shipped change resolves, mark them completed, and reply to voters. The public roadmap updates itself, because roadmap columns are views over feedback status.</li>
        <li><strong>Announce it.</strong> Draft a changelog entry from the actual diff, drop it in the right category, publish — or schedule it for launch morning.</li>
        <li><strong>Document it.</strong> Write the help article, in the right collection, as a draft for review.</li>
        <li><strong>Measure it.</strong> A week later: "how is adoption of the export feature?" — and the agent queries product analytics for the real numbers.</li>
      </ol>
      <p>None of these steps involve opening a browser tab. All of them used to be the boring half of a PM's job.</p>

      <h2>What stays human</h2>
      <p>Three things, and they're non-negotiable:</p>
      <ul>
        <li><strong>Prioritization.</strong> An agent can rank feedback by votes and trends; it can't know that your biggest prospect churns without SSO. Weighting signals is judgment.</li>
        <li><strong>Voice decisions.</strong> Agents draft well, but whether an announcement is playful or sober, apologetic or proud — that's positioning.</li>
        <li><strong>The irreversible calls.</strong> Deprecations, pricing changes, public commitments. Draft with the agent; decide without it.</li>
      </ul>
      <p>A practical guardrail: let agents <em>write</em> freely and <em>publish</em> narrowly. Drafts everywhere, publishes only where the blast radius is small or the human has reviewed.</p>

      <h2>How to start</h2>
      <p>Don't start with strategy decks. Start with one workflow you already resent:</p>
      <ol>
        <li>Pick the loop you always skip — for most teams it's closing feedback after shipping, or writing the changelog.</li>
        <li>Give your agent access to your product platform (via a skill or MCP server).</li>
        <li>Run it manually a few times with review, then fold it into your definition of done: a feature isn't shipped until the feedback is closed, the changelog is out, and the doc draft exists.</li>
      </ol>
      <p>If you're on Userorbit, that's a five-minute setup: install the <a href="https://github.com/userorbit/skill">skill</a>, export an API key, and try "we just shipped X — close the loop." If you're not, <a href="https://userorbit.com">Userorbit</a> gives you the feedback boards, roadmap, changelog, help center, and support inbox for agents to operate on — in one platform instead of five.</p>
    `,
  },
  {
    slug: "close-the-feedback-loop-with-ai-agents",
    title: "Close the Feedback Loop Automatically with a Coding Agent",
    nav: "Close the Loop",
    date: "2026-07-17",
    dateLabel: "Jul 17, 2026",
    description:
      "A step-by-step workflow for letting your AI coding agent mark feedback completed, update the public roadmap, and publish the changelog the moment a feature ships.",
    excerpt:
      "Users who ask for a feature and never hear back stop asking. Here's the one-prompt workflow that makes closing the loop part of every deploy.",
    body: `
      <p>Every product team has the same dirty secret: a feedback board full of items that were actually shipped months ago, still sitting in "planned." The work got done; the loop never got closed. Users who voted never heard about it, the roadmap looks stale, and the next person who searches finds an "open" request for a feature that exists.</p>
      <p>The reason isn't laziness. Closing the loop is a five-tab chore that happens at the worst possible moment — right after shipping, when you've already moved on. Which makes it a perfect job for the agent that just did the shipping.</p>

      <h2>The workflow</h2>
      <p>With the <a href="https://github.com/userorbit/skill">Userorbit skill</a> installed, this is one prompt after a deploy:</p>
      <div class="prompt-block">"We just shipped dark mode. Find the related feedback, mark it completed, reply to the voters, and publish a changelog entry."</div>
      <p>Under the hood, the agent chains four API calls:</p>
      <ol>
        <li><code>feedbacks.list</code> with a search for "dark mode" — finds the matching items and their vote counts.</li>
        <li><code>feedbacks.update</code> — flips each to <code>completed</code>. Because <a href="../roadmap.html">roadmap columns</a> are live filters over feedback status, the public roadmap moves the items to Shipped on its own. No separate roadmap edit.</li>
        <li><code>feedback-comments.create</code> — a reply on each item telling voters it's live and how to use it.</li>
        <li><code>announcements.create</code> with <code>publish: true</code> — the changelog entry, written from the actual diff the agent just worked on, so it describes what really shipped.</li>
      </ol>
      <p>Total elapsed time: under a minute, while the deploy pipeline is still running.</p>

      <h2>Why this compounds</h2>
      <p>Closing the loop isn't hygiene — it's a growth loop:</p>
      <ul>
        <li><strong>Voters become announcers.</strong> The people who asked for a feature are the most likely to try it, talk about it, and vote on the next thing. Telling them is free activation.</li>
        <li><strong>A live roadmap earns trust.</strong> Prospects read public roadmaps as a proxy for velocity. A board where things visibly move from Planned to Shipped is better marketing than the marketing site.</li>
        <li><strong>Feedback quality rises.</strong> When users see requests get answered, they file better requests. When they see a graveyard, they stop filing at all.</li>
      </ul>

      <h2>Make it part of the definition of done</h2>
      <p>The trick to making this stick is not doing it as a favor — it's making it a step in shipping, the same way tests are. Two ways teams wire it in:</p>
      <ul>
        <li><strong>Prompt convention:</strong> end feature branches with the close-the-loop prompt. The agent has the diff in context, so accuracy is high.</li>
        <li><strong>Checklist in the PR template:</strong> "Feedback closed / changelog published / doc drafted" — each one a single agent prompt, so there's no excuse to skip.</li>
      </ul>
      <p>For bigger launches, add scheduling: <code>announcements.create</code> accepts <code>scheduledAt</code>, so the agent can queue the announcement for launch morning while the code ships Friday night. And when the announcement should reach inboxes, publishing with an email broadcast is one flag.</p>

      <h2>Setting it up</h2>
      <p>You need a <a href="https://userorbit.com">Userorbit</a> workspace with a <a href="https://userorbit.com/feedback-boards">feedback board</a>, an API key from Settings → API, and the skill:</p>
      <div class="prompt-block">claude install-skill https://github.com/userorbit/skill</div>
      <p>Then export <code>USERORBIT_API_KEY</code> and <code>USERORBIT_TEAM_ID</code>, and try it on the last thing you shipped — odds are there's feedback for it sitting open right now. The full endpoint reference is in the <a href="../feedback.html">feedback guide</a> and <a href="../announcements.html">announcements guide</a>.</p>
    `,
  },
  {
    slug: "ai-customer-support-triage",
    title: "AI Support Triage: An Agent Working Your Inbox, Not Replacing It",
    nav: "AI Support Triage",
    date: "2026-07-14",
    dateLabel: "Jul 14, 2026",
    description:
      "How to use an AI coding agent to triage a customer support inbox: queues, drafted replies, private notes, side discussions, and workflow automation — with humans on the sends that matter.",
    excerpt:
      "The best AI support setup isn't a chatbot deflecting tickets. It's an agent that reads the whole queue, drafts the easy replies, and briefs you on the hard ones.",
    body: `
      <p>Most "AI support" is a chatbot standing between users and help, deflecting tickets and hoping. There's a quieter setup that works better: keep the inbox, keep the humans, and put an agent to work <em>inside</em> the queue — reading everything, drafting the routine replies, and packaging context for the ones that need a person.</p>
      <p>This is triage, and it's the highest-leverage thing to automate in support, because it's where the time actually goes: figuring out what each thread is, who should handle it, and what the answer probably is.</p>

      <h2>The morning sweep</h2>
      <p>With the <a href="https://github.com/userorbit/skill">Userorbit skill</a>, an agent can work the <a href="https://userorbit.com/customer-support">support inbox</a> the way a good support lead does. A single morning prompt:</p>
      <div class="prompt-block">"Go through the support todo queue. Reply to anything covered by our docs, label and prioritize the rest, and give me a summary with your suggested replies for the tricky ones."</div>
      <p>The agent pulls the queue with <code>support-threads.list</code>, reads each timeline and its customer context via <code>support-threads.info</code>, and then splits the work:</p>
      <ul>
        <li><strong>Known answers</strong> — questions covered by the help center get a reply (<code>support-messages.create</code>) and a status flip to done. Because the agent can search your <a href="../help-center.html">articles</a>, its replies cite real docs instead of hallucinating steps.</li>
        <li><strong>Bugs</strong> — get a label, a priority, and a private note summarizing the repro. Since the agent also has your codebase, it can often attach a first diagnosis — "this matches the pagination change in last week's release" — before an engineer ever looks.</li>
        <li><strong>Judgment calls</strong> — refunds, angry customers, ambiguous requests — get drafted replies left as private notes for a human to review, edit, and send.</li>
      </ul>

      <h2>The escalation path matters most</h2>
      <p>Where agent triage usually falls down is the handoff. Two features make it clean:</p>
      <ul>
        <li><strong>Private notes vs public replies.</strong> Everything risky stays internal by default. The agent's rule of thumb: it may <em>send</em> what documentation supports, it must <em>draft</em> everything else. Notes are how it shows its work.</li>
        <li><strong>Side discussions.</strong> When a thread needs engineering, the agent opens a Slack or email side discussion from inside the thread — the crash report goes to #engineering with full context, and the answer comes back attached to the ticket instead of lost in a channel.</li>
      </ul>

      <h2>Graduating to workflows</h2>
      <p>After a few weeks of prompted triage, patterns emerge — and patterns are what <a href="../workflows.html">workflows</a> are for. The rules the agent kept applying by hand ("anything mentioning invoice → Billing label, billing queue") become trigger-driven automations that run on every new thread, no prompt needed. The agent can build these too: describe the rule, and it creates, publishes, and test-runs the workflow.</p>
      <p>The division of labor settles into three tiers: workflows handle the mechanical routing, the agent handles reading and drafting, humans handle the sends that carry risk or relationship. Support volume grows; headcount doesn't have to.</p>

      <h2>What to measure</h2>
      <p>Three numbers tell you whether it's working: first-response time on the todo queue, the share of threads resolved with a docs-backed reply, and how often humans edit the agent's drafts before sending. The first two should fall and rise fast. The third is your quality dial — when edits get rare, widen what the agent may send on its own.</p>
      <p>The setup is the same as every other agent workflow: a <a href="https://userorbit.com">Userorbit</a> workspace, an API key, and the <a href="https://github.com/userorbit/skill">skill</a>. The full endpoint surface — queues, messages, labels, assignees, snoozing, merging, snippets — is in the <a href="../support.html">support inbox guide</a>.</p>
    `,
  },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;

const css = `
:root{
  --bg:#16171d;--bg-soft:#1c1d24;--ink:#ffffff;--text:#b4b4bd;--muted:#98989f;--faint:#6a6a71;
  --line:#2e2e32;--line-strong:#43434b;
  --brand:#b39aff;--brand-bright:#c9b8ff;--violet:#7c4dff;
  --dark:#101014;--dark-2:#1a1b22;--dark-line:#2e2e32;
  --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --display:"Space Grotesk",var(--sans);
  --mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
  --radius:14px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;color-scheme:dark}
body{background:var(--bg);color:var(--text);font:16px/1.7 var(--sans);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
a{color:var(--brand);text-decoration:none}
a:hover{text-decoration:underline;text-underline-offset:3px}
::selection{background:rgba(124,77,255,.45);color:#fff}
.wrap{max-width:1060px;margin:0 auto;padding:0 24px}
.narrow{max-width:760px;margin:0 auto;padding:0 24px}

h1,h2,h3,h4{font-family:var(--display);color:var(--ink);font-weight:500}
h1{font-size:clamp(34px,5.4vw,56px);line-height:1.05;letter-spacing:-.04em}
h2{font-size:clamp(24px,3vw,32px);letter-spacing:-.03em;line-height:1.2}
h3{font-size:19px;letter-spacing:-.01em}
.hl{color:var(--brand)}

.eyebrow{font-family:var(--mono);font-size:12px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.eyebrow a{color:inherit}
.eyebrow .sep{color:var(--line-strong);margin:0 6px}

header.site{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 86%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;gap:26px;height:60px}
.logo{font-family:var(--display);font-weight:700;font-size:16px;letter-spacing:.02em;color:var(--ink);margin-right:auto;white-space:nowrap}
.logo:hover{text-decoration:none}
.logo .mark{font-family:var(--mono);font-weight:500;color:var(--brand)}
.nav a.item{color:var(--muted);font-size:14.5px;font-weight:500}
.nav a.item:hover{color:var(--ink);text-decoration:none}
.nav a.cta{background:#fff;color:#16171d;font-family:var(--display);font-weight:500;font-size:14px;padding:8px 16px;border-radius:9px}
.nav a.cta:hover{text-decoration:none;box-shadow:0 0 0 3px rgba(179,154,255,.35)}
@media(max-width:640px){.nav a.item{display:none}}

.btn{display:inline-flex;align-items:center;gap:8px;font-family:var(--display);font-weight:500;font-size:15.5px;padding:11px 22px;border-radius:10px}
.btn:hover{text-decoration:none}
.btn-primary{border:3px solid transparent;border-radius:12px;color:#fff;background:linear-gradient(var(--dark),var(--dark)) padding-box,linear-gradient(115deg,#9d7bff,#5b2ee0 40%,#c9b8ff 72%,#7c4dff) border-box;box-shadow:0 0 26px -6px rgba(124,77,255,.65)}
.btn-primary:hover{box-shadow:0 0 34px -4px rgba(124,77,255,.9)}
.btn-secondary{background:transparent;color:var(--ink);border:1px solid var(--line-strong)}
.btn-secondary:hover{border-color:#8e8e98}
.btn-light{background:#fff;color:#16171d;box-shadow:0 10px 24px -10px rgba(0,0,0,.4)}

.hero .wrap{max-width:1280px}
.hero-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);align-items:center;padding:64px 0 76px}
.hero-copy{padding-right:56px}
.hero .by{margin-bottom:22px}
.hero .by a{color:var(--ink)}
.hero h1{margin:0 0 22px;font-size:clamp(34px,4.6vw,60px)}
.hero .sub{font-size:17.5px;color:var(--muted);max-width:520px;margin:0 0 10px}
.hero .fine{font-size:14px;color:var(--faint);margin-bottom:36px}
.hero .actions{display:flex;gap:14px;flex-wrap:wrap}
.hero-side{border-left:1px solid var(--line);padding:28px 0 28px 56px;background:radial-gradient(closest-side at 55% 50%,rgba(124,77,255,.16),transparent)}
@media(max-width:900px){.hero-grid{grid-template-columns:minmax(0,1fr);gap:44px;padding:56px 0 64px}.hero-copy{padding-right:0}.hero-side{border-left:0;padding:0}}

.prism{position:relative;isolation:isolate;overflow:hidden;background:
  repeating-linear-gradient(93deg,rgba(255,255,255,.14) 0 1px,transparent 1px 46px),
  repeating-linear-gradient(87deg,rgba(255,255,255,.08) 0 1px,transparent 1px 17px),
  radial-gradient(130% 170% at 50% -30%,#cdbcff 0%,#8b5cff 34%,#5b2ee0 62%,#2a1266 100%)}
.prism::after{content:"";position:absolute;inset:0;z-index:-1;background-image:${GRAIN};mix-blend-mode:overlay;opacity:.9;pointer-events:none}
.prism.teal{background:
  repeating-linear-gradient(93deg,rgba(255,255,255,.14) 0 1px,transparent 1px 46px),
  repeating-linear-gradient(87deg,rgba(255,255,255,.08) 0 1px,transparent 1px 17px),
  radial-gradient(130% 170% at 50% -30%,#a8f0e4 0%,#14b8a6 40%,#0b7a6e 66%,#053832 100%)}
.band{padding:72px 0}

.term{background:var(--dark);border:1px solid var(--line);border-radius:var(--radius);box-shadow:0 0 70px -22px rgba(124,77,255,.35);padding:24px 26px;overflow-x:auto;text-align:left}
.term pre{font-family:var(--mono);font-size:13.5px;line-height:1.85;color:#c9c9d4;margin:0}
.term .cmd{color:#fff;font-weight:500}
.term .c-dim{color:#7c7c8a}
.term .c-key{color:var(--brand)}
.term .c-ok{color:#3dd68c}
.term .c-str{color:#8ad0ff}
.term-label{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#787885;margin-bottom:14px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}

.hero-term{max-width:760px;margin:0 auto}
.hero-term pre{font-size:12.5px}
.hero-term .panels{min-height:212px}
.term-tabs{display:flex;flex-wrap:wrap;gap:2px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:4px;width:max-content;max-width:100%;margin:22px auto 2px;font-family:var(--mono);font-size:12.5px}
.term-tabs button{appearance:none;border:0;background:transparent;color:#9a9aa8;padding:7px 13px;border-radius:9px;cursor:pointer;font:inherit;white-space:nowrap}
.term-tabs button:hover{color:#e8e8f0}
.term-tabs button.active{background:#fff;color:var(--dark);font-weight:600}
.tab-panel{display:none}
.tab-panel.active{display:block}

.bene-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;margin-top:40px}
.bene{background:var(--dark-2);border:1px solid var(--line);border-radius:var(--radius);padding:26px;display:flex;flex-direction:column}
.bene h3{margin-bottom:8px}
.bene p{font-size:14.5px;color:var(--muted);line-height:1.6;margin-bottom:18px}
.bene .try{margin-top:auto;font-family:var(--mono);font-size:12.5px;color:#e8e8f0;background:var(--dark);border:1px solid var(--line);border-radius:10px;padding:10px 14px}
.bene .try::before{content:"\\203A ";color:var(--brand);font-weight:700}

section.block{padding:84px 0;border-top:1px solid var(--line)}
.split{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:56px;align-items:start}
@media(max-width:820px){.split{grid-template-columns:1fr}}
.block .eyebrow{margin-bottom:14px}
.block h2{margin-bottom:14px}
.block p.lead{color:var(--muted);font-size:16.5px}

.install-card{background:var(--dark);border:1px solid var(--dark-line);border-radius:var(--radius);padding:18px 20px;margin-bottom:14px;display:flex;flex-direction:column;gap:8px}
.install-card .k{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#787885}
.install-card code{font-family:var(--mono);font-size:13px;color:#e8e8f0;word-break:break-all}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin-top:40px}
.card{position:relative;background:var(--dark-2);border:1px solid var(--line);border-radius:var(--radius);padding:22px;display:block;color:var(--text);transition:border-color .15s,transform .15s,box-shadow .15s}
.card:hover{border-color:rgba(179,154,255,.55);text-decoration:none;transform:translateY(-2px);box-shadow:0 12px 32px -18px rgba(124,77,255,.35)}
.card .num{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--faint);display:block;margin-bottom:12px}
.card h3{margin-bottom:6px;font-size:16.5px}
.card p{font-size:14px;color:var(--muted);line-height:1.55}

.dark-block{background:var(--dark);color:#b9b9c4;padding:92px 0}
.dark-block h2{color:#fff}
.dark-block .eyebrow{color:#8a8a98}
.dark-block p.lead{color:#9a9aa8}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0;margin-top:48px;border-left:1px solid var(--dark-line)}
.stats .stat{padding:6px 28px;border-right:1px solid var(--dark-line)}
.stats .n{font-family:var(--display);font-weight:500;font-size:40px;letter-spacing:-.03em;color:#fff;display:block}
.stats .l{font-size:14px;color:#8a8a98}
.checks{list-style:none;margin-top:28px}
.checks li{padding:9px 0 9px 32px;position:relative;font-size:15.5px;color:#d3d3dc}
.checks li::before{content:"";position:absolute;left:0;top:14px;width:18px;height:18px;border-radius:6px;background:var(--violet);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 13l4 4 10-11'/%3E%3C/svg%3E");background-size:11px;background-position:center;background-repeat:no-repeat}

.note{border:1px solid var(--line);border-left:3px solid var(--brand);border-radius:0 var(--radius) var(--radius) 0;background:var(--bg-soft);padding:18px 22px;margin:28px 0;font-size:15px}
.note p{margin:0;color:var(--text)}
.note p+p{margin-top:8px}

.prompts{list-style:none;margin:24px 0}
.prompts li{border:1px solid var(--line);border-radius:12px;padding:14px 18px 14px 44px;margin-bottom:10px;font-size:15px;color:#e8e8f0;position:relative;background:var(--dark-2)}
.prompts li::before{content:"\\203A";font-family:var(--mono);font-weight:700;color:var(--brand);position:absolute;left:18px;top:12px;font-size:17px}

article.doc{padding:72px 0 88px}
article.doc>.narrow>p{margin-bottom:16px}
article.doc .tagline{font-size:19px;color:var(--muted);margin:18px 0 34px;line-height:1.55}
article.doc h1{font-size:clamp(30px,4.4vw,44px)}
article.doc h2{margin:56px 0 16px}
article.doc h3{margin:28px 0 10px}
article.doc ul,article.doc ol{margin:0 0 16px 22px}
article.doc li{margin-bottom:8px}
code{font-family:var(--mono);font-size:.88em;background:#232432;border:1px solid #35363f;border-radius:6px;padding:1.5px 6px;color:#d9d0ff}
.term code{background:none;border:none;padding:0;color:inherit;font-size:inherit}
.install-card code{background:none;border:none;padding:0}
pre.plain{background:var(--dark);border-radius:var(--radius);border:1px solid var(--dark-line);padding:18px 20px;overflow-x:auto;margin:16px 0}
pre.plain code{background:none;border:none;padding:0;font-size:13px;line-height:1.7;color:#e8e8f0}

table{width:100%;border-collapse:collapse;margin:20px 0;font-size:14.5px}
th,td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-family:var(--mono);color:var(--faint);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.12em}
td:first-child{width:40%}
td code{font-size:13px}
.table-scroll{overflow-x:auto}

.pagenav{display:flex;justify-content:space-between;gap:16px;margin-top:64px;padding-top:28px;border-top:1px solid var(--line);font-family:var(--display);font-weight:500;font-size:15px}

.post-list{margin-top:44px;border-top:1px solid var(--line)}
.post-item{display:block;padding:30px 0;border-bottom:1px solid var(--line);color:var(--text)}
.post-item:hover{text-decoration:none}
.post-item:hover h3{color:var(--brand)}
.post-item .meta{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-bottom:10px;display:block}
.post-item h3{font-size:22px;letter-spacing:-.02em;margin-bottom:8px;transition:color .15s}
.post-item p{color:var(--muted);font-size:15.5px;max-width:640px}
.post-item .more{display:inline-block;margin-top:12px;font-family:var(--display);font-weight:500;font-size:14.5px;color:var(--brand)}

article.post{padding:72px 0 88px}
article.post .meta{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-bottom:18px}
article.post h1{font-size:clamp(30px,4.4vw,44px);margin-bottom:18px}
article.post .lede{font-size:19px;color:var(--muted);line-height:1.6;margin-bottom:40px}
article.post h2{margin:52px 0 16px}
article.post p{margin-bottom:18px}
article.post ul,article.post ol{margin:0 0 18px 22px}
article.post li{margin-bottom:10px}
article.post strong{color:var(--ink)}
.prompt-block{font-family:var(--mono);font-size:13.5px;line-height:1.7;color:#e8e8f0;background:var(--dark);border:1px solid var(--dark-line);border-radius:12px;padding:16px 20px;margin:24px 0}
.post-cta{margin-top:56px;border-radius:var(--radius);padding:36px 32px;color:#fff}
.post-cta h3{color:#fff;font-size:22px;margin-bottom:8px}
.post-cta p{color:rgba(255,255,255,.85);margin-bottom:20px;font-size:15.5px}
.post-cta .btn-light{color:#16171d}

.cta-band{text-align:center;padding:104px 0;color:#fff}
.cta-band h2{color:#fff;font-size:clamp(28px,4.2vw,40px)}
.cta-band p{color:rgba(255,255,255,.88);max-width:520px;margin:14px auto 32px;font-size:16.5px}

footer.site{border-top:1px solid var(--line);padding:52px 0 56px;color:var(--muted);font-size:14px}
footer.site .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:36px;margin-bottom:36px}
footer.site h4{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--faint);margin-bottom:14px;font-weight:500}
footer.site ul{list-style:none}
footer.site li{margin-bottom:9px}
footer.site a{color:#cfcfd6}
footer.site a:hover{color:#fff}
footer.site .base{border-top:1px solid var(--line);padding-top:24px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;color:var(--faint)}
`;

function page({ title, description, path, root, body, extraHead = "" }) {
  const canonical = `${SITE}/${path}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2242%22 fill=%22%237c4dff%22/><circle cx=%2250%22 cy=%2250%22 r=%2217%22 fill=%22white%22/></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}styles.css">
${extraHead}</head>
<body>
<header class="site">
  <div class="wrap nav">
    <a class="logo" href="${root}index.html">USERORBIT<span class="mark">+( skill )</span></a>
    <a class="item" href="${root}index.html#features">Features</a>
    <a class="item" href="${root}index.html#setup">Setup</a>
    <a class="item" href="${root}blog/index.html">Blog</a>
    <a class="item" href="https://github.com/userorbit/skill">GitHub</a>
    <a class="cta" href="https://userorbit.com">userorbit.com</a>
  </div>
</header>
${body}
<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div>
        <h4>Userorbit</h4>
        <ul>
          <li><a href="https://userorbit.com">Home</a></li>
          <li><a href="https://userorbit.com/features">Features</a></li>
          <li><a href="https://userorbit.com/pricing">Pricing</a></li>
          <li><a href="https://userorbit.com/blog">Blog</a></li>
        </ul>
      </div>
      <div>
        <h4>Product</h4>
        <ul>
          <li><a href="https://userorbit.com/feedback-boards">Feedback boards</a></li>
          <li><a href="https://userorbit.com/product-roadmap">Product roadmap</a></li>
          <li><a href="https://userorbit.com/product-tours">Product tours</a></li>
          <li><a href="https://userorbit.com/interactive-product-demos">Interactive demos</a></li>
          <li><a href="https://userorbit.com/customer-support">Customer support</a></li>
        </ul>
      </div>
      <div>
        <h4>Skill guides</h4>
        <ul>
          <li><a href="https://github.com/userorbit/skill">Source on GitHub</a></li>
          ${features.map((f) => `<li><a href="${root}${f.slug}.html">${f.nav}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div>
        <h4>From the blog</h4>
        <ul>
          ${posts.map((p) => `<li><a href="${root}blog/${p.slug}.html">${p.nav}</a></li>`).join("\n          ")}
          <li><a href="${root}blog/index.html">All posts</a></li>
        </ul>
      </div>
    </div>
    <div class="base">
      <span>Userorbit Skill — manage <a href="https://userorbit.com">Userorbit</a> from any AI coding agent.</span>
      <span>MIT licensed</span>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

const esc = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

function featurePage(f, i) {
  const prev = features[(i - 1 + features.length) % features.length];
  const next = features[(i + 1) % features.length];
  const body = `
<article class="doc">
  <div class="narrow">
    <p class="eyebrow"><a href="index.html">Userorbit Skill</a><span class="sep">/</span>${f.nav}</p>
    <h1>${f.title}</h1>
    <p class="tagline">${f.tagline}</p>
    ${f.intro.map((p) => `<p>${p}</p>`).join("\n    ")}
    <div class="note"><p>This guide covers the agent skill and API. For the full product, see <a href="${f.product.url}">${f.product.name}</a>.</p></div>

    <h2>Ask your agent</h2>
    <ul class="prompts">
      ${f.prompts.map((p) => `<li>${p}</li>`).join("\n      ")}
    </ul>

    <h2>Endpoints</h2>
    <p>All endpoints are <code>POST https://api.userorbit.com/api/v1/&lt;endpoint&gt;</code> with a Bearer API key and <code>x-team-id</code> header.</p>
    <div class="table-scroll">
    <table>
      <thead><tr><th>Endpoint</th><th>What it does</th></tr></thead>
      <tbody>
        ${f.endpoints.map(([e, d]) => `<tr><td><code>${e}</code></td><td>${d}</td></tr>`).join("\n        ")}
      </tbody>
    </table>
    </div>

    <h2>Example</h2>
    <div class="term">
      <div class="term-label"><span>Example</span><span>${f.slug}</span></div>
      <pre><code>${esc(f.example)}</code></pre>
    </div>
    <p style="margin-top:16px;color:var(--muted)">Full request and response schemas: <a href="https://github.com/userorbit/skill/blob/main/userorbit/references/api.md">references/api.md</a>.</p>

    <div class="pagenav">
      <a href="${prev.slug}.html">&larr; ${prev.title}</a>
      <a href="${next.slug}.html">${next.title} &rarr;</a>
    </div>
  </div>
</article>`;
  return page({
    title: `${f.title} — Userorbit Skill`,
    description: `${f.tagline} How to manage ${f.nav.toLowerCase()} in Userorbit with an AI coding agent via the API and MCP.`,
    body,
    root: "",
    path: `${f.slug}.html`,
  });
}

const clients = [
  {
    id: "claude",
    label: "Claude Code",
    panel: `<span class="cmd">$ claude install-skill https://github.com/userorbit/skill</span>
<span class="c-ok">&#10003;</span> <span class="c-dim">userorbit skill installed</span>

<span class="cmd">$ claude "we shipped dark mode — close the loop"</span>
<span class="c-ok">&#10003;</span> <span class="c-key">feedbacks.update</span>       <span class="c-dim">23 items &rarr;</span> <span class="c-str">completed</span><span class="c-dim">, voters replied</span>
<span class="c-ok">&#10003;</span> <span class="c-key">announcements.create</span>   <span class="c-str">"Dark mode is here"</span> <span class="c-dim">— published</span>
<span class="c-ok">&#10003;</span> <span class="c-key">articles.create</span>        <span class="c-dim">draft:</span> <span class="c-str">"Using dark mode"</span>

<span class="c-dim">Changelog live. Roadmap moved itself. 23 people heard back.</span>`,
  },
  {
    id: "codex",
    label: "Codex",
    panel: `<span class="cmd">$ git clone https://github.com/userorbit/skill.git ~/.codex/skills/userorbit</span>
<span class="c-ok">&#10003;</span> <span class="c-dim">skill picked up on the next run</span>

<span class="cmd">$ codex "what should we build next?"</span>
<span class="c-ok">&#10003;</span> <span class="c-key">feedbacks.list</span>  <span class="c-dim">sortBy:</span> <span class="c-str">top</span>
<span class="c-dim">  1.</span> SSO for Google Workspace   <span class="c-str">184 votes</span> <span class="c-dim">· trending</span>
<span class="c-dim">  2.</span> CSV export                  <span class="c-str">97 votes</span>
<span class="c-dim">  3.</span> Slack notifications         <span class="c-str">66 votes</span>`,
  },
  {
    id: "cursor",
    label: "Cursor",
    panel: `<span class="cmd">$ git clone https://github.com/userorbit/skill.git /tmp/uo-skill</span>
<span class="cmd">$ cp /tmp/uo-skill/userorbit/SKILL.md .cursor/rules/userorbit.md</span>

<span class="c-dim">In Cursor:</span> <span class="cmd">"publish the checkout demo, then turn it into a help article"</span>
<span class="c-ok">&#10003;</span> <span class="c-key">demos.publish</span>         <span class="c-str">"Checkout flow"</span> <span class="c-dim">— live</span>
<span class="c-ok">&#10003;</span> <span class="c-key">demo-articles.create</span>  <span class="c-dim">how-to guide drafted from the demo's steps</span>`,
  },
  {
    id: "opencode",
    label: "OpenCode",
    panel: `<span class="cmd">$ git clone https://github.com/userorbit/skill.git /tmp/uo-skill</span>
<span class="cmd">$ cp -r /tmp/uo-skill/userorbit ~/.config/opencode/skills/userorbit</span>

<span class="cmd">$ opencode "triage the support todo queue"</span>
<span class="c-ok">&#10003;</span> <span class="c-key">support-threads.list</span>  <span class="c-dim">14 open threads read</span>
<span class="c-ok">&#10003;</span> <span class="c-dim">6 answered from the help center · 5 labeled &amp; prioritized</span>
<span class="c-ok">&#10003;</span> <span class="c-dim">3 tricky ones: reply drafts left as private notes</span>`,
  },
  {
    id: "mcp",
    label: "Hosted MCP",
    panel: `<span class="cmd">$ claude mcp add --transport http userorbit https://api.userorbit.com/mcp</span>
<span class="c-ok">&#10003;</span> <span class="c-dim">connected via OAuth — no API key to manage</span>

<span class="cmd">$ claude "how's the launch doing?"</span>
<span class="c-ok">&#10003;</span> <span class="c-key">analytics.query</span>  <span class="c-dim">metric:</span> <span class="c-str">activeUsers</span> <span class="c-dim">interval:</span> <span class="c-str">week</span>
<span class="c-dim">  &#9602; &#9603; &#9605; &#9606; &#9608;</span>   <span class="c-str">+38%</span> <span class="c-dim">since launch week</span>`,
  },
];

const heroTerm = `<div class="term hero-term">
  <div class="term-label"><span>Agent session</span><span>userorbit skill</span></div>
  <div class="panels">
    ${clients.map((c, i) => `<div class="tab-panel${i === 0 ? " active" : ""}" data-tab="${c.id}"><pre><code>${c.panel}</code></pre></div>`).join("\n    ")}
  </div>
  <div class="term-tabs" role="tablist">
    ${clients.map((c, i) => `<button type="button"${i === 0 ? ' class="active"' : ""} data-tab="${c.id}">${c.label}</button>`).join("\n    ")}
  </div>
</div>`;

const indexBody = `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow by">by <a href="https://userorbit.com">Userorbit</a></p>
      <h1>Ship the Feature.<br><span class="hl">Everything Else Is One Prompt.</span></h1>
      <p class="sub">The open-source skill that turns Claude Code, Codex, Cursor — any coding agent — into your product ops team on <a href="https://userorbit.com">Userorbit</a>. Changelog published, roadmap updated, feedback answered, docs drafted — before the deploy finishes.</p>
      <p class="fine">Free &amp; open source · works with any agent that reads SKILL.md</p>
      <div class="actions">
        <a class="btn btn-primary" href="https://github.com/userorbit/skill">Get the skill</a>
        <a class="btn btn-secondary" href="#features">Explore the guides</a>
      </div>
    </div>
    <div class="hero-side">${heroTerm}</div>
  </div>
</section>

<section class="block" id="benefits">
  <div class="wrap">
    <p class="eyebrow">What changes</p>
    <h2>Product ops you never do by hand again</h2>
    <p class="lead" style="max-width:640px;margin-top:12px;color:var(--muted)">Your agent already knows what shipped — it wrote the diff. Give it the skill, and the follow-through stops being your job.</p>
    <div class="bene-grid">
      <div class="bene">
        <h3>The changelog writes itself</h3>
        <p>The announcement is drafted from the actual diff — accurate, categorized, published now or scheduled for launch morning. Users find out the day it ships, not whenever someone remembers.</p>
        <span class="try">publish a changelog for what we just merged</span>
      </div>
      <div class="bene">
        <h3>Feedback answered the day it ships</h3>
        <p>The people who asked get a reply, items flip to completed, and the public roadmap moves itself — columns are live views over feedback status. No stale board, no ghosted voters.</p>
        <span class="try">mark the dark mode feedback completed and reply to voters</span>
      </div>
      <div class="bene">
        <h3>Docs by the agent that built it</h3>
        <p>The best-placed author for a feature's help article is the agent that implemented it. It drafts in the right category, with revisions tracked, ready for your review.</p>
        <span class="try">draft a help article for the new export feature</span>
      </div>
      <div class="bene">
        <h3>Support triaged before standup</h3>
        <p>The agent reads the whole queue with your docs and codebase in context — answers what's documented, labels and prioritizes the rest, and leaves reply drafts on the tricky ones.</p>
        <span class="try">work through the support todo queue</span>
      </div>
    </div>
  </div>
</section>

<section class="block" id="setup">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Getting started</p>
      <h2>Install once, prompt forever</h2>
      <p class="lead">Add the skill to your agent, export an API key from <strong>Settings &rarr; API</strong> in your Userorbit workspace, and every product chore becomes a one-line prompt.</p>
      <p class="lead" style="margin-top:14px">Read-only keys can call list/info/count/search endpoints; read/write keys can call everything. If your tool speaks MCP, there is also a hosted server at <code>api.userorbit.com/mcp</code>.</p>
    </div>
    <div>
      <div class="install-card">
        <span class="k">1 · Install</span>
        <code>claude install-skill https://github.com/userorbit/skill</code>
      </div>
      <div class="install-card">
        <span class="k">2 · Authenticate</span>
        <code>export USERORBIT_API_KEY="uo_..."<br>export USERORBIT_TEAM_ID="..."</code>
      </div>
      <div class="install-card">
        <span class="k">3 · Prompt</span>
        <code>"we shipped dark mode — close the loop"</code>
      </div>
      <div class="install-card">
        <span class="k">Prefer MCP? OAuth, no keys to manage</span>
        <code>claude mcp add --transport http userorbit https://api.userorbit.com/mcp</code>
      </div>
    </div>
  </div>
</section>

<section class="block" id="features">
  <div class="wrap">
    <p class="eyebrow">Feature guides</p>
    <h2>Everything your agent can run</h2>
    <div class="grid">
      ${features.map((f, i) => `<a class="card" href="${f.slug}.html"><span class="num">${String(i + 1).padStart(2, "0")}</span><h3>${f.title}</h3><p>${f.tagline}</p></a>`).join("\n      ")}
    </div>
  </div>
</section>

<div class="dark-block">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Why it works</p>
      <h2>The agent that ships the code closes the loop</h2>
      <p class="lead" style="margin-top:14px">A separate "AI PM tool" doesn't know what you just built. Your coding agent does — it wrote the diff. The skill hands it the map of your whole product platform, so it can finish the job it started.</p>
    </div>
    <div>
      <ul class="checks">
        <li>Changelog entries written from the actual diff</li>
        <li>Feedback closed and voters notified when the fix ships</li>
        <li>Roadmap moves itself — columns are live views over feedback status</li>
        <li>Help articles drafted by the agent that built the feature</li>
        <li>Support answered with your docs and codebase in context</li>
      </ul>
    </div>
  </div>
</div>

<section class="block">
  <div class="wrap">
    <p class="eyebrow">From the blog</p>
    <h2>AI product management, in practice</h2>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">
      ${posts.map((p) => `<a class="card" href="blog/${p.slug}.html"><span class="num">${p.dateLabel}</span><h3>${p.title}</h3><p>${p.excerpt}</p></a>`).join("\n      ")}
    </div>
    <div class="note" style="margin-top:40px"><p>New to Userorbit? It's a customer engagement platform for collecting <a href="https://userorbit.com/feedback-boards">feedback</a>, sharing a <a href="https://userorbit.com/product-roadmap">public roadmap</a>, publishing <a href="https://userorbit.com/announcements">announcements</a>, onboarding users with <a href="https://userorbit.com/product-tours">tours</a> and <a href="https://userorbit.com/checklists">checklists</a>, and running <a href="https://userorbit.com/customer-support">support</a> — with <a href="https://userorbit.com/product-analytics">product analytics</a> built in. <a href="https://userorbit.com/pricing">See pricing</a>.</p></div>
  </div>
</section>

<div class="prism cta-band">
  <div class="wrap">
    <h2>Start shipping with the skill</h2>
    <p>Install once. After that, every product chore that follows a merge is one prompt away.</p>
    <a class="btn btn-light" href="https://github.com/userorbit/skill">Get Started</a>
  </div>
</div>

<script>
document.querySelectorAll(".term-tabs button").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll(".term-tabs button").forEach((x) => x.classList.toggle("active", x === b));
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.dataset.tab === b.dataset.tab));
}));
</script>`;

function postPage(p) {
  const jsonLd = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    author: { "@type": "Organization", name: "Userorbit", url: "https://userorbit.com" },
    publisher: { "@type": "Organization", name: "Userorbit", url: "https://userorbit.com" },
    mainEntityOfPage: `${SITE}/blog/${p.slug}.html`,
  })}</script>\n`;
  const body = `
<article class="post">
  <div class="narrow">
    <p class="eyebrow"><a href="index.html">Blog</a><span class="sep">/</span>${p.dateLabel}</p>
    <h1>${p.title}</h1>
    <p class="lede">${p.excerpt}</p>
    ${p.body}
    <div class="post-cta prism">
      <h3>Give your agent a product platform</h3>
      <p>Userorbit is the feedback, roadmap, changelog, help center, and support inbox your coding agent can actually operate — via one open-source skill.</p>
      <a class="btn btn-light" href="https://userorbit.com">Try Userorbit free</a>
      <a class="btn btn-light" style="margin-left:10px" href="https://github.com/userorbit/skill">Install the skill</a>
    </div>
  </div>
</article>`;
  return page({
    title: `${p.title} — Userorbit Skill Blog`,
    description: p.description,
    body,
    root: "../",
    path: `blog/${p.slug}.html`,
    extraHead: jsonLd,
  });
}

const blogIndexBody = `
<article class="doc">
  <div class="narrow">
    <p class="eyebrow"><a href="../index.html">Userorbit Skill</a><span class="sep">/</span>Blog</p>
    <h1>Notes on <span class="hl">AI product management</span></h1>
    <p class="tagline">How teams use coding agents to run product operations — feedback loops, changelogs, docs, support, and the judgment calls that stay human.</p>
    <div class="post-list">
      ${posts.map((p) => `<a class="post-item" href="${p.slug}.html"><span class="meta">${p.dateLabel}</span><h3>${p.title}</h3><p>${p.excerpt}</p><span class="more">Read the post &rarr;</span></a>`).join("\n      ")}
    </div>
  </div>
</article>`;

writeFileSync(join(OUT, "styles.css"), css.trim() + "\n");
writeFileSync(
  join(OUT, "index.html"),
  page({
    title: "Userorbit Skill — manage Userorbit from any AI coding agent",
    description:
      "An agent skill that teaches Claude Code, Codex, and Cursor to manage Userorbit: feedback, roadmap, announcements, help center, tours, demos, surveys, support inbox, and analytics via the API.",
    body: indexBody,
    root: "",
    path: "",
  }),
);
features.forEach((f, i) => writeFileSync(join(OUT, `${f.slug}.html`), featurePage(f, i)));
writeFileSync(
  join(OUT, "blog", "index.html"),
  page({
    title: "Blog — AI Product Management Notes | Userorbit Skill",
    description:
      "Practical writing on AI product management: using coding agents for feedback triage, changelogs, documentation, support, and product analytics.",
    body: blogIndexBody,
    root: "../",
    path: "blog/index.html",
  }),
);
posts.forEach((p) => writeFileSync(join(OUT, "blog", `${p.slug}.html`), postPage(p)));
writeFileSync(join(OUT, ".nojekyll"), "");
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
    `${SITE}/`,
    ...features.map((f) => `${SITE}/${f.slug}.html`),
    `${SITE}/blog/index.html`,
    ...posts.map((p) => `${SITE}/blog/${p.slug}.html`),
  ]
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join("\n")}
</urlset>
`,
);
console.log(`Wrote ${features.length + posts.length + 5} files to ${OUT}`);
