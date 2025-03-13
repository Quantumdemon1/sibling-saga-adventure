
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';
import { Box } from '@react-three/drei';

interface NPCProps {
  position: [number, number, number];
  npcId: string;
  name?: string;
  color?: string;
}

const NPC: React.FC<NPCProps> = ({ 
  position, 
  npcId, 
  name = "NPC",
  color = "#FF6347" // Tomato red default color
}) => {
  const { setOverlay, currentPhase } = useGameStateStore();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [bodyRotation, setBodyRotation] = useState(0);
  
  // Random idle movement for NPC
  useFrame(({ clock, camera }) => {
    if (groupRef.current) {
      // Make the NPC face the player when nearby
      if (hovered) {
        const targetRotation = Math.atan2(
          camera.position.x - groupRef.current.position.x,
          camera.position.z - groupRef.current.position.z
        );
        setBodyRotation(targetRotation);
      } else {
        // Subtle idle movement when not interacting
        setBodyRotation(Math.sin(clock.getElapsedTime() * 0.2) * 0.2);
      }
      
      // Apply the rotation
      groupRef.current.rotation.y = bodyRotation;
      
      // Subtle breathing animation
      const breathe = Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
      if (groupRef.current.children[0]) {
        groupRef.current.children[0].scale.y = 1 + breathe;
        groupRef.current.children[0].position.y = 1 + breathe/2;
      }
    }
  });
  
  // Handle interaction
  const handleInteract = () => {
    if (currentPhase === 'idle') {
      setOverlay({ type: 'dialogue', npcId });
    }
  };
  
  // Detect when player is looking at or near the NPC
  useFrame((state) => {
    if (groupRef.current) {
      const playerPosition = state.camera.position;
      const npcPosition = new THREE.Vector3(...position);
      const distance = playerPosition.distanceTo(npcPosition);
      
      // Check if player is looking at NPC and is close enough
      const direction = new THREE.Vector3();
      state.camera.getWorldDirection(direction);
      const raycaster = new THREE.Raycaster(state.camera.position, direction);
      const intersects = raycaster.intersectObject(groupRef.current, true);
      
      const isHovered = intersects.length > 0 && distance < 3;
      if (isHovered !== hovered) {
        setHovered(isHovered);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* NPC body */}
      <Box args={[0.6, 1.8, 0.4]} position={[0, 1, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </Box>
      
      {/* NPC head */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 2.05, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </Box>
      
      {/* Label above head */}
      <Text
        position={[0, 2.7, 0]}
        rotation={[0, Math.PI, 0]} // Flip text so it faces forward
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {name}
        {hovered && " (Press E)"}
      </Text>
      
      {/* Clickable/interactive behavior */}
      <Box 
        args={[0.8, 2, 0.8]} // Slightly larger than the NPC for easier interaction
        position={[0, 1, 0]}
        visible={false} // Invisible collision box
        onClick={handleInteract}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>
    </group>
  );
};

export default NPC;
