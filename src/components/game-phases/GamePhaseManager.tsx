
import React from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import HohCompetition from '@/components/game-phases/HohCompetition';
import NominationCeremony from '@/components/game-phases/NominationCeremony';
import VetoCompetition from '@/components/game-phases/VetoCompetition';
import VetoCeremony from '@/components/game-phases/VetoCeremony';
import EvictionVoting from '@/components/game-phases/EvictionVoting';
import WeeklySummary from '@/components/game-phases/WeeklySummary';
import GameIdle from '@/components/game-phases/GameIdle';

interface GamePhaseManagerProps {
  onStartHohCompetition: () => void;
  onManageAlliances: () => void;
}

const GamePhaseManager: React.FC<GamePhaseManagerProps> = ({
  onStartHohCompetition,
  onManageAlliances
}) => {
  const { 
    currentPhase,
    players,
    hoh,
    nominees,
    vetoHolder,
    dayCount,
    weekCount
  } = useGameStateStore();
  
  switch (currentPhase) {
    case 'hohCompetition':
      return <HohCompetition players={players} />;
      
    case 'nominationCeremony':
      return <NominationCeremony players={players} hoh={hoh} />;
      
    case 'vetoCompetition':
      return <VetoCompetition players={players} hoh={hoh} nominees={nominees} />;
      
    case 'vetoCeremony':
      return <VetoCeremony players={players} hoh={hoh} nominees={nominees} vetoHolder={vetoHolder} />;
      
    case 'evictionVoting':
      return <EvictionVoting players={players} nominees={nominees} hoh={hoh} />;
      
    case 'weeklySummary':
      return <WeeklySummary players={players} weekCount={weekCount} dayCount={dayCount} />;
      
    case 'idle':
    default:
      return <GameIdle 
        onStartHohCompetition={onStartHohCompetition} 
        onManageAlliances={onManageAlliances} 
      />;
  }
};

export default GamePhaseManager;
