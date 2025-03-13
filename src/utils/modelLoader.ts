
import { useState, useEffect } from 'react';
import * as THREE from 'three';

// Define model paths - using placeholder paths for development
const MODEL_PATHS = {
  house: '/models/house.glb',
  nominationBox: '/models/nomination_box.glb',
  npc: '/models/npc.glb',
  hohChair: '/models/hoh_chair.glb',
  vetoNecklace: '/models/veto_necklace.glb',
};

// Type for model keys
export type ModelKey = keyof typeof MODEL_PATHS;

// Simplified hook to preload models
export const usePreloadModels = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // In a real implementation, we would do actual asset loading here
    // For now, we're just simulating success to avoid errors
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return isLoaded;
};

// Safe model generation function that uses simple geometries
export const useGameModel = (modelKey: ModelKey) => {
  // Create a simple mesh to represent the model
  const group = new THREE.Group();
  
  // Color mapping for different models
  const colors = {
    house: 0x8888FF,
    nominationBox: 0xFF8888,
    npc: 0x88FF88,
    hohChair: 0xFFFF88,
    vetoNecklace: 0xFF88FF,
  };
  
  // Create different geometries based on model type
  let geometry: THREE.BufferGeometry;
  
  switch(modelKey) {
    case 'house':
      geometry = new THREE.BoxGeometry(2, 1.5, 2);
      break;
    case 'nominationBox':
      geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      break;
    case 'npc':
      // Simple character shape
      geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
      break;
    case 'hohChair':
      geometry = new THREE.CylinderGeometry(0.6, 0.6, 1, 16);
      break;
    case 'vetoNecklace':
      geometry = new THREE.TorusGeometry(0.5, 0.1, 8, 24);
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
  }
  
  // Create material with appropriate color
  const material = new THREE.MeshStandardMaterial({ 
    color: colors[modelKey] || 0x888888,
    transparent: true,
    opacity: 0.8
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
  
  // Return a simple object structure without any custom properties
  return {
    scene: group,
    animations: [] as THREE.AnimationClip[],
    modelKey
  };
};

// Export paths for direct access
export { MODEL_PATHS };
