
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

// Hook to preload all models with better error handling
export const usePreloadModels = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Skip model loading in development/testing
    setIsLoaded(true);
    
    // In a real implementation, we would preload models here
    // This is simplified to avoid errors with Three.js initialization
    return () => {
      // Cleanup if needed
    };
  }, []);

  return isLoaded;
};

// Hook to load a specific model with error handling
export const useGameModel = (modelKey: ModelKey) => {
  // Return a default empty scene to avoid errors
  return { scene: new THREE.Group() };
};

// Export paths for direct access
export { MODEL_PATHS };
