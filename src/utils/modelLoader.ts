
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
  const [isLoaded, setIsLoaded] = useState(true); // Changed to true to avoid loading screen in development

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Manually preload models
        const preloadModel = (path: string) => {
          return new Promise<void>((resolve) => {
            try {
              // Instead of using the cache property which doesn't exist in the type definitions,
              // we'll use the preload method, which is the official way to preload models
              useGLTF.preload(path);
              
              // Always resolve since we're just preloading
              resolve();
            } catch (error) {
              console.warn(`Error preloading model: ${path}`, error);
              resolve(); // Always resolve to continue with other models
            }
          });
        };
        
        // Create a promise for each model
        const promises = Object.values(MODEL_PATHS).map(preloadModel);
        
        // All promises will resolve
        await Promise.all(promises);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
        // Return true anyway to avoid being stuck on loading screen
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
    return { scene: null };
  }
};

// Export paths for direct access
export { MODEL_PATHS };
