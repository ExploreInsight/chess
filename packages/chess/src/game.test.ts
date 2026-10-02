import { describe, expect, test } from "bun:test";

import { createEmptyBoard } from "./board";
import { applyMove, createInitialGameState, evaluatePosition, getLegalMoves } from "./game";
import type { GameState, Move } from "./types";

function play(state: GameState, from: [number, number], to: [number, number]): GameState {
  const move = getLegalMoves(state, { row: from[0], col: from[1] }).find(
    (candidate) => candidate.to.row === to[0] && candidate.to.col === to[1],
  );
  if (!move) throw new Error(`illegal move ${from.join(",")} -> ${to.join(",")}`);
  return applyMove(state, move);
}

describe("piece movement and turns", () => {
  test("white pawn can move one or two squares, then the turn switches", () => {
    const start = createInitialGameState();
    const pawnMoves = getLegalMoves(start, { row: 6, col: 4 });

    expect(pawnMoves.map((move) => move.to.row).sort()).toEqual([4, 5]);

    const afterWhite = play(start, [6, 4], [4, 4]);
    expect(afterWhite.currentPlayer).toBe("black");
    expect(afterWhite.board[4][4]?.type).toBe("pawn");
    expect(getLegalMoves(afterWhite, { row: 6, col: 4 })).toHaveLength(0);
  });

  test("rejects an opponent piece and an illegal destination", () => {
    const start = createInitialGameState();
    const illegal: Move = { from: { row: 6, col: 4 }, to: { row: 3, col: 4 } };

    expect(getLegalMoves(start, { row: 1, col: 4 })).toHaveLength(0);
    expect(applyMove(start, illegal)).toBe(start);
  });

  test("captures and promotes a pawn to a queen", () => {
    const board = createEmptyBoard();
    board[1][0] = { type: "pawn", color: "white", hasMoved: true };
    board[0][1] = { type: "rook", color: "black", hasMoved: true };
    board[7][7] = { type: "king", color: "white", hasMoved: true };
    board[0][7] = { type: "king", color: "black", hasMoved: true };
    const state = evaluatePosition({
      board,
      currentPlayer: "white",
      isCheck: false,
      isCheckmate: false,
      isDraw: false,
      winner: null,
      moveHistory: [],
    });

    const next = play(state, [1, 0], [0, 1]);
    expect(next.board[0][1]).toEqual({ type: "queen", color: "white", hasMoved: true });
  });
});

describe("check, checkmate, and draw", () => {
  test("detects scholar's mate", () => {
    let state = createInitialGameState();
    state = play(state, [6, 4], [4, 4]);
    state = play(state, [1, 4], [3, 4]);
    state = play(state, [7, 3], [3, 7]);
    state = play(state, [0, 1], [2, 2]);
    state = play(state, [7, 5], [4, 2]);
    state = play(state, [0, 6], [2, 5]);
    state = play(state, [3, 7], [1, 5]);

    expect(state.isCheck).toBe(true);
    expect(state.isCheckmate).toBe(true);
    expect(state.isDraw).toBe(false);
    expect(state.winner).toBe("white");
    expect(state.currentPlayer).toBe("black");
    expect(getLegalMoves(state, { row: 0, col: 4 })).toHaveLength(0);
  });

  test("detects stalemate when the side to move is not in check", () => {
    const board = createEmptyBoard();
    board[0][0] = { type: "king", color: "black", hasMoved: true };
    board[2][1] = { type: "queen", color: "white", hasMoved: true };
    board[7][7] = { type: "king", color: "white", hasMoved: true };
    const state = evaluatePosition({
      board,
      currentPlayer: "black",
      isCheck: false,
      isCheckmate: false,
      isDraw: false,
      winner: null,
      moveHistory: [],
    });

    expect(state.isCheck).toBe(false);
    expect(state.isCheckmate).toBe(false);
    expect(state.isDraw).toBe(true);
    expect(state.winner).toBeNull();
  });
});
