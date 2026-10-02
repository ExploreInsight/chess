# Turn System

## Goal

Manage alternating turns between white and black players.

## User Experience

White always moves first. After each move, turn switches to the other player. A status display shows whose turn it is.

## Functional Requirements

- White always starts
- Turn alternates after each valid move
- Current turn displayed to users
- Turn does not change on invalid moves
- Turn does not change on captures
- Game state tracks current player

## Technical Requirements

- `currentPlayer` field in GameState type
- Turn switches in move execution function
- Turn display component shows "White to move" or "Black to move"
- Turn validation: only current player's pieces can be moved

## Edge Cases

- Attempting to move opponent's piece does nothing
- Game over states (checkmate/draw) suspend turn changes

## Acceptance Criteria

1. White is always first to move
2. Turn switches exactly once per move
3. UI displays current turn clearly
4. Cannot move opponent's pieces

## Dependencies

- Piece movement must be working first
