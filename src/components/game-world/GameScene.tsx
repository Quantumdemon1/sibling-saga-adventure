
import React from 'react';
import { Sky, Environment } from '@react-three/drei';
import { useGameModel } from '@/utils/modelLoader';
import House from '../House';
import BigBrotherHouse from '../BigBrotherHouse';

const GameScene: React.FC = () => {
  return (
    <>
      {/* Sky and environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />
      
      {/* Main house */}
      <group position={[0, 0, 0]}>
        <BigBrotherHouse />
      </group>
      
      {/* Additional structures */}
      <group position={[15, 0, -15]}>
        <House />
      </group>
      
      {/* Ground decorations */}
      <group position={[0, 0, 5]}>
        {/* Trees */}
        {[[-10, -10], [10, -10], [-10, 10], [10, 10]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 1.5, pos[1]]}>
            <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
            <meshStandardMaterial color="#5D4037" />
            <mesh position={[0, 2, 0]}>
              <coneGeometry args={[2, 4, 8]} />
              <meshStandardMaterial color="#2E7D32" />
            </mesh>
          </mesh>
        ))}
      </group>
    </>
  );
};

export default GameScene;
