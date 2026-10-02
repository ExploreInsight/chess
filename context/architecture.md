# Architecture Context

## Stack

| Layer     | Technology              | Role                              |
| --------- | ----------------------- | --------------------------------- |
| Runtime   | Bun                     | Package manager and runtime       |
| Monorepo  | Turborepo               | Build orchestration and caching   |
| Language  | TypeScript (strict)     | Type-safe code                    |
| Web App   | React + Vite            | Web UI framework                  |
| Mobile    | React Native/Expo       | Mobile UI (future)                |
| Shared    | Pure TypeScript packages| Chess logic and UI components     |

## System Boundaries

- `apps/web/` — Owns the web application UI and entry point
- `apps/mobile/` — Reserved for future mobile app (structure only)
- `packages/chess/` — Owns all chess game logic, rules, and state management
- `packages/ui/` — Owns reusable UI components for chess display
- `packages/config/` — Owns shared TypeScript and tooling configuration
- `context/` — Owns project documentation, specs, and workflow rules

## Monorepo Architecture

```
chess-game/
├── apps/
│   ├── web/          # React web application
│   └── mobile/       # React Native mobile app (future)
├── packages/
│   ├── chess/        # Core chess logic (shared)
│   ├── ui/           # Shared UI components (shared)
│   └── config/       # Shared build configs
├── context/
│   └── specs/        # Feature specifications
├── package.json      # Root workspace config
├── turbo.json        # Turborepo config
└── bun.lock          # Package lock
```

## Responsibility of Each Package

### packages/chess

- Chess rules and validation
- Piece movement logic
- Legal move calculation
- Check, checkmate, draw detection
- Game state management
- Move history
- NO UI concerns

### packages/ui

- Chessboard component
- Chess piece display components
- Square highlighting
- Move indicators
- Game status display
- Depends on `packages/chess` for types

### apps/web

- Main React application
- Game container and state
- User interactions
- Uses `packages/chess` and `packages/ui`

### apps/mobile

- Reserved for future React Native implementation
- Will consume `packages/chess` and `packages/ui`

## Shared Code Strategy

Chess game logic lives in `packages/chess`. This package:

- Contains no React or UI code
- Exports pure TypeScript types and functions
- Can be imported by web or future mobile without bringing in UI dependencies
- Is tested independently

```
Web UI ─────┐
            ├── packages/chess (shared logic)
Mobile UI ──┘
```

## Web/Mobile Separation

| Concern          | Web          | Mobile       |
| ---------------- | ------------ | ------------ |
| UI Framework     | React + Vite | React Native |
| Entry Point      | web/src/main | mobile/src/  |
| Shared Logic     | packages/chess | packages/chess |
| Shared UI        | packages/ui  | packages/ui   |
| Platform Code    | apps/web/    | apps/mobile/  |

## Dependency Direction Rules

1. Apps (`apps/web`, `apps/mobile`) can depend on packages
2. Packages can depend on other packages
3. Never create circular dependencies
4. `packages/chess` has NO dependencies on other packages in this repo
5. `packages/ui` depends on `packages/chess`
6. `apps/web` depends on both `packages/chess` and `packages/ui`

```
apps/web ──────┐
               ├──> packages/chess (core logic)
apps/mobile ───┘         │
                         └──> packages/ui (depends on chess)
                                  │
packages/config <── shared configs
```

## Invariants

1. Chess logic must never import from UI packages
2. UI components must not contain chess rule validation
3. New features require a specification in `context/specs/` before implementation
4. Shared logic belongs in packages, not in app code
5. Do not introduce backend infrastructure prematurely
