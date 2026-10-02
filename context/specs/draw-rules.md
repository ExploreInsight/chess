# Draw Rules

## Goal

Detect when the game ends in a draw rather than a win.

## User Experience

When no player can win (stalemate or other draw conditions), the game ends in a draw. Both players are notified.

## Functional Requirements

### Stalemate Detection

- When a player has no legal moves but is NOT in check
- Game ends in draw

### Future Draw Conditions (not in v0)

- Threefold repetition
- 50-move rule
- Mutual agreement
- Insufficient material

## Technical Requirements

- `isStalemate(board, color)` function
- Check if player has no legal moves AND not in check
- Update `isDraw` in game state
- Display "Draw by stalemate!" or similar

## Edge Cases

- Stalemate detection must run after checkmate check (checkmate takes precedence)
- Need to verify no legal moves exist for the player

## Acceptance Criteria

1. Stalemate detected when player has no legal moves but not in check
2. Game ends in draw (not checkmate) on stalemate
3. Correct message displayed to players

## Dependencies

- Check/checkmate detection must be working first
- Legal move calculation must be working first

## Open Questions

- v0 draw is stalemate only. Threefold, 50-move, and insufficient material stay future specs.
