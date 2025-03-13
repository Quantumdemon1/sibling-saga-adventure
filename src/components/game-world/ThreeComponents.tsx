
import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { usePreloadModels } from '@/utils/modelLoader';
import { toast } from '@/hooks/use-toast';

import GameScene from './GameScene';
import GameOverlay from './GameOverlay';
import GameControls from '../GameControls';

const ThreeComponents: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef<any>(null);
  const [debug, setDebug] = useState(false);
  const modelsLoaded = usePreloadModels();
  
  // Listen for keyboard shortcuts
  React.useEffect(() => {
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

  try {
    return (
      <div className="w-full h-full relative">
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
        
        <GameOverlay 
          isLocked={isLocked}
          handleLock={handleLock}
        />
        
        <GameControls />
      </div>
    );
  } catch (error) {
    console.error("Error rendering Three.js components:", error);
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
};

export default ThreeComponents;
