// ** import types
import type { GameState } from "./types";

// ** import lib
import { createInitialBoard } from "./board";

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
