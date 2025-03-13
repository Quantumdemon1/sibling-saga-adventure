
export type GamePhase = 
  | 'idle' 
  | 'hohCompetition' 
  | 'nominationCeremony' 
  | 'vetoCompetition' 
  | 'vetoCeremony' 
  | 'evictionVoting' 
  | 'weeklySummary' 
  | 'endGame';

export type PlayerStatus = 'active' | 'nominated' | 'evicted';

export type DialogueOption = {
  text: string;
  next: string | undefined;
  effect?: {
    type: string;
    value: any;
  };
};

export type DialogueNode = {
  text: string;
  options: DialogueOption[];
};

export type NPCDialogue = {
  [nodeId: string]: DialogueNode;
};

export type DialogueData = {
  [npcId: string]: NPCDialogue;
};

export type OverlayType = 
  | { type: 'dialogue'; npcId: string }
  | { type: 'hoh' }
  | { type: 'nomination' }
  | { type: 'veto' }
  | { type: 'eviction' }
  | { type: 'summary' }
  | { type: 'alliance' }
  | { type: 'allianceProposal'; proposalId: string; proposerId: string; allianceName: string }
  | { type: 'weekSidebar' }
  | null;

export type Relationship = {
  type: 'friendly' | 'neutral' | 'hostile';
  extraPoints: number;
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

export type PlayerStats = {
  hohWins: number;
  povWins: number;
  nominations: number;
  daysInHouse: number;
};
