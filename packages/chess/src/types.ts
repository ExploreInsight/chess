export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export type PlayerColor = "white" | "black";

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  hasMoved: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  promotion?: PieceType;
}

export type Board = (Piece | null)[][];

export interface GameState {
  board: Board;
  currentPlayer: PlayerColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  winner: PlayerColor | null;
  moveHistory: Move[];
}
