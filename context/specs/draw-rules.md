# Draw Rules

## Goal

End the game in a draw when the rules say neither side wins.

## User Experience

The status line names the draw. Play stops. New Game starts again.

## Functional Requirements

- Stalemate: no legal move and not in check
- Threefold repetition: the same position occurs three times. Position includes side to move, castling rights, and en passant rights
- Fifty-move rule: 50 moves by each side with no pawn move and no capture. Tracked as 100 half-moves
- Insufficient material: king vs king, king and bishop vs king, king and knight vs king, or king and bishop vs king and bishop on the same color
- Agreement: either player at the board can accept a draw
- Checkmate beats a draw if the same move is checkmate

## Technical Requirements

- Decisions live in `packages/chess`
- `result` records the reason
- `halfmoveClock` resets on pawn moves and captures
- Local play applies threefold and fifty-move automatically so the game actually ends

## Edge Cases

- Checkmate is not converted into a draw
- A capture or pawn move resets the fifty-move clock
- En passant counts as a capture

## Acceptance Criteria

1. Stalemate, threefold, fifty-move, and insufficient material set `isDraw`
2. The status names the reason
3. No further moves are legal after a draw

## Dependencies

- Legal moves
- Check detection

## Open Questions

- None. Automatic threefold and fifty-move are the local-play rule.
