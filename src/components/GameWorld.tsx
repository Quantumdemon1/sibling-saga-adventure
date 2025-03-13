
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { usePreloadModels } from '@/utils/modelLoader';

import GameScene from './game-world/GameScene';
import GameOverlay from './game-world/GameOverlay';

const GameWorld: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef<any>(null);
  const [debug, setDebug] = useState(false);
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
      if (e.key === 'e') {
        // E key handling is done in the InteractiveObject component
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

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.6, 5] }}
        gl={{ antialias: true }}
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
    </div>
  );
};

export default GameWorld;
