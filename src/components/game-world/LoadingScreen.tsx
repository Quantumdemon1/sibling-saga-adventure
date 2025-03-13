
import React from 'react';
import { Box } from '@react-three/drei';

interface LoadingScreenProps {
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0 }) => {
  return (
    <Box args={[1, 1, 1]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#8B5CF6" />
    </Box>
  );
};

export default LoadingScreen;
