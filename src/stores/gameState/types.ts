
import { GamePhase, OverlayType, Alliance, AllianceProposal } from '@/types/gameTypes';
import { Player } from '@/types/PlayerProfileTypes';

export interface GameProgressState {
  currentPhase: GamePhase;
  dayCount: number;
  weekCount: number;
  advanceWeek: () => void;
}

export interface PlayersState {
  players: Player[];
  hoh: string | null;
  nominees: string[];
  vetoHolder: string | null;
  setPlayers: (players: Player[]) => void;
  setHohWinner: (playerId: string) => void;
  setNominees: (nominees: string[]) => void;
  setVetoHolder: (playerId: string) => void;
}

export interface UIState {
  overlay: OverlayType;
  setDialogue: (dialogue: { npcId: string; text: string } | null) => void;
  setOverlay: (overlay: OverlayType) => void;
}

export interface AllianceState {
  alliances: Alliance[];
  allianceProposals: AllianceProposal[];
  createAlliance: (name: string, members: string[]) => void;
  proposeAlliance: (name: string, proposerId: string, invitees: string[]) => void;
  acceptAlliance: (proposalId: string, playerId: string) => void;
  rejectAlliance: (proposalId: string) => void;
}

export interface MiscActions {
  setPhase: (phase: GamePhase) => void;
  resetGame: () => void;
}

export interface GameState extends GameProgressState, PlayersState, UIState, AllianceState, MiscActions {}
