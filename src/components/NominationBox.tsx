
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStateStore from '@/stores/gameStateStore';
import * as THREE from 'three';

const NominationBox: React.FC = () => {
  const { currentPhase } = useGameStateStore();
  const boxRef = useRef<THREE.Mesh>(null);
  
  // Add a floating animation to the nomination box - optimized to run less frequently
  useFrame(({ clock }) => {
    if (boxRef.current) {
      // Use a slower animation to reduce computations
      boxRef.current.position.y = 1 + Math.sin(clock.getElapsedTime()) * 0.2;
      boxRef.current.rotation.y += 0.005;
    }
  });
  
  // Box glows or changes color based on game phase
  const isActive = currentPhase === 'nominationCeremony';
  
  return (
    <mesh 
      ref={boxRef}
      position={[4, 1, -8]} 
      castShadow 
      receiveShadow
    >
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      {isActive ? (
        <meshStandardMaterial 
          color="#ffcc00"
          emissive="#ff6600"
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.2}
        />
      ) : (
        <meshLambertMaterial 
          color="#3366cc"
        />
      )}
    </mesh>
  );
};

export default NominationBox;
