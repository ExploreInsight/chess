import { describe, expect, test } from "bun:test";

import { createEmptyBoard } from "./board";
import { positionKey } from "./draws";
import { applyMove, createInitialGameState, evaluatePosition, getLegalMoves, resign, undoMove } from "./game";
import type { Board, GameState, Move, PlayerColor } from "./types";

function sitting(board: Board, currentPlayer: PlayerColor, halfmoveClock = 0): GameState {
  const draft: GameState = {
    board,
    currentPlayer,
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    winner: null,
    result: null,
    moveHistory: [],
    halfmoveClock,
    positionHistory: [],
    history: [],
  };
  draft.positionHistory = [positionKey(draft)];
  return evaluatePosition(draft);
}

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
    const state = sitting(board, "white");
    const choices = getLegalMoves(state, { row: 1, col: 0 }).filter(
      (move) => move.to.row === 0 && move.to.col === 1,
    );
    expect(choices.map((move) => move.promotion)).toEqual(["queen", "rook", "bishop", "knight"]);

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
    const state = sitting(board, "black");

    expect(state.isCheck).toBe(false);
    expect(state.isCheckmate).toBe(false);
    expect(state.isDraw).toBe(true);
    expect(state.winner).toBeNull();
  });
});

describe("blocking, castling, and en passant", () => {
  test("a rook cannot pass through a pawn", () => {
    const board = createEmptyBoard();
    board[7][0] = { type: "rook", color: "white", hasMoved: false };
    board[7][1] = { type: "pawn", color: "white", hasMoved: false };
    board[7][4] = { type: "king", color: "white", hasMoved: false };
    board[0][4] = { type: "king", color: "black", hasMoved: false };
    const state = sitting(board, "white");

    const destinations = getLegalMoves(state, { row: 7, col: 0 }).map((move) => move.to.col);
    expect(destinations).not.toContain(2);
    expect(destinations).not.toContain(3);
  });

  test("white can castle both sides when the path is clear", () => {
    const board = createEmptyBoard();
    board[7][4] = { type: "king", color: "white", hasMoved: false };
    board[7][0] = { type: "rook", color: "white", hasMoved: false };
    board[7][7] = { type: "rook", color: "white", hasMoved: false };
    board[0][4] = { type: "king", color: "black", hasMoved: false };
    const state = sitting(board, "white");

    const castles = getLegalMoves(state, { row: 7, col: 4 }).filter((move) => move.castle);
    expect(castles.map((move) => move.castle).sort()).toEqual(["kingside", "queenside"]);

    const kingside = play(state, [7, 4], [7, 6]);
    expect(kingside.board[7][6]?.type).toBe("king");
    expect(kingside.board[7][5]?.type).toBe("rook");
    expect(kingside.board[7][7]).toBeNull();
  });

  test("cannot castle through check", () => {
    const board = createEmptyBoard();
    board[7][4] = { type: "king", color: "white", hasMoved: false };
    board[7][7] = { type: "rook", color: "white", hasMoved: false };
    board[0][5] = { type: "rook", color: "black", hasMoved: true };
    board[0][0] = { type: "king", color: "black", hasMoved: false };
    const state = sitting(board, "white");

    expect(getLegalMoves(state, { row: 7, col: 4 }).some((move) => move.castle === "kingside")).toBe(false);
  });

  test("captures en passant on the next move only", () => {
    let state = createInitialGameState();
    state = play(state, [6, 4], [4, 4]);
    state = play(state, [1, 0], [2, 0]);
    state = play(state, [4, 4], [3, 4]);
    state = play(state, [1, 3], [3, 3]);
    state = play(state, [3, 4], [2, 3]);

    expect(state.board[2][3]?.type).toBe("pawn");
    expect(state.board[2][3]?.color).toBe("white");
    expect(state.board[3][3]).toBeNull();
  });
});

describe("rule-book draws", () => {
  test("ends on insufficient material", () => {
    const board = createEmptyBoard();
    board[0][0] = { type: "king", color: "black", hasMoved: true };
    board[7][7] = { type: "king", color: "white", hasMoved: true };
    board[4][4] = { type: "bishop", color: "white", hasMoved: true };

    expect(sitting(board, "white").result).toBe("insufficient-material");
  });

  test("ends after fifty moves without a pawn move or capture", () => {
    const board = createEmptyBoard();
    board[0][0] = { type: "king", color: "black", hasMoved: true };
    board[7][7] = { type: "king", color: "white", hasMoved: true };
    board[7][0] = { type: "rook", color: "white", hasMoved: true };

    const state = sitting(board, "white", 99);
    const next = play(state, [7, 0], [6, 0]);
    expect(next.result).toBe("fifty-move");
    expect(next.isDraw).toBe(true);
  });
});

