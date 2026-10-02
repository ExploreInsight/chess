# Chessboard

## Goal

Render a standard 8x8 chessboard with alternating light and dark squares.

## User Experience

User opens the web app and sees a chessboard with all pieces in starting position. The board is centered on the page with a dark wood background.

## Functional Requirements

- 8x8 grid of squares
- Alternating light (cream/ivory) and dark (brown/walnut) squares
- Standard chess starting position with all 32 pieces placed correctly
- Board has subtle border and shadow for depth
- Responsive sizing (min 320px, max 560px)

## Technical Requirements

- Component in `packages/ui/src/components/Board.tsx`
- Board data comes from `packages/chess` types
- Uses CSS Grid for layout
- Uses CSS variables from `context/ui-context.md`

## Edge Cases

- None for initial board rendering

## Acceptance Criteria

1. Board renders 64 squares in correct alternating pattern
2. All 32 pieces are in correct starting positions
3. Squares are labeled correctly (a-h, 1-8) - optional for v0
4. Board maintains square aspect ratio on resize
5. Colors match the defined palette exactly

## Dependencies

- None (this is the first feature)

## Open Questions

- Square coordinates (a-h, 1-8) are optional for v0. Confirm before implementation.
- Spec is drafted. Do not implement until architecture review is approved.
