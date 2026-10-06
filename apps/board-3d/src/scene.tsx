// ** import types
import type { Board, Piece, Position } from "@chess-game/chess";

// ** import lib
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

// ** import constants
import { TILE_HEIGHT, TILE_SIZE } from "./board-metrics";
import { PieceMesh } from "./pieces";

export interface SceneProps {
  board: Board;
  selected: Position | null;
  targets: Position[];
  checkedKing: Position | null;
  flipped: boolean;
  lastMove: { from: Position; to: Position; captured: Piece | null } | null;
  onSquareClick: (position: Position) => void;
}

const ANIM_MS = 220;

function squarePosition(row: number, col: number, flipped: boolean): [number, number, number] {
  const z = flipped ? 3.5 - row : row - 3.5;
  return [col - 3.5, 0.08, z];
}

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

interface MovingPieceProps {
  from: Position;
  to: Position;
  piece: Piece;
  flipped: boolean;
}

function MovingPiece({ from, to, piece, flipped }: MovingPieceProps) {
  const startRef = useRef<number | null>(null);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    if (startRef.current === null) startRef.current = performance.now();
    const t = Math.min(1, (performance.now() - startRef.current) / ANIM_MS);
    const k = easeOut(t);
    const [fx, , fz] = squarePosition(from.row, from.col, flipped);
    const [tx, , tz] = squarePosition(to.row, to.col, flipped);
    group.position.x = fx + (tx - fx) * k;
    group.position.z = fz + (tz - fz) * k;
    if (t >= 1) group.visible = false;
  });

  const [x, y, z] = squarePosition(from.row, from.col, flipped);
  return (
    <group ref={groupRef} position={[x, y, z]}>
      <PieceMesh piece={piece} />
    </group>
  );
}

interface CapturedPieceProps {
  piece: Piece;
  position: Position;
  flipped: boolean;
}

function CapturedPiece({ piece, position, flipped }: CapturedPieceProps) {
  const startRef = useRef<number | null>(null);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    if (startRef.current === null) startRef.current = performance.now();
    const t = Math.min(1, (performance.now() - startRef.current) / ANIM_MS);
    const k = 1 - easeOut(t);
    group.scale.set(k, k, k);
  });

  const [x, y, z] = squarePosition(position.row, position.col, flipped);
  return (
    <group ref={groupRef} position={[x, y, z]}>
      <PieceMesh piece={piece} />
    </group>
  );
}

export function ChessScene({
  board,
  selected,
  targets,
  checkedKing,
  flipped,
  lastMove,
  onSquareClick,
}: SceneProps) {
  const animating = !!lastMove;
  const movingPiece = lastMove ? (board[lastMove.to.row]?.[lastMove.to.col] ?? null) : null;
  const capturePiece = lastMove?.captured ?? null;

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
          const skipPiece =
            animating && lastMove && lastMove.to.row === rowIndex && lastMove.to.col === colIndex;

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
              {piece && !skipPiece ? <PieceMesh piece={piece} /> : null}
            </group>
          );
        }),
      )}
      {animating && lastMove && movingPiece ? (
        <MovingPiece from={lastMove.from} to={lastMove.to} piece={movingPiece} flipped={flipped} />
      ) : null}
      {animating && capturePiece && lastMove ? (
        <CapturedPiece piece={capturePiece} position={lastMove.to} flipped={flipped} />
      ) : null}
      <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2.1} minDistance={6} maxDistance={16} />
    </>
  );
}