describe("undoMove", () => {
  test("returns null when there is no move to undo", () => {
    const state = createInitialGameState();
    expect(undoMove(state)).toBeNull();
  });

  test("returns null when the game is over (resignation)", () => {
    const state = createInitialGameState();
    const resigned = resign(state);
    expect(resigned.winner).toBe("black");
    expect(undoMove(resigned)).toBeNull();
  });

  test("reverses a pawn move and restores the side to move", () => {
    let state = createInitialGameState();
    state = play(state, [6, 4], [4, 4]);
    const undone = undoMove(state);
    expect(undone).not.toBeNull();
    if (!undone) return;
    expect(undone.currentPlayer).toBe("white");
    expect(undone.board[6][4]?.type).toBe("pawn");
    expect(undone.board[4][4]).toBeNull();
    expect(undone.moveHistory).toHaveLength(0);
  });

  test("reverses a capture", () => {
    const board = createEmptyBoard();
    board[0][0] = { type: "king", color: "black", hasMoved: true };
    board[7][7] = { type: "king", color: "white", hasMoved: true };
    board[3][3] = { type: "rook", color: "white", hasMoved: true };
    board[3][4] = { type: "bishop", color: "black", hasMoved: true };
    let state = sitting(board, "white");
    state = play(state, [3, 3], [3, 4]);
    expect(state.board[3][4]?.color).toBe("white");
    const undone = undoMove(state);
    if (!undone) throw new Error("expected undo");
    expect(undone.board[3][3]?.color).toBe("white");
    expect(undone.board[3][4]?.color).toBe("black");
  });

  test("reverses a kingside castle", () => {
    const board = createEmptyBoard();
    board[0][0] = { type: "king", color: "black", hasMoved: true };
    board[7][7] = { type: "king", color: "white", hasMoved: true };
    board[7][4] = { type: "king", color: "white", hasMoved: false };
    board[7][7] = { type: "rook", color: "white", hasMoved: false };
    let state = sitting(board, "white");
    const castled = play(state, [7, 4], [7, 6]);
    expect(castled.board[7][6]?.type).toBe("king");
    expect(castled.board[7][5]?.type).toBe("rook");
    const undone = undoMove(castled);
    if (!undone) throw new Error("expected undo");
    expect(undone.board[7][4]?.type).toBe("king");
    expect(undone.board[7][7]?.type).toBe("rook");
    expect(undone.board[7][5]).toBeNull();
  });

  test("reverses a promotion", () => {
    const board = createEmptyBoard();
    board[0][7] = { type: "king", color: "black", hasMoved: true };
    board[7][7] = { type: "king", color: "white", hasMoved: true };
    board[1][0] = { type: "pawn", color: "white", hasMoved: true };
    let state = sitting(board, "white");
    const promoted = applyMove(state, {
      from: { row: 1, col: 0 },
      to: { row: 0, col: 0 },
      promotion: "queen",
    });
    expect(promoted.board[0][0]?.type).toBe("queen");
    const undone = undoMove(promoted);
    if (!undone) throw new Error("expected undo");
    expect(undone.board[1][0]?.type).toBe("pawn");
    expect(undone.board[0][0]).toBeNull();
  });

  test("reverses an en passant capture", () => {
    const board = createEmptyBoard();
    board[0][0] = { type: "king", color: "black", hasMoved: true };
    board[7][7] = { type: "king", color: "white", hasMoved: true };
    board[3][2] = { type: "pawn", color: "white", hasMoved: true };
    board[1][3] = { type: "pawn", color: "black", hasMoved: false };
    let state = sitting(board, "black");
    state = play(state, [1, 3], [3, 3]);
    const ep = applyMove(state, { from: { row: 3, col: 2 }, to: { row: 2, col: 3 }, enPassant: true });
    expect(ep.board[2][3]?.color).toBe("white");
    expect(ep.board[3][3]).toBeNull();
    const undone = undoMove(ep);
    if (!undone) throw new Error("expected undo");
    expect(undone.board[3][2]?.color).toBe("white");
    expect(undone.board[3][3]?.color).toBe("black");
  });
});
