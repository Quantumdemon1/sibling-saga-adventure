
import React from 'react';
import { Box } from '@react-three/drei';

const House: React.FC = () => {
  return (
    <group position={[0, 0, -10]}>
      {/* Main house structure */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 4, 8]} />
        <meshStandardMaterial color="#C5B8A5" />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[13, 1, 9]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, 1.25, 4]} castShadow>
        <boxGeometry args={[1.5, 2.5, 0.1]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-3, 2, 4]} castShadow>
        <boxGeometry args={[1.5, 1.5, 0.1]} />
        <meshStandardMaterial color="#B5D3E7" opacity={0.7} transparent />
      </mesh>
      
      <mesh position={[3, 2, 4]} castShadow>
        <boxGeometry args={[1.5, 1.5, 0.1]} />
        <meshStandardMaterial color="#B5D3E7" opacity={0.7} transparent />
      </mesh>
    </group>
  );
};

export default House;
