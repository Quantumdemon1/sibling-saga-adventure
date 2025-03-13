import React from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import NPC from './NPC';

// Potential locations for NPCs
const NPC_LOCATIONS: Record<string, [number, number, number]> = {
  kitchen: [2, 0, -5],
  livingRoom: [-3, 0, -10],
  backyard: [5, 0, -25],
  bedroomA: [-8, 0, -15],
  bedroomB: [8, 0, -15],
  hohRoom: [0, 0, -35],
};

const NPCsContainer: React.FC = () => {
  const { players, currentPhase, hoh, nominees } = useGameStateStore();
  
  // Filter only active AI players
  const activeNPCs = players.filter(p => p.isAI && p.status !== 'evicted');
  
  return (
    <>
      {activeNPCs.map((npc, index) => {
        // Base position
        let position: [number, number, number];
        
        // Position based on game state
        if (npc.id === hoh) {
          // HoH is in the HoH room
          position = NPC_LOCATIONS.hohRoom;
        } else if (nominees.includes(npc.id)) {
          // Nominees hang out in the living room
          position = [
            NPC_LOCATIONS.livingRoom[0] + (index % 2) * 2, 
            NPC_LOCATIONS.livingRoom[1],
            NPC_LOCATIONS.livingRoom[2]
          ];
        } else {
          // Other NPCs distributed around the house
          const locations = Object.values(NPC_LOCATIONS);
          const basePosition = locations[index % locations.length];
          
          // Add a bit of randomness to prevent overlap
          position = [
            basePosition[0] + (Math.random() - 0.5) * 2,
            basePosition[1],
            basePosition[2] + (Math.random() - 0.5) * 2
          ];
        }
        
        // Behavior based on game phase
        let behavior = 'idle';
        if (currentPhase === 'hohCompetition') {
          behavior = 'competing';
        } else if (currentPhase === 'nominationCeremony' && npc.id === hoh) {
          behavior = 'nominating';
        }
        
        return (
          <NPC
            key={npc.id}
            npcId={npc.id}
            position={position}
            name={npc.name}
            color={npc.id === hoh ? "#FFD700" : nominees.includes(npc.id) ? "#ea384c" : "#3498db"}
            behavior={behavior as any}
          />
        );
      })}
    </>
  );
};

export default NPCsContainer;
