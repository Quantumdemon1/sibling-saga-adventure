import React from 'react';
import { OverlayType } from '@/types/gameTypes';
import DialogueUI from '@/components/ui/DialogueUI';
import HohCompetitionUI from '@/components/game-ui/HohCompetitionUI';
import NominationUI from '@/components/game-ui/NominationUI';
import WeekSidebarOverlay from '@/components/WeekSidebarOverlay';
import { AnimatePresence, motion } from 'framer-motion';

// Import refactored component
import EvictionVotingUI from '@/components/ui/eviction-voting';
// Import other UI components
import VetoCeremonyUI from '@/components/ui/VetoCeremonyUI';
import WeeklySummaryUI from '@/components/ui/WeeklySummaryUI';
import AllianceManagementUI from '@/components/game-ui/AllianceManagementUI';
import AllianceProposalUI from '@/components/game-ui/AllianceProposalUI';

interface GameOverlaysProps {
  overlay: OverlayType;
  renderOverlay?: () => React.ReactNode;
}

const GameOverlays: React.FC<GameOverlaysProps> = ({ 
  overlay, 
  renderOverlay 
}) => {
  const handleClose = () => {
    // We'll let the individual components handle their own closing
  };

  // If there's a custom overlay renderer, use it
  if (renderOverlay) {
    return renderOverlay();
  }

  // If there's no overlay, don't render anything
  if (!overlay) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={overlay.type}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Different overlays based on type */}
        {overlay.type === 'dialogue' && (
          <DialogueUI npcId={overlay.npcId} onClose={handleClose} />
        )}
        
        {overlay.type === 'hoh' && (
          <HohCompetitionUI onClose={handleClose} />
        )}
        
        {overlay.type === 'nomination' && (
          <NominationUI onClose={handleClose} />
        )}
        
        {overlay.type === 'veto' && (
          <VetoCeremonyUI onClose={handleClose} />
        )}
        
        {overlay.type === 'eviction' && (
          <EvictionVotingUI onClose={handleClose} />
        )}
        
        {overlay.type === 'summary' && (
          <WeeklySummaryUI onClose={handleClose} />
        )}
        
        {overlay.type === 'alliance' && (
          <AllianceManagementUI onClose={handleClose} />
        )}
        
        {overlay.type === 'allianceProposal' && (
          <AllianceProposalUI 
            proposalId={overlay.proposalId} 
            proposerId={overlay.proposerId} 
            allianceName={overlay.allianceName}
            onClose={handleClose}
          />
        )}
        
        {overlay.type === 'weekSidebar' && (
          <WeekSidebarOverlay onClose={handleClose} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default GameOverlays;
