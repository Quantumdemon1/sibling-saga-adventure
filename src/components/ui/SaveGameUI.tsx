
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSaveGame } from '@/hooks/useSaveGame';
import { Loader2 } from "lucide-react";

const SaveGameUI: React.FC = () => {
  const { saveGame, loadGame, isLoading } = useSaveGame();

  return (
    <div className="save-game-ui flex gap-2">
      <Button 
        onClick={saveGame} 
        disabled={isLoading}
        className="glass-panel backdrop-blur-md"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Save Game
      </Button>
      
      <Button 
        onClick={loadGame} 
        disabled={isLoading}
        variant="outline" 
        className="glass-panel backdrop-blur-md"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Load Game
      </Button>
    </div>
  );
};

export default SaveGameUI;
