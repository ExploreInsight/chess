# AI Workflow Rules

## Approach

Build incrementally. Specs define behavior. Do not invent product behavior.

Smallest correct architecture for the next feature. No speculative backend, auth, database, multiplayer, or mobile app.

## Required Workflow

```text
Requirement
    ↓
Feature specification (context/specs/)
    ↓
Review / clarification
    ↓
Implementation plan
    ↓
Implementation
    ↓
Testing / verification
    ↓
Progress update
```

No meaningful feature implementation starts without a specification.

If `context/specs/<feature>.md` does not exist, stop and create it. Do not implement first.

If a requirement is ambiguous, put it under `Open Questions` and ask. Do not guess chess rules or product behavior.

## Specification Template

```md
# Feature Name

## Goal

## User Experience

## Functional Requirements

## Technical Requirements

## Edge Cases

## Acceptance Criteria

## Dependencies

## Open Questions
```

## Scoping

- One feature unit at a time.
- Do not mix UI, domain rules, and future backend in one step.
- If it cannot be verified end to end, the scope is too large.

## Before Coding

1. Read `context/project-overview.md`, `architecture.md`, `ui-context.md`, `code-standards.md`, this file, and `progress-tracker.md`.
2. Read the relevant spec in `context/specs/`.
3. State the implementation approach.
4. Respect package boundaries in `context/architecture.md`.

## During Coding

- Chess rules go in `packages/chess`.
- UI does not validate chess rules.
- Follow import headers in `context/code-standards.md`.
- Use a design pattern only when the spec or real duplication justifies it.
- Do not add dependencies for hypothetical features.

## After Coding

1. Run `bun run typecheck` and `bun run build`.
2. Add or run domain tests when the change is chess logic.
3. Update the spec if behavior changed.
4. Update `context/progress-tracker.md` only for work that is actually verified.
5. Update architecture docs if boundaries changed.
6. Summarize what changed.

## Docs That Must Stay in Sync

| Change                         | File                         |
| ------------------------------ | ---------------------------- |
| Package boundaries             | `context/architecture.md`    |
| Engineering conventions        | `context/code-standards.md`  |
| Visual rules                   | `context/ui-context.md`      |
| Product scope                  | `context/project-overview.md`|
| Feature requirements           | `context/specs/*`            |
| Completed, verified work       | `context/progress-tracker.md`|

## Out of Scope Until Specified

Authentication, backend, database, online multiplayer, friends, matchmaking, ratings, history, and mobile implementation.
