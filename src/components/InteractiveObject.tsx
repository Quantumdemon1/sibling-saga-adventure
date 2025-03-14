
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
  
  // Optimize by checking every few frames instead of every frame
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Optimize by only checking every few frames
    if (Math.floor(state.clock.elapsedTime * 10) % 3 === 0) {
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

      // Simplified hover detection
      if (meshRef.current) {
        const distance = camera.position.distanceTo(meshRef.current.position);
        const isHovered = distance < 5;
        
        if (isHovered !== hovered) {
          setHovered(isHovered);
        }
      }
    }
  });

  // Hover effect animation
  useFrame(({ clock }) => {
    if (meshRef.current && hovered) {
      // Subtle hover animation
      const hoverScale = scale * (1 + Math.sin(clock.elapsedTime * 3) * 0.05);
      meshRef.current.scale.set(hoverScale, hoverScale, hoverScale);
    } else if (meshRef.current && !hovered) {
      // Reset scale when not hovered
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      scale={[scale, scale, scale]}
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
          <meshStandardMaterial 
            color={hovered ? "#ffcc00" : "#cccccc"} 
            emissive={hovered ? "#ffcc00" : undefined}
            emissiveIntensity={hovered ? 0.5 : 0}
          />
        </>
      )}
    </mesh>
  );
};

export default InteractiveObject;
