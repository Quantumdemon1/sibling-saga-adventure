
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

// Simplified hook to load a specific model
export const useGameModel = (modelKey: ModelKey) => {
  // Return a default empty scene to avoid errors
  const defaultModel = {
    scene: new THREE.Group(),
    animations: [],
    asset: null
  };
  
  return defaultModel;
};

// Export paths for direct access
export { MODEL_PATHS };
