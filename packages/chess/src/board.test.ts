import { describe, expect, test } from "bun:test";

import { createInitialBoard } from "./board";

describe("createInitialBoard", () => {
  test("places 32 pieces in the standard starting position", () => {
    const board = createInitialBoard();
    const pieces = board.flat().filter((piece) => piece !== null);

    expect(pieces).toHaveLength(32);
    expect(board[0][0]).toEqual({ type: "rook", color: "black", hasMoved: false });
    expect(board[0][4]).toEqual({ type: "king", color: "black", hasMoved: false });
    expect(board[0][3]).toEqual({ type: "queen", color: "black", hasMoved: false });
    expect(board[1].every((piece) => piece?.type === "pawn" && piece.color === "black")).toBe(true);
    expect(board[6].every((piece) => piece?.type === "pawn" && piece.color === "white")).toBe(true);
    expect(board[7][4]).toEqual({ type: "king", color: "white", hasMoved: false });
    expect(board[7][3]).toEqual({ type: "queen", color: "white", hasMoved: false });
    expect(board[3].every((piece) => piece === null)).toBe(true);
  });
});
