
import React from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';

interface ReplacementSelectionProps {
  savedNomineeId: string;
  onSelectReplacement: (playerId: string) => void;
}

const ReplacementSelection: React.FC<ReplacementSelectionProps> = ({ 
  savedNomineeId, 
  onSelectReplacement 
}) => {
  const { players, nominees, hoh, vetoHolder } = useGameStateStore();
  
  const savedNominee = players.find(p => p.id === savedNomineeId);
  
  // Get eligible replacement nominees (not HoH, not veto holder, not current nominees)
  const eligibleReplacements = players.filter(
    p => p.status === 'active' && 
    p.id !== hoh && 
    p.id !== vetoHolder && 
    !nominees.includes(p.id)
  );

  return (
    <div className="space-y-4">
      <p className="text-gray-300 mb-2">
        {savedNominee?.name} has been saved!
        Select a replacement nominee:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {eligibleReplacements.map(player => (
          <Button 
            key={player.id}
            onClick={() => onSelectReplacement(player.id)}
            variant="outline"
            className="border-red-700 text-red-200 hover:bg-red-900/30"
          >
            Nominate {player.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ReplacementSelection;
