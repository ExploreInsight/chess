# Game Reset

## Goal

Allow players to reset the game to the initial starting position at any time.

## User Experience

A "New Game" or "Reset" button below the board. Clicking it resets all pieces to starting positions, clears move history, and sets white to move.

## Functional Requirements

- Button visible below the board
- Clicking resets:
  - All pieces to starting positions
  - Current player to white
  - Move history to empty
  - Check/checkmate/draw states to false
  - Winner to null
- Game restarts immediately without confirmation

## Technical Requirements

- `createInitialBoard()` function already exists
- `createInitialGameState()` function already exists
- Reset button component
- Click handler calls reset function

## Edge Cases

- Reset during checkmate game - should still work
- Reset mid-move-animation - no animations in v0

## Acceptance Criteria

1. Button is visible and clickable
2. Board returns to initial position
3. Turn resets to white
4. All game state flags reset
5. Move history clears

## Dependencies

- Game state structure must be defined first
