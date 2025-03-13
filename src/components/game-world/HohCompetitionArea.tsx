
import React from 'react';
import { Box } from '@react-three/drei';

interface HohCompetitionAreaProps {
  position: [number, number, number];
}

const HohCompetitionArea: React.FC<HohCompetitionAreaProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Platform */}
      <Box 
        args={[10, 0.5, 10]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <meshStandardMaterial color="#8B5CF6" />
      </Box>
      
      {/* Competition elements */}
      <Box 
        args={[1.5, 1.5, 1.5]} 
        position={[0, 1.5, 0]} 
        castShadow
      >
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </Box>
      
      {/* Decorative pillars */}
      {[[-4, 0, -4], [4, 0, -4], [-4, 0, 4], [4, 0, 4]].map((pillarPos, i) => (
        <Box 
          key={i}
          args={[0.8, 3, 0.8]} 
          position={[pillarPos[0], 1.5, pillarPos[2]]} 
          castShadow
        >
          <meshStandardMaterial color="#0EA5E9" />
        </Box>
      ))}
    </group>
  );
};

export default HohCompetitionArea;
