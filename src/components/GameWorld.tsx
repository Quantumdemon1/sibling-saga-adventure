
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import ThreeComponents from './game-world/ThreeComponents';
import ViewSwitcher from './ui/ViewSwitcher';

// Define a simple 2D view component as a fallback
const TwoDView: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-game-bg text-white">
    <div className="text-center p-6 max-w-md">
      <h2 className="text-2xl mb-4">2D Game View</h2>
      <p className="mb-4">
        You are currently in 2D mode. Switch to 3D for an immersive experience.
      </p>
      <p className="text-gray-300">
        All game features are available in both views.
      </p>
    </div>
  </div>
);

// Define the state type for the error boundary
interface GameWorldErrorBoundaryState {
  hasError: boolean;
  errorCount: number;
}

// Simple error boundary component for the game world
class GameWorldErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}, GameWorldErrorBoundaryState> {
  // Initialize state with proper typing
  state: GameWorldErrorBoundaryState = {
    hasError: false,
    errorCount: 0
  };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error("Game World Error:", error);
    this.props.onError(error);
    
    // Update error count
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1
    }));
  }
  
  render() {
    if (this.state.hasError) {
      return <TwoDView />;
    }
    
    return this.props.children;
  }
}

// Main component that toggles between 2D and 3D views
const GameWorld: React.FC = () => {
  const [view3D, setView3D] = useState(true);
  const [renderError, setRenderError] = useState<Error | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);
  
  // Handle ThreeJS errors
  const handleError = (error: Error) => {
    console.error("3D view error:", error);
    setRenderError(error);
    
    // Only force 2D mode after multiple errors
    if (errorCount >= 2) {
      setView3D(false);
      
      toast({
        title: "3D View Issues",
        description: "Switching to 2D mode due to rendering issues. You can try 3D mode again later.",
        variant: "destructive"
      });
    } else {
      // Try to recover from error
      setIsRecovering(true);
      setTimeout(() => {
        setIsRecovering(false);
      }, 1500);
    }
    
    setErrorCount(prev => prev + 1);
  };
  
  // Clear error state when switching views
  useEffect(() => {
    if (view3D) {
      setRenderError(null);
    }
  }, [view3D]);
  
  // Toggle between 3D and 2D views
  const toggleView = () => {
    setView3D(!view3D);
    toast({
      title: view3D ? "Switched to 2D Mode" : "Switched to 3D Mode",
      description: view3D ? "Using simplified 2D interface." : "Using immersive 3D environment."
    });
  };
  
  return (
    <div className="w-full h-full">
      {isRecovering ? (
        <div className="w-full h-full flex items-center justify-center bg-game-bg text-white">
          <div className="text-center">
            <p className="mb-2">Recovering 3D view...</p>
            <div className="w-32 h-2 bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : view3D ? (
        <GameWorldErrorBoundary onError={handleError}>
          <ThreeComponents />
        </GameWorldErrorBoundary>
      ) : (
        <TwoDView />
      )}
      
      {/* View switcher */}
      <div className="absolute top-16 right-4 z-30">
        <ViewSwitcher is3DActive={view3D} onToggle={toggleView} />
      </div>
    </div>
  );
};

export default GameWorld;
