
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { GameState, AllianceState } from './types';
import { Alliance, AllianceProposal } from '@/types/gameTypes';

export const createAllianceSlice: StateCreator<
  GameState,
  [],
  [],
  AllianceState
> = (set) => ({
  alliances: [],
  allianceProposals: [],
  
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
});
