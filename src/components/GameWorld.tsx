
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Sky, Stats } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';
import Player from './Player';
import NPC from './NPC';
import House from './House';
import NominationBox from './NominationBox';
import SceneLights from './SceneLights';
import InteractiveObject from './InteractiveObject';
import { Box } from '@react-three/drei';

const GameWorld: React.FC = () => {
  const { currentPhase, setOverlay } = useGameStateStore();
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef<any>(null);
  const [debug, setDebug] = useState(false);
  
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

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.6, 5] }}
        gl={{ antialias: true }}
        onClick={handleLock}
      >
        {debug && <Stats />}
        
        <fog attach="fog" args={['#87CEEB', 10, 40]} />
        <Sky sunPosition={[100, 10, 100]} />
        <SceneLights />
        
        <Suspense fallback={null}>
          {/* Floor */}
          <Box 
            args={[100, 0.2, 100]} 
            position={[0, -0.1, 0]} 
            receiveShadow
          >
            <meshStandardMaterial color="#8FB275" />
          </Box>
          
          {/* Main House */}
          <House />
          
          {/* Nomination Box - Interactive object for ceremony */}
          <InteractiveObject
            position={[4, 1, -8]}
            onInteract={() => {
              if (currentPhase === 'nominationCeremony') {
                setOverlay({ type: 'nomination' });
              }
            }}
            phase="nominationCeremony"
          >
            <NominationBox />
          </InteractiveObject>
          
          {/* HoH Competition Area */}
          <InteractiveObject
            position={[-4, 1, -8]}
            onInteract={() => {
              if (currentPhase === 'hohCompetition') {
                setOverlay({ type: 'hoh' });
              }
            }}
            phase="hohCompetition"
          >
            <Box args={[1.5, 1.5, 1.5]} castShadow>
              <meshStandardMaterial color="#FFD700" />
            </Box>
          </InteractiveObject>
          
          {/* NPCs */}
          <NPC
            position={[3, 0, -5]}
            npcId="npc1"
            name="Alex"
            color="#8A2BE2"
          />
          
          <NPC
            position={[-3, 0, -5]}
            npcId="npc2"
            name="Jordan"
            color="#20B2AA"
          />
          
          {/* Player controller */}
          <Player controls={controlsRef} />
        </Suspense>
        
        {/* Mouse lock controls for first-person view */}
        <PointerLockControls
          ref={controlsRef}
          onLock={() => setIsLocked(true)}
          onUnlock={() => setIsLocked(false)}
        />
      </Canvas>
      
      {/* Overlay instructions - only show when pointer isn't locked */}
      {!isLocked && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-4 rounded-lg text-white text-center">
          <p className="text-xl font-bold mb-2">Big Brother RPG</p>
          <p>Click to enter first-person mode</p>
          <p className="text-sm mt-2">WASD to move, SPACE to jump, SHIFT to sprint, E to interact</p>
          <p className="text-sm mt-1">ESC to exit first-person mode</p>
          <button 
            onClick={handleLock}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Enter Game
          </button>
        </div>
      )}
      
      {/* Game controls reminder - only show when locked */}
      {isLocked && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded text-white text-xs">
          <p>WASD: Move | SPACE: Jump | SHIFT: Sprint | E: Interact | ESC: Exit</p>
        </div>
      )}
    </div>
  );
};

export default GameWorld;
