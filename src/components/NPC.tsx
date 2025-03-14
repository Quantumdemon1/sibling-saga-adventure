
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, Box } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';
import { useGameModel } from '@/utils/modelLoader';

interface NPCProps {
  position: [number, number, number];
  npcId: string;
  name?: string;
  color?: string;
  behavior?: 'idle' | 'competing' | 'nominating' | 'voting';
}

const NPC: React.FC<NPCProps> = ({ 
  position, 
  npcId, 
  name = "NPC",
  color = "#3498db",
  behavior = 'idle'
}) => {
  const { setOverlay, currentPhase, hoh, nominees } = useGameStateStore();
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [bodyRotation, setBodyRotation] = useState(0);
  const [interactionReady, setInteractionReady] = useState(false);
  const [movementOffset, setMovementOffset] = useState({ x: 0, z: 0 });
  
  // Try to load NPC model
  let npcModel;
  try {
    npcModel = useGameModel('npc');
  } catch (e) {
    // Model not available, will use geometry instead
    npcModel = { scene: null };
  }

  // Status indicator color logic
  let statusColor = 'white';
  if (npcId === hoh) statusColor = 'gold';
  if (nominees.includes(npcId)) statusColor = 'red';
  
  // Behavior-specific movement and animations
  useEffect(() => {
    // Set initial random movement offset based on behavior
    if (behavior === 'competing') {
      setMovementOffset({
        x: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 4
      });
    } else {
      setMovementOffset({ x: 0, z: 0 });
    }
  }, [behavior]);
  
  // Random idle movement for NPC - optimized to run less frequently
  useFrame(({ clock, camera }, delta) => {
    if (!groupRef.current) return;
    
    // Optimization: only update position every few frames
    if (clock.elapsedTime % 0.1 < delta) {
      // Make the NPC face the player when nearby
      if (hovered) {
        const targetRotation = Math.atan2(
          camera.position.x - groupRef.current.position.x,
          camera.position.z - groupRef.current.position.z
        );
        setBodyRotation(targetRotation);
        
        // Check if close enough for interaction
        const distance = camera.position.distanceTo(groupRef.current.position);
        setInteractionReady(distance < 3);
      } else {
        // Behavior-specific animations
        switch (behavior) {
          case 'competing':
            // Move in small circles for competition
            const time = clock.getElapsedTime();
            const radius = 2;
            groupRef.current.position.x = position[0] + Math.cos(time * 0.5) * radius + movementOffset.x;
            groupRef.current.position.z = position[2] + Math.sin(time * 0.5) * radius + movementOffset.z;
            setBodyRotation(time * 0.5 + Math.PI);
            break;
            
          case 'nominating':
            // Turn slowly for nominating
            setBodyRotation(Math.sin(clock.getElapsedTime() * 0.5) * 1);
            break;
            
          case 'voting':
            // Quick movements for voting
            setBodyRotation(Math.sin(clock.getElapsedTime() * 2) * 0.5);
            break;
            
          case 'idle':
          default:
            // Subtle idle movement
            setBodyRotation(Math.sin(clock.getElapsedTime() * 0.2) * 0.2);
            break;
        }
      }
    }
    
    // Apply the rotation - do this every frame for smooth motion
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        bodyRotation,
        0.1
      );
    }
    
    // Find the body mesh and animate it if we're not using a model
    if (groupRef.current?.children[0] && !npcModel?.scene) {
      const breathe = Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
      groupRef.current.children[0].scale.y = 1 + breathe;
      groupRef.current.children[0].position.y = 1 + breathe/2;
    }
  });
  
  // Handle interaction
  const handleInteract = () => {
    if (currentPhase === 'idle' || (currentPhase === 'nominationCeremony' && npcId === hoh)) {
      setOverlay({ type: 'dialogue', npcId });
    }
  };
  
  // Detect when player is looking at or near the NPC - optimized to check less frequently
  useFrame((state, delta) => {
    // Only check every few frames to improve performance
    if (state.clock.elapsedTime % 0.2 < delta && groupRef.current) {
      const playerPosition = state.camera.position;
      const npcPosition = new THREE.Vector3(...position);
      const distance = playerPosition.distanceTo(npcPosition);
      
      // Simple distance-based hover detection (more performant)
      const isHovered = distance < 5;
      if (isHovered !== hovered) {
        setHovered(isHovered);
      }
    }
  });

  // Check for E key press when hovered
  useEffect(() => {
    if (!hovered || !interactionReady) return;
    
    const checkKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        handleInteract();
      }
    };
    
    window.addEventListener('keydown', checkKeyPress);
    return () => window.removeEventListener('keydown', checkKeyPress);
  }, [hovered, interactionReady, handleInteract]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (npcModel?.scene) {
        // Dispose of model resources
        npcModel.scene.traverse((object: any) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: THREE.Material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  if (npcModel?.scene) {
    return (
      <group ref={groupRef} position={position}>
        <primitive
          object={npcModel.scene.clone()}
          scale={[0.01, 0.01, 0.01]}
        />
        
        {/* Name label above head - more dynamic */}
        <Text
          position={[0, 2.7, 0]}
          fontSize={0.2}
          color={statusColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {name}
          {interactionReady && " (Press E)"}
        </Text>
        
        {/* Clickable/interactive box */}
        <Box 
          args={[0.8, 2, 0.8]}
          position={[0, 1, 0]}
          visible={false}
          onClick={handleInteract}
        >
          <meshBasicMaterial transparent opacity={0} />
        </Box>
        
        {/* Status indicator for HoH or nominee */}
        {(npcId === hoh || nominees.includes(npcId)) && (
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color={statusColor} />
          </mesh>
        )}
      </group>
    );
  }

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
        color={statusColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {name}
        {interactionReady && " (Press E)"}
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
      
      {/* Status indicator for HoH or nominee */}
      {(npcId === hoh || nominees.includes(npcId)) && (
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>
      )}
    </group>
  );
};

export default NPC;
