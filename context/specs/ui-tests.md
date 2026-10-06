# UI Tests

## Goal

Add a test suite for the portable board component in `packages/ui`, so changes to the flat board are caught by automated tests.

## User Experience

No user-visible change. Tests run via `bun test` in `packages/ui` alongside the existing domain tests.

## Functional Requirements

- A test file exercises the `ChessBoard` component for the following behaviors:
  1. Renders 32 pieces in the starting position.
  2. Each square has the correct ARIA label: file + rank + colour + piece type, e.g. "e2, white pawn".
  3. Clicking a white piece in the starting position selects it (sets `aria-selected="true"`) and exposes its legal-move targets as highlighted squares.
  4. Clicking a target square fires `onSquareClick` with that target's position.
  5. A king in check has its square tinted with the check highlight class.
  6. A legal-move destination that holds an enemy piece is tinted with the capture-tile color (the same green as the selected square).
  7. Empty legal-move destinations render the gray move-dot indicator.
- Tests are stable, fast (under 2 s for the full file), and have no flaky timings.

## Technical Requirements

- `packages/ui` gains `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `happy-dom` as devDependencies. No new runtime dependency.
- A `vitest.config.ts` in `packages/ui` declares the test environment and the `tsconfig` test inclusion (the package's existing `tsconfig.json` may need `"types": ["vitest/globals"]` or the `vite/client` types referenced; follow the smallest viable change).
- The existing `tsconfig.json` for the package is updated only if vitest types require it; no domain code is reshuffled.
- `packages/chess` is not modified. The web app and 3D app are not modified.
- The repo's `turbo.json` does not need a new task; `bun run --filter @chess-game/ui test` is the entry point (it runs `vitest run` in the package).

## Edge Cases

- A test that needs to render a board with a king in check must construct a custom `board` and `checkedKing` prop.
- Tests must not depend on font rendering of the Unicode glyphs (assert class names, not pixel colors).

## Acceptance Criteria

1. `bun run --filter @chess-game/ui test` runs the new tests and they pass.
2. `bun test packages/chess` still passes 12 tests.
3. `bun run typecheck` and `bun run build` pass.
4. No production file is wrapped in test-only code paths.

## Dependencies

- `packages/ui`

## Open Questions

- None. Scope is `packages/ui` only; the 3D app and web app wiring remain untested in this round.
