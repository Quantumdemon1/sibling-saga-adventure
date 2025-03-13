
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import useGameStateStore from '@/stores/gameStateStore';

const VetoCeremonyViz: React.FC = () => {
  const vetoRef = useRef<THREE.Mesh>(null);
  const { vetoHolder, players } = useGameStateStore();
  const vetoPlayer = players.find(p => p.id === vetoHolder);
  
  useFrame((state) => {
    if (vetoRef.current) {
      // Rotate the veto necklace
      vetoRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group position={[0, 2, -15]}>
      <Text
        position={[0, 2, 0]}
        color="gold"
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
      >
        Veto Ceremony
      </Text>
      
      {/* Veto necklace */}
      <mesh position={[0, 0, 0]} ref={vetoRef}>
        <torusGeometry args={[0.8, 0.2, 16, 100]} />
        <meshStandardMaterial 
          color="gold" 
          metalness={0.8} 
          roughness={0.2}
          emissive="orange"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Veto holder indicator */}
      {vetoPlayer && (
        <Text
          position={[0, 1, 0]}
          color="gold"
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
        >
          {vetoPlayer.name} holds the Power of Veto
        </Text>
      )}
    </group>
  );
};

export default VetoCeremonyViz;
