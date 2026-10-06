# 3D Move Animation

## Goal

Replace the instant piece teleport in the 3D board with a short slide, so moves feel like a physical piece being moved.

## User Experience

When `applyMove` runs, the piece that moved slides from its source square to its destination over about 200 ms with an ease-out curve. A captured piece shrinks to zero over the same window and is removed at the end. Castling moves both king and rook together. En passant animates the capturing pawn; the captured pawn fades. Promotion swaps the pawn for the new piece at the end of the slide without a visible morph.

## Functional Requirements

- The piece being moved slides from source to destination in approximately 200 ms (ease-out).
- A captured piece shrinks to 0 over the same window.
- Castling: king and rook animate together (king travels two squares, rook travels two/three squares).
- En passant: the capturing pawn animates its slide; the captured pawn shrinks to 0.
- Promotion: the pawn animates its slide; at the end of the slide it is replaced by the promoted piece (no morph).
- During animation the destination square does not accept a new click; clicks are buffered or ignored until the animation finishes.
- The move remains applied to the engine state immediately; only the visual representation is animated.

## Technical Requirements

- A new hook in `apps/board-3d/src/move-animation.tsx` (or a small `useMoveAnimation` helper) tracks the previous board and the new board, computes the moving piece, and exposes a target position per piece.
- The `ChessScene` reads animation targets for each piece and `useFrame`-lerps toward them.
- The animation hook is decoupled from the chess rules; the engine still updates synchronously via `applyMove`.
- `packages/chess` is not modified.
- No new dependency.

## Edge Cases

- Rapid successive moves: if a new move arrives before the previous animation finishes, the animation hook restarts from the current visual position to the new destination.
- A new game reset: the new position is applied without an animation.
- Promotion replacement: the new piece type appears at the end of the slide; its material / model loads if not yet cached (covered by the existing preload in `piece-model.tsx`).

## Acceptance Criteria

1. `bun run typecheck` and `bun run build` pass.
2. Playing a move in the 3D app shows the moving piece slide, not teleport.
3. Captures show the captured piece shrinking.
4. Castling shows both pieces moving together.
5. The 12 domain tests in `packages/chess` still pass and no engine file changed.

## Dependencies

- `apps/board-3d`

## Open Questions

- None. The animation is presentation only.
