
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStateStore from '@/stores/gameStateStore';

interface PlayerProps {
  controls: React.RefObject<any>;
}

const Player: React.FC<PlayerProps> = ({ controls }) => {
  const playerRef = useRef<THREE.Group>(new THREE.Group());
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [isGrounded, setIsGrounded] = useState(true);
  const gravityRef = useRef(0.01);
  const jumpForceRef = useRef(0);
  const { scene } = useThree();
  const [currentRoom, setCurrentRoom] = useState<string>("Outside");
  
  // Simplified keyboard state management
  const [keys, setKeys] = useState({
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
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setKeys(prev => ({ ...prev, forward: true }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setKeys(prev => ({ ...prev, backward: true }));
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(prev => ({ ...prev, left: true }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(prev => ({ ...prev, right: true }));
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') setKeys(prev => ({ ...prev, shift: true }));
      if (e.code === 'Space') setKeys(prev => ({ ...prev, space: true }));
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setKeys(prev => ({ ...prev, forward: false }));
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setKeys(prev => ({ ...prev, backward: false }));
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setKeys(prev => ({ ...prev, left: false }));
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setKeys(prev => ({ ...prev, right: false }));
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') setKeys(prev => ({ ...prev, shift: false }));
      if (e.code === 'Space') setKeys(prev => ({ ...prev, space: false }));
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
    const speed = keys.shift ? 0.15 : 0.08;
    
    // Reset horizontal velocity
    velocityRef.current.x = 0;
    velocityRef.current.z = 0;
    
    // Get camera direction
    const direction = new THREE.Vector3();
    state.camera.getWorldDirection(direction);
    direction.y = 0; // Keep movement on the horizontal plane
    direction.normalize();
    
    // Calculate forward and right vectors
    const forwardVector = direction.clone();
    const rightVector = new THREE.Vector3(-direction.z, 0, direction.x);
    
    // Apply movement based on keys pressed
    if (keys.forward) {
      velocityRef.current.add(forwardVector.multiplyScalar(speed));
    }
    if (keys.backward) {
      velocityRef.current.add(forwardVector.multiplyScalar(-speed * 0.7)); // Slower backward movement
    }
    if (keys.left) {
      velocityRef.current.add(rightVector.multiplyScalar(-speed * 0.8)); // Slightly slower strafing
    }
    if (keys.right) {
      velocityRef.current.add(rightVector.multiplyScalar(speed * 0.8)); // Slightly slower strafing
    }
    
    // Handle jumping
    if (keys.space && isGrounded) {
      jumpForceRef.current = 0.2;
      setIsGrounded(false);
    }
    
    // Apply gravity and jump force
    if (!isGrounded) {
      jumpForceRef.current -= gravityRef.current;
    }
    velocityRef.current.y = jumpForceRef.current;
    
    // Collision detection with ground
    const raycaster = new THREE.Raycaster(
      playerRef.current.position.clone().add(new THREE.Vector3(0, 0.1, 0)),
      new THREE.Vector3(0, -1, 0)
    );
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0 && intersects[0].distance < 0.2) {
      if (!isGrounded) {
        setIsGrounded(true);
        jumpForceRef.current = 0;
      }
      playerRef.current.position.y = intersects[0].point.y + 0.1;
    }
    
    // Store the current position before attempting to move
    const previousPosition = playerRef.current.position.clone();
    
    // Move player based on velocity
    playerRef.current.position.add(velocityRef.current);
    
    // Simplify collision detection for performance
    // Check for collisions with basic objects
    const playerBoundingBox = new THREE.Box3().setFromCenterAndSize(
      playerRef.current.position,
      new THREE.Vector3(0.5, 1.8, 0.5)
    );
    
    // Update camera position to follow player
    state.camera.position.copy(playerRef.current.position.clone().add(new THREE.Vector3(0, 1.6, 0)));
  });
  
  return <primitive object={playerRef.current} />;
};

export default Player;
