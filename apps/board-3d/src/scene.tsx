// ** import types
import type { Board, Position } from "@chess-game/chess";

// ** import lib
import { OrbitControls } from "@react-three/drei";
import { PieceMesh } from "./pieces";

// ** import constants
import { TILE_HEIGHT, TILE_SIZE } from "./board-metrics";

export interface SceneProps {
  board: Board;
  selected: Position | null;
  targets: Position[];
  checkedKing: Position | null;
  flipped: boolean;
  onSquareClick: (position: Position) => void;
}

function squarePosition(row: number, col: number, flipped: boolean): [number, number, number] {
  const z = flipped ? 3.5 - row : row - 3.5;
  return [col - 3.5, 0.08, z];
}

export function ChessScene({ board, selected, targets, checkedKing, flipped, onSquareClick }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#312e2b"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 4]} intensity={1.4} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#272522" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[8.6, 0.16, 8.6]} />
        <meshStandardMaterial color="#5a3a24" roughness={0.7} />
      </mesh>
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const dark = (rowIndex + colIndex) % 2 === 1;
          const selectedSquare = selected?.row === rowIndex && selected.col === colIndex;
          const target = targets.some((item) => item.row === rowIndex && item.col === colIndex);
          const capture = target && piece !== null;
          const check = checkedKing?.row === rowIndex && checkedKing.col === colIndex;
          const color = check ? "#e74c3c" : selectedSquare || capture ? "#829769" : dark ? "#b58863" : "#f0d9b5";
          const [x, y, z] = squarePosition(rowIndex, colIndex, flipped);

          return (
            <group
              key={`${rowIndex}-${colIndex}`}
              position={[x, y, z]}
              onClick={(event) => {
                event.stopPropagation();
                onSquareClick({ row: rowIndex, col: colIndex });
              }}
            >
              <mesh receiveShadow>
                <boxGeometry args={[TILE_SIZE, TILE_HEIGHT, TILE_SIZE]} />
                <meshStandardMaterial color={color} roughness={0.62} />
              </mesh>
              {target && !piece ? (
                <mesh position={[0, 0.06, 0]}>
                  <sphereGeometry args={[0.08, 16, 12]} />
                  <meshStandardMaterial color="#696969" />
                </mesh>
              ) : null}
              {piece ? <PieceMesh piece={piece} /> : null}
            </group>
          );
        }),
      )}
      <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2.1} minDistance={6} maxDistance={16} />
    </>
  );
}
