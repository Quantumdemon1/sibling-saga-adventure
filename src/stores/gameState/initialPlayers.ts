
import { Player } from '@/types/PlayerProfileTypes';

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
