import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import ThreeComponents from './game-world/ThreeComponents';
import ViewSwitcher from './ui/ViewSwitcher';
import useGameStateStore from '@/stores/gameStateStore';

// Define an enhanced 2D view component that includes game features
const EnhancedTwoDView: React.FC = () => {
  const { currentPhase } = useGameStateStore();
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-game-bg text-white">
      <div className="text-center p-6 max-w-lg">
        <h2 className="text-2xl mb-4">Big Brother Game View</h2>
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <p className="mb-4">
            The 3D environment is currently unavailable while we fix stability issues.
            All game features are fully functional in this 2D mode.
          </p>
          
          {/* Placeholder for game UI elements */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 p-3 rounded text-left">
              <h3 className="font-bold mb-1">House Areas</h3>
              <ul className="text-sm">
                <li>• HoH Room</li>
                <li>• Kitchen</li>
                <li>• Living Room</li>
                <li>• Nomination Area</li>
              </ul>
            </div>
            <div className="bg-gray-700 p-3 rounded text-left">
              <h3 className="font-bold mb-1">Current Phase</h3>
              <p className="text-yellow-300 font-bold">{currentPhase.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-xs mt-1">Make your strategic choices</p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          Development Note: We're working on a stable 3D view that will be available in a future update.
        </div>
      </div>
    </div>
  );
};

// Simple error boundary component for the game world
class GameWorldErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}, {
  hasError: boolean;
  errorCount: number;
}> {
  // Initialize state with proper typing
  state = {
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
      return <EnhancedTwoDView />;
    }
    
    return this.props.children;
  }
}

// Main component that toggles between 2D and 3D views
const GameWorld: React.FC = () => {
  // Force 2D mode by default, 3D disabled until stable
  const [view3D, setView3D] = useState(false);
  const [renderError, setRenderError] = useState<Error | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);
  
  // Handle ThreeJS errors
  const handleError = (error: Error) => {
    console.error("3D view error:", error);
    setRenderError(error);
    setView3D(false);
    
    toast({
      title: "3D View Issues",
      description: "Switching to 2D mode due to rendering issues. 3D mode will be available in a future update.",
      variant: "destructive"
    });
    
    setErrorCount(prev => prev + 1);
  };
  
  // Toggle between 3D and 2D views
  const toggleView = () => {
    if (view3D) {
      setView3D(false);
      toast({
        title: "Switched to 2D Mode",
        description: "Using simplified 2D interface."
      });
    } else {
      // Display a "coming soon" toast instead of enabling 3D
      toast({
        title: "3D View Coming Soon",
        description: "We're working on stability improvements for the 3D view.",
        variant: "default"
      });
      
      // Uncomment this when 3D is ready:
      // setView3D(true);
    }
  };
  
  return (
    <div className="w-full h-full">
      {/* Always show 2D view for now */}
      <EnhancedTwoDView />
      
      {/* Keep the view switcher component for future use */}
      <div className="absolute top-16 right-4 z-30">
        <ViewSwitcher 
          is3DActive={view3D} 
          onToggle={toggleView} 
          is3DDisabled={true}
        />
      </div>
    </div>
  );
};

export default GameWorld;
