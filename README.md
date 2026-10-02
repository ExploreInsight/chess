# Chess Game

A chess game built as a Turborepo monorepo with Bun, TypeScript, and React.

## Tech Stack

- **Runtime/Package Manager**: Bun
- **Monorepo**: Turborepo
- **Language**: TypeScript (strict mode)
- **Web App**: React + Vite
- **Mobile**: Reserved for future React Native/Expo

## Project Structure

```
chess-game/
├── apps/
│   ├── web/              # React web application
│   └── mobile/           # React Native mobile app (future)
├── packages/
│   ├── chess/            # Core chess logic (shared)
│   ├── ui/               # Shared UI components (shared)
│   └── config/           # Shared build configs
├── context/
│   └── specs/            # Feature specifications
├── package.json          # Root workspace config
├── turbo.json            # Turborepo config
├── bun.lock              # Package lock
└── README.md
```

## Quick Start

```bash
# Install dependencies
bun install

# Run type checking
bun run typecheck

# Build all packages
bun run build

# Run development server
bun run dev
```

## Architecture

```
apps/web ─────┐
              ├──> packages/chess (core logic)
apps/mobile ───┘         │
                        └──> packages/ui (depends on chess)
```

### Package Responsibilities

- `packages/chess` — Chess rules, validation, game state (NO UI)
- `packages/ui` — React components for chess display
- `apps/web` — Main web application
- `apps/mobile` — Future mobile implementation

## Development Rules

### Import Organization

Always organize imports with comment headers:

```typescript
// ** import types
import type { GameState } from "@chess-game/chess";

// ** import lib
import { Button } from "@chess-game/ui";
import { helperFunction } from "./helpers";
```

### Feature Development

1. Check `context/specs/` for feature specification
2. If no spec exists, create one first
3. Implement feature
4. Run `bun run typecheck` and `bun run build`
5. Update `context/progress-tracker.md`

### Dependency Rules

- `packages/chess` has NO dependencies on other packages
- `packages/ui` depends on `packages/chess`
- Apps depend on packages
- Never create circular dependencies

## Phases

### Phase 1: Local Two-Player Chess (Current)
- [ ] Chessboard rendering
- [ ] Piece display
- [ ] Square selection
- [ ] Legal move calculation
- [ ] Turn handling
- [ ] Move execution
- [ ] Check detection
- [ ] Checkmate detection
- [ ] Draw (stalemate) detection
- [ ] Game reset

### Phase 2: Future
- [ ] Online multiplayer
- [ ] Authentication
- [ ] Friend requests
- [ ] Game rooms
- [ ] Match history
- [ ] Ratings
- [ ] Mobile app

## Documentation

- [Context Files](./context/)
- [Feature Specs](./context/specs/)
- [CLAUDE.md](./CLAUDE.md)

## License

Private project - all rights reserved.
