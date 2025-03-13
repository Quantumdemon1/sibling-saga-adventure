
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

// Safe model generation function that doesn't try to load real models
export const useGameModel = (modelKey: ModelKey) => {
  // Create a basic default model to return
  const group = new THREE.Group();
  
  // Create a simple mesh to represent the model
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    transparent: true,
    opacity: 0.5
  });
  
  // Each model type gets a slightly different color
  switch(modelKey) {
    case 'house':
      material.color.set(0x8888FF);
      break;
    case 'nominationBox':
      material.color.set(0xFF8888);
      break;
    case 'npc':
      material.color.set(0x88FF88);
      break;
    case 'hohChair':
      material.color.set(0xFFFF88);
      break;
    case 'vetoNecklace':
      material.color.set(0xFF88FF);
      break;
  }
  
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
  
  // Return a simple object structure
  return {
    scene: group,
    animations: [],
    asset: null
  };
};

// Export paths for direct access
export { MODEL_PATHS };
