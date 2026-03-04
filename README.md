# Userorbit Skill for AI Coding Agents

Teach your AI coding agent to manage [Userorbit](https://userorbit.com) — feedback, announcements, roadmaps, help center articles, and more — directly from your terminal.

After deploying a feature, tell your agent to publish a changelog, update the roadmap, resolve related feedback, and draft a help article. No context switching.

## What it can do

- **Feedback** — create, list, update, archive, vote, comment, organize into boards
- **Announcements** — draft, publish, schedule, pin, categorize product updates
- **Roadmaps** — create roadmaps with stages, add and move topics between stages
- **Help Center** — write, publish, version, and manage article revisions
- **Subscribers** — create, search, and manage subscriber records
- **Organization** — tags, projects, collections for categorization

Covers 60+ API endpoints across all Userorbit resources.

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
cp /tmp/userorbit-skill/SKILL.md .cursor/rules/userorbit.md
cp -r /tmp/userorbit-skill/references .cursor/rules/userorbit-references
```

### GitHub Copilot

Add the files to `.github/copilot-instructions.md` or include them in your workspace:

```bash
git clone https://github.com/userorbit/skill.git /tmp/userorbit-skill
cat /tmp/userorbit-skill/SKILL.md >> .github/copilot-instructions.md
```

### Gemini / Other agents

Clone the repo and point your agent's context to `SKILL.md`:

```bash
git clone https://github.com/userorbit/skill.git ~/.config/userorbit-skill
```

Then reference the file in your agent's system prompt or context configuration.

## Authentication

On first use, the agent will ask for your **API key** and **team ID** (available in **Settings → API** in your Userorbit workspace).

Set them as environment variables:

```bash
export USERORBIT_API_KEY="your-api-key"
export USERORBIT_TEAM_ID="your-team-id"
```

## Usage examples

**Publish an announcement:**
> "Publish an announcement about the dark mode feature we just shipped"

**Triage feedback:**
> "Show me all high-priority feedback with the most votes"

**Update a roadmap:**
> "Move the API v2 topic to the Done stage on our public roadmap"

**Draft a help article:**
> "Draft a help article explaining how to set up SSO"

**Post-deploy workflow:**
> "We just shipped dark mode. Publish a changelog, mark the 'dark mode' feedback as completed, move the roadmap topic to Done, and draft a help article about it."

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Quick reference — endpoints, required fields, workflows |
| `references/api.md` | Full API reference — all fields, types, response schemas |

## Links

- [Userorbit](https://userorbit.com)
- [API documentation](https://userorbit.com/docs/api)
- [Blog post: Manage Userorbit with coding agents](https://userorbit.com/blog/manage-userorbit-with-coding-agents)
