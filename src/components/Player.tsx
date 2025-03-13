
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerProps {
  controls: React.RefObject<any>;
}

const Player: React.FC<PlayerProps> = ({ controls }) => {
  const playerRef = useRef<THREE.Group>(new THREE.Group());
  const { camera } = useThree();
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const direction = useRef<THREE.Vector3>(new THREE.Vector3());
  const [isGrounded, setIsGrounded] = useState(true);
  const jumpForce = useRef(0);
  const gravity = 0.01;
  
  // Keyboard state
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
    space: false
  });
  
  // Set up player and camera
  useEffect(() => {
    // Initialize player position
    if (playerRef.current) {
      playerRef.current.position.set(0, 1, 10);
    }
    
    // Set up keyboard listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.shift = true;
      if (e.code === 'Space') {
        keys.current.space = true;
        if (isGrounded) {
          jumpForce.current = 0.2;
          setIsGrounded(false);
        }
      }
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
  }, [isGrounded]);
  
  // Handle player movement
  useFrame((state, delta) => {
    if (!playerRef.current || !camera) return;
    
    try {
      // Get movement speed (sprint with shift)
      const speed = keys.current.shift ? 0.15 : 0.08;
      
      // Reset horizontal velocity
      velocity.current.x = 0;
      velocity.current.z = 0;
      
      // Get camera direction for movement relative to view
      direction.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
      direction.current.y = 0;
      direction.current.normalize();
      
      // Calculate forward and right vectors
      const forward = direction.current.clone();
      const right = new THREE.Vector3();
      right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();
      
      // Apply movement based on keys pressed
      if (keys.current.forward) {
        velocity.current.add(forward.clone().multiplyScalar(speed));
      }
      if (keys.current.backward) {
        velocity.current.add(forward.clone().multiplyScalar(-speed * 0.7));
      }
      if (keys.current.left) {
        velocity.current.add(right.clone().multiplyScalar(-speed * 0.8));
      }
      if (keys.current.right) {
        velocity.current.add(right.clone().multiplyScalar(speed * 0.8));
      }
      
      // Apply gravity and jumping
      if (!isGrounded) {
        jumpForce.current -= gravity;
      }
      
      // Check if player has landed
      if (playerRef.current.position.y <= 1 && jumpForce.current <= 0) {
        playerRef.current.position.y = 1;
        jumpForce.current = 0;
        setIsGrounded(true);
      }
      
      // Apply vertical movement
      velocity.current.y = jumpForce.current;
      
      // Move player
      playerRef.current.position.add(velocity.current);
      
      // Position camera with player
      camera.position.x = playerRef.current.position.x;
      camera.position.y = playerRef.current.position.y + 1.6; // Eye level
      camera.position.z = playerRef.current.position.z;
      
      // Update controls target to look ahead of player
      if (controls.current) {
        const lookTarget = playerRef.current.position.clone().add(forward.multiplyScalar(5));
        controls.current.target.copy(lookTarget);
      }
    } catch (error) {
      console.error("Player movement error:", error);
    }
  });
  
  return <primitive object={playerRef.current} />;
};

export default Player;
