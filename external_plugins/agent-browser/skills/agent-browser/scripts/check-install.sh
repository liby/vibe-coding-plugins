#!/bin/bash
# Check if agent-browser is installed and accessible

if command -v agent-browser &> /dev/null; then
    version=$(agent-browser --version 2>/dev/null || echo "unknown")
    echo "agent-browser is installed: $version"
    exit 0
else
    echo "ERROR: agent-browser is not installed or not in PATH"
    echo ""
    echo "Installation options:"
    echo "  npm install -g agent-browser"
    echo "  # or"
    echo "  pnpm add -g agent-browser"
    echo ""
    echo "See: https://github.com/anthropic/agent-browser"
    exit 1
fi
