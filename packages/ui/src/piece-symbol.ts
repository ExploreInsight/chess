// ** import types
import type { Piece } from "@chess-game/chess";

const SYMBOLS: Record<Piece["color"], Record<Piece["type"], string>> = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
};

export function pieceSymbol(piece: Piece): string {
  return SYMBOLS[piece.color][piece.type];
}
