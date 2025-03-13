
import { Player } from '@/types/PlayerProfileTypes';
import useGameStateStore from '../gameStateStore';

export const initialPlayers: Player[] = [
  {
    id: 'player1',
    name: 'You',
    status: 'active',
    isHuman: true,
    isAI: false,
    alliances: [],
    relationships: {},
    stats: {
      social: 5,
      physical: 5,
      mental: 5,
      strategic: 5,
      hohWins: 0,
      povWins: 0,
      nominations: 0,
      daysInHouse: 0
    }
  },
  {
    id: 'npc1',
    name: 'Alex',
    status: 'active',
    isHuman: false,
    isAI: true,
    alliances: [],
    relationships: {
      'player1': { type: 'neutral', extraPoints: 0 }
    },
    stats: {
      social: 6,
      physical: 4,
      mental: 5,
      strategic: 7,
      hohWins: 0,
      povWins: 0,
      nominations: 0,
      daysInHouse: 0
    }
  },
  {
    id: 'npc2',
    name: 'Jordan',
    status: 'active',
    isHuman: false,
    isAI: true,
    alliances: [],
    relationships: {
      'player1': { type: 'friendly', extraPoints: 10 },
      'npc1': { type: 'neutral', extraPoints: 0 }
    },
    stats: {
      social: 8,
      physical: 3,
      mental: 6,
      strategic: 5,
      hohWins: 0,
      povWins: 0,
      nominations: 0,
      daysInHouse: 0
    }
  },
  {
    id: 'npc3',
    name: 'Morgan',
    status: 'active',
    isHuman: false,
    isAI: true,
    alliances: [],
    relationships: {
      'player1': { type: 'hostile', extraPoints: -10 },
      'npc1': { type: 'friendly', extraPoints: 15 },
      'npc2': { type: 'neutral', extraPoints: 0 }
    },
    stats: {
      social: 4,
      physical: 7,
      mental: 6,
      strategic: 8,
      hohWins: 0,
      povWins: 0,
      nominations: 0,
      daysInHouse: 0
    }
  },
  {
    id: 'npc4',
    name: 'Taylor',
    status: 'active',
    isHuman: false,
    isAI: true,
    alliances: [],
    relationships: {
      'player1': { type: 'neutral', extraPoints: 5 },
      'npc1': { type: 'hostile', extraPoints: -5 },
      'npc2': { type: 'friendly', extraPoints: 10 },
      'npc3': { type: 'hostile', extraPoints: -15 }
    },
    stats: {
      social: 7,
      physical: 6,
      mental: 4,
      strategic: 5,
      hohWins: 0,
      povWins: 0,
      nominations: 0,
      daysInHouse: 0
    }
  }
];

// Update the store to use the initial players
export const useInitialPlayers = () => {
  const { setPlayers, players } = useGameStateStore();
  
  if (players.length === 0) {
    setPlayers(initialPlayers);
  }
  
  return players;
};
