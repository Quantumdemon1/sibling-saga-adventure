
import React from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';

interface ConfirmReplacementProps {
  savedNomineeId: string;
  replacementNomineeId: string;
  onConfirm: () => void;
}

const ConfirmReplacement: React.FC<ConfirmReplacementProps> = ({ 
  savedNomineeId, 
  replacementNomineeId, 
  onConfirm 
}) => {
  const { players } = useGameStateStore();
  
  const savedNominee = players.find(p => p.id === savedNomineeId);
  const replacementNominee = players.find(p => p.id === replacementNomineeId);

  return (
    <div className="text-center space-y-4">
      <p className="text-gray-300">
        You're replacing {savedNominee?.name} with {replacementNominee?.name}.
      </p>
      <Button 
        onClick={onConfirm}
        className="bg-red-600 hover:bg-red-700"
      >
        Confirm Replacement
      </Button>
    </div>
  );
};

export default ConfirmReplacement;
