
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
  
  return (
    <>
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
        <GamePhaseElements 
          currentPhase={currentPhase} 
          setOverlay={setOverlay} 
        />
        
        {/* Player controller */}
        <Player controls={controlsRef} />
      </Suspense>
    </>
  );
};

export default GameScene;
