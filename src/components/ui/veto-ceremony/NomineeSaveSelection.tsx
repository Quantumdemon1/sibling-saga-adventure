
import React from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';

interface NomineeSaveSelectionProps {
  onSaveNominee: (nomineeId: string) => void;
}

const NomineeSaveSelection: React.FC<NomineeSaveSelectionProps> = ({ onSaveNominee }) => {
  const { players, nominees } = useGameStateStore();

  return (
    <div className="space-y-4">
      <p className="text-gray-300 mb-2">Select a nominee to save:</p>
      <div className="grid grid-cols-2 gap-2">
        {nominees.map(nomineeId => {
          const nominee = players.find(p => p.id === nomineeId);
          return nominee ? (
            <Button 
              key={nomineeId}
              onClick={() => onSaveNominee(nomineeId)}
              variant="outline"
              className="border-purple-700 text-purple-200 hover:bg-purple-900/30"
            >
              Save {nominee.name}
            </Button>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default NomineeSaveSelection;
