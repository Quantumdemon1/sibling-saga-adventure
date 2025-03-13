import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Sky, Stats } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';
import Player from './Player';
import NPC from './NPC';
import NPCsContainer from './NPCsContainer';
import BigBrotherHouse from './BigBrotherHouse';
import NominationBox from './NominationBox';
import SceneLights from './SceneLights';
import InteractiveObject from './InteractiveObject';
import StatusIndicators from './StatusIndicators';
import PhaseVisualizer from './phase-visualizations/PhaseVisualizer';
import { Box } from '@react-three/drei';
import { usePreloadModels } from '@/utils/modelLoader';

interface LoadingScreenProps {
  progress?: number;
}

// Simple loading screen component
const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0 }) => {
  return (
    <Box args={[1, 1, 1]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#8B5CF6" />
    </Box>
  );
};

// Ground component
const Ground: React.FC<{ size: [number, number] }> = ({ size }) => {
  return (
    <Box 
      args={[size[0], 0.2, size[1]]} 
      position={[0, -0.1, 0]} 
      receiveShadow
    >
      <meshStandardMaterial color="#8FB275" />
    </Box>
  );
};

// HoH Competition Area
const HohCompetitionArea: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Platform */}
      <Box 
        args={[10, 0.5, 10]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <meshStandardMaterial color="#8B5CF6" />
      </Box>
      
      {/* Competition elements */}
      <Box 
        args={[1.5, 1.5, 1.5]} 
        position={[0, 1.5, 0]} 
        castShadow
      >
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </Box>
      
      {/* Decorative pillars */}
      {[[-4, 0, -4], [4, 0, -4], [-4, 0, 4], [4, 0, 4]].map((pillarPos, i) => (
        <Box 
          key={i}
          args={[0.8, 3, 0.8]} 
          position={[pillarPos[0], 1.5, pillarPos[2]]} 
          castShadow
        >
          <meshStandardMaterial color="#0EA5E9" />
        </Box>
      ))}
    </group>
  );
};

const GameWorld: React.FC = () => {
  const { currentPhase, setOverlay } = useGameStateStore();
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
        {debug && <Stats />}
        
        <fog attach="fog" args={['#87CEEB', 10, 40]} />
        <Sky sunPosition={[100, 10, 100]} />
        <SceneLights />
        
        <Suspense fallback={<LoadingScreen />}>
          {/* Ground */}
          <Ground size={[100, 100]} />
          
          {/* Big Brother House */}
          <BigBrotherHouse />
          
          {/* Status indicators in 3D space */}
          <StatusIndicators />
          
          {/* Phase-specific visualizations */}
          <PhaseVisualizer />
          
          {/* NPCs Container - all NPCs will be managed here */}
          <NPCsContainer />
          
          {/* Phase-specific interactive elements */}
          {currentPhase === 'nominationCeremony' && (
            <InteractiveObject
              position={[4, 1, -8]}
              onInteract={() => {
                setOverlay({ type: 'nomination' });
              }}
              phase="nominationCeremony"
            >
              <NominationBox />
            </InteractiveObject>
          )}
          
          {currentPhase === 'hohCompetition' && (
            <>
              <HohCompetitionArea position={[0, 0, -20]} />
              <InteractiveObject
                position={[0, 1, -20]}
                onInteract={() => {
                  setOverlay({ type: 'hoh' });
                }}
                phase="hohCompetition"
              >
                <Box args={[1.5, 1.5, 1.5]} castShadow>
                  <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
                </Box>
              </InteractiveObject>
            </>
          )}
          
          {currentPhase === 'vetoCompetition' && (
            <>
              <HohCompetitionArea position={[0, 0, -20]} />
              <InteractiveObject
                position={[0, 1, -20]}
                onInteract={() => {
                  setOverlay({ type: 'veto' });
                }}
                phase="vetoCompetition"
              >
                <Box args={[1.5, 1.5, 1.5]} castShadow>
                  <meshStandardMaterial color="#9b87f5" emissive="#9b87f5" emissiveIntensity={0.3} />
                </Box>
              </InteractiveObject>
            </>
          )}
          
          {currentPhase === 'vetoCeremony' && (
            <InteractiveObject
              position={[-4, 1, -8]}
              onInteract={() => {
                setOverlay({ type: 'veto' });
              }}
              phase="vetoCeremony"
            >
              <Box args={[1.5, 1.5, 1.5]} castShadow>
                <meshStandardMaterial color="#9b87f5" />
              </Box>
            </InteractiveObject>
          )}
          
          {currentPhase === 'evictionVoting' && (
            <InteractiveObject
              position={[0, 1, -10]}
              onInteract={() => {
                setOverlay({ type: 'eviction' });
              }}
              phase="evictionVoting"
            >
              <Box args={[2, 2, 0.5]} castShadow>
                <meshStandardMaterial color="#ea384c" />
              </Box>
            </InteractiveObject>
          )}
          
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
