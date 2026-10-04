# En Passant

## Goal

Allow a pawn to capture an opposing pawn that has just moved two squares, as if it had moved one.

## User Experience

On the immediate next turn, the capturing pawn can move diagonally onto the skipped square. The captured pawn is removed.

## Functional Requirements

- Only immediately after a two-square pawn move
- Capturing pawn must be on the adjacent file and the same rank
- The captured pawn is removed from its square, not from the destination
- The right disappears after any other move

## Technical Requirements

- Derived from the last move in history
- Marked with `enPassant: true`
- Must not leave the mover's king in check

## Edge Cases

- A later capture of that pawn is a normal capture, not en passant
- Promotion does not apply to en passant

## Acceptance Criteria

1. The capture is legal only on the next move
2. The captured pawn leaves the board
3. The capturer lands on the skipped square

## Dependencies

- Pawn movement
- Move history

## Open Questions

- None.
