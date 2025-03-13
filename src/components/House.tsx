
import React from 'react';
import { Box } from '@react-three/drei';

const House: React.FC = () => {
  return (
    <group position={[0, 0, -10]}>
      {/* Main house structure */}
      <Box args={[12, 4, 8]} position={[0, 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#C5B8A5" />
      </Box>
      
      {/* Roof */}
      <Box args={[13, 1, 9]} position={[0, 4.5, 0]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Door */}
      <Box args={[1.5, 2.5, 0.1]} position={[0, 1.25, 4]} castShadow>
        <meshStandardMaterial color="#5C4033" />
      </Box>
      
      {/* Windows */}
      <Box args={[1.5, 1.5, 0.1]} position={[-3, 2, 4]} castShadow>
        <meshStandardMaterial color="#B5D3E7" opacity={0.7} transparent />
      </Box>
      
      <Box args={[1.5, 1.5, 0.1]} position={[3, 2, 4]} castShadow>
        <meshStandardMaterial color="#B5D3E7" opacity={0.7} transparent />
      </Box>
    </group>
  );
};

export default House;
