
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStateStore from '@/stores/gameStateStore';

interface PlayerProps {
  controls: React.RefObject<any>;
}

const Player: React.FC<PlayerProps> = ({ controls }) => {
  const playerRef = useRef<THREE.Group>(new THREE.Group());
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const [isGrounded, setIsGrounded] = useState(true);
  const jumpForce = useRef(0);
  const gravity = useRef(0.01);
  const { scene } = useThree();
  const [currentRoom, setCurrentRoom] = useState<string>("Outside");
  
  // Simplified keyboard state management using refs instead of state
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    space: false
  });
  
  // Initialize player position
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(0, 1, 5);
    }
    
    // Set up keyboard listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.shift = true;
      if (e.code === 'Space') keys.current.space = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.shift = false;
      if (e.code === 'Space') keys.current.space = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Handle player movement and collisions
  useFrame((state, delta) => {
    if (!playerRef.current) return;
    
    // Get movement speed (sprint with shift)
    const speed = keys.current.shift ? 0.15 : 0.08;
    
    // Reset horizontal velocity
    velocity.current.x = 0;
    velocity.current.z = 0;
    
    try {
      // Get camera direction
      const direction = new THREE.Vector3();
      if (state.camera) {
        state.camera.getWorldDirection(direction);
        direction.y = 0; // Keep movement on the horizontal plane
        direction.normalize();
        
        // Calculate forward and right vectors
        const forwardVector = direction.clone();
        const rightVector = new THREE.Vector3(-direction.z, 0, direction.x);
        
        // Apply movement based on keys pressed
        if (keys.current.forward) {
          velocity.current.add(forwardVector.multiplyScalar(speed));
        }
        if (keys.current.backward) {
          velocity.current.add(forwardVector.multiplyScalar(-speed * 0.7));
        }
        if (keys.current.left) {
          velocity.current.add(rightVector.multiplyScalar(-speed * 0.8));
        }
        if (keys.current.right) {
          velocity.current.add(rightVector.multiplyScalar(speed * 0.8));
        }
        
        // Handle jumping
        if (keys.current.space && isGrounded) {
          jumpForce.current = 0.2;
          setIsGrounded(false);
        }
        
        // Apply gravity and jump force
        if (!isGrounded) {
          jumpForce.current -= gravity.current;
        }
        velocity.current.y = jumpForce.current;
        
        // Move player based on velocity
        playerRef.current.position.add(velocity.current);
        
        // Update camera position to follow player
        if (state.camera) {
          state.camera.position.copy(playerRef.current.position.clone().add(new THREE.Vector3(0, 1.6, 0)));
        }
      }
    } catch (error) {
      console.error("Error in player movement:", error);
    }
  });
  
  return <primitive object={playerRef.current} />;
};

export default Player;
