// ** import types
import type { Board, Move, Piece, PlayerColor, Position } from "./types";

// ** import lib
import { cloneBoard, isInside } from "./board";

const KING_DELTAS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const KNIGHT_DELTAS = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

const ROOK_DELTAS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const BISHOP_DELTAS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

export function opponent(color: PlayerColor): PlayerColor {
  return color === "white" ? "black" : "white";
}

export function findKing(board: Board, color: PlayerColor): Position | null {
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = board[row]?.[col];
      if (piece?.type === "king" && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

function rayAttacks(board: Board, from: Position, deltas: number[][], target: Position): boolean {
  for (const [rowDelta, colDelta] of deltas) {
    if (rowDelta === undefined || colDelta === undefined) continue;
    let row = from.row + rowDelta;
    let col = from.col + colDelta;
    while (isInside(row, col)) {
      if (row === target.row && col === target.col) return true;
      if (board[row]?.[col]) break;
      row += rowDelta;
      col += colDelta;
    }
  }
  return false;
}

export function pieceAttacksSquare(board: Board, from: Position, piece: Piece, target: Position): boolean {
  const rowDelta = target.row - from.row;
  const colDelta = target.col - from.col;

  if (piece.type === "knight") {
    return KNIGHT_DELTAS.some(([dRow, dCol]) => dRow === rowDelta && dCol === colDelta);
  }

  if (piece.type === "king") {
    return Math.abs(rowDelta) <= 1 && Math.abs(colDelta) <= 1 && (rowDelta !== 0 || colDelta !== 0);
  }

  if (piece.type === "pawn") {
    const direction = piece.color === "white" ? -1 : 1;
    return rowDelta === direction && Math.abs(colDelta) === 1;
  }

  if (piece.type === "rook") return rayAttacks(board, from, ROOK_DELTAS, target);
  if (piece.type === "bishop") return rayAttacks(board, from, BISHOP_DELTAS, target);
  return rayAttacks(board, from, [...ROOK_DELTAS, ...BISHOP_DELTAS], target);
}

export function isSquareAttacked(board: Board, target: Position, byColor: PlayerColor): boolean {
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = board[row]?.[col];
      if (!piece || piece.color !== byColor) continue;
      if (pieceAttacksSquare(board, { row, col }, piece, target)) return true;
    }
  }
  return false;
}

export function isKingInCheck(board: Board, color: PlayerColor): boolean {
  const king = findKing(board, color);
  if (!king) return false;
  return isSquareAttacked(board, king, opponent(color));
}

function pushIfLegalTarget(moves: Move[], board: Board, from: Position, row: number, col: number): boolean {
  if (!isInside(row, col)) return false;
  const target = board[row]?.[col];
  const piece = board[from.row]?.[from.col];
  if (!piece || target?.color === piece.color) return true;

  const promotions: Array<Piece["type"] | undefined> =
    piece.type === "pawn" && (row === 0 || row === 7)
      ? ["queen", "rook", "bishop", "knight"]
      : [undefined];

  for (const promotion of promotions) {
    moves.push({ from, to: { row, col }, promotion });
  }
  return target !== null;
}

function addSliderMoves(moves: Move[], board: Board, from: Position, deltas: number[][]): void {
  for (const [rowDelta, colDelta] of deltas) {
    if (rowDelta === undefined || colDelta === undefined) continue;
    let row = from.row + rowDelta;
    let col = from.col + colDelta;
    while (isInside(row, col)) {
      const blocked = pushIfLegalTarget(moves, board, from, row, col);
      if (blocked) break;
      row += rowDelta;
      col += colDelta;
    }
  }
}

