# UI System

## Goal

Move the interface onto Tailwind CSS with shadcn/ui primitives and React Aria for accessible behavior.

## User Experience

The board looks the same as before: wooden squares, cream and brown, Unicode pieces, dark table background. The difference is that the whole board is now reachable and operable from the keyboard, and the promotion choice appears in a real dialog.

## Functional Requirements

- Tailwind CSS v4 is the only styling tool for the apps
- shadcn/ui components live in the web app
- React Aria powers the promotion dialog
- The board is a real ARIA grid
- Arrow keys, Home, and End move focus between squares
- Enter or Space selects and moves a piece
- The turn and result are announced in a live region
- Focus is always visible
- The 3D app HUD is labelled and its status is announced

## Technical Requirements

- Web: Tailwind v4 through `@tailwindcss/vite`
- Web: `apps/web/src/components/ui` for shadcn components
- Web: `apps/web/src/lib/utils.ts` holds the `cn` helper
- `packages/ui` keeps only portable React and Tailwind classes
- Radix and React Aria stay in `apps/web` because they need the DOM
- Tokens live in `apps/web/src/styles.css` under `@theme`

## Edge Cases

- A square with a piece must have a clear label, such as "e2, white pawn"
- The promotion dialog must trap focus and close on Escape
- Keyboard focus must not land on a square that has no piece after a reset

## Acceptance Criteria

1. The board renders identically to the previous CSS version
2. The board can be played with the keyboard alone
3. Promotion opens an accessible dialog with four choices
4. The status text is announced when it changes
5. `bun run build` and `bun run type-check` pass

## Dependencies

- `packages/chess` for rules
- `packages/ui` for the board component

## Open Questions

- `packages/ui` uses Tailwind classes, so a future mobile app will need its own board component. Decide at mobile time.
