
import React, { useState, useEffect } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import dialogues from '@/data/dialogues.json';

interface DialogueUIProps {
  npcId: string;
  onClose: () => void;
}

const DialogueUI: React.FC<DialogueUIProps> = ({ npcId, onClose }) => {
  const { setDialogue, createAlliance } = useGameStateStore();
  const [currentDialogueNode, setCurrentDialogueNode] = useState<string>('initial');
  const [dialogueHistory, setDialogueHistory] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const dialogueData = dialogues as any;
  const currentDialogue = dialogueData[npcId]?.[currentDialogueNode];

  useEffect(() => {
    setCurrentDialogueNode('initial');
    setDialogueHistory([]);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [npcId]);

  const handleOptionEffect = (option: any) => {
    if (option.effect) {
      switch (option.effect.type) {
        case 'createAlliance':
          const { name, members } = option.effect.value;
          createAlliance(name, [...members, 'player1']);
          break;
        default:
          break;
      }
    }
  };

  const handleOptionSelect = (option: any) => {
    handleOptionEffect(option);
    
    if (option.next) {
      setDialogueHistory([...dialogueHistory, currentDialogueNode]);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentDialogueNode(option.next);
        setIsAnimating(false);
      }, 200);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setDialogue(null);
    onClose();
  };

  const handleBack = () => {
    if (dialogueHistory.length > 0) {
      const newHistory = [...dialogueHistory];
      const previousNode = newHistory.pop()!;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentDialogueNode(previousNode);
        setDialogueHistory(newHistory);
        setIsAnimating(false);
      }, 200);
    }
  };

  if (!currentDialogue) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div 
        className={`glass-panel max-w-2xl w-full p-6 animate-${isAnimating ? 'fade-out' : 'scale-in'}`}
      >
        <div className="mb-4">
          <div className="game-chip bg-game-accent text-white mb-3">
            Conversation
          </div>
          <h2 className="game-text-title mb-4">{dialogueData[npcId]?.character || npcId}</h2>
          <p className="game-text-body mb-6">{currentDialogue.text}</p>
        </div>
        
        <div className="space-y-3 mb-6">
          {currentDialogue.options.map((option: any, index: number) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left px-4 py-3 rounded-lg bg-game-surface hover:bg-game-surface-hover transition-all duration-200"
            >
              {option.text}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between">
          {dialogueHistory.length > 0 && (
            <button 
              onClick={handleBack}
              className="game-button-secondary"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleClose}
            className="game-button-secondary ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogueUI;
