<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# Project agent rules

These rules sit outside the managed Turborepo block. Do not remove or edit that block.

- Read `CLAUDE.md` and `context/` before meaningful changes.
- Do not implement a feature that has no file in `context/specs/`.
- Do not start chessboard or game implementation until architecture review is explicitly approved.
- Keep chess rules in `packages/chess`. Keep presentation out of that package.
- Do not add backend, auth, database, multiplayer, or mobile implementation.
- Do not commit `node_modules`, `.turbo`, or `dist`.
- Verify with `bun run typecheck` and `bun run build` before calling setup or a feature done.
