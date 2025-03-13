
import React, { useRef, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Main error boundary for the entire 3D world
class GameWorldErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error("Game World Error:", error);
    this.props.onError(error);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black text-white">
          <div className="text-center p-4">
            <h2 className="text-2xl mb-4 text-red-500">3D View Error</h2>
            <p>We couldn't load the 3D view. Please try switching to 2D mode.</p>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Define a simple fallback component for 2D view
const TwoDView: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-game-bg text-white">
    <div className="text-center p-6 max-w-md">
      <h2 className="text-2xl mb-4">2D Game View</h2>
      <p className="mb-4">
        You are currently in 2D mode. The 3D view is not available in your browser.
      </p>
      <p className="text-gray-300">
        You can still play all game features in this view.
      </p>
    </div>
  </div>
);

// Dynamically import Three.js components to prevent rendering issues
const ThreeComponentsLazy = React.lazy(() => 
  import('./game-world/ThreeComponents')
    .catch(error => {
      console.error("Failed to load Three.js components:", error);
      throw error; // Rethrow to be caught by error boundary
    })
);

const GameWorld: React.FC = () => {
  const [is3DAvailable, setIs3DAvailable] = useState<boolean>(true); // Start with 3D enabled by default
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if Three.js is available and can be initialized
    const checkThreeJsAvailability = async () => {
      try {
        // Test if WebGL is available
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          throw new Error('WebGL not supported');
        }
        
        // Try to import Three.js
        await import('three').catch(() => {
          throw new Error('Three.js cannot be initialized');
        });
        
        // Set 3D as available only if all checks pass
        setIs3DAvailable(true);
      } catch (error) {
        console.error("3D view unavailable:", error);
        setIs3DAvailable(false);
        toast({
          title: "3D View Unavailable",
          description: "Your browser doesn't support 3D view. Using 2D mode instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkThreeJsAvailability();
  }, []);
  
  const handleError = (error: Error) => {
    console.error("GameWorld error:", error);
    setIs3DAvailable(false);
    toast({
      title: "3D View Error",
      description: "Encountered an error in 3D view. Switched to 2D mode.",
      variant: "destructive",
    });
  };
  
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
    return <TwoDView />;
  }
  
  return (
    <GameWorldErrorBoundary onError={handleError}>
      <React.Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      }>
        <ThreeComponentsLazy />
      </React.Suspense>
    </GameWorldErrorBoundary>
  );
};

export default GameWorld;
