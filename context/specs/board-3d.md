# 3D Board

## Goal

A separate playable 3D chess board that uses the same chess rules as the web app.

## User Experience

The board sits on a dark wooden table. The player can orbit the camera, select a piece, and move it. Promotion, check, checkmate, draws, resign, and reset work the same way as the flat board.

## Functional Requirements

- Render an 8x8 wooden board and all 32 pieces
- White starts at the near side
- Click a piece, then a legal square, to move
- Castling and en passant use the shared engine
- Promotion asks for queen, rook, bishop, or knight
- Show whose turn it is, and the game result
- Do not duplicate chess rules in this app

## Technical Requirements

- New app: `apps/board-3d`
- React, Vite, Three.js via React Three Fiber
- Imports rules only from `@chess-game/chess`
- Piece visuals are specified separately in `context/specs/board-3d-pieces.md`

## Edge Cases

- Clicks on a piece must select that square, not the square behind it
- Game-over positions do not accept moves
- Orbiting the camera must not be required to play

## Acceptance Criteria

1. `bun run --filter @chess-game/board-3d build` succeeds
2. The starting position is visible in 3D
3. A legal move changes the shared game state
4. No chess rule function is implemented inside the 3D app

## Dependencies

- `packages/chess`

## Open Questions

- None. This is a presentation app, not a new ruleset.
