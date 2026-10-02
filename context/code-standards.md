# Code Standards

## General

- Keep modules small and single-purpose
- Fix root causes, do not layer workarounds
- Do not mix unrelated concerns in one component or function
- Avoid unnecessary abstractions until they are actually needed
- Keep business/game logic separate from UI code

## TypeScript

- Strict mode is required throughout the project
- Avoid `any` — use explicit interfaces or narrowly scoped types
- Validate unknown external input at system boundaries
- Use `unknown` for values of unknown type, then narrow appropriately
- Prefer `type` over `interface` for simple type definitions
- Use `interface` for object shapes that may be extended

## Import Organization

At the top of each file, use clear section comments:

```ts
/** External dependencies */
import React from "react";

/** Internal dependencies */
import { Piece } from "@chess-game/chess";

/** Local modules */
import { Board } from "./types";
```

Keep this order consistent. Add blank lines between sections.

## File Organization

- `src/` — Source code
- `src/index.ts` — Public exports only
- Subdirectories for grouping related code by feature
- One concept per file when possible

## Naming Conventions

| Thing         | Convention         | Example                    |
| ------------- | ------------------ | -------------------------- |
| Files         | kebab-case         | `game-state.ts`            |
| Types/Classes | PascalCase         | `GameState`, `ChessBoard`  |
| Functions     | camelCase          | `calculateLegalMoves`      |
| Constants     | UPPER_SNAKE_CASE   | `MAX_BOARD_SIZE`           |
| Interfaces    | PascalCase         | `Move`, `Position`         |

## Component Rules

- Functional components with hooks (no class components)
- Props interface defined above component
- Destructure props in function signature
- Colocate component styles when practical

## Package Rules

1. `packages/chess` — No React imports, no UI code, pure game logic
2. `packages/ui` — React components that use chess types
3. `apps/web` — Main application, uses both packages
4. Never mix chess rules into UI components

## Turborepo

- Tasks: `build`, `dev`, `lint`, `typecheck`
- Apps depend on packages via `dependsOn: ["^build"]`
- Shared configs in `packages/config/`
- Never reference apps from packages (dependency direction)

## Build and Verification

- `bun run build` must pass before pushing
- `bun run typecheck` must pass before pushing
- Run relevant checks after each feature implementation
- Do not mark work complete until checks pass
