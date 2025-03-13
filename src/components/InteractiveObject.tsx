
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStateStore from '@/stores/gameStateStore';
import { useKeyboardControls } from '@react-three/drei';

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
  
  // Get keyboard controls with the correct method
  const [, getKeys] = useKeyboardControls();
  
  useFrame((state) => {
    // Check interaction with E key
    const keys = getKeys();
    const eKeyPressed = keys.interact || false;
    
    // Handle key up/down to prevent multiple triggers
    if (eKeyPressed && !wasPressed) {
      setWasPressed(true);
      
      // Only allow interaction if we're in the correct phase or if no phase is specified
      if ((!phase || currentPhase === phase) && meshRef.current) {
        const playerPosition = state.camera.position;
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
    
    // Check if player is looking at the object
    if (meshRef.current) {
      const direction = new THREE.Vector3();
      state.camera.getWorldDirection(direction);
      const raycaster = new THREE.Raycaster(state.camera.position, direction);
      const intersects = raycaster.intersectObject(meshRef.current);
      
      // Update hover state
      const isHovered = intersects.length > 0 && intersects[0].distance < 3;
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
          <primitive object={geometry} />
          <primitive object={material} />
        </>
      ) : children ? (
        children
      ) : (
        // Default shape if nothing is provided
        <>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={hovered ? "#ffcc00" : "#cccccc"} 
            emissive={hovered ? "#ff6600" : "#000000"}
            emissiveIntensity={hovered ? 0.5 : 0}
          />
        </>
      )}
    </mesh>
  );
};

export default InteractiveObject;
