// ** import lib
import { createInitialGameState } from "@chess-game/chess";
import { ChessBoard } from "@chess-game/ui";

// ** import styles
import "./styles.css";

export default function App() {
  const game = createInitialGameState();

  return (
    <main className="app">
      <ChessBoard board={game.board} />
    </main>
  );
}
