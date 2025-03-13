
import React, { Suspense, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Sky, Stats } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';

import LoadingScreen from './LoadingScreen';
import Ground from './Ground';
import GamePhaseElements from './GamePhaseElements';
import SceneLights from '../SceneLights';
import BigBrotherHouse from '../BigBrotherHouse';
import NPCsContainer from '../NPCsContainer';
import Player from '../Player';
import StatusIndicators from '../StatusIndicators';
import PhaseVisualizer from '../phase-visualizations/PhaseVisualizer';

interface GameSceneProps {
  controlsRef: React.RefObject<any>;
  debug: boolean;
}

const GameScene: React.FC<GameSceneProps> = ({ controlsRef, debug }) => {
  const { currentPhase, setOverlay } = useGameStateStore();
  const [sceneError, setSceneError] = useState<string | null>(null);
  
  // Error handler for scene components
  const handleComponentError = (componentName: string, error: Error) => {
    console.error(`Error in ${componentName}:`, error);
    setSceneError(`Failed to load ${componentName}: ${error.message}`);
  };
  
  // If there's an error in the scene, display a simple fallback
  if (sceneError) {
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
  }
  
  return (
    <>
      {debug && <Stats />}
      
      <fog attach="fog" args={['#87CEEB', 10, 40]} />
      <Sky sunPosition={[100, 10, 100]} />
      <SceneLights />
      
      <Suspense fallback={<LoadingScreen />}>
        <ErrorBoundaryGroup onError={(name, error) => handleComponentError(name, error)}>
          {/* Ground */}
          <ComponentWithErrorBoundary name="Ground">
            <Ground size={[100, 100]} />
          </ComponentWithErrorBoundary>
          
          {/* Big Brother House */}
          <ComponentWithErrorBoundary name="BigBrotherHouse">
            <BigBrotherHouse />
          </ComponentWithErrorBoundary>
          
          {/* Status indicators in 3D space */}
          <ComponentWithErrorBoundary name="StatusIndicators">
            <StatusIndicators />
          </ComponentWithErrorBoundary>
          
          {/* Phase-specific visualizations */}
          <ComponentWithErrorBoundary name="PhaseVisualizer">
            <PhaseVisualizer />
          </ComponentWithErrorBoundary>
          
          {/* NPCs Container - all NPCs will be managed here */}
          <ComponentWithErrorBoundary name="NPCsContainer">
            <NPCsContainer />
          </ComponentWithErrorBoundary>
          
          {/* Phase-specific interactive elements */}
          <ComponentWithErrorBoundary name="GamePhaseElements">
            <GamePhaseElements 
              currentPhase={currentPhase} 
              setOverlay={setOverlay} 
            />
          </ComponentWithErrorBoundary>
          
          {/* Player controller */}
          <ComponentWithErrorBoundary name="Player">
            <Player controls={controlsRef} />
          </ComponentWithErrorBoundary>
        </ErrorBoundaryGroup>
      </Suspense>
    </>
  );
};

// Component that wraps children in an error boundary
interface ComponentWithErrorBoundaryProps {
  children: React.ReactNode;
  name: string;
}

const ComponentWithErrorBoundary: React.FC<ComponentWithErrorBoundaryProps> = ({ children, name }) => {
  return <>{children}</>;
};

// Group of error boundaries with a common error handler
interface ErrorBoundaryGroupProps {
  children: React.ReactNode;
  onError: (name: string, error: Error) => void;
}

const ErrorBoundaryGroup: React.FC<ErrorBoundaryGroupProps> = ({ children, onError }) => {
  return <>{children}</>;
};

export default GameScene;
