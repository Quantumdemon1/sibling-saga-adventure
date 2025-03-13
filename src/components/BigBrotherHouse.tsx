
import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Simplified housing component
const BigBrotherHouse: React.FC = () => {  
  // Create a very simple house with basic shapes
  return (
    <group>
      {/* Main structure */}
      <mesh position={[0, 2.5, -15]}>
        <boxGeometry args={[20, 5, 30]} />
        <meshStandardMaterial color="#888888" transparent opacity={0.9} />
      </mesh>
      
      {/* Simple room label */}
      <Text 
        position={[0, 5, -15]} 
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Big Brother House
      </Text>
    </group>
  );
};

export default BigBrotherHouse;
