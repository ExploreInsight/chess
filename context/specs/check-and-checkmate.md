# Check and Checkmate

## Goal

Detect when a king is in check and when the game ends in checkmate.

## User Experience

When a player's king is under attack, they must move out of check. The king square is highlighted in red. If no legal moves resolve the check, the game ends and the attacking player wins.

## Functional Requirements

### Check Detection

- After each move, determine if the current player's king is attacked
- Highlight the king's square in red when in check
- Display "Check!" status

### Checkmate Detection

- If in check and no legal moves exist, game ends
- Display "Checkmate! [Color] wins!"
- Disable further piece movement

### Legal Moves During Check

- King must move out of check
- Capturing the attacking piece if possible
- Blocking the attack if possible (except from knight)

## Technical Requirements

- `isKingInCheck(board, color)` function in chess package
- `hasLegalMoves(board, color)` function
- Update `isCheck` and `isCheckmate` in game state
- Highlight check state in UI

## Edge Cases

- Double check (two pieces attacking king) - only king can move
- Check from pawn - cannot block
- Stalemate vs checkmate distinction

## Acceptance Criteria

1. Check is detected after any move that puts king in danger
2. King square highlights red when in check
3. Only moves that resolve check are shown as valid
4. Checkmate is detected when no legal moves escape check
5. Game ends with winner announcement on checkmate

## Dependencies

- Turn system must be working first
- Piece movement must be working first

## Open Questions

- Castling through check and en passant checks are not specified. Do not implement those rules inside this feature until specified.
