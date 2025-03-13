
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DialogueUI from '@/components/ui/DialogueUI';

interface GameOverlaysProps {
  overlay: { type: string; npcId?: string } | null;
  renderOverlay: () => React.ReactNode | null;
}

const GameOverlays: React.FC<GameOverlaysProps> = ({ overlay, renderOverlay }) => {
  return (
    <AnimatePresence>
      {overlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50"
        >
          {renderOverlay()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverlays;
