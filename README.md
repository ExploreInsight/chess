# Chess Game

Local two-player chess, built as a Bun + Turborepo + TypeScript monorepo. Web first. Mobile later.

Local two-player chess is playable on web. v0 has no castling, en passant, or promotion picker. Pawns promote to a queen.

## Stack

- Bun
- Turborepo
- TypeScript (strict)
- Web: React + Vite
- Mobile: React Native / Expo reserved, not implemented

## Structure

```text
apps/web/                 web app
apps/mobile/              future mobile placeholder
packages/chess/           pure chess domain logic
packages/ui/              reusable presentation
packages/config/          shared tooling config
context/specs/            feature specs, required before implementation
```

## Commands

```bash
bun install
bun run typecheck
bun run build
bun run dev
```

## Rules

- No feature work without a spec in `context/specs/`.
- Chess rules live in `packages/chess`, not in UI.
- Apps may depend on packages. Packages must not depend on apps.
- Do not add auth, backend, database, multiplayer, or mobile implementation until specified.

Read `CLAUDE.md` and `context/architecture.md` before changing the project.

## Scope now

Classic local chess on web: board, pieces, movement, legal moves, turns, captures, check, checkmate, draw, reset.

Not now: auth, backend, database, online play, friends, matchmaking, ratings, history, mobile app.
