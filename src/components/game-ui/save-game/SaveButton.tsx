
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import useSaveGameManager from '@/hooks/useSaveGameManager';
import SaveLoadMenu from './SaveLoadMenu';

const SaveButton: React.FC = () => {
  const { saveGame, saveSuccess } = useSaveGameManager();
  const [showMenu, setShowMenu] = useState(false);
  
  const handleQuickSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveGame();
  }
  
  return (
    <>
      <div className="relative">
        <Button 
          onClick={() => setShowMenu(true)} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save/Load
          {saveSuccess && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
          )}
        </Button>
      </div>
      
      {showMenu && (
        <SaveLoadMenu onClose={() => setShowMenu(false)} />
      )}
    </>
  );
};

export default SaveButton;
