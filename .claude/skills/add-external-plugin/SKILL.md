---
name: add-external-plugin
description: |
  Add a new external plugin to the vibe-coding-plugins repository.
  Trigger when the user wants to add a new Claude Code skill or MCP server
  from a GitHub repository, or asks about the process of adding external plugins.
---

# Add External Plugin

This skill guides through adding a new external plugin from a GitHub repository.

## Directory Structure

Each external plugin follows this layout:

```
external_plugins/<plugin-name>/
├── .claude-plugin/
│   └── plugin.json          # Plugin identity metadata (we maintain)
└── skills/<plugin-name>/    # Upstream repo content (sync script manages)
    ├── SKILL.md
    └── ...
```

- `.claude-plugin/plugin.json` — Our metadata, NOT from upstream. We create and maintain this.
- `skills/<plugin-name>/` — Upstream repo files. Managed by `scripts/sync-plugins.ts`, don't manually edit.

## Step-by-Step Process

### 1. Gather info about the upstream repo

Before adding, confirm:
- **Repo URL** (e.g. `https://github.com/owner/repo`)
- **Default branch** — check with `git ls-remote --heads <url>` (could be `main` or `master`)
- **What it provides** — skill (has SKILL.md) or MCP server (has .mcp.json)

### 2. Create plugin metadata

```bash
mkdir -p external_plugins/<plugin-name>/.claude-plugin
```

Write `external_plugins/<plugin-name>/.claude-plugin/plugin.json`:

```json
{
  "name": "<plugin-name>",
  "description": "<one-line description of what it does>",
  "author": {
    "name": "<github-username>",
    "url": "https://github.com/<owner>/<repo>"
  },
  "homepage": "https://github.com/<owner>/<repo>"
}
```

### 3. Add entry to sync script

Edit `scripts/sync-plugins.ts`, add to the `plugins` array:

```typescript
{ name: "<plugin-name>", prefix: "external_plugins/<plugin-name>/skills/<plugin-name>", repo: "https://github.com/<owner>/<repo>", branch: "<branch>" },
```

### 4. Run sync to fetch upstream files

```bash
bun scripts/sync-plugins.ts --ssh
```

This clones the repo and copies files to the correct prefix path.

### 5. Update marketplace.json

Add a new entry to `.claude-plugin/marketplace.json` in the `plugins` array:

```json
{
  "name": "<plugin-name>",
  "description": "<description>",
  "category": "<development|productivity>",
  "source": "./external_plugins/<plugin-name>",
  "homepage": "https://github.com/<owner>/<repo>"
}
```

Fields:
- `name` / `description` — can differ from plugin.json (marketplace-facing)
- `category` — `development` for coding tools, `productivity` for workflow tools
- `source` — path to the plugin root (not the skills subdirectory)
- `homepage` — upstream repo URL

### 6. Verify

- Confirm `external_plugins/<plugin-name>/skills/<plugin-name>/SKILL.md` exists
- Confirm `plugin.json` is valid JSON
- Confirm `marketplace.json` is valid JSON with the new entry

### 7. Commit

Stage all new files and commit:

```
Add `<plugin-name>` plugin from <owner>/<repo>
```

## Removing a Plugin

1. Delete `external_plugins/<plugin-name>/` directory
2. Remove entry from `.claude-plugin/marketplace.json`
3. Remove entry from `scripts/sync-plugins.ts` plugins array
4. Commit

## Key Files Reference

| File | Purpose |
|------|---------|
| `.claude-plugin/marketplace.json` | Repository-level plugin registry |
| `scripts/sync-plugins.ts` | Upstream sync config + execution |
| `external_plugins/<name>/.claude-plugin/plugin.json` | Per-plugin identity metadata |
| `.github/workflows/sync-external-plugins.yml` | Daily auto-sync CI |
