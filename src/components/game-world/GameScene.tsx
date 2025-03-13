
import React, { Suspense, useRef, useState, useEffect } from 'react';
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

// Simple error boundary component for individual scene elements
class ElementErrorBoundary extends React.Component<{
  children: React.ReactNode;
  name: string;
  onError: (name: string, error: Error) => void;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(this.props.name, error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Return nothing when there's an error
    }

    return this.props.children;
  }
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
        {/* Ground */}
        <ElementErrorBoundary name="Ground" onError={handleComponentError}>
          <Ground size={[100, 100]} />
        </ElementErrorBoundary>
        
        {/* Big Brother House */}
        <ElementErrorBoundary name="BigBrotherHouse" onError={handleComponentError}>
          <BigBrotherHouse />
        </ElementErrorBoundary>
        
        {/* Status indicators in 3D space */}
        <ElementErrorBoundary name="StatusIndicators" onError={handleComponentError}>
          <StatusIndicators />
        </ElementErrorBoundary>
        
        {/* Phase-specific visualizations */}
        <ElementErrorBoundary name="PhaseVisualizer" onError={handleComponentError}>
          <PhaseVisualizer />
        </ElementErrorBoundary>
        
        {/* NPCs Container - all NPCs will be managed here */}
        <ElementErrorBoundary name="NPCsContainer" onError={handleComponentError}>
          <NPCsContainer />
        </ElementErrorBoundary>
        
        {/* Phase-specific interactive elements */}
        <ElementErrorBoundary name="GamePhaseElements" onError={handleComponentError}>
          <GamePhaseElements 
            currentPhase={currentPhase} 
            setOverlay={setOverlay} 
          />
        </ElementErrorBoundary>
        
        {/* Player controller */}
        <ElementErrorBoundary name="Player" onError={handleComponentError}>
          <Player controls={controlsRef} />
        </ElementErrorBoundary>
      </Suspense>
    </>
  );
};

export default GameScene;
