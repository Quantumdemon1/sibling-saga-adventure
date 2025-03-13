
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';

const NominationBox: React.FC = () => {
  const { currentPhase } = useGameStateStore();
  const boxRef = useRef<THREE.Mesh>(null);
  
  // Add a floating animation to the nomination box
  useFrame(({ clock }) => {
    if (boxRef.current) {
      boxRef.current.position.y = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      boxRef.current.rotation.y += 0.01;
    }
  });
  
  // Box glows or changes color based on game phase
  const isActive = currentPhase === 'nominationCeremony';
  
  return (
    <Box 
      ref={boxRef}
      args={[1.2, 1.2, 1.2]} 
      position={[4, 1, -8]} 
      castShadow 
      receiveShadow
    >
      <meshStandardMaterial 
        color={isActive ? "#ffcc00" : "#3366cc"}
        emissive={isActive ? "#ff6600" : "#000000"}
        emissiveIntensity={isActive ? 0.5 : 0}
        metalness={0.5}
        roughness={0.2}
      />
    </Box>
  );
};

export default NominationBox;
