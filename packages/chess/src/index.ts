export type {
  Board,
  GameResult,
  GameState,
  Move,
  Piece,
  PieceType,
  PlayerColor,
  Position,
} from "./types";

export { cloneBoard, createInitialBoard, isInside, samePosition } from "./board";
export {
  agreeDraw,
  applyMove,
  checkedKing,
  createInitialGameState,
  evaluatePosition,
  getLegalMoves,
  resign,
} from "./game";
