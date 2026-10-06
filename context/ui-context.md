# UI Context

## Theme

Classic physical chessboard aesthetic. Traditional and clean — not a gaming dashboard. Feels like sitting at a real chess table with a quality wooden set.

## Styling System

Tailwind CSS v4 with `@tailwindcss/vite`. Tokens are defined in each app's `src/styles.css` under `@theme`.

shadcn/ui provides the component primitives. React Aria provides accessible behavior for dialogs and focus.

Components in `packages/ui` use Tailwind utility classes with the same token names, so the web app and the 3D app look identical.

## Color Palette

| Role              | CSS Variable           | Value     | Description                    |
| ----------------- | --------------------- | --------- | ------------------------------ |
| Light square      | `--square-light`      | `#F0D9B5` | Cream/ivory wood               |
| Dark square       | `--square-dark`       | `#B58863` | Brown walnut wood              |
| Selected square   | `--square-selected`   | `#829769` | Muted green highlight          |
| Valid move dot    | `--move-indicator`    | `#696969` | Gray circle for valid moves    |
| Check highlight   | `--square-check`      | `#E74C3C` | Red glow for king in check     |
| Page background   | `--bg-page`           | `#312E2B` | Dark wood table background     |
| Surface           | `--bg-surface`        | `#272522` | Slightly darker panel           |
| Text primary      | `--text-primary`      | `#FFFFFF` | White text                      |
| Text muted        | `--text-muted`        | `#9B9B9B` | Gray secondary text             |

## Typography

| Role      | Font                   | Variable        |
| --------- | ---------------------- | --------------- |
| UI text   | Inter, system-ui, sans | `--font-sans`   |
| Piece     | Chess symbols/sets     | Unicode pieces  |

## Chess Pieces

Use Unicode chess symbols for initial implementation:

| Piece | White | Black |
| ----- | ----- | ----- |
| King   | ♔     | ♚     |
| Queen  | ♕     | ♛     |
| Rook   | ♖     | ♜     |
| Bishop | ♗     | ♝     |
| Knight | ♘     | ♞     |
| Pawn   | ♙     | ♟     |

White pieces are drawn ivory with a dark outline so they stay visible on light squares. Black pieces are drawn near-black. Both use the `--color-piece-white` / `--color-piece-black` tokens, which the 3D board shares.

## Layout Patterns

- Centered chessboard on page
- Board is square, responsive sizing (min 320px, max 560px)
- Subtle shadow under board for depth
- Game status text below board
- Reset button below status
- Dark wood-grain background behind board

## Design Rules

**Do:**

- Clean, traditional chessboard look
- Subtle shadows and depth
- Clear piece contrast
- Simple piece symbols
- Minimal UI chrome

**Don't:**

- Futuristic or neon styling
- Excessive gradients
- Complex animations
- Gaming dashboard aesthetics
- Colorful or cartoonish pieces

## Component Inventory

### Chessboard

- 8x8 grid of alternating light/dark squares
- Subtle border and shadow
- Responsive but maintains square aspect ratio

### Square

- Light or dark based on position
- Highlight states: default, selected, valid-move, check
- Cursor pointer when contains selectable piece

### Piece

- Unicode symbol centered in square
- Appropriate font size for square
- Draggable (future enhancement)

### Game Status

- Shows current turn (White/Black to move)
- Shows check, checkmate, or draw state
- Clean text below board

### Reset Button

- Simple button below board
- Resets game to initial position
