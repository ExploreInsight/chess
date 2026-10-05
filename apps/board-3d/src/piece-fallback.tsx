// ** import types
import type { Piece } from "@chess-game/chess";
import type { ReactNode } from "react";
import type { Group } from "three";

// ** import lib
import { Component, useLayoutEffect, useRef } from "react";

function Material({ color }: { color: string }) {
  return <meshStandardMaterial color={color} roughness={0.45} metalness={0.08} />;
}

export function ProceduralPiece({ piece }: { piece: Piece }) {
  const color = piece.color === "white" ? "#f3efe6" : "#1a1a1a";
  const group = useRef<Group>(null);

  useLayoutEffect(() => {
    group.current?.traverse((node) => {
      node.castShadow = true;
    });
  }, []);

  return (
    <group ref={group} position={[0, 0.16, 0]}>
      {piece.type === "pawn" ? (
        <>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 0.16, 20]} />
            <Material color={color} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[0.14, 20, 16]} />
            <Material color={color} />
          </mesh>
        </>
      ) : null}
      {piece.type === "rook" ? (
        <>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.4, 8]} />
            <Material color={color} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <boxGeometry args={[0.34, 0.08, 0.34]} />
            <Material color={color} />
          </mesh>
        </>
      ) : null}
      {piece.type === "knight" ? (
        <mesh position={[0.04, 0.28, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.18, 0.46, 0.18]} />
          <Material color={color} />
        </mesh>
      ) : null}
      {piece.type === "bishop" ? (
        <>
          <mesh position={[0, 0.24, 0]}>
            <coneGeometry args={[0.16, 0.46, 16]} />
            <Material color={color} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.07, 16, 12]} />
            <Material color={color} />
          </mesh>
        </>
      ) : null}
      {piece.type === "queen" ? (
        <>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.12, 0.2, 0.42, 16]} />
            <Material color={color} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.1, 16, 12]} />
            <Material color={color} />
          </mesh>
        </>
      ) : null}
      {piece.type === "king" ? (
        <>
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.14, 0.2, 0.46, 16]} />
            <Material color={color} />
          </mesh>
          <mesh position={[0, 0.56, 0]}>
            <boxGeometry args={[0.16, 0.05, 0.05]} />
            <Material color={color} />
          </mesh>
          <mesh position={[0, 0.56, 0]}>
            <boxGeometry args={[0.05, 0.16, 0.05]} />
            <Material color={color} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

interface PieceLoadBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface PieceLoadBoundaryState {
  failed: boolean;
}

export class PieceLoadErrorBoundary extends Component<PieceLoadBoundaryProps, PieceLoadBoundaryState> {
  public state: PieceLoadBoundaryState = { failed: false };

  public static getDerivedStateFromError(): PieceLoadBoundaryState {
    return { failed: true };
  }

  public render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
