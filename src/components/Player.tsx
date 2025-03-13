import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from '@react-three/drei';
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
  
  // Get keyboard controls with the correct method
  const [, getKeys] = useKeyboardControls();
  
  // Initialize player position
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(0, 1, 5);
    }
  }, []);
  
  // Handle player movement
  useFrame((state, delta) => {
    if (!playerRef.current) return;
    
    // Get current keystate
    const keys = getKeys();
    const forward = keys.forward || false;
    const backward = keys.backward || false;
    const left = keys.left || false;
    const right = keys.right || false;
    const shift = keys.shift || false;
    const space = keys.space || false;
    
    // Get movement speed (sprint with shift)
    const speed = shift ? 0.15 : 0.08;
    
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
    if (forward) {
      velocityRef.current.add(forwardVector.multiplyScalar(speed));
    }
    if (backward) {
      velocityRef.current.add(forwardVector.multiplyScalar(-speed * 0.7)); // Slower backward movement
    }
    if (left) {
      velocityRef.current.add(rightVector.multiplyScalar(-speed * 0.8)); // Slightly slower strafing
    }
    if (right) {
      velocityRef.current.add(rightVector.multiplyScalar(speed * 0.8)); // Slightly slower strafing
    }
    
    // Handle jumping
    if (space && isGrounded) {
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
    
    // Move player based on velocity
    playerRef.current.position.add(velocityRef.current);
    
    // Get current game phase for phase-specific restrictions
    const { currentPhase } = useGameStateStore.getState();
    
    // Add phase-specific movement restrictions
    if (currentPhase === 'hohCompetition' || currentPhase === 'vetoCompetition') {
      // Restrict movement to competition area
      const competitionCenter = new THREE.Vector3(0, 0, -10);
      if (playerRef.current.position.distanceTo(competitionCenter) > 15) {
        // Move back toward competition area
        const toCenter = competitionCenter.sub(playerRef.current.position).normalize();
        playerRef.current.position.add(toCenter.multiplyScalar(0.1));
      }
    } else if (currentPhase === 'nominationCeremony') {
      // Keep players closer to nomination area
      const nominationCenter = new THREE.Vector3(4, 0, -8);
      if (playerRef.current.position.distanceTo(nominationCenter) > 12) {
        const toNomination = nominationCenter.sub(playerRef.current.position).normalize();
        playerRef.current.position.add(toNomination.multiplyScalar(0.08));
      }
    }
    
    // Boundary limits - prevent player from going too far from house
    const maxDistance = 40;
    const origin = new THREE.Vector3(0, 0, 0);
    if (playerRef.current.position.distanceTo(origin) > maxDistance) {
      const toOrigin = origin.sub(playerRef.current.position).normalize();
      playerRef.current.position.add(toOrigin.multiplyScalar(0.2));
    }
    
    // Update camera position to follow player
    state.camera.position.copy(playerRef.current.position.clone().add(new THREE.Vector3(0, 1.6, 0)));
  });
  
  return <primitive object={playerRef.current} />;
};

export default Player;
