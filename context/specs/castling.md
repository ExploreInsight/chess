# Castling

## Goal

Allow the king and rook to castle when the standard rules are met.

## User Experience

After the path is clear, the player selects the king. The castling square is highlighted. Moving the king two squares castles: the rook jumps to the other side of the king.

## Functional Requirements

- Kingside and queenside castling for both colors
- King and that rook have not moved
- Squares between them are empty
- King is not in check
- King does not pass through or land on an attacked square
- Queenside: the square beside the rook must be empty, but it does not have to be safe
- The rook moves in the same action

## Technical Requirements

- Generated in `packages/chess`
- Marked with `castle: "kingside" | "queenside"`
- Applying the move moves both pieces and sets `hasMoved`

## Edge Cases

- Castling is illegal after the king or rook has moved, even if it returns
- A captured rook cannot castle
- Checkmate takes priority over any castling attempt

## Acceptance Criteria

1. Both sides can castle when the path is clear and the king is safe
2. Castling through check is rejected
3. The rook ends on the correct square

## Dependencies

- Legal move generation
- Check detection

## Open Questions

- None. Follow standard castling.
