
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { usePreloadModels } from '@/utils/modelLoader';
import { toast } from '@/hooks/use-toast';

import GameScene from './GameScene';
import GameOverlay from './GameOverlay';
import GameControls from '../GameControls';

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
  const controlsRef = useRef<any>(null);
  const [debug, setDebug] = useState(false);
  const [canvasError, setCanvasError] = useState<Error | null>(null);
  const modelsLoaded = usePreloadModels();
  
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
    if (controlsRef.current) {
      controlsRef.current.lock();
    }
  };

  const handleCanvasError = (error: Error) => {
    setCanvasError(error);
    toast({
      title: "3D Rendering Error",
      description: "Failed to initialize 3D view. Using fallback mode.",
      variant: "destructive"
    });
  };

  // Show a loading screen until models are loaded
  if (!modelsLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Loading Game Assets...</h2>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

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
          shadows
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.6, 5] }}
          gl={{ antialias: true, alpha: false }}
          onClick={handleLock}
        >
          <GameScene 
            controlsRef={controlsRef}
            debug={debug}
          />
          
          {/* Mouse lock controls for first-person view */}
          <PointerLockControls
            ref={controlsRef}
            onLock={() => setIsLocked(true)}
            onUnlock={() => setIsLocked(false)}
          />
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
