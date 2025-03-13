
import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';

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
        const promises = Object.values(MODEL_PATHS).map((path) => 
          useGLTF.preload(path).catch((error) => {
            console.log(`Model not found: ${path}`);
            return null; // Return null instead of undefined
          })
        );
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
