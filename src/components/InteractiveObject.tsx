
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStateStore from '@/stores/gameStateStore';

interface InteractiveObjectProps {
  position: [number, number, number];
  onInteract: () => void;
  phase?: string;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  children?: React.ReactNode;
  scale?: number;
}

const InteractiveObject: React.FC<InteractiveObjectProps> = ({ 
  position, 
  onInteract, 
  phase, 
  geometry, 
  material,
  children,
  scale = 1
}) => {
  const { currentPhase } = useGameStateStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [wasPressed, setWasPressed] = useState(false);
  const { camera } = useThree();
  
  // Track E key press manually instead of using useKeyboardControls
  useFrame(() => {
    // Check for E key press using standard DOM event tracking
    const eKeyPressed = window.document.querySelector('body')?.getAttribute('data-key-e') === 'true';
    
    // Handle key up/down to prevent multiple triggers
    if (eKeyPressed && !wasPressed) {
      setWasPressed(true);
      
      // Only allow interaction if we're in the correct phase or if no phase is specified
      if ((!phase || currentPhase === phase) && meshRef.current) {
        const playerPosition = camera.position;
        const objectPosition = meshRef.current.position;
        const distance = playerPosition.distanceTo(objectPosition);
        
        // Check if player is close enough (3 units)
        if (distance < 3) {
          onInteract();
        }
      }
    } else if (!eKeyPressed && wasPressed) {
      setWasPressed(false);
    }
    
    // Check if player is looking at the object (simplified)
    if (meshRef.current) {
      const distance = camera.position.distanceTo(meshRef.current.position);
      
      // Update hover state based on distance only to improve performance
      const isHovered = distance < 5;
      if (isHovered !== hovered) {
        setHovered(isHovered);
      }
    }
  });

  // Scale based on hover state
  const hoverScale = hovered ? scale * 1.1 : scale;

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      scale={[hoverScale, hoverScale, hoverScale]}
    >
      {geometry && material ? (
        <>
          <primitive object={geometry} attach="geometry" />
          <primitive object={material} attach="material" />
        </>
      ) : children ? (
        children
      ) : (
        // Default shape if nothing is provided
        <>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial 
            color={hovered ? "#ffcc00" : "#cccccc"} 
          />
        </>
      )}
    </mesh>
  );
};

export default InteractiveObject;
