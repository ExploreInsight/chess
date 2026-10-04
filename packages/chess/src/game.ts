// ** import types
import type { GameState, Move, Position } from "./types";

// ** import lib
import { createInitialBoard, samePosition } from "./board";
import { isInsufficientMaterial, nextHalfmoveClock, positionKey, repetitionCount } from "./draws";
import {
  applyMoveToBoard,
  castlingMoves,
  enPassantMoves,
  enPassantTarget,
  findKing,
  isKingInCheck,
  moveLeavesKingInCheck,
  opponent,
  pseudoMoves,
} from "./moves";

function openState(board: GameState["board"], currentPlayer: GameState["currentPlayer"]): GameState {
  return {
    board,
    currentPlayer,
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    winner: null,
    result: null,
    moveHistory: [],
    halfmoveClock: 0,
    positionHistory: [],
  };
}

export function createInitialGameState(): GameState {
  const draft = openState(createInitialBoard(), "white");
  return evaluatePosition({
    ...draft,
    positionHistory: [positionKey(draft)],
  });
}

export function isGameOver(state: GameState): boolean {
  return state.isCheckmate || state.isDraw || state.winner !== null;
}

export function getLegalMoves(state: GameState, from: Position): Move[] {
  if (isGameOver(state)) return [];
  const piece = state.board[from.row]?.[from.col];
  if (!piece || piece.color !== state.currentPlayer) return [];

  const generated = [
    ...pseudoMoves(state.board, from),
    ...castlingMoves(state.board, from),
    ...enPassantMoves(state.board, from, enPassantTarget(state.moveHistory, state.board)),
  ];

  return generated.filter((move) => !moveLeavesKingInCheck(state.board, move, piece.color));
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
  if (state.result === "agreement" || state.result === "resignation") return state;

  const inCheck = isKingInCheck(state.board, state.currentPlayer);
  const legal = hasLegalMoves({
    ...state,
    isCheck: inCheck,
    isCheckmate: false,
    isDraw: false,
    winner: null,
    result: null,
  });
  const checkmate = inCheck && !legal;
  const key = positionKey(state);
  const repeats = repetitionCount(state.positionHistory, key);

  if (checkmate) {
    return {
      ...state,
      isCheck: true,
      isCheckmate: true,
      isDraw: false,
      winner: opponent(state.currentPlayer),
      result: "checkmate",
    };
  }

  if (!legal) {
    return { ...state, isCheck: false, isCheckmate: false, isDraw: true, winner: null, result: "stalemate" };
  }
  if (state.halfmoveClock >= 100) {
    return { ...state, isCheck: inCheck, isCheckmate: false, isDraw: true, winner: null, result: "fifty-move" };
  }
  if (repeats >= 3) {
    return { ...state, isCheck: inCheck, isCheckmate: false, isDraw: true, winner: null, result: "threefold" };
  }
  if (isInsufficientMaterial(state.board)) {
    return {
      ...state,
      isCheck: false,
      isCheckmate: false,
      isDraw: true,
      winner: null,
      result: "insufficient-material",
    };
  }

  return { ...state, isCheck: inCheck, isCheckmate: false, isDraw: false, winner: null, result: null };
}

export function applyMove(state: GameState, move: Move): GameState {
  const legal = getLegalMoves(state, move.from).some(
    (candidate) =>
      samePosition(candidate.to, move.to) &&
      candidate.promotion === move.promotion &&
      candidate.castle === move.castle &&
      candidate.enPassant === move.enPassant,
  );
  if (!legal) return state;

  const board = applyMoveToBoard(state.board, move);
  const moveHistory = [...state.moveHistory, move];
  const currentPlayer = opponent(state.currentPlayer);
  const draft: GameState = {
    ...state,
    board,
    currentPlayer,
    moveHistory,
    halfmoveClock: nextHalfmoveClock(state, move),
    positionHistory: [],
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    winner: null,
    result: null,
  };
  draft.positionHistory = [...state.positionHistory, positionKey(draft)];
  return evaluatePosition(draft);
}

export function resign(state: GameState): GameState {
  if (isGameOver(state)) return state;
  return {
    ...state,
    isCheckmate: false,
    isDraw: false,
    winner: opponent(state.currentPlayer),
    result: "resignation",
  };
}

export function agreeDraw(state: GameState): GameState {
  if (isGameOver(state)) return state;
  return {
    ...state,
    isCheckmate: false,
    isDraw: true,
    winner: null,
    result: "agreement",
  };
}

export function checkedKing(state: GameState): Position | null {
  if (!state.isCheck) return null;
  return findKing(state.board, state.currentPlayer);
}
