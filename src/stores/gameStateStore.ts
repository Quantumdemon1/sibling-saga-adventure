
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { GamePhase, OverlayType, Alliance, AllianceProposal } from '@/types/gameTypes';
import { Player } from '@/types/PlayerProfileTypes';

interface GameState {
  // Game progress
  currentPhase: GamePhase;
  dayCount: number;
  weekCount: number;
  
  // Players and game roles
  players: Player[];
  hoh: string | null;
  nominees: string[];
  vetoHolder: string | null;
  
  // UI state
  overlay: OverlayType;
  
  // Alliance system
  alliances: Alliance[];
  allianceProposals: AllianceProposal[];
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setPlayers: (players: Player[]) => void;
  setHohWinner: (playerId: string) => void;
  setNominees: (nominees: string[]) => void;
  setVetoHolder: (playerId: string) => void;
  setDialogue: (dialogue: { npcId: string; text: string } | null) => void;
  setOverlay: (overlay: OverlayType) => void;
  createAlliance: (name: string, members: string[]) => void;
  proposeAlliance: (name: string, proposerId: string, invitees: string[]) => void;
  acceptAlliance: (proposalId: string, playerId: string) => void;
  rejectAlliance: (proposalId: string) => void;
  advanceWeek: () => void;
}

const initialPlayers: Player[] = [
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

const useGameStateStore = create<GameState>((set) => ({
  // Initial state
  currentPhase: 'idle',
  dayCount: 1,
  weekCount: 1,
  players: initialPlayers,
  hoh: null,
  nominees: [],
  vetoHolder: null,
  overlay: null,
  alliances: [],
  allianceProposals: [],
  
  // Actions
  setPhase: (phase) => set({ currentPhase: phase }),
  
  setPlayers: (players) => set({ players }),
  
  setHohWinner: (playerId) => set((state) => ({
    hoh: playerId,
    players: state.players.map(player => 
      player.id === playerId 
        ? { 
            ...player, 
            stats: { 
              ...player.stats, 
              hohWins: (player.stats?.hohWins || 0) + 1 
            } 
          }
        : player
    )
  })),
  
  setNominees: (nominees) => set((state) => ({
    nominees,
    players: state.players.map(player => 
      nominees.includes(player.id)
        ? { 
            ...player, 
            status: 'nominated',
            stats: { 
              ...player.stats, 
              nominations: (player.stats?.nominations || 0) + 1 
            } 
          }
        : player.status === 'nominated' && !nominees.includes(player.id)
          ? { ...player, status: 'active' }
          : player
    )
  })),
  
  setVetoHolder: (playerId) => set((state) => ({
    vetoHolder: playerId,
    players: state.players.map(player => 
      player.id === playerId 
        ? { 
            ...player, 
            stats: { 
              ...player.stats, 
              povWins: (player.stats?.povWins || 0) + 1 
            } 
          }
        : player
    )
  })),
  
  setDialogue: (dialogue) => set({
    overlay: dialogue ? { type: 'dialogue', npcId: dialogue.npcId } : null
  }),
  
  setOverlay: (overlay) => set({ overlay }),
  
  createAlliance: (name, members) => set((state) => {
    const newAlliance: Alliance = {
      id: uuidv4(),
      name,
      members
    };
    
    return {
      alliances: [...state.alliances, newAlliance],
      players: state.players.map(player => 
        members.includes(player.id)
          ? { 
              ...player, 
              alliances: [...(player.alliances || []), newAlliance.id] 
            }
          : player
      )
    };
  }),
  
  proposeAlliance: (name, proposerId, invitees) => set((state) => ({
    allianceProposals: [
      ...state.allianceProposals,
      {
        id: uuidv4(),
        name,
        proposerId,
        invitees,
        accepted: [proposerId],
        rejected: []
      }
    ]
  })),
  
  acceptAlliance: (proposalId, playerId) => set((state) => {
    const proposal = state.allianceProposals.find(p => p.id === proposalId);
    if (!proposal) return state;
    
    const updatedProposal = {
      ...proposal,
      accepted: [...proposal.accepted, playerId]
    };
    
    // Check if all invitees have accepted
    const allAccepted = updatedProposal.invitees.every(
      invitee => updatedProposal.accepted.includes(invitee)
    );
    
    if (allAccepted) {
      // Create the alliance
      const newAlliance: Alliance = {
        id: uuidv4(),
        name: proposal.name,
        members: updatedProposal.accepted
      };
      
      return {
        allianceProposals: state.allianceProposals.filter(p => p.id !== proposalId),
        alliances: [...state.alliances, newAlliance],
        players: state.players.map(player => 
          updatedProposal.accepted.includes(player.id)
            ? { 
                ...player, 
                alliances: [...(player.alliances || []), newAlliance.id] 
              }
            : player
        )
      };
    }
    
    return {
      allianceProposals: state.allianceProposals.map(p => 
        p.id === proposalId ? updatedProposal : p
      )
    };
  }),
  
  rejectAlliance: (proposalId) => set((state) => ({
    allianceProposals: state.allianceProposals.filter(p => p.id !== proposalId)
  })),
  
  advanceWeek: () => set((state) => ({
    weekCount: state.weekCount + 1,
    dayCount: state.dayCount + 7,
    hoh: null,
    nominees: [],
    vetoHolder: null,
    players: state.players.map(player => 
      player.status !== 'evicted'
        ? { 
            ...player, 
            status: 'active',
            stats: { 
              ...player.stats, 
              daysInHouse: (player.stats?.daysInHouse || 0) + 7 
            } 
          }
        : player
    )
  }))
}));

export default useGameStateStore;
