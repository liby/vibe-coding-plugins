# Claude Code Plugins

A curated collection of high-quality plugins for Claude Code.

> **Important:** Make sure you trust a plugin before installing it. We do not control what MCP servers, files, or other software are included in third-party plugins and cannot verify that they will work as intended. See each plugin's homepage for more information.

## Installation

Add this marketplace to Claude Code:

```shell
/plugin marketplace add liby/vibe-coding-plugins
```

Then install plugins:

```shell
/plugin install <plugin-name>@vibe-coding-plugins
```

Or browse available plugins in `/plugin > Discover`.

## Available Plugins

| Plugin | Category | Description |
|--------|----------|-------------|
| [agent-browser](https://github.com/vercel-labs/agent-browser) | development | Browser automation for web testing, form filling, screenshots, and data extraction. |
| [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | development | Chrome DevTools for coding agents. Control and inspect a live Chrome browser. |
| [grep-by-vercel](https://grep.app) | development | Search over a million public GitHub repositories using grep.app's MCP server. |
| [notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill) | productivity | Query Google NotebookLM notebooks for source-grounded answers from Gemini. |

## Documentation

For more information on developing Claude Code plugins, see the [official documentation](https://code.claude.com/docs/en/plugins).

