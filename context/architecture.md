# Architecture

## Stack

| Layer    | Technology               | Role                                      |
| -------- | ------------------------ | ----------------------------------------- |
| Runtime  | Bun                      | Package manager and runtime               |
| Monorepo | Turborepo                | Task orchestration and caching            |
| Language | TypeScript (strict)      | Shared and app code                       |
| Web      | React + Vite             | First platform                            |
| Mobile   | React Native / Expo      | Reserved. Not implemented                 |
| Domain   | `packages/chess`         | Pure chess logic                          |
| UI       | `packages/ui`            | Reusable presentation only                |
| Config   | `packages/config`        | Shared tooling configuration              |

## Layout

```text
apps/
├── web/                 # web pages, composition, browser behavior
└── mobile/              # future mobile app only

packages/
├── chess/               # pure chess/domain logic
├── ui/                  # reusable presentation
└── config/              # shared configuration

context/
├── specs/               # required before any feature implementation
├── architecture.md
├── code-standards.md
├── ai-workflow-rules.md
├── project-overview.md
├── ui-context.md
└── progress-tracker.md

CLAUDE.md
AGENTS.md
```

## Package Responsibilities

### packages/chess

Contains ONLY chess/game domain logic.

Allowed:

- Board state
- Pieces
- Positions
- Moves
- Legal move generation
- Move validation
- Turn management
- Captures
- Check
- Checkmate
- Draw rules
- Game state
- Move history

Must NOT depend on:

- React
- React Native
- Browser APIs
- DOM APIs
- UI components
- `apps/web`
- `apps/mobile`

Keep it pure TypeScript. It must be independently testable. Current `src/index.ts` is a type stub only. It is not a chess engine.

### packages/ui

Reusable presentation components.

Must NOT contain chess rules, legal-move generation, check detection, or game-state transitions.

May import domain types from `packages/chess` so web and mobile do not duplicate those types.

May use Tailwind classes and portable React. Must NOT depend on Radix, React Aria, or any DOM-only library, so it stays reusable. See `context/specs/ui-system.md`.

shadcn/ui and React Aria components live in `apps/web/src/components` because they need the DOM.

### apps/web

Web-specific:

- Pages and routes
- Application composition
- Browser behavior
- Web-specific state wiring
- Web-specific UI

Calls into `packages/chess` for rules. Renders with local components or `packages/ui`.

### apps/mobile

Reserved for a future React Native/Expo app. Structure only. Do not implement it.

### packages/config

Shared TypeScript/tooling config. No product logic.

## Dependency Direction

```text
apps/web ────────┐
                 ├──> packages/chess
                 └──> packages/ui

apps/mobile ─────┐
                 ├──> packages/chess
                 └──> packages/ui
```

Rules:

- Apps may depend on packages.
- Packages must never depend on apps.
- `packages/chess` stays independent of UI and apps.
- `packages/ui` may depend on `packages/chess` types only. It must not own rules.
- No circular dependencies.
- Do not copy chess logic into `apps/web` or `apps/mobile`.
- If a dependency violates this, refactor it. Do not ignore the rule.

Preferred flow:

```text
ChessBoard UI
      ↓
Application / game wiring
      ↓
packages/chess
```

## Shared Code

Put logic in a package only when it is genuinely shared or is domain logic that must stay out of UI.

Do not move every small helper into a shared package early.

Do not duplicate identical domain types across apps. Domain types live in `packages/chess`.

## Current Scope

Build later, after specs are approved:

- Web app
- Local two-player chess
- Classic board and standard pieces
- Movement, legal moves, turns, captures
- Check, checkmate, draw, reset

Do not build yet:

- Authentication
- Backend
- Database
- Online multiplayer
- Friends, matchmaking, ratings, history
- Mobile implementation

Those need their own future specs. Do not add repositories, services, or persistence until a backend spec exists.

## Design Patterns

Use a pattern only when it solves a real problem. Prefer simple code.

- Factory: only when construction has real branching or repeated setup, for example a future `createChessPiece(type, color)`. Do not wrap a trivial object.
- Strategy: only when interchangeable algorithms actually exist, for example move validation or a future game mode. Do not add a strategy for one behavior.
- Adapter: only when translating an external API into an internal interface.
- Repository: do not introduce until persistence exists.

Before adding an abstraction, it must have real duplication or more than one consumer, reduce coupling, and be needed now.

## File Responsibility

One clear responsibility per file. Prefer names like `move-validator.ts`, `board-state.ts`, `legal-moves.ts`.

Avoid dump files (`utils.ts`, `helpers.ts`, `game-manager.ts`) unless the name is honestly narrow.

Size is a guideline, not a quota:

- under 250 lines: normal
- 250–350: review whether responsibilities mixed
- over 350: split when practical

Split on responsibility change, independent concepts, or testable reuse. Do not fragment a file just to hit a number.

## Invariants

1. Chess rules never live in UI components.
2. `packages/chess` never imports React, DOM, or app code.
3. No feature implementation without a spec in `context/specs/`.
4. No backend, auth, database, or mobile app until a spec says so.
5. Docs change when boundaries change. Do not silently drift.
