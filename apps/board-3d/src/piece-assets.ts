// ** import types
import type { Piece, PieceType, PlayerColor } from "@chess-game/chess";

const MODEL_DIR = "/models/";

const HEIGHT_RATIO: Record<PieceType, number> = {
  pawn: 0.53,
  rook: 0.6,
  knight: 0.67,
  bishop: 0.7,
  queen: 0.87,
  king: 1,
};

const TYPES: PieceType[] = ["pawn", "rook", "knight", "bishop", "queen", "king"];

const SIDES: PlayerColor[] = ["white", "black"];

export const KING_HEIGHT = 1.4;

export interface PieceAsset {
  url: string;
  height: number;
  yaw: number;
}

function modelUrl(side: PlayerColor, type: PieceType): string {
  return `${MODEL_DIR}${side}-${type}.glb`;
}

export function pieceAsset(piece: Piece): PieceAsset {
  return {
    url: modelUrl(piece.color, piece.type),
    height: KING_HEIGHT * HEIGHT_RATIO[piece.type],
    yaw: piece.color === "white" ? Math.PI : 0,
  };
}

export const MODEL_URLS: string[] = SIDES.flatMap((side) =>
  TYPES.map((type) => modelUrl(side, type)),
);
