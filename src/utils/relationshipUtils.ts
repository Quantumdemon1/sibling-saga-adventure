
import { Player } from '@/types/PlayerProfileTypes';
import { Relationship } from '@/types/gameTypes';

/**
 * Calculate relationship score between two players
 */
export const getRelationshipScore = (relationship: Relationship): number => {
  // Base score based on relationship type
  const baseScore = {
    'friendly': 50,
    'neutral': 25,
    'hostile': 0,
  }[relationship.type];
  
  // Add extra points (positive or negative)
  return baseScore + relationship.extraPoints;
};

/**
 * Get relationship status between two players
 */
export const getRelationshipBetweenPlayers = (
  player1: Player,
  player2: Player
): Relationship => {
  if (!player1.relationships || !player2.id) {
    return { type: 'neutral', extraPoints: 0 };
  }
  
  return player1.relationships[player2.id] || { type: 'neutral', extraPoints: 0 };
};

/**
 * Update relationship between players
 */
export const updateRelationship = (
  players: Player[],
  player1Id: string,
  player2Id: string, 
  change: Partial<Relationship> | number
): Player[] => {
  return players.map(player => {
    if (player.id !== player1Id) return player;
    
    const relationships = player.relationships || {};
    const currentRelationship = relationships[player2Id] || { type: 'neutral', extraPoints: 0 };
    
    // If change is just a number, update extraPoints
    if (typeof change === 'number') {
      const newExtraPoints = currentRelationship.extraPoints + change;
      
      // Determine new relationship type based on points
      let newType = currentRelationship.type;
      if (newExtraPoints > 20) newType = 'friendly';
      else if (newExtraPoints < -20) newType = 'hostile';
      else newType = 'neutral';
      
      return {
        ...player,
        relationships: {
          ...relationships,
          [player2Id]: {
            type: newType,
            extraPoints: newExtraPoints
          }
        }
      };
    }
    
    // If change is an object, merge with current relationship
    return {
      ...player,
      relationships: {
        ...relationships,
        [player2Id]: {
          ...currentRelationship,
          ...change
        }
      }
    };
  });
};

/**
 * Get visual elements for relationship display
 */
export const getRelationshipVisuals = (relationship: Relationship) => {
  const score = getRelationshipScore(relationship);
  
  // Derive color and icon based on relationship type and score
  let color = 'bg-gray-400'; // neutral
  let textColor = 'text-white';
  
  if (relationship.type === 'friendly') {
    color = 'bg-green-500';
    textColor = 'text-white';
  } else if (relationship.type === 'hostile') {
    color = 'bg-red-500';
    textColor = 'text-white';
  }
  
  return { color, textColor, score };
};
