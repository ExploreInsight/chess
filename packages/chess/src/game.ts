// ** import types
import type { GameState, Move, Position } from "./types";

// ** import lib
import { createInitialBoard, samePosition } from "./board";
import {
  findKing,
  isKingInCheck,
  moveLeavesKingInCheck,
  opponent,
  pseudoMoves,
} from "./moves";

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: "white",
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    winner: null,
    moveHistory: [],
  };
}

export function isGameOver(state: GameState): boolean {
  return state.isCheckmate || state.isDraw;
}

export function getLegalMoves(state: GameState, from: Position): Move[] {
  if (isGameOver(state)) return [];
  const piece = state.board[from.row]?.[from.col];
  if (!piece || piece.color !== state.currentPlayer) return [];

  return pseudoMoves(state.board, from).filter(
    (move) => !moveLeavesKingInCheck(state.board, move, piece.color),
  );
}

export function hasLegalMoves(state: GameState): boolean {
  if (isGameOver(state)) return false;
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      if (getLegalMoves(state, { row, col }).length > 0) return true;
    }
  }
  return false;
}

export function evaluatePosition(state: GameState): GameState {
  const inCheck = isKingInCheck(state.board, state.currentPlayer);
  const legal = hasLegalMoves({ ...state, isCheck: inCheck, isCheckmate: false, isDraw: false });
  return {
    ...state,
    isCheck: inCheck,
    isCheckmate: inCheck && !legal,
    isDraw: !inCheck && !legal,
    winner: inCheck && !legal ? opponent(state.currentPlayer) : null,
  };
}

export function applyMove(state: GameState, move: Move): GameState {
  const legal = getLegalMoves(state, move.from).some(
    (candidate) =>
      samePosition(candidate.to, move.to) && candidate.promotion === move.promotion,
  );
  if (!legal) return state;

  const next: GameState = {
    board: state.board,
    currentPlayer: opponent(state.currentPlayer),
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    winner: null,
    moveHistory: [...state.moveHistory, move],
  };
  next.board = applyBoard(state, move);
  return evaluatePosition(next);
}

function applyBoard(state: GameState, move: Move) {
  const board = state.board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
  const piece = board[move.from.row]?.[move.from.col];
  if (!piece) return board;
  board[move.from.row][move.from.col] = null;
  board[move.to.row][move.to.col] = {
    ...piece,
    type: move.promotion ?? piece.type,
    hasMoved: true,
  };
  return board;
}

export function checkedKing(state: GameState): Position | null {
  if (!state.isCheck) return null;
  return findKing(state.board, state.currentPlayer);
}
