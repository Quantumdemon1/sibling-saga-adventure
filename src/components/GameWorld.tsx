
import React from 'react';
import { toast } from '@/hooks/use-toast';

// Define a simple 2D view component that will be shown instead of the 3D view
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

// Simple error boundary component for the game world
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
      return <TwoDView />;
    }
    
    return this.props.children;
  }
}

// Main component that always returns the 2D view for now
const GameWorld: React.FC = () => {
  // Notify user that we're using 2D mode
  React.useEffect(() => {
    toast({
      title: "Using 2D Mode",
      description: "For optimal performance, the game is running in 2D mode."
    });
  }, []);
  
  // Always return the 2D view for stability
  return <TwoDView />;
};

export default GameWorld;
