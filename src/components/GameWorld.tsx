
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { usePreloadModels } from '@/utils/modelLoader';

import GameScene from './game-world/GameScene';
import GameOverlay from './game-world/GameOverlay';
import GameControls from './GameControls';

const GameWorld: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef<any>(null);
  const [debug, setDebug] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
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

  // Show a loading screen until models are loaded
  const loadingContent = (
    <div className="w-full h-full flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-2xl mb-4">Loading Big Brother RPG...</h2>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-purple-600 animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );

  if (!modelsLoaded) {
    return loadingContent;
  }

  // If there was a render error, show fallback UI
  if (renderError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-game-bg text-white">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl mb-4 text-game-destructive">3D View Error</h2>
          <p className="mb-4">{renderError}</p>
          <p className="text-game-secondary">Please switch to 2D view to continue playing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <ErrorBoundary onError={(error) => setRenderError(error.message)}>
        <Canvas
          shadows
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.6, 5] }}
          gl={{ antialias: true }}
          onClick={handleLock}
        >
          <Suspense fallback={null}>
            <GameScene 
              controlsRef={controlsRef}
              debug={debug}
            />
          </Suspense>
          
          {/* Mouse lock controls for first-person view */}
          <PointerLockControls
            ref={controlsRef}
            onLock={() => setIsLocked(true)}
            onUnlock={() => setIsLocked(false)}
          />
        </Canvas>
      </ErrorBoundary>
      
      <GameOverlay 
        isLocked={isLocked}
        handleLock={handleLock}
      />
      
      <GameControls />
    </div>
  );
};

// Simple error boundary component for React Three Fiber
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }
  
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default GameWorld;
