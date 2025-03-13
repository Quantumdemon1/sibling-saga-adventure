
import { useState } from 'react';
import { Player } from '@/types/PlayerProfileTypes';
import { Relationship } from '@/types/gameTypes';
import { getRelationshipBetweenPlayers, getRelationshipScore } from '@/utils/relationshipUtils';

export type InteractionAction = {
  id: string;
  name: string;
  icon: JSX.Element;
  points: number;
  description: string;
};

export type InteractionHistoryEvent = {
  date: string;
  action: string;
  points: number;
};

export const useRelationshipInteractions = (
  selectedPlayer: Player | null,
  humanPlayer: Player | undefined,
  onRelationshipChange: (playerId: string, points: number) => void
) => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [customPoints, setCustomPoints] = useState<number[]>([0]);
  const [interactionHistory, setInteractionHistory] = useState<InteractionHistoryEvent[]>([
    { date: "Day 5", action: "Had a deep conversation", points: 15 },
    { date: "Day 3", action: "Shared game strategy", points: 10 },
    { date: "Day 2", action: "Disagreement about chores", points: -5 },
  ]);

  const relationship = selectedPlayer && humanPlayer
    ? getRelationshipBetweenPlayers(humanPlayer, selectedPlayer)
    : null;
    
  const relationshipScore = relationship ? getRelationshipScore(relationship) : 0;

  const handleActionSelect = (actionId: string, actions: InteractionAction[]) => {
    setSelectedAction(actionId);
    const action = actions.find(a => a.id === actionId);
    
    if (action && selectedPlayer) {
      onRelationshipChange(selectedPlayer.id, action.points);
      
      // Add to interaction history
      const newHistoryItem: InteractionHistoryEvent = {
        date: `Day ${Math.floor(Math.random() * 10) + 1}`, // Just for demo
        action: action.name,
        points: action.points
      };
      
      setInteractionHistory(prev => [newHistoryItem, ...prev]);
    }
  };

  const handleCustomInteraction = () => {
    if (selectedPlayer && customPoints[0] !== 0) {
      onRelationshipChange(selectedPlayer.id, customPoints[0]);
      
      // Add to interaction history
      const newHistoryItem: InteractionHistoryEvent = {
        date: `Day ${Math.floor(Math.random() * 10) + 1}`, // Just for demo
        action: `Custom interaction (${customPoints[0] > 0 ? 'positive' : 'negative'})`,
        points: customPoints[0]
      };
      
      setInteractionHistory(prev => [newHistoryItem, ...prev]);
      setCustomPoints([0]);
    }
  };

  const getRelationshipDescription = (score: number): string => {
    if (score > 80) return 'Strong alliance - they trust you completely!';
    if (score > 60) return 'Good friends - they see you as an ally.';
    if (score > 40) return 'Friendly - they generally like you.';
    if (score > 20) return 'Neutral - they have no strong feelings.';
    return 'Hostile - they may target you!';
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
