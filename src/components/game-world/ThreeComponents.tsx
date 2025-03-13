
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { toast } from '@/hooks/use-toast';

import GameOverlay from './GameOverlay';
import GameControls from '../GameControls';

// Simplified scene component to reduce complexity
const SimpleScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh position={[0, 0, -5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
};

// Error boundary specific for Three.js canvas
class ThreeJSErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error("Three.js Error:", error);
    this.props.onError(error);
  }
  
  render() {
    if (this.state.hasError) {
      return null; // Don't render anything in error state
    }
    
    return this.props.children;
  }
}

const ThreeComponents: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [debug, setDebug] = useState(false);
  const [canvasError, setCanvasError] = useState<Error | null>(null);
  
  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle debug mode with F3
      if (e.key === 'F3') {
        setDebug(prev => !prev);
      }
      
      // Add keyboard hooks for game controls
      if (e.key === 'Escape') {
        setIsLocked(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleCanvasError = (error: Error) => {
    console.error("Canvas error:", error);
    setCanvasError(error);
    toast({
      title: "3D Rendering Error",
      description: "Failed to initialize 3D view. Using fallback mode.",
      variant: "destructive"
    });
  };

  // If there was a canvas error, show fallback UI
  if (canvasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-game-bg text-white">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl mb-4 text-red-500">3D Rendering Error</h2>
          <p className="mb-4">Failed to initialize the 3D game world.</p>
          <p className="text-gray-300">
            Please switch to 2D view to continue playing. The game will work normally in 2D mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <ThreeJSErrorBoundary onError={handleCanvasError}>
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.6, 5] }}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: true
          }}
          onClick={handleLock}
        >
          {/* Use the simplified scene to avoid any complex props passing */}
          <SimpleScene />
          {debug && <Stats />}
        </Canvas>
      </ThreeJSErrorBoundary>
      
      <GameOverlay 
        isLocked={isLocked}
        handleLock={handleLock}
      />
      
      <GameControls />
    </div>
  );
};

export default ThreeComponents;
