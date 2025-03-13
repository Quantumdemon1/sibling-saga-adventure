
import { useState } from 'react';
import { Player } from '@/types/PlayerProfileTypes';
import { Relationship } from '@/types/gameTypes';
import { InteractionAction, InteractionHistoryEvent } from '@/types/relationshipTypes';
import { getRelationshipBetweenPlayers, getRelationshipScore } from '@/utils/relationshipUtils';
import { INITIAL_INTERACTION_HISTORY, getRelationshipDescription } from '@/constants/relationshipConstants';

export const useRelationshipInteractions = (
  selectedPlayer: Player | null,
  humanPlayer: Player | undefined,
  onRelationshipChange: (playerId: string, points: number) => void
) => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [customPoints, setCustomPoints] = useState<number[]>([0]);
  const [interactionHistory, setInteractionHistory] = useState<InteractionHistoryEvent[]>(INITIAL_INTERACTION_HISTORY);

  // Get current relationship data
  const relationship = selectedPlayer && humanPlayer
    ? getRelationshipBetweenPlayers(humanPlayer, selectedPlayer)
    : null;
    
  const relationshipScore = relationship ? getRelationshipScore(relationship) : 0;

  // Handle predefined interaction action
  const handleActionSelect = (actionId: string, actions: InteractionAction[]) => {
    setSelectedAction(actionId);
    const action = actions.find(a => a.id === actionId);
    
    if (action && selectedPlayer) {
      // Apply relationship change
      onRelationshipChange(selectedPlayer.id, action.points);
      
      // Record interaction in history
      addToInteractionHistory(action.name, action.points);
    }
  };

  // Handle custom interaction with slider value
  const handleCustomInteraction = () => {
    if (selectedPlayer && customPoints[0] !== 0) {
      // Apply relationship change
      onRelationshipChange(selectedPlayer.id, customPoints[0]);
      
      // Record interaction in history
      const interactionType = customPoints[0] > 0 ? 'positive' : 'negative';
      addToInteractionHistory(`Custom interaction (${interactionType})`, customPoints[0]);
      
      // Reset slider
      setCustomPoints([0]);
    }
  };

  // Helper function to add new interaction to history
  const addToInteractionHistory = (actionName: string, points: number) => {
    const newHistoryItem: InteractionHistoryEvent = {
      date: `Day ${Math.floor(Math.random() * 10) + 1}`, // Simplified for demo
      action: actionName,
      points: points
    };
    
    setInteractionHistory(prev => [newHistoryItem, ...prev]);
  };

  return {
    selectedAction,
    customPoints,
    interactionHistory,
    relationship,
    relationshipScore,
    handleActionSelect,
    handleCustomInteraction,
    setCustomPoints,
    getRelationshipDescription
  };
};
