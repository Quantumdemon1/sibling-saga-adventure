
import React from 'react';
import { Sky } from '@react-three/drei';

// Super simplified game scene to avoid property issues
const GameScene: React.FC = () => {
  return (
    <>
      <Sky sunPosition={[100, 10, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Add a simple placeholder house */}
      <group position={[0, 0, -10]}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[5, 2, 5]} />
          <meshStandardMaterial color="#8888FF" />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      </group>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#336633" />
      </mesh>
    </>
  );
};

export default GameScene;
