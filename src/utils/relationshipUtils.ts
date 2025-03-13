
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
  }[relationship.type] || 25;
  
  // Add extra points (positive or negative)
  return Math.min(Math.max(baseScore + relationship.extraPoints, 0), 100);
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

/**
 * Calculate compatibility between two players based on their strategies and stats
 */
export const calculateCompatibility = (player1: Player, player2: Player): number => {
  // This is a simplified compatibility model - can be expanded with more factors
  let score = 50; // Start neutral
  
  // If players' strategies match/clash
  if (player1.strategy && player2.strategy) {
    // Players targeting the same strategy generally get along better
    if (player1.strategy.preferredTargets === player2.strategy.preferredTargets) {
      score += 15;
    }
    
    // If one player is targeting the other (or their type)
    if (player1.strategy.targetIds?.includes(player2.id) || 
        player2.strategy.targetIds?.includes(player1.id)) {
      score -= 30;
    }
  }
  
  // Shared alliances = more compatible
  const player1Alliances = player1.alliances || [];
  const player2Alliances = player2.alliances || [];
  const sharedAlliances = player1Alliances.filter(id => player2Alliances.includes(id));
  score += sharedAlliances.length * 10;
  
  // Cap the score between 0-100
  return Math.min(Math.max(score, 0), 100);
};
