# Command Reference

## Global Options

Options that can be combined with any command.

```bash
agent-browser --cdp <port> <command>       # Connect via CDP to existing browser
agent-browser --session <name> <command>   # Isolate browser instance
agent-browser --headers '<json>' <command> # Inject custom HTTP headers
```

For serverless deployment (`--executable-path`), browser extensions (`--extension`), or viewport streaming (`--stream`), see `agent-browser --help`.

## Navigation

```bash
agent-browser open <url>          # Navigate to URL
agent-browser open <url> --headed # Show browser window
agent-browser back                # Go back
agent-browser forward             # Go forward
agent-browser reload              # Reload page
agent-browser close               # Close browser
```

## Snapshot

Capture page structure. Returns elements with refs like `@e1`, `@e2`.

```bash
agent-browser snapshot            # Full accessibility tree
agent-browser snapshot -i         # Interactive elements only (recommended)
agent-browser snapshot -c         # Compact output
agent-browser snapshot --json     # JSON format
```

## Interactions

Use `@refs` from snapshot output.

```bash
agent-browser click @e1           # Click element
agent-browser fill @e1 "text"     # Clear input and type
agent-browser type @e1 "text"     # Type without clearing
agent-browser press Enter         # Press key
agent-browser press Control+a     # Key combination
agent-browser select @e1 "value"  # Select dropdown option
agent-browser scrollintoview @e1  # Scroll element into view
```

## Get Information

```bash
agent-browser get text @e1        # Element text content
agent-browser get value @e1       # Input value
agent-browser get title           # Page title
agent-browser get url             # Current URL
agent-browser get attribute @e1 href  # Element attribute
```

## Screenshot

```bash
agent-browser screenshot              # To stdout
agent-browser screenshot output.png   # Save to file
agent-browser screenshot --full       # Full page
agent-browser screenshot @e1          # Element only
```

## Wait

```bash
agent-browser wait @e1                 # Wait for element visible
agent-browser wait 2000                # Wait milliseconds
agent-browser wait --text "Success"    # Wait for text on page
agent-browser wait --url "**/path"     # Wait for URL pattern
agent-browser wait --load networkidle  # Wait for network idle
```

## State

Save and restore browser state (cookies, localStorage).

```bash
agent-browser state save auth.json    # Save current state
agent-browser state load auth.json    # Restore saved state
agent-browser state clear             # Clear all state
```

## Environment Variables

```bash
AGENT_BROWSER_SESSION=myagent  # Default session name
```

## Help

For latest options and commands:

```bash
agent-browser --help
agent-browser <command> --help
```
