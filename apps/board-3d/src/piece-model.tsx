// ** import types
import type { Piece } from "@chess-game/chess";

// ** import lib
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Box3, Mesh, Vector3 } from "three";

// ** import constants
import { TILE_TOP } from "./board-metrics";
import { MODEL_URLS, pieceAsset } from "./piece-assets";

export function PieceModel({ piece }: { piece: Piece }) {
  const asset = pieceAsset(piece);
  const { scene } = useGLTF(asset.url);
  const template = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node instanceof Mesh) {
        node.castShadow = true;
        node.receiveShadow = false;
      }
    });
    return clone;
  }, [scene]);
  const bounds = useMemo(() => new Box3().setFromObject(scene), [scene]);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const scale = asset.height / size.y;

  return (
    <group position={[0, TILE_TOP - bounds.min.y * scale, 0]} scale={scale}>
      <group rotation={[0, asset.yaw, 0]}>
        <group position={[-center.x, 0, -center.z]}>
          <primitive object={template} />
        </group>
      </group>
    </group>
  );
}

MODEL_URLS.forEach((url) => useGLTF.preload(url));
