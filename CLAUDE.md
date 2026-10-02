# Chess Game — Claude Code Instructions

These files are project instructions, not optional notes.

## Read before any meaningful change

1. `context/project-overview.md`
2. `context/architecture.md`
3. `context/ui-context.md`
4. `context/code-standards.md`
5. `context/ai-workflow-rules.md`
6. `context/progress-tracker.md`
7. The relevant file in `context/specs/`

## Required behavior

1. Check `context/specs/` before implementation.
2. Never implement an undocumented feature. Create the spec first.
3. If behavior is ambiguous, stop and ask. Record it under `Open Questions`.
4. Respect package boundaries.
5. Keep chess logic in `packages/chess`. No React, DOM, or app imports there.
6. Do not put chess rules in UI components.
7. Follow the import convention in `context/code-standards.md`.
8. Follow file-size and single-responsibility guidelines. They are guidelines, not quotas.
9. Use design patterns only when they solve a real problem.
10. Do not add premature abstractions, dependencies, backend, auth, database, or mobile implementation.
11. Explain the approach, then change code.
12. After implementation, run `bun run typecheck` and `bun run build`.
13. Verify the feature. Domain rules need domain tests, not UI-only checks.
14. Update the spec if requirements changed.
15. Update `context/progress-tracker.md` only when work is actually verified.
16. Update architecture docs when boundaries change.

## Dependency direction

```text
apps/web ────────┐
                 ├──> packages/chess
                 └──> packages/ui

apps/mobile ─────┐
                 ├──> packages/chess
                 └──> packages/ui
```

Packages never depend on apps. `packages/chess` never depends on UI.

## Current scope

Local two-player web chess only, and only after its specs are approved.

Do not build authentication, backend, database, multiplayer, friends, matchmaking, ratings, history, or the mobile app.
