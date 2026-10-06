# Board Flip

## Goal

Let a player view the board from either side, so Black can play from the natural perspective.

## User Experience

A "Flip" toggle sits next to the existing controls. Toggling it rotates the board 180°: rank 1 (White's back rank) sits at the bottom by default; after a flip, rank 8 (Black's back rank) sits at the bottom. The board's contents are unchanged, only the visual orientation. The toggle is a session preference, not persisted.

## Functional Requirements

- The flip is purely visual. The engine, move history, side-to-move, and all legal-move computations are unaffected.
- A flip does not change which side is to move and does not auto-resign or auto-end the game.
- In the web app the board grid is rendered in reverse order.
- In the 3D app the camera target and the board's row/column-to-world mapping are rotated 180° about the vertical axis.
- A flip survives a move: after any move, the orientation stays where the user left it.
- A new-game reset does not change the orientation; that is the user's call.

## Technical Requirements

- Each app owns a `flipped: boolean` (web: `useState`, 3D: `useState`).
- A `Flip` button toggles the value.
- `packages/chess` is not modified. `packages/ui` is not modified; the new behavior is the apps composing it.
- No new dependency.

## Edge Cases

- OrbitControls in the 3D app keep working in both orientations; the user can still orbit around the board.
- Coordinate labels (file letters, rank numbers) in the web app match the visible orientation.

## Acceptance Criteria

1. `bun run typecheck` and `bun run build` pass.
2. Clicking Flip in the web app shows rank 8 at the bottom; clicking again restores rank 1.
3. Clicking Flip in the 3D app rotates the camera and the piece layout by 180°.
4. Playing a move before or after a flip behaves identically.

## Dependencies

- `packages/ui` (web only), `apps/board-3d`

## Open Questions

- None.
