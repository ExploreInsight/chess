# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and the current state of progress. Always implement against these specs — do not infer or invent behavior from scratch.

## Feature Workflow

```
Idea
  ↓
Feature specification (context/specs/)
  ↓
Review
  ↓
Implementation plan
  ↓
Implementation
  ↓
Verification (build + typecheck)
  ↓
Progress update
```

## Scoping Rules

- Work on one feature unit at a time
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated system boundaries in a single implementation step
- If a change cannot be verified end to end quickly, the scope is too broad

## Feature Specifications

Every feature must have its own specification file in `context/specs/`.

Before implementing any feature:

1. Check whether a specification exists in `context/specs/`
2. If it does not exist, create one
3. Document: goal, user experience, functional requirements, technical requirements, edge cases, acceptance criteria, and dependencies
4. Only then begin implementation

## Specification Template

```md
# [Feature Name]

## Goal

[What this feature accomplishes]

## User Experience

[How the user interacts with this feature]

## Functional Requirements

- [Requirement 1]
- [Requirement 2]

## Technical Requirements

- [Technical requirement 1]

## Edge Cases

- [Edge case 1]

## Acceptance Criteria

1. [Criterion 1]
2. [Criterion 2]

## Dependencies

- [Any prerequisite features]
```

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before implementing
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing

## Protected Files

Do not modify unless explicitly instructed:

- `packages/chess/src/index.ts` — Core logic without existing tests
- Any third-party library internals

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → `context/architecture.md`
- Visual design → `context/ui-context.md`
- Code conventions → `context/code-standards.md`
- Feature scope → `context/project-overview.md` and relevant spec

## Before Moving to Next Feature

1. The current unit works end to end within its defined scope
2. No invariant defined in `context/architecture.md` was violated
3. `progress-tracker.md` reflects the completed work
4. `bun run build` passes
5. `bun run typecheck` passes

## Implementation Guidelines

When implementing a feature, first explain the intended implementation approach, then make the changes.

After implementation:
1. Run relevant checks/tests
2. Verify the feature works
3. Update the feature specification if necessary
4. Update `progress-tracker.md`
5. Clearly summarize what changed
