
import React from 'react';
import { Box } from '@react-three/drei';

interface GroundProps {
  size: [number, number];
}

const Ground: React.FC<GroundProps> = ({ size }) => {
  return (
    <Box 
      args={[size[0], 0.2, size[1]]} 
      position={[0, -0.1, 0]} 
      receiveShadow
    >
      <meshStandardMaterial color="#8FB275" />
    </Box>
  );
};

export default Ground;
