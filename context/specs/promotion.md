# Promotion

## Goal

Let a pawn that reaches the last rank become a queen, rook, bishop, or knight.

## User Experience

The player moves the pawn to the last rank, then picks the piece. The board updates to that piece.

## Functional Requirements

- All four promotion choices are legal when the move is otherwise legal
- Capture-promotions are included
- The chosen piece belongs to the moving player
- Auto-queen is not the only option

## Technical Requirements

- Each choice is a separate move with `promotion` set
- The web UI asks before applying when more than one promotion exists for that square

## Edge Cases

- A promotion that leaves the king in check is illegal
- Promotion can deliver check or checkmate

## Acceptance Criteria

1. Four promotion moves are generated for a legal last-rank pawn move
2. The selected piece appears on the board
3. An illegal promotion is rejected

## Dependencies

- Pawn movement

## Open Questions

- None. Underpromotion is allowed.
