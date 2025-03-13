
import React from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface HohCompetitionAreaProps {
  position: [number, number, number];
}

const HohCompetitionArea: React.FC<HohCompetitionAreaProps> = ({ position }) => {
  // Create materials with proper parameters
  const platformMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color("#8B5CF6"),
    roughness: 0.7
  });
  
  const trophyMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color("#FFD700"),
    emissive: new THREE.Color("#FFD700"),
    emissiveIntensity: 0.2,
    metalness: 0.8,
    roughness: 0.2
  });
  
  const pillarMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color("#0EA5E9"),
    roughness: 0.5
  });
  
  return (
    <group position={position}>
      {/* Platform */}
      <mesh 
        position={[0, 0, 0]} 
        receiveShadow
        castShadow
      >
        <boxGeometry args={[10, 0.5, 10]} />
        <primitive object={platformMaterial} />
      </mesh>
      
      {/* Competition elements */}
      <mesh 
        position={[0, 1.5, 0]} 
        castShadow
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <primitive object={trophyMaterial} />
      </mesh>
      
      {/* Decorative pillars */}
      {[[-4, 0, -4], [4, 0, -4], [-4, 0, 4], [4, 0, 4]].map((pillarPos, i) => (
        <mesh 
          key={i}
          position={[pillarPos[0], 1.5, pillarPos[2]]} 
          castShadow
        >
          <boxGeometry args={[0.8, 3, 0.8]} />
          <primitive object={pillarMaterial} />
        </mesh>
      ))}
    </group>
  );
};

export default HohCompetitionArea;
