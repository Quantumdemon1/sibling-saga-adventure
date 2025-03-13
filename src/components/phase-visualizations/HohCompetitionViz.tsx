
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import useGameStateStore from '@/stores/gameStateStore';

const HohCompetitionViz: React.FC = () => {
  const competitionRef = useRef<THREE.Group>(null);
  const { players } = useGameStateStore();
  
  useFrame((state) => {
    if (competitionRef.current) {
      // Animate the competition elements
      competitionRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group position={[0, 5, -20]} ref={competitionRef}>
      <Text
        position={[0, 2, 0]}
        color="gold"
        fontSize={1}
        anchorX="center"
        anchorY="middle"
      >
        HoH Competition
      </Text>
      
      {/* Competition podiums */}
      {players
        .filter(p => p.status !== 'evicted')
        .map((player, i) => {
          const angle = (i / players.length) * Math.PI * 2;
          const x = Math.cos(angle) * 5;
          const z = Math.sin(angle) * 5;
          
          return (
            <mesh 
              key={player.id} 
              position={[x, -1, z]}
              rotation={[0, -angle, 0]} // Face center
            >
              <boxGeometry args={[1, 0.5, 1]} />
              <meshStandardMaterial color={player.isHuman ? 'blue' : 'red'} />
              <Text
                position={[0, 0.5, 0]}
                color="white"
                fontSize={0.3}
                anchorX="center"
                anchorY="bottom"
              >
                {player.name}
              </Text>
            </mesh>
          );
        })}
        
      {/* Central competition object */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[3, 0.3, 16, 100]} />
        <meshStandardMaterial color="gold" emissive="orange" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

export default HohCompetitionViz;
