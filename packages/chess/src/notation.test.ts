import { describe, expect, test } from "bun:test";

import { applyMove, createInitialGameState } from "./game";
import { toAlgebraic } from "./notation";

function play(state: ReturnType<typeof createInitialGameState>, from: [number, number], to: [number, number]) {
  return applyMove(state, { from: { row: from[0], col: from[1] }, to: { row: to[0], col: to[1] } });
}

function customBefore(): ReturnType<typeof createInitialGameState> {
  const before = createInitialGameState();
  for (let c = 0; c < 8; c += 1) before.board[0][c] = null;
  before.board[0][1] = { type: "king", color: "black", hasMoved: true };
  before.board[1][0] = { type: "pawn", color: "white", hasMoved: true };
  return before;
}

describe("toAlgebraic", () => {
  test("pawn move", () => {
    const before = createInitialGameState();
    const move = { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } };
    expect(toAlgebraic(move, before)).toBe("e4");
  });

  test("pawn capture", () => {
    const before = createInitialGameState();
    for (let c = 0; c < 8; c += 1) before.board[0][c] = null;
    before.board[0][1] = { type: "king", color: "black", hasMoved: true };
    before.board[1][1] = { type: "bishop", color: "black", hasMoved: true };
    before.board[2][0] = { type: "pawn", color: "white", hasMoved: true };
    const move = { from: { row: 2, col: 0 }, to: { row: 1, col: 1 } };
    expect(toAlgebraic(move, before)).toBe("axb7");
  });

  test("knight move", () => {
    const before = createInitialGameState();
    const move = { from: { row: 7, col: 1 }, to: { row: 5, col: 2 } };
    expect(toAlgebraic(move, before)).toBe("Nc3");
  });

  test("kingside castle", () => {
    const before = customBefore();
    const move = { from: { row: 7, col: 4 }, to: { row: 7, col: 6 }, castle: "kingside" as const };
    const after = applyMove(before, move);
    expect(after.result).toBeNull();
    expect(toAlgebraic(move, before)).toBe("O-O");
  });

  test("queenside castle", () => {
    const before = customBefore();
    const move = { from: { row: 7, col: 4 }, to: { row: 7, col: 2 }, castle: "queenside" as const };
    const after = applyMove(before, move);
    expect(after.result).toBeNull();
    expect(toAlgebraic(move, before)).toBe("O-O-O");
  });

  test("promotion to queen with check", () => {
    const before = customBefore();
    const move = { from: { row: 1, col: 0 }, to: { row: 0, col: 0 }, promotion: "queen" as const };
    expect(toAlgebraic(move, before)).toBe("a8=Q+");
  });

  test("check suffix on a non-castling move", () => {
    const before = createInitialGameState();
    for (let c = 0; c < 8; c += 1) {
      before.board[0][c] = null;
      before.board[1][c] = null;
    }
    before.board[0][4] = { type: "king", color: "black", hasMoved: true };
    before.board[3][3] = { type: "queen", color: "white", hasMoved: true };
    const move = { from: { row: 3, col: 3 }, to: { row: 0, col: 3 } };
    const after = applyMove(before, move);
    expect(after.isCheck).toBe(true);
    expect(toAlgebraic(move, before)).toBe("Qd8+");
  });

  test("checkmate suffix", () => {
    let s = createInitialGameState();
    s = play(s, [6, 5], [5, 5]);
    s = play(s, [1, 4], [3, 4]);
    s = play(s, [6, 6], [4, 6]);
    const before = s;
    const after = applyMove(s, { from: { row: 0, col: 3 }, to: { row: 4, col: 7 } });
    expect(after.isCheckmate).toBe(true);
    const lastMove = after.moveHistory.at(-1)!;
    expect(toAlgebraic(lastMove, before)).toMatch(/^Qh4#$/);
  });
});
