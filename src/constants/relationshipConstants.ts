
import { InteractionHistoryEvent } from '@/types/relationshipTypes';

// Initial interaction history for new relationships
export const INITIAL_INTERACTION_HISTORY: InteractionHistoryEvent[] = [
  { date: "Day 5", action: "Had a deep conversation", points: 15 },
  { date: "Day 3", action: "Shared game strategy", points: 10 },
  { date: "Day 2", action: "Disagreement about chores", points: -5 },
];

// Description mapping for relationship scores
export const getRelationshipDescription = (score: number): string => {
  if (score > 80) return 'Strong alliance - they trust you completely!';
  if (score > 60) return 'Good friends - they see you as an ally.';
  if (score > 40) return 'Friendly - they generally like you.';
  if (score > 20) return 'Neutral - they have no strong feelings.';
  return 'Hostile - they may target you!';
};
