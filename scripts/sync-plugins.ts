#!/usr/bin/env bun

/**
 * Sync external plugins from upstream repositories.
 * Clones each repo to a temp directory, copies files to the target path,
 * and stages changes for commit.
 *
 * Usage:
 *   bun scripts/sync-plugins.ts          # HTTPS (for CI)
 *   bun scripts/sync-plugins.ts --ssh    # SSH (for local dev)
 */

import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

interface Plugin {
  name: string;
  prefix: string;
  repo: string;
  branch: string;
}

const plugins: Plugin[] = [
  { name: "napkin", prefix: "external_plugins/napkin/skills/napkin", repo: "https://github.com/blader/napkin", branch: "main" },
  { name: "claudeception", prefix: "external_plugins/claudeception/skills/claudeception", repo: "https://github.com/blader/Claudeception", branch: "main" },
  { name: "notebooklm-skill", prefix: "external_plugins/notebooklm-skill/skills/notebooklm-skill", repo: "https://github.com/PleasePrompto/notebooklm-skill", branch: "master" },
  { name: "rust-skills", prefix: "external_plugins/rust-skills/skills/rust-skills", repo: "https://github.com/leonardomso/rust-skills", branch: "master" },
];

function toGitUrl(repo: string, ssh: boolean): string {
  if (!ssh) return `${repo}.git`;
  const { host, pathname } = new URL(repo);
  return `git@${host}:${pathname.slice(1)}.git`;
}

async function run(cmd: string[], cwd?: string): Promise<{ ok: boolean; output: string }> {
  const proc = Bun.spawn(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
  const exitCode = await proc.exited;
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  return { ok: exitCode === 0, output: stdout + stderr };
}

const useSsh = process.argv.includes("--ssh");
let synced = 0;
let skipped = 0;
let failed = 0;

for (const { name, prefix, repo, branch } of plugins) {
  const url = toGitUrl(repo, useSsh);
  const tmpDir = join(tmpdir(), `sync-plugin-${name}-${Date.now()}`);

  console.log(`::group::Syncing ${name}`);

  // Shallow clone to temp directory
  const clone = await run(["git", "clone", "--depth=1", "--branch", branch, url, tmpDir]);
  if (!clone.ok) {
    console.error(`  Failed to clone ${name}: ${clone.output}`);
    failed++;
    console.log("::endgroup::");
    continue;
  }

  // Remove old files (keep .claude-plugin/ metadata which is ours)
  if (existsSync(prefix)) {
    rmSync(prefix, { recursive: true });
  }

  // Copy cloned files to target prefix (exclude .git)
  const rsync = await run(["rsync", "-a", "--exclude", ".git", `${tmpDir}/`, prefix]);
  if (!rsync.ok) {
    console.error(`  Failed to copy ${name}: ${rsync.output}`);
    failed++;
  } else {
    // Stage changes
    await run(["git", "add", prefix]);

    // Check if there are actually staged changes for this prefix
    const diff = await run(["git", "diff", "--cached", "--quiet", "--", prefix]);
    if (diff.ok) {
      console.log(`  ${name}: already up to date`);
      skipped++;
    } else {
      console.log(`  ${name}: updated`);
      synced++;
    }
  }

  // Cleanup
  rmSync(tmpDir, { recursive: true });
  console.log("::endgroup::");
}

console.log(`\nSync complete: ${synced} updated, ${skipped} up-to-date, ${failed} failed`);

if (failed > 0) process.exit(1);
