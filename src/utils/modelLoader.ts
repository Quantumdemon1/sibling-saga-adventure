
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
        // Create a promise for each model path with proper error handling
        const promises = Object.values(MODEL_PATHS).map((path) => {
          // Wrap in a promise that always resolves with either the model or null
          return new Promise<any>((resolve) => {
            // We need to handle the case where useGLTF.preload could return undefined
            try {
              const preloadResult = useGLTF.preload(path);
              
              // Check if the result is a Promise
              if (preloadResult && typeof preloadResult === 'object' && 'then' in preloadResult) {
                // It's a Promise
                (preloadResult as Promise<any>)
                  .then(result => resolve(result))
                  .catch(error => {
                    console.log(`Model not found: ${path}`, error);
                    resolve(null); // Always resolve with null for failed loads
                  });
              } else {
                // Not a Promise or undefined
                console.log(`Invalid preload result for: ${path}`);
                resolve(null);
              }
            } catch (error) {
              console.log(`Error preloading model: ${path}`, error);
              resolve(null);
            }
          });
        });
        
        // All promises will resolve (never undefined)
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
