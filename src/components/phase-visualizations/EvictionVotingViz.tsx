
import React from 'react';
import { Text } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';

const EvictionVotingViz: React.FC = () => {
  const { nominees, players } = useGameStateStore();
  const nomineeNames = nominees
    .map(id => players.find(p => p.id === id)?.name || 'Unknown')
    .join(' vs ');
  
  return (
    <group position={[0, 2, -15]}>
      <Text
        position={[0, 2, 0]}
        color="red"
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
      >
        Eviction Vote
      </Text>
      
      <Text
        position={[0, 1, 0]}
        color="white"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {nomineeNames}
      </Text>
      
      {/* Voting booth */}
      <mesh position={[0, -0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color="darkblue" />
      </mesh>
    </group>
  );
};

export default EvictionVotingViz;
