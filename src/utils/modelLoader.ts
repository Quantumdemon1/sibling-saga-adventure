
import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
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

// Hook to preload all models
export const usePreloadModels = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Manually preload models
        const preloadModel = (path: string) => {
          return new Promise<void>((resolve) => {
            try {
              useGLTF.preload(path);
              resolve();
            } catch (error) {
              console.warn(`Error preloading model: ${path}`, error);
              resolve(); // Always resolve to continue with other models
            }
          });
        };
        
        // Create a promise for each model
        const promises = Object.values(MODEL_PATHS).map(preloadModel);
        
        // Wait for all promises to resolve
        await Promise.all(promises);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
        // Set loaded to true to avoid being stuck on loading screen
        setIsLoaded(true);
      }
    };

    loadModels();

    // Clean up
    return () => {
      Object.values(MODEL_PATHS).forEach((path) => {
        try {
          useGLTF.clear(path);
        } catch (e) {
          console.log(`Could not clear model: ${path}`);
        }
      });
    };
  }, []);

  return isLoaded;
};

// Hook to load a specific model with error handling
export const useGameModel = (modelKey: ModelKey) => {
  try {
    return useGLTF(MODEL_PATHS[modelKey]);
  } catch (error) {
    console.error(`Error loading model: ${modelKey}`, error);
    // Return a default empty scene if model loading fails
    return { scene: new THREE.Group() };
  }
};

// Export paths for direct access
export { MODEL_PATHS };