export function pseudoMoves(board: Board, from: Position): Move[] {
  const piece = board[from.row]?.[from.col];
  if (!piece) return [];
  const moves: Move[] = [];

  if (piece.type === "knight" || piece.type === "king") {
    const deltas = piece.type === "knight" ? KNIGHT_DELTAS : KING_DELTAS;
    for (const [rowDelta, colDelta] of deltas) {
      if (rowDelta === undefined || colDelta === undefined) continue;
      pushIfLegalTarget(moves, board, from, from.row + rowDelta, from.col + colDelta);
    }
    return moves;
  }

  if (piece.type === "rook") {
    addSliderMoves(moves, board, from, ROOK_DELTAS);
    return moves;
  }

  if (piece.type === "bishop") {
    addSliderMoves(moves, board, from, BISHOP_DELTAS);
    return moves;
  }

  if (piece.type === "queen") {
    addSliderMoves(moves, board, from, [...ROOK_DELTAS, ...BISHOP_DELTAS]);
    return moves;
  }

  const direction = piece.color === "white" ? -1 : 1;
  const startRow = piece.color === "white" ? 6 : 1;
  const oneRow = from.row + direction;
  if (isInside(oneRow, from.col) && !board[oneRow]?.[from.col]) {
    pushIfLegalTarget(moves, board, from, oneRow, from.col);
    const twoRow = from.row + direction * 2;
    if (from.row === startRow && isInside(twoRow, from.col) && !board[twoRow]?.[from.col]) {
      pushIfLegalTarget(moves, board, from, twoRow, from.col);
    }
  }
  for (const colDelta of [-1, 1]) {
    const row = from.row + direction;
    const col = from.col + colDelta;
    if (!isInside(row, col)) continue;
    const target = board[row]?.[col];
    if (target && target.color !== piece.color) {
      pushIfLegalTarget(moves, board, from, row, col);
    }
  }
  return moves;
}

export function castlingMoves(board: Board, from: Position): Move[] {
  const piece = board[from.row]?.[from.col];
  if (!piece || piece.type !== "king" || piece.hasMoved) return [];
  if (isKingInCheck(board, piece.color)) return [];

  const row = piece.color === "white" ? 7 : 0;
  if (from.row !== row || from.col !== 4) return [];

  const moves: Move[] = [];
  for (const side of ["kingside", "queenside"] as const) {
    const rookCol = side === "kingside" ? 7 : 0;
    const rook = board[row]?.[rookCol];
    if (!rook || rook.type !== "rook" || rook.color !== piece.color || rook.hasMoved) continue;

    const emptyCols = side === "kingside" ? [5, 6] : [1, 2, 3];
    if (emptyCols.some((col) => board[row]?.[col])) continue;

    const passedCols = side === "kingside" ? [5, 6] : [2, 3];
    const attacked = passedCols.some((col) =>
      isSquareAttacked(board, { row, col }, opponent(piece.color)),
    );
    if (attacked) continue;

    moves.push({
      from,
      to: { row, col: side === "kingside" ? 6 : 2 },
      castle: side,
    });
  }
  return moves;
}

export function enPassantTarget(history: Move[], board: Board): Position | null {
  const last = history.at(-1);
  if (!last) return null;
  const pawn = board[last.to.row]?.[last.to.col];
  if (!pawn || pawn.type !== "pawn") return null;
  if (Math.abs(last.to.row - last.from.row) !== 2 || last.to.col !== last.from.col) return null;
  return { row: (last.from.row + last.to.row) / 2, col: last.to.col };
}

export function enPassantMoves(board: Board, from: Position, target: Position | null): Move[] {
  if (!target) return [];
  const piece = board[from.row]?.[from.col];
  if (!piece || piece.type !== "pawn") return [];
  const direction = piece.color === "white" ? -1 : 1;
  if (from.row + direction !== target.row || Math.abs(from.col - target.col) !== 1) return [];
  const captured = board[from.row]?.[target.col];
  if (!captured || captured.type !== "pawn" || captured.color === piece.color) return [];
  return [{ from, to: target, enPassant: true }];
}

export function applyMoveToBoard(board: Board, move: Move): Board {
  const next = cloneBoard(board);
  const piece = next[move.from.row]?.[move.from.col];
  if (!piece) return next;
  next[move.from.row][move.from.col] = null;
  next[move.to.row][move.to.col] = {
    ...piece,
    type: move.promotion ?? piece.type,
    hasMoved: true,
  };

  if (move.castle) {
    const rookFrom = move.castle === "kingside" ? 7 : 0;
    const rookTo = move.castle === "kingside" ? 5 : 3;
    const rook = next[move.from.row]?.[rookFrom];
    next[move.from.row][rookFrom] = null;
    if (rook) {
      next[move.from.row][rookTo] = { ...rook, hasMoved: true };
    }
  }

  if (move.enPassant) {
    next[move.from.row][move.to.col] = null;
  }

  return next;
}

export function moveLeavesKingInCheck(board: Board, move: Move, color: PlayerColor): boolean {
  return isKingInCheck(applyMoveToBoard(board, move), color);
}
