
export type GamePhase = 
  | 'idle' 
  | 'hohCompetition' 
  | 'nominationCeremony' 
  | 'vetoCompetition' 
  | 'vetoCeremony' 
  | 'evictionVoting'
  | 'weeklySummary'
  | 'endGame';

export type OverlayType = {
  type: 'dialogue' | 'hoh' | 'nomination' | 'veto' | 'eviction' | 'summary' | 'alliance' | 'allianceProposal' | 'weekSidebar';
  npcId?: string;
  proposalId?: string;
  proposerId?: string;
  allianceName?: string;
} | null;

export type PlayerStatus = 'active' | 'nominee' | 'hoh' | 'veto' | 'evicted' | 'nominated';

export type Relationship = {
  type: 'friendly' | 'neutral' | 'hostile';
  extraPoints: number;
};

export type PlayerStats = {
  social: number;
  physical: number;
  mental: number;
  strategic: number;
  hohWins?: number;
  povWins?: number;
  nominations?: number;
  daysInHouse?: number;
};

export type Alliance = {
  id: string;
  name: string;
  members: string[];
  isSecret?: boolean;
};

export type AllianceProposal = {
  id: string;
  name: string;
  proposerId: string;
  invitees: string[];
  accepted: string[];
  rejected: string[];
};
