
import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';

// Define model paths
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
      const promises = Object.values(MODEL_PATHS).map((path) => 
        useGLTF.preload(path)
      );
      await Promise.all(promises);
      setIsLoaded(true);
    };

    loadModels();

    // Clean up
    return () => {
      Object.values(MODEL_PATHS).forEach((path) => 
        useGLTF.clear(path)
      );
    };
  }, []);

  return isLoaded;
};

// Hook to load a specific model
export const useGameModel = (modelKey: ModelKey) => {
  const path = MODEL_PATHS[modelKey];
  return useGLTF(path);
};

// Export paths for direct access
export { MODEL_PATHS };
