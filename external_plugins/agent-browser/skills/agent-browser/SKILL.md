---
name: agent-browser
description: Automates browser interactions for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact with web pages, fill forms, take screenshots, test web applications, or extract information from web pages.
version: "1.0.0"
allowed-tools:
  - Bash(agent-browser:*)
  - Bash(which:*)
  - Read
---

# Browser Automation with agent-browser

Headless browser automation CLI for web testing, scraping, and interactions.

## Prerequisites

Before using, verify installation:
```bash
which agent-browser || echo "Not installed - see https://github.com/vercel-labs/agent-browser"
```

## Quick Start

```bash
agent-browser open <url>        # Navigate to page
agent-browser snapshot -i       # Get interactive elements with refs
agent-browser click @e1         # Click element by ref
agent-browser fill @e2 "text"   # Fill input by ref
agent-browser screenshot        # Capture page
agent-browser close             # Close browser
```

## Core Workflow

1. **Navigate**: `agent-browser open <url>`
2. **Snapshot**: `agent-browser snapshot -i` (returns elements with refs like `@e1`, `@e2`)
3. **Interact**: Use refs from snapshot (`@e1`, `@e2`, etc.)
4. **Re-snapshot**: After navigation or DOM changes

**Critical**: Always re-snapshot after any action that changes the page (navigation, form submit, modal open). Element refs are invalidated when DOM changes.

## Debugging

```bash
agent-browser open example.com --headed  # Show browser window
agent-browser console                    # View console messages
agent-browser errors                     # View page errors
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Element not found | Re-run `snapshot -i` after page changes |
| Click not working | Try `scrollintoview @e1` first, then click |
| Timeout errors | Add `wait --load networkidle` after navigation |
| Auth expired | Re-run login flow and save new state |

## Additional Resources

- `references/commands.md` - Full command reference
- `examples/workflows.md` - Common patterns (form, auth, scraping)
