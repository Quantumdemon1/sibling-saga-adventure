
import React, { useRef, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Dynamically import Three.js related components to prevent initialization errors
const ThreeComponents = React.lazy(() => 
  import('./game-world/ThreeComponents')
    .catch(error => {
      console.error("Failed to load Three.js components:", error);
      return { default: () => null };
    })
);

const GameWorld: React.FC = () => {
  const [is3DAvailable, setIs3DAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if Three.js is available and can be initialized
    const checkThreeJsAvailability = async () => {
      try {
        // Test if Three.js can be initialized
        await import('three').catch(() => {
          throw new Error('Three.js cannot be initialized');
        });
        
        setIs3DAvailable(true);
      } catch (error) {
        console.error("3D view unavailable:", error);
        setIs3DAvailable(false);
        toast({
          title: "3D View Unavailable",
          description: "Unable to initialize 3D view. Using 2D mode instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkThreeJsAvailability();
  }, []);
  
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Initializing Game World...</h2>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!is3DAvailable) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-game-bg text-white">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl mb-4">3D View Unavailable</h2>
          <p className="mb-4">
            Your browser doesn't support the 3D view or an error occurred during initialization.
          </p>
          <p className="text-gray-300">Please use the 2D view to play the game.</p>
        </div>
      </div>
    );
  }
  
  return (
    <React.Suspense fallback={
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="animate-spin w-10 h-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    }>
      <ThreeComponents />
    </React.Suspense>
  );
};

export default GameWorld;
