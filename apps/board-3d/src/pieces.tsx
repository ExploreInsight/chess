// ** import types
import type { Piece } from "@chess-game/chess";

// ** import lib
import { Suspense } from "react";

// ** import constants
import { PieceLoadErrorBoundary, ProceduralPiece } from "./piece-fallback";
import { PieceModel } from "./piece-model";

export function PieceMesh({ piece }: { piece: Piece }) {
  return (
    <PieceLoadErrorBoundary fallback={<ProceduralPiece piece={piece} />}>
      <Suspense fallback={null}>
        <PieceModel piece={piece} />
      </Suspense>
    </PieceLoadErrorBoundary>
  );
}
