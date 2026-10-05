# 3D Piece Models

## Goal

Replace the procedural primitives used for chess pieces in `apps/board-3d` with classic Staunton-style GLB models so the board looks like a physical wooden chess set, without touching chess rules, interaction, or camera behaviour.

## User Experience

White pieces read as pale polished boxwood/ivory, black pieces as dark walnut/ebony. Every piece is recognisable by silhouette alone: the king's cross, the queen's coronet, the bishop's slit mitre, the rook's crenellations, a proper horse head on the knight, and a turned pawn. Pieces sit flush on their squares, scale in correct tournament proportion to each other, and cast shadows onto the board.

## Functional Requirements

- All 32 pieces render from GLB models instead of cylinders, cones, spheres, and boxes.
- White and black use distinct wood tones: light warm wood for white, dark walnut/ebony for black.
- Piece heights follow tournament proportion relative to the king: queen 0.87, bishop 0.70, knight 0.67, rook 0.60, pawn 0.53.
- The knight renders with a readable horse silhouette and faces the opposing side of the board.
- Every piece rests on the surface of its square, never floating or clipping through it.
- If a model fails to load, the existing procedural piece renders instead; the board stays playable.
- While models are loading, the board, tiles, highlights, and controls render normally.
- Selection, legal-move targets, check highlight, click-to-move, promotion, resign, agree draw, new game, and orbit camera behave exactly as before.
- No chess rule is read, computed, or duplicated in this app.

## Technical Requirements

- Models live in `apps/board-3d/public/models/` and are served by Vite as static files.
- Source: `polyyai.itch.io/3d-chess-pieces-pack`, licensed CC0 1.0 (public domain dedication, no attribution required). Provenance is recorded in this spec.
- Use the low-poly LOD variants (3,600-4,600 triangles per piece); committed asset total target is under ~8 MB, achieved by resizing embedded textures to at most 512px only if the measurement requires it.
- Load models with `useGLTF` from the already-installed `@react-three/drei`. No new runtime dependency.
- Normalise every model at load: measure its bounding box, scale to the target height, re-centre on x/z, and anchor the minimum y to the tile surface.
- Share GPU resources: parse each URL once through the drei/three loader cache and render per-instance `scene.clone(true)`, which shares geometry and material references. `InstancedMesh` is not used: there are 12 distinct geometries, per-square transforms, and raycast targets for only 32 draw calls.
- Preload all model URLs once so pieces do not pop in one at a time.
- Piece models sit in their own module. `src/piece-assets.ts` is the manifest, `src/piece-model.tsx` is the loader/normaliser, `src/piece-fallback.tsx` holds the procedural fallback and its error boundary, and `src/pieces.tsx` only orchestrates the two.
- Files stay under 250 lines with one responsibility each. Import headers follow `context/code-standards.md`.
- `packages/chess` is not modified. `App.tsx` game wiring is not modified.

## Edge Cases

- A GLB is missing or corrupt: the error boundary renders the procedural piece for that square and the game remains playable.
- A model has unexpected scale or origin: normalisation is computed from the measured bounding box, never assumed.
- A model is off-centre or rotated (notably the knight): re-centring and a per-side yaw constant handle it.
- WebGL context unavailable or slow first paint: tiles and controls still render; pieces appear when parsing completes.
- Screenshot verification may fail if headless WebGL is unavailable; that is a verification limitation, not a product defect.

## Acceptance Criteria

1. `bun test packages/chess` passes with 12 tests, unchanged.
2. `bun run typecheck` passes.
3. `bun run build` passes, including `@chess-game/board-3d`.
4. `git diff` shows no change under `packages/chess` or `apps/web`.
5. A headless Brave screenshot of the starting position shows 32 Staunton pieces, correct wood colours, seated on their squares.
6. No piece floats above or sinks below its tile.
7. Clicking a piece and a legal square still changes the shared game state.
8. With a model URL deliberately broken, that square falls back to the procedural piece and the game stays playable.
9. `context/progress-tracker.md` records only this verified work.

## Dependencies

- `packages/chess` (types only, unchanged)
- `@react-three/drei` (already installed)
- CC0 model pack from `https://polyyai.itch.io/3d-chess-pieces-pack`

## Open Questions

- None. This is a presentation change; the ruleset and interaction model are already specified by `context/specs/board-3d.md`.
