// ** import types
import type { Board, Position } from "@chess-game/chess";

// ** import lib
import { OrbitControls } from "@react-three/drei";

import { PieceMesh } from "./pieces";

export interface SceneProps {
  board: Board;
  selected: Position | null;
  targets: Position[];
  checkedKing: Position | null;
  onSquareClick: (position: Position) => void;
}

function squarePosition(row: number, col: number): [number, number, number] {
  return [col - 3.5, 0.08, row - 3.5];
}

export function ChessScene({ board, selected, targets, checkedKing, onSquareClick }: SceneProps) {
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
          const check = checkedKing?.row === rowIndex && checkedKing.col === colIndex;
          const color = check ? "#e74c3c" : selectedSquare ? "#829769" : dark ? "#b58863" : "#f0d9b5";
          const [x, y, z] = squarePosition(rowIndex, colIndex);

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
                <boxGeometry args={[0.96, 0.08, 0.96]} />
                <meshStandardMaterial color={color} roughness={0.62} />
              </mesh>
              {target ? (
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
