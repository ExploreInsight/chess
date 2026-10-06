# Algebraic Notation

## Goal

Render every move in Standard Algebraic Notation (SAN) in both the web and 3D apps, so players can read a move list and follow the game.

## User Experience

A move list panel sits beside the board in each app. It shows every move played so far, paired as `1. e4 e5  2. Nf3 Nc6 ...`. The most recent pair is highlighted. The list auto-scrolls to the latest move. Selecting an entry highlights the corresponding source and destination squares on the board.

## Functional Requirements

- Every legal move is rendered in Standard Algebraic Notation: castling `O-O` / `O-O-O`, pawn moves without prefix (e.g. `e4`), pawn captures with file and `x` (e.g. `exd5`), en passant appends `e.p.` (e.g. `exd6 e.p.`), piece captures `Nxe4`, promotion `e8=Q`, check `+`, mate `#`.
- Disambiguation follows standard SAN rules: prefer the file when two of the same piece type can reach the same square, then the rank, then both.
- The move list shows full moves (one per pair) and is read top-to-bottom.
- The list does not include moves played after the game ends.
- The list is empty before the first move.

## Technical Requirements

- A new engine function `toAlgebraic(move: Move, state: GameState): string` lives in `packages/chess` and produces the SAN string for the move, evaluated against the state BEFORE the move.
- The move list and per-move highlighting are added to `apps/web` and `apps/board-3d`. The 3D panel uses the same DOM as the web app's panel (extract or duplicate; both apps already own their own UI).
- Domain tests cover: pawn move, pawn capture, piece move, piece capture, knight disambiguation by file and by rank, both-file-and-rank, kingside castling, queenside castling, promotion, en passant, check, mate, and the no-move case.
- No external dependency; SAN is computed by hand.

## Edge Cases

- A pawn promoting to knight / rook / bishop / queen still produces a legal SAN.
- A move that delivers check, after a prior double-check, is still `+` (no double-check marker in SAN).
- The "no SAN" case (game not started) returns an empty string.

## Acceptance Criteria

1. `bun test packages/chess` adds at least 10 SAN tests and the existing 12 tests still pass.
2. `bun run typecheck` and `bun run build` pass.
3. The web and 3D apps render the move list next to the board and highlight the latest pair.
4. `Nf3`, `exd5`, `O-O`, `e8=Q`, `Nxe4+`, and `Qh7#` all round-trip from legal moves in domain tests.

## Dependencies

- `packages/chess`

## Open Questions

- None. The scope is SAN only; full PGN export is a separate spec.
