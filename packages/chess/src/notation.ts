// ** import types
import type { Board, GameState, Move, PieceType, Position } from "./types";

// ** import lib
import { applyMove, getLegalMoves } from "./game";
import { samePosition } from "./board";

const PIECE_LETTER: Record<Exclude<PieceType, "pawn">, string> = {
  king: "K",
  queen: "Q",
  rook: "R",
  bishop: "B",
  knight: "N",
};

const PROMOTION_LETTER: Record<"queen" | "rook" | "bishop" | "knight", string> = {
  bishop: "B",
  knight: "N",
  queen: "Q",
  rook: "R",
};

function file(rank: number): string {
  return String.fromCharCode("a".charCodeAt(0) + rank);
}

function rank(row: number): string {
  return String(8 - row);
}

function square(pos: Position): string {
  return file(pos.col) + rank(pos.row);
}

function pieceAt(board: Board, pos: Position) {
  return board[pos.row]?.[pos.col] ?? null;
}

function disambiguation(state: GameState, move: Move): string {
  if (move.castle) return "";
  const piece = pieceAt(state.board, move.from);
  if (!piece || piece.type === "pawn") return "";

  const candidates: Position[] = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const other = state.board[row]?.[col];
      if (!other || other.type !== piece.type || other.color !== piece.color) continue;
      if (samePosition({ row, col }, move.from)) continue;
      const moves = getLegalMoves(state, { row, col });
      if (moves.some((m) => samePosition(m.to, move.to) && m.promotion === move.promotion)) {
        candidates.push({ row, col });
      }
    }
  }

  if (candidates.length === 0) return "";
  const sameFile = candidates.some((c) => c.col === move.from.col);
  const sameRank = candidates.some((c) => c.row === move.from.row);
  if (!sameFile) return file(move.from.col);
  if (!sameRank) return rank(move.from.row);
  return file(move.from.col) + rank(move.from.row);
}

export function toAlgebraic(move: Move, before: GameState): string {
  const piece = pieceAt(before.board, move.from);
  if (!piece) return "";

  if (move.castle === "kingside") return suffix("O-O", before, move);
  if (move.castle === "queenside") return suffix("O-O-O", before, move);

  const isCapture = move.enPassant || pieceAt(before.board, move.to) !== null;
  const target = square(move.to);
  const head =
    piece.type === "pawn"
      ? pawnHead(move, isCapture)
      : PIECE_LETTER[piece.type] + disambiguation(before, move) + (isCapture ? "x" : "") + target;

  return suffix(head + promotionSuffix(move), before, move);
}

function pawnHead(move: Move, isCapture: boolean): string {
  if (!isCapture) return square(move.to);
  return file(move.from.col) + "x" + square(move.to);
}

function promotionSuffix(move: Move): string {
  if (!move.promotion) return "";
  if (move.promotion === "pawn" || move.promotion === "king") return "";
  return "=" + PROMOTION_LETTER[move.promotion];
}

function suffix(base: string, before: GameState, move: Move): string {
  const after = applyMove(before, move);
  if (after.isCheckmate) return base + "#";
  if (after.isCheck) return base + "+";
  return base;
}
