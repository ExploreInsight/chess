export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export type PlayerColor = "white" | "black";

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  hasMoved?: boolean;
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

export function createInitialBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  const backRow: PieceType[] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: "black", hasMoved: false };
    board[1][col] = { type: "pawn", color: "black", hasMoved: false };
    board[6][col] = { type: "pawn", color: "white", hasMoved: false };
    board[7][col] = { type: backRow[col], color: "white", hasMoved: false };
  }

  return board;
}

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
