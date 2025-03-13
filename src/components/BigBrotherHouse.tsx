
import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';

// Improved house component with better Three.js practices
const BigBrotherHouse: React.FC = () => {  
  // Use memoized values for window positions only
  const windowPositions = useMemo(() => {
    // Ensure each array has exactly 3 elements for TypeScript type safety
    return [
      [-7, 3, 15.01],
      [-3.5, 3, 15.01],
      [0, 3, 15.01],
      [3.5, 3, 15.01],
      [7, 3, 15.01]
    ] as const; // Use 'as const' to tell TypeScript these are fixed arrays
  }, []);

  return (
    <group position={[0, 0, -15]}>
      {/* Foundation */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[22, 0.2, 32]} />
        <meshStandardMaterial color="#7B7B7B" />
      </mesh>
      
      {/* Main structure */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, 5, 30]} />
        <meshStandardMaterial color="#A0A0A0" />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[21, 1, 31]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      
      {/* Front door */}
      <mesh position={[0, 1.5, 15.01]} castShadow>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Windows */}
      {windowPositions.map((position, i) => (
        <mesh key={i} position={position} castShadow>
          <boxGeometry args={[1.5, 1.5, 0.1]} />
          <meshStandardMaterial 
            color="#B5D3E7" 
            transparent={true} 
            opacity={0.7} 
          />
        </mesh>
      ))}
      
      {/* House label - rendered as a sprite for better performance */}
      <Text 
        position={[0, 6.5, 0]} 
        fontSize={1.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        Big Brother House
      </Text>
    </group>
  );
};

export default BigBrotherHouse;
