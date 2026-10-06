# Undo Move

## Goal

Let a player take back the last move while the game is still in progress, in both the web and the 3D apps.

## User Experience

A single "Undo" button sits next to the existing "New Game", "Resign", and "Agree Draw" controls. It is enabled only when there is a move to take back and the game has not ended. Clicking it rewinds the position to before the last move, keeps the same side to move, and clears the current selection. The button has no effect on finished games.

## Functional Requirements

- Undo reverses exactly the last applied move.
- After undo, the side to move is the one that made the move that was taken back.
- Promotion, castling, and en passant all round-trip correctly through undo.
- The move history panel, when present, removes the last entry.
- Undo is a no-op when the game is over (checkmate, stalemate, resignation, threefold, fifty-move, insufficient material, agreement).
- Undo is a no-op when no move has been played yet.
- Only one move is undone at a time; there is no multi-step undo in this feature.
- An "over-the-board" rule: when it is White's turn, the only undoable move is Black's last move. Undoing further (back to White's previous turn) is not offered. This keeps local play from accidentally rewinding through a whole turn.

## Technical Requirements

- A new engine function `undoMove(state: GameState): GameState | null` lives in `packages/chess` and returns the previous state, or `null` if there is nothing to undo or the game is finished.
- `GameState` gains a `history: GameState[]` field holding the states BEFORE each applied move. `applyMove` pushes the current state into `history` before producing the new state.
- The 12 existing domain tests still pass. New domain tests cover undo for: pawn move, capture, castling kingside, castling queenside, en passant, promotion, plus the no-op cases (empty history, finished game).
- A new `Undo` button is added to `apps/web` and `apps/board-3d`. Its `disabled` reflects `history.length === 0` and the finished-game condition.
- `packages/chess` remains React-free, DOM-free, app-free.

## Edge Cases

- Undo after promotion restores the pawn and the captured-piece status.
- Undo after castling restores both king and rook to their original squares with `hasMoved` flags back to false.
- Undo after en passant restores the captured pawn.
- Undo when the position is already in `history` (for repetition or threefold detection): the `positionHistory` shrinks by exactly one entry.
- The app does not allow undo when `isCheckmate || isDraw || winner !== null`.

## Acceptance Criteria

1. `bun test packages/chess` covers the new undo cases and the existing 12 tests pass.
2. `bun run typecheck` and `bun run build` pass.
3. Both apps show an Undo button next to the existing controls.
4. Playing and undoing a sequence of moves returns the board to the same position and the same side to move at every step.
5. Withdrawing from a finished game does nothing (button disabled, click is a no-op).

## Dependencies

- `packages/chess`

## Open Questions

- None.
