# Code Standards

## General

- Keep modules small and single-purpose
- Fix root causes, do not layer workarounds
- Do not mix unrelated concerns in one component or function
- Avoid unnecessary abstractions until they are actually needed
- Keep business/game logic separate from UI code

## TypeScript

- Strict mode is required throughout the project
- Avoid `any` — use explicit interfaces or narrowly scoped types
- Validate unknown external input at system boundaries
- Use `unknown` for values of unknown type, then narrow appropriately
- Prefer `type` over `interface` for simple type definitions
- Use `interface` for object shapes that may be extended

## Import Organization

Always organize imports with proper comment headers and spacing:

```typescript
// ** import types
import type { TypeName, AnotherType } from "@/types/module";

// ** import utils
import { utilFunction } from "wxt/utils/module";

// ** import lib
import { LibClass } from "@/lib/module";
import { AnotherClass } from "./localModule";

// ** import apis
import { apiFunction } from "@/api/module";

// ** import constants
import { CONSTANT_VALUE } from "./constants";

// ** import styles
import "@/entrypoints/style.css";
```

### Rules

1. Always add 1 line space between different import sections
2. Use exact comment format: `// ** import [category]`
3. Group related imports under the same comment section
4. Order from abstract to concrete: types → utils → lib → apis → constants → styles
5. No additional descriptive text in comments - just the category name

### Categories

- `// ** import types` - TypeScript type imports only
- `// ** import utils` - Utility functions and helpers
- `// ** import lib` - Library/class imports from local modules
- `// ** import apis` - API-related imports
- `// ** import constants` - Constant/configuration imports
- `// ** import styles` - CSS/style imports

### Examples

✅ Good:

```typescript
// ** import types
import type { FormField } from "@/types/extension";

// ** import lib
import { ElementUtils } from "./elementUtils";
import { SoundManager } from "@/lib/utils/soundManager";
```

❌ Bad:

```typescript
import type { FormField } from "@/types/extension";
import { ElementUtils } from "./elementUtils";
import { SoundManager } from "@/lib/utils/soundManager";
```

❌ Bad:

```typescript
// ** import types
import type { FormField } from "@/types/extension";
// ** import lib utilities
import { ElementUtils } from "./elementUtils";
```

## File Organization

- `src/` — Source code
- `src/index.ts` — Public exports only
- Subdirectories for grouping related code by feature
- One concept per file when possible
- Group API functions by feature/domain in dedicated folders

## Naming Conventions

| Thing         | Convention         | Example                    |
| ------------- | ------------------ | -------------------------- |
| Files         | kebab-case         | `game-state.ts`            |
| Types/Classes | PascalCase         | `GameState`, `ChessBoard`  |
| Functions     | camelCase          | `calculateLegalMoves`      |
| Constants     | UPPER_SNAKE_CASE   | `MAX_BOARD_SIZE`           |
| Interfaces    | PascalCase         | `Move`, `Position`         |

## Component Rules

- Functional components with hooks (no class components)
- Props interface defined above component
- Destructure props in function signature
- Colocate component styles when practical
- API functions should be separate from React components
- Use centralized axios configuration for API calls

## Code Splitting Rules

### API Code Splitting

When API files become large or contain multiple endpoints, follow these splitting rules:

#### 1. Single Responsibility Principle

- One API endpoint per file
- One schema per file
- Each file should handle exactly one operation

#### 2. Domain-Based Folder Structure

```
src/api/
├── config/
│   └── axios.ts              # Centralized axios configuration
├── features/
│   ├── feature-name/
│   │   ├── get-feature.ts    # GET endpoint
│   │   ├── create-feature.ts # POST endpoint
│   │   └── index.ts          # Export all
```

#### 3. File Naming Conventions

- Use kebab-case for file names
- Use descriptive action-resource naming:
  - `get-products.ts` - List products
  - `get-product-details.ts` - Single product
  - `create-product.ts` - Create product
  - `update-product-status.ts` - Update specific field

#### 4. Index File Pattern

Each domain folder must have an `index.ts` that exports all functions:

```typescript
export { getProducts } from "./get-products";
export { createProduct } from "./create-product";
```

## Package Rules

1. `packages/chess` — No React imports, no UI code, pure game logic
2. `packages/ui` — React components that use chess types
3. `apps/web` — Main application, uses both packages
4. Never mix chess rules into UI components

## Turborepo

- Tasks: `build`, `dev`, `lint`, `type-check`
- Apps depend on packages via `dependsOn: ["^build"]`
- Shared configs in `packages/config/`
- Never reference apps from packages (dependency direction)

## Build and Verification

- `bun run build` must pass before pushing
- `bun run typecheck` must pass before pushing
- Run relevant checks after each feature implementation
- Do not mark work complete until checks pass

## Quality Checklist

Before implementing new API functionality:

- [ ] API function is in appropriate domain folder
- [ ] Uses centralized axios configuration
- [ ] Follows established naming conventions
- [ ] Includes proper TypeScript types
- [ ] Component remains focused on UI logic only
