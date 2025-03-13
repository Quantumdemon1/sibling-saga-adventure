
import { PlayerStatus, Relationship, PlayerStats } from './gameTypes';

export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  status: PlayerStatus;
  isHuman: boolean;
  isAI: boolean;
  alliances?: string[];
  relationships?: { [playerId: string]: Relationship };
  stats?: PlayerStats;
  strategy?: {
    targetIds?: string[];
    allianceIds?: string[];
    preferredTargets?: 'strong' | 'weak' | 'neutral';
  };
  personality?: 'social' | 'loner' | 'strategist' | 'loyalist';
  lastProposal?: number;
}

// For backward compatibility
export type PlayerData = Player;
