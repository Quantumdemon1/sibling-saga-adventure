
import React from 'react';
import { Text } from '@react-three/drei';
import useGameStateStore from '@/stores/gameStateStore';

const StatusIndicators: React.FC = () => {
  const { hoh, nominees, currentPhase, players } = useGameStateStore();
  
  // Get names instead of IDs
  const getPlayerName = (id: string) => {
    const player = players.find(p => p.id === id);
    return player ? player.name : id;
  };
  
  const hohName = hoh ? getPlayerName(hoh) : null;
  const nomineeNames = nominees.map(id => getPlayerName(id));
  
  return (
    <group>
      {/* Game phase indicator */}
      <Text
        position={[0, 4, -15]}
        color="#8B5CF6" // Vivid purple
        fontSize={0.6}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {formatPhase(currentPhase)}
      </Text>
      
      {/* HoH indicator */}
      {hohName && (
        <Text
          position={[0, 3.2, -15]}
          color="#FFD700" // Gold
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          Head of Household: {hohName}
        </Text>
      )}
      
      {/* Nominees indicator */}
      {nominees.length > 0 && (
        <Text
          position={[0, 2.6, -15]}
          color="#ea384c" // Red
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          Nominees: {nomineeNames.join(', ')}
        </Text>
      )}
    </group>
  );
};

// Helper function to format the phase name for display
const formatPhase = (phase: string): string => {
  switch (phase) {
    case 'hohCompetition':
      return 'HoH Competition';
    case 'nominationCeremony':
      return 'Nomination Ceremony';
    case 'vetoCompetition':
      return 'Veto Competition';
    case 'vetoCeremony':
      return 'Veto Ceremony';
    case 'evictionVoting':
      return 'Eviction Voting';
    case 'weeklySummary':
      return 'Weekly Summary';
    case 'endGame':
      return 'Game Over';
    default:
      return phase.charAt(0).toUpperCase() + phase.slice(1);
  }
};

export default StatusIndicators;
