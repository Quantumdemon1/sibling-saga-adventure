
import React from 'react';

interface HohCompetitionAreaProps {
  position: [number, number, number];
}

const HohCompetitionArea: React.FC<HohCompetitionAreaProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Platform */}
      <mesh 
        position={[0, 0, 0]} 
        receiveShadow
        castShadow
      >
        <boxGeometry args={[10, 0.5, 10]} />
        <meshStandardMaterial 
          color="#8B5CF6"
          roughness={0.7}
        />
      </mesh>
      
      {/* Competition elements */}
      <mesh 
        position={[0, 1.5, 0]} 
        castShadow
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Decorative pillars */}
      {[[-4, 0, -4], [4, 0, -4], [-4, 0, 4], [4, 0, 4]].map((pillarPos, i) => (
        <mesh 
          key={i}
          position={[pillarPos[0], 1.5, pillarPos[2]]} 
          castShadow
        >
          <boxGeometry args={[0.8, 3, 0.8]} />
          <meshStandardMaterial color="#0EA5E9" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

export default HohCompetitionArea;
