# Piece Movement

## Goal

Allow players to select pieces and move them to valid squares according to chess rules.

## User Experience

1. User clicks on a piece belonging to the current player
2. The square is highlighted as selected
3. Valid destination squares are shown with a dot indicator
4. User clicks a valid square to move the piece
5. The piece moves to the new square
6. Turn switches to the other player

## Functional Requirements

- Click to select a piece
- Highlight selected square
- Show valid moves with visual indicator
- Click valid square to execute move
- Update board state after move
- Switch current player after move
- Deselect when clicking elsewhere or on invalid square

## Technical Requirements

- Selection state managed in app component
- Move validation functions in `packages/chess`
- Legal moves calculated based on piece type and board state
- Pawn special moves: single/double first move, en passant (future), promotion
- Other pieces: rook, knight, bishop, queen, king movement patterns

## Edge Cases

- Cannot select opponent's pieces
- Cannot move when in check (must resolve check)
- Double-click should not behave differently
- Clicking same piece twice deselects it

## Acceptance Criteria

1. Only current player's pieces can be selected
2. Selected square shows visual highlight
3. Valid moves show indicator on each square
4. Piece moves to clicked valid square
5. Board updates immediately after move
6. Turn indicator updates after move
7. Invalid clicks are ignored (no state change)

## Dependencies

- Chessboard component must be working first
