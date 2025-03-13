
import React from 'react';
import { Text } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';

const NominationCeremonyViz: React.FC = () => {
  const { hoh, players } = useGameStateStore();
  const hohPlayer = players.find(p => p.id === hoh);
  
  return (
    <group position={[0, 2, -15]}>
      <Text
        position={[0, 2, 0]}
        color="red"
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
      >
        Nomination Ceremony
      </Text>
      
      {/* Nomination box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial color="darkred" />
      </mesh>
      
      {/* Keys on top */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* HoH indicator */}
      {hohPlayer && (
        <Text
          position={[0, 1, 0]}
          color="gold"
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
        >
          {hohPlayer.name} is Head of Household
        </Text>
      )}
    </group>
  );
};

export default NominationCeremonyViz;
