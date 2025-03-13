
import { v4 as uuidv4 } from 'uuid';
import { Player } from '@/types/PlayerProfileTypes';

// A list of potential AI player names
const AI_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", 
  "Riley", "Jamie", "Quinn", "Avery", "Cameron",
  "Sam", "Charlie", "Blake", "Robin", "Dakota",
  "Skyler", "Reese", "Parker", "Drew", "Jesse"
];

// Different personality types
const PERSONALITIES = ["social", "loner", "strategist", "loyalist"];

type Difficulty = 'easy' | 'medium' | 'hard';

export const createAIPlayers = (count: number, difficulty: Difficulty = 'medium'): Player[] => {
  const players: Player[] = [];
  
  // Take random names without duplicates
  const shuffledNames = [...AI_NAMES].sort(() => 0.5 - Math.random());
  const selectedNames = shuffledNames.slice(0, count);
  
  for (let i = 0; i < count; i++) {
    // Generate a random personality
    const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)] as Player['personality'];
    
    // Difficulty affects AI player stats and strategy
    const baseLevel = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    
    // Generate random stats based on difficulty and personality
    const generateStat = () => Math.max(1, Math.min(10, baseLevel + Math.floor(Math.random() * 3) - 1));
    
    const stats = {
      social: generateStat(),
      physical: generateStat(),
      mental: generateStat(),
      strategic: generateStat(),
      hohWins: 0,
      povWins: 0,
      nominations: 0,
      daysInHouse: 1
    };
    
    // Adjust stats based on personality
    if (personality === 'social') stats.social += 2;
    if (personality === 'strategist') stats.strategic += 2;
    
    const player: Player = {
      id: uuidv4(),
      name: selectedNames[i],
      avatarUrl: `/avatars/ai-${i+1}.png`, // Assumes you have some avatar images
      status: 'active',
      isHuman: false,
      isAI: true,
      alliances: [],
      relationships: {},
      stats,
      strategy: {
        targetIds: [],
        allianceIds: [],
        preferredTargets: ['weak', 'strong', 'neutral'][Math.floor(Math.random() * 3)] as 'strong' | 'weak' | 'neutral',
      },
      personality,
      lastProposal: 0
    };
    
    players.push(player);
  }
  
  return players;
};
