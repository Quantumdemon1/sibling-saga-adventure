
import React, { useState, useEffect } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import dialogues from '@/data/dialogues.json';

interface DialogueUIProps {
  npcId: string;
  onClose: () => void;
}

const DialogueUI: React.FC<DialogueUIProps> = ({ npcId, onClose }) => {
  const { setOverlay } = useGameStateStore();
  const [currentDialogueNode, setCurrentDialogueNode] = useState<string>('initial');
  const [dialogueHistory, setDialogueHistory] = useState<string[]>([]);
  const [textVisible, setTextVisible] = useState(false);
  
  // Get the current dialogue from the data
  const npcDialogues = dialogues[npcId as keyof typeof dialogues] || {};
  const currentDialogue = npcDialogues[currentDialogueNode] || undefined;
  
  // Text animation on dialogue change
  useEffect(() => {
    setTextVisible(false);
    const timer = setTimeout(() => setTextVisible(true), 150);
    return () => clearTimeout(timer);
  }, [currentDialogueNode]);
  
  // Initialize dialogue
  useEffect(() => {
    setCurrentDialogueNode('initial');
    setDialogueHistory([]);
    setTextVisible(true);
  }, [npcId]);

  const handleOptionSelect = (nextNode: string | undefined, option?: any) => {
    // If there's an effect for this option, process it
    if (option?.effect) {
      console.log('Dialogue effect:', option.effect);
      // Process effects here (e.g. relationship changes, inventory items, etc.)
    }
    
    if (nextNode) {
      // Move to next dialogue node
      setDialogueHistory([...dialogueHistory, currentDialogueNode]);
      setCurrentDialogueNode(nextNode);
    } else {
      // End dialogue
      handleClose();
    }
  };

  const handleClose = () => {
    setOverlay(null);
    onClose();
  };

  const handleBack = () => {
    if (dialogueHistory.length > 0) {
      const newHistory = [...dialogueHistory];
      const previousNode = newHistory.pop();
      if (previousNode) {
        setCurrentDialogueNode(previousNode);
        setDialogueHistory(newHistory);
      }
    }
  };

  const getNpcName = () => {
    return {
      "npc1": "Alex",
      "npc2": "Jordan"
    }[npcId] || "NPC";
  };

  return (
    <Card className="w-[90vw] max-w-[550px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-white">
          {getNpcName()}
        </CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={handleClose}>
          <X size={20} />
        </Button>
      </CardHeader>
      
      <CardContent className="pt-6 px-6 min-h-[200px]">
        <AnimatePresence mode="wait">
          {currentDialogue ? (
            <motion.div
              key={currentDialogueNode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 10 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white mb-6">{currentDialogue.text}</p>
            </motion.div>
          ) : (
            <p className="text-gray-400 italic">No dialogue available.</p>
          )}
        </AnimatePresence>
      </CardContent>
      
      <CardFooter className="flex-col space-y-2 border-t border-gray-700 pt-4">
        {currentDialogue?.options.map((option, index) => (
          <Button 
            key={index} 
            variant="outline" 
            className="w-full justify-start text-left hover:bg-gray-800"
            onClick={() => handleOptionSelect(option.next, option)}
          >
            {option.text}
          </Button>
        ))}
        
        <div className="w-full flex justify-between pt-2">
          {dialogueHistory.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400" 
              onClick={handleBack}
            >
              <ChevronLeft size={16} className="mr-1" /> Back
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DialogueUI;
