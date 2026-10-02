# Chess Game - Claude Code Instructions

## Read Before Working

Read these files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — Product definition, goals, features, and scope
2. `context/architecture.md` — System structure, boundaries, package responsibilities, and invariants
3. `context/ui-context.md` — Theme, colors, typography, and component conventions
4. `context/code-standards.md` — Implementation rules, naming conventions, and import organization
5. `context/ai-workflow-rules.md` — Development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — Current phase, completed work, open questions, and next steps
7. Relevant files in `context/specs/` — Feature specifications for the feature you are working on

## Core Principles

### Do

- Follow the spec-driven workflow: always check `context/specs/` before implementing
- Keep chess logic in `packages/chess` — never mix rules into UI components
- Keep UI components in `packages/ui` or `apps/web`
- Build small, verifiable increments
- Update `progress-tracker.md` after each meaningful change
- Run `bun run build` and `bun run typecheck` before pushing

### Never Do

- Implement undocumented features
- Skip feature specifications
- Add unnecessary dependencies
- Introduce backend infrastructure prematurely
- Mix chess logic into UI components
- Duplicate shared logic between web and future mobile
- Rewrite working code without a reason
- Mark incomplete work as complete

## Architecture Rules

```
apps/web ──────┐
              ├──> packages/chess (core logic - NO UI)
apps/mobile ───┘         │
                        └──> packages/ui (depends on chess)
```

- `packages/chess` has NO dependencies on other packages in this repo
- `packages/ui` depends on `packages/chess`
- Apps depend on packages
- Never create circular dependencies

## Implementation Workflow

1. Explain your intended implementation approach
2. Make the changes
3. Run `bun run build` and `bun run typecheck`
4. Verify the feature works
5. Update relevant context files if needed
6. Update `progress-tracker.md`
7. Summarize what changed

## Important

The initial version implements only local two-player chess. Online multiplayer, authentication, friends, matchmaking, ratings, and mobile are future phases. Do not build infrastructure for these until they are explicitly required.
