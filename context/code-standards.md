# Code Standards

## General

- TypeScript-first. Strict typing.
- Small, focused modules. Clear names.
- One responsibility per file, component, and function.
- No unnecessary abstractions.
- Prefer composition over inheritance.
- Game logic stays out of UI.
- Reusable domain logic belongs in `packages/chess`.
- Do not duplicate chess logic between web and future mobile.
- Keep dependencies minimal.
- Follow existing conventions before adding new ones.
- Fix root causes. Do not layer workarounds.

## TypeScript

- Avoid `any`.
- Prefer explicit types.
- Use `unknown` for unknown external values, then narrow before use.
- Avoid unnecessary assertions.
- Prefer discriminated unions for domain states when they make illegal states unrepresentable.
- Domain types live in `packages/chess`. Do not copy them into apps.
- Prefer `import type` for type-only imports.
- `interface` for object shapes that may be extended. `type` for unions and simple aliases.

## Import Organization

Every source file uses this order. Skip a section if it has no imports. One blank line between sections. No empty sections. No custom comment wording.

```ts
// ** import types
import type { Position } from "./types";

// ** import utils
import { calculateSomething } from "./utils";

// ** import lib
import { ChessBoard } from "@/components/ChessBoard";

// ** import apis
import { getGame } from "@/api/game";

// ** import constants
import { BOARD_SIZE } from "./constants";

// ** import styles
import "./styles.css";
```

Rules:

- Exact format: `// ** import [category]`
- Categories, in order: `types`, `utils`, `lib`, `apis`, `constants`, `styles`
- Do not write variations such as `// ** import lib utilities`
- Do not add extra descriptive text
- Group related imports under the same header
- Type-only imports use `import type` and belong under `types`
- Avoid circular imports
- There is no API layer yet. Do not add `apis` imports until a spec requires them.

## Naming

| Thing          | Convention        | Example               |
| -------------- | ----------------- | --------------------- |
| Files          | kebab-case        | `move-validator.ts`   |
| Types          | PascalCase        | `GameState`           |
| Functions      | camelCase         | `getLegalMoves`       |
| Constants      | UPPER_SNAKE_CASE  | `BOARD_SIZE`          |

Prefer domain names. Do not create `utils.ts` or `helpers.ts` as a dumping ground.

## File Size

Guidelines, not quotas:

- under 250 lines: normal
- 250–350: review responsibility
- over 350: split when practical

Split when responsibility changes, concepts are independent, or logic can be tested alone. Do not split into meaningless fragments.

## React

- Functional components only.
- One clear responsibility.
- Props type above the component. Destructure in the signature.
- No chess rules inside presentation components.
- No giant board component that also validates moves, detects mate, and owns networking.
- Prefer composition.
- Business and game logic stay outside presentation components.

Bad:

```text
ChessBoard
 ├── movement rules
 ├── check detection
 ├── networking
 └── rendering
```

Preferred:

```text
ChessBoard UI → app wiring → packages/chess
```

## Abstractions

Do not abstract for hypothetical future requirements.

Before creating one, all of these should be true:

1. There is actual duplication, or more than one meaningful consumer.
2. It reduces coupling.
3. It improves readability.
4. It is needed now.

Avoid premature base classes, managers, services, factories, generic wrappers, and deep inheritance.

Patterns, only when justified:

- Factory: meaningful branching or repeated construction. A future `createChessPiece(type, color)` is acceptable. A factory around a plain object is not.
- Strategy: multiple interchangeable algorithms that exist now, or are required by the current spec.
- Adapter: translating an external interface into an internal one.
- Repository: not until persistence exists.

## Packages

1. `packages/chess` — no React, no DOM, no app imports.
2. `packages/ui` — presentation only. May use chess types. Must not implement rules.
3. `apps/web` — composition and browser behavior.
4. `apps/mobile` — placeholder only.
5. Packages never import from apps.

## Testing

Chess correctness is tested in the domain package, not only through the UI.

Prioritize, once those features are specified and implemented:

- Initial board
- Piece movement
- Legal moves
- Captures
- Turns
- Check
- Checkmate
- Stalemate
- Draw conditions
- Special chess rules

Do not add a test runner until the first domain feature is approved. Do not mark rules complete without domain tests.

## Styling

- Tailwind CSS v4 is the only styling tool in the apps. No plain CSS files, no CSS-in-JS.
- Tokens live in the app stylesheet under `@theme`. Do not hardcode hex values in components.
- Use `cn()` from `apps/web/src/lib/utils.ts` for conditional classes.
- shadcn/ui components live in `apps/web/src/components/ui`. Components are copied in, not imported from a package.
- Radix and React Aria stay in `apps/web` because they need the DOM. Never put them in `packages/ui`.
- `packages/ui` may use Tailwind classes and portable React only.

## Accessibility

- Every interactive element is reachable and operable by keyboard.
- The board is an ARIA grid. Squares are labelled with file, rank, and piece, such as "e2, white pawn".
- Arrow keys move focus between squares. Home and End jump to the row edges.
- Status and result changes are announced through a live region.
- Dialogs trap focus and close on Escape.
- Focus is always visible. Never remove focus rings without a replacement.
- Groups of related controls get an accessible group label.

## Verification

- `bun run typecheck` and `bun run build` must pass before a feature is called done.
- Do not mark incomplete work complete in `context/progress-tracker.md`.

## Documentation Sync

- Architecture or package boundaries → `context/architecture.md`
- Conventions → this file
- Visual rules → `context/ui-context.md`
- Product scope → `context/project-overview.md`
- Feature behavior → `context/specs/*`
- Completed work → `context/progress-tracker.md`
