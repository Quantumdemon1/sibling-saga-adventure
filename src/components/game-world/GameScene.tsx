
import React from 'react';
import { Sky, Environment } from '@react-three/drei';
import { useGameModel } from '@/utils/modelLoader';
import House from '../House';
import BigBrotherHouse from '../BigBrotherHouse';

const GameScene: React.FC = () => {
  // Simple trees using basic Three.js geometries instead of complex models
  const renderTrees = () => {
    const treePositions = [[-10, -10], [10, -10], [-10, 10], [10, 10]];
    return treePositions.map((pos, i) => (
      <group key={i} position={[pos[0], 0, pos[1]]}>
        {/* Tree trunk */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        {/* Tree top */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <coneGeometry args={[2, 4, 8]} />
          <meshStandardMaterial color="#2E7D32" />
        </mesh>
      </group>
    ));
  };

  return (
    <>
      {/* Sky and environment with more stable settings */}
      <Sky distance={450000} sunPosition={[100, 20, 100]} />
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
        {renderTrees()}
      </group>
    </>
  );
};

export default GameScene;
