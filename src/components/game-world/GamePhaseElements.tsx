
import React from 'react';
import { Box } from '@react-three/drei';
import InteractiveObject from '../InteractiveObject';
import NominationBox from '../NominationBox';
import HohCompetitionArea from './HohCompetitionArea';
import { GamePhase } from '@/types/gameTypes';

interface GamePhaseElementsProps {
  currentPhase: GamePhase;
  setOverlay: (overlay: any) => void;
}

const GamePhaseElements: React.FC<GamePhaseElementsProps> = ({ currentPhase, setOverlay }) => {
  return (
    <>
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
              <meshStandardMaterial 
                color="#FFD700" 
                emissive="#FFD700" 
                emissiveIntensity={0.3} 
              />
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
              <meshStandardMaterial 
                color="#9b87f5" 
                emissive="#9b87f5" 
                emissiveIntensity={0.3} 
              />
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
    </>
  );
};

export default GamePhaseElements;
