
import React from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import HohCompetitionViz from './HohCompetitionViz';
import NominationCeremonyViz from './NominationCeremonyViz';
import VetoCeremonyViz from './VetoCeremonyViz';
import EvictionVotingViz from './EvictionVotingViz';

const PhaseVisualizer: React.FC = () => {
  const { currentPhase } = useGameStateStore();
  
  // Render different visualizations based on the current game phase
  switch (currentPhase) {
    case 'hohCompetition':
      return <HohCompetitionViz />;
    case 'nominationCeremony':
      return <NominationCeremonyViz />;
    case 'vetoCeremony':
      return <VetoCeremonyViz />;
    case 'evictionVoting':
      return <EvictionVotingViz />;
    default:
      return null; // No visualization for other phases
  }
};

export default PhaseVisualizer;
