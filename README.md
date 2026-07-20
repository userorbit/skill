# Userorbit Skill for AI Coding Agents

Teach your AI coding agent to manage [Userorbit](https://userorbit.com) — feedback, announcements, roadmaps, help center articles, product tours, interactive demos, surveys, support inbox, and more — directly from your terminal.

After deploying a feature, tell your agent to publish a changelog, update the roadmap, resolve related feedback, and draft a help article. No context switching.

**Docs:** [userorbit.github.io/skill](https://userorbit.github.io/skill/) — per-feature guides with API examples.

## What it can do

- **[Feedback](https://userorbit.com/feedback-boards)** — create, list, update, merge, archive, vote, comment, organize into boards
- **[Roadmap](https://userorbit.com/product-roadmap)** — manage public roadmap views and columns; move items by feedback status
- **[Announcements](https://userorbit.com/announcements)** — draft, publish, schedule, pin, categorize product updates
- **[Help Center](https://userorbit.com/help-center)** — write, publish, version, and manage article revisions
- **[Product Tours](https://userorbit.com/product-tours)** — create, publish, translate in-app tours and manage their steps
- **[Interactive Demos](https://userorbit.com/interactive-product-demos)** — publish, duplicate, analyze demos; auto-generate help articles from them
- **[Checklists](https://userorbit.com/checklists)** — manage onboarding checklists and their tasks
- **[Surveys](https://userorbit.com/surveys)** — create and manage in-app surveys, questions, and targeting
- **[Support Inbox](https://userorbit.com/customer-support)** — triage threads, reply, leave private notes, manage labels and snippets, run side discussions
- **Workflows** — build and run support automation workflows
- **[Analytics](https://userorbit.com/product-analytics)** — query product analytics: active users, new users, filters, breakdowns
- **Subscribers** — create, search, and manage subscriber records and custom contact properties
- **Organization** — tags, projects, collections for categorization

Covers 150+ API endpoints across all Userorbit resources. The same surface is available as a hosted MCP server at `https://api.userorbit.com/mcp`.

## Setup

### Claude Code

```bash
claude install-skill https://github.com/userorbit/skill
```

### Codex

```bash
git clone https://github.com/userorbit/skill.git ~/.codex/skills/userorbit
```

### Cursor

Add the contents of `SKILL.md` and `references/api.md` to your project's `.cursor/rules/` directory:

```bash
git clone https://github.com/userorbit/skill.git /tmp/userorbit-skill
mkdir -p .cursor/rules
cp /tmp/userorbit-skill/userorbit/SKILL.md .cursor/rules/userorbit.md
cp -r /tmp/userorbit-skill/userorbit/references .cursor/rules/userorbit-references
```

### GitHub Copilot

Add the files to `.github/copilot-instructions.md` or include them in your workspace:

```bash
git clone https://github.com/userorbit/skill.git /tmp/userorbit-skill
cat /tmp/userorbit-skill/userorbit/SKILL.md >> .github/copilot-instructions.md
```

### Gemini / Other agents

Clone the repo and point your agent's context to `SKILL.md`:

```bash
git clone https://github.com/userorbit/skill.git ~/.config/userorbit-skill
```

Then reference the file in your agent's system prompt or context configuration.

## Authentication

On first use, the agent will ask for your **API key** and **team ID** (available in **Settings → API** in your Userorbit workspace). Set them as environment variables:

```bash
export USERORBIT_API_KEY="uo_..."
export USERORBIT_TEAM_ID="..."
```

Read-only keys can call list/info/count/search endpoints; read/write keys can call everything.

## Usage examples

**Publish an announcement:**
> "Publish an announcement about the dark mode feature we just shipped"

**Triage feedback:**
> "Show me all high-priority feedback with the most votes"

**Update the roadmap:**
> "Move the API v2 feedback to in_progress so it shows up in the right roadmap column"

**Triage support:**
> "Go through the support todo queue, reply to the easy ones, and leave private notes on the rest"

**Ship a demo:**
> "Publish the checkout demo and generate a help article from it"

**Post-deploy workflow:**
> "We just shipped dark mode. Publish a changelog, mark the 'dark mode' feedback as completed, and draft a help article about it."

## Files

| File | Purpose |
|------|---------|
| `userorbit/SKILL.md` | Quick reference — endpoints, required fields, workflows |
| `userorbit/references/api.md` | Full API reference — all fields, types, response schemas |
| `docs/` | Feature guides published at [userorbit.github.io/skill](https://userorbit.github.io/skill/) |

## Links

- [Userorbit](https://userorbit.com)
- [Feature guides](https://userorbit.github.io/skill/)
- [Blog post: Manage Userorbit with coding agents](https://userorbit.com/blog/manage-userorbit-with-coding-agents)
