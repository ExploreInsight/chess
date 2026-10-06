# Progress Tracker

## Current Phase

- [x] Monorepo setup
- [x] Web app scaffold (Vite + React placeholder only)
- [x] Package scaffolds
- [x] Agent and architecture documentation
- [x] Architecture review approval
- [x] Chess implementation

## Current Goal

Local chess rules and the 3D board are both on main. The 3D board now renders classic Staunton GLB piece models.

## Completed

- [x] Monorepo structure created (apps/web, apps/mobile, packages/chess, packages/ui, packages/config)
- [x] Root package.json with Turborepo configuration
- [x] turbo.json configured for build orchestration
- [x] TypeScript configuration hierarchy (base + per-package)
- [x] Bun configured as package manager
- [x] apps/web with Vite + React + TypeScript
- [x] apps/mobile placeholder structure
- [x] packages/chess with initial types (Piece, Board, GameState, etc.)
- [x] packages/ui with placeholder Button component
- [x] packages/config with shared TypeScript config
- [x] All context documentation updated for chess project
- [x] context/specs/ directory created
- [x] CLAUDE.md updated with project instructions

## In Progress

- None

## Completed features

- [x] Chessboard rendering and starting position
- [x] Piece selection, legal moves, captures, castling, en passant, and promotion choice
- [x] Turn handling
- [x] Check and checkmate
- [x] Stalemate, threefold, fifty-move, insufficient material, agreement, and resignation
- [x] New game reset
- [x] Tailwind CSS v4 in both apps
- [x] shadcn/ui Button with project tokens
- [x] React Aria promotion dialog
- [x] Keyboard and screen reader support on the board
- [x] 3D board piece models replaced with classic Staunton GLBs (CC0, 12 files, 3.85 MB, normalised and seated on their squares)
- [x] 3D board capture targets tinted green on the tile, matching the check highlight mechanism
- [x] Undo last move (engine snapshots + Undo buttons in both apps)
- [x] Algebraic notation (SAN) in the engine + move-list panels in both apps
- [x] Board flip (visual 180° rotation) in both apps
- [x] 3D board piece slide and capture-fade animations
- [x] packages/ui ChessBoard component tests (vitest + Testing Library)

## Next Up

After setup is complete, implement chess features in order:

1. Chessboard rendering — done
2. Piece display — done
3. Square selection — done
4. Legal move calculation — done
5. Turn handling — done
6. Move execution — done
7. Check detection — done
8. Checkmate detection — done
9. Draw (stalemate) detection — done
10. Game reset — done

Still open for the 3D pieces: a headless browser screenshot of the starting position has not been captured yet, so scale, knight facing, and wood tones are unverified visually. Build, type-check, the 27 domain tests, and 7 UI tests pass.

## Open Questions

- None at this time

## Architecture Decisions

1. **Bun over npm/yarn/pnpm** — Faster installs and builds, all-in-one runtime
2. **Turborepo for monorepo** — Excellent caching, simple configuration, scales well
3. **Unicode chess symbols** — Simple initial implementation, no asset management needed
4. **Separate chess package** — Core logic independent of UI for future mobile sharing
5. **Vite for web** — Fast dev server, simple config, good React support

## Session Notes

- Project started as side project for chess game
- Using Turborepo monorepo structure
- Web is primary platform, mobile is future
- Token auth issues resolved by embedding in remote URL
