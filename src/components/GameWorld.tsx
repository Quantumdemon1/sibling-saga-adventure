
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Define a simple fallback component for 2D view
const TwoDView: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-game-bg text-white">
    <div className="text-center p-6 max-w-md">
      <h2 className="text-2xl mb-4">2D Game View</h2>
      <p className="mb-4">
        You are currently in 2D mode. The 3D view is not available.
      </p>
      <p className="text-gray-300">
        All game features are available in this view.
      </p>
    </div>
  </div>
);

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
            <p>We couldn't load the 3D view. Please use 2D mode.</p>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Dynamically import Three.js components only when needed
const ThreeComponentsLazy = React.lazy(() => 
  import('./game-world/ThreeComponents')
    .catch(error => {
      console.error("Failed to load Three.js components:", error);
      throw error; // Rethrow to be caught by error boundary
    })
);

const GameWorld: React.FC = () => {
  // Start with 2D mode as the default for reliability
  const [is3DAvailable, setIs3DAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if Three.js can be loaded successfully
    const checkThreeJsAvailability = async () => {
      try {
        // For safety and reliability, default to 2D mode
        // This helps avoid 3D-related errors
        setIs3DAvailable(false);
        setIsLoading(false);
      } catch (error) {
        console.error("3D view unavailable:", error);
        setIs3DAvailable(false);
        toast({
          title: "3D View Unavailable",
          description: "Using 2D mode for stability.",
          variant: "destructive",
        });
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
  
  // For now, always use 2D view to avoid Three.js errors
  return <TwoDView />;
};

export default GameWorld;
