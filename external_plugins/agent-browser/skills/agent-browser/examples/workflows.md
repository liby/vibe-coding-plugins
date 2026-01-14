# Common Workflows

Core patterns for browser automation tasks.

## Form Submission

```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
# Output: textbox "Email" [ref=e1], textbox "Password" [ref=e2], button "Submit" [ref=e3]

agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --load networkidle
agent-browser snapshot -i  # Verify result
```

## Authentication with State

```bash
# First time: login and save state
agent-browser open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "username"
agent-browser fill @e2 "password"
agent-browser click @e3
agent-browser wait --url "**/dashboard"
agent-browser state save auth.json

# Later: reuse saved session
agent-browser state load auth.json
agent-browser open https://app.example.com/dashboard
```

## Data Extraction

```bash
agent-browser open https://example.com/products
agent-browser wait --load networkidle
agent-browser snapshot -i

# Extract text from elements
agent-browser get text @e1  # Product name
agent-browser get text @e2  # Price

# Or export full snapshot
agent-browser snapshot --json > page-data.json
```

## Pagination

```bash
agent-browser open https://example.com/listings?page=1
agent-browser snapshot -i
# Extract data...

agent-browser click @e10  # "Next" button
agent-browser wait --load networkidle
agent-browser snapshot -i  # Must re-snapshot after navigation
# Extract next page...
```

## Handling Dynamic Content

```bash
agent-browser open https://example.com
agent-browser wait --load networkidle

# Wait for specific element before interacting
agent-browser wait @e1
agent-browser click @e1

# Or wait for text to appear
agent-browser wait --text "Loading complete"
agent-browser snapshot -i
```

## Infinite Scroll

```bash
agent-browser open https://example.com/feed
agent-browser snapshot -i

# Scroll and wait for lazy loading
agent-browser scroll down 1000
agent-browser wait 1000
agent-browser snapshot -i

# Repeat until no new content
```

## Parallel Sessions

```bash
# Compare prod vs staging
agent-browser --session prod open https://example.com
agent-browser --session staging open https://staging.example.com

agent-browser --session prod screenshot prod.png
agent-browser --session staging screenshot staging.png
```

## CDP Mode

Connect to an existing Chrome or Electron instance for debugging.

```bash
# Start Chrome with remote debugging
# google-chrome --remote-debugging-port=9222

# Connect and interact
agent-browser --cdp 9222 snapshot -i
agent-browser --cdp 9222 click @e1
agent-browser --cdp 9222 screenshot debug.png
```

## Custom Headers

Inject authentication tokens or custom headers for API testing.

```bash
# Add auth header to all requests
agent-browser --headers '{"Authorization":"Bearer token123"}' open https://api.example.com
agent-browser snapshot -i

# Headers are scoped to origin for security
agent-browser click @e1
```
