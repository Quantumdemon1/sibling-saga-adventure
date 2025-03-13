
import React, { useState } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface VetoCeremonyUIProps {
  onClose: () => void;
}

const VetoCeremonyUI: React.FC<VetoCeremonyUIProps> = ({ onClose }) => {
  const { players, nominees, vetoHolder, hoh, setNominees, setPhase } = useGameStateStore();
  const [useVeto, setUseVeto] = useState<boolean | null>(null);
  const [savedNominee, setSavedNominee] = useState<string | null>(null);
  const [replacementNominee, setReplacementNominee] = useState<string | null>(null);

  const vetoHolderPlayer = players.find(p => p.id === vetoHolder);
  const nomineeNames = nominees.map(id => players.find(p => p.id === id)?.name).filter(Boolean);

  const handleUseVeto = (use: boolean) => {
    setUseVeto(use);
    if (!use) {
      // Veto not used, proceed to eviction
      setPhase('evictionVoting');
      onClose();
    }
  };

  const handleSaveNominee = (nomineeId: string) => {
    setSavedNominee(nomineeId);
  };

  const handleReplaceNominee = (playerId: string) => {
    setReplacementNominee(playerId);
  };

  const handleConfirm = () => {
    if (savedNominee && replacementNominee) {
      // Replace the saved nominee with the new one
      const newNominees = [...nominees];
      const savedIndex = newNominees.indexOf(savedNominee);
      if (savedIndex !== -1) {
        newNominees[savedIndex] = replacementNominee;
        setNominees(newNominees);
      }
      setPhase('evictionVoting');
      onClose();
    }
  };

  // Get eligible replacement nominees (not HoH, not veto holder, not current nominees)
  const eligibleReplacements = players.filter(
    p => p.status === 'active' && 
    p.id !== hoh && 
    p.id !== vetoHolder && 
    !nominees.includes(p.id)
  );

  return (
    <Card className="w-[90vw] max-w-[550px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Shield className="h-5 w-5 mr-2 text-purple-500" /> 
          Veto Ceremony
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 px-6">
        <p className="text-gray-300 mb-4">
          {vetoHolderPlayer?.name || "The veto holder"} has won the Power of Veto!
        </p>
        
        <p className="text-gray-300 mb-6">
          Current nominees: {nomineeNames.join(", ")}
        </p>
        
        {useVeto === null && (
          <div className="text-center space-y-4">
            <p className="text-gray-300">Will you use the Power of Veto?</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="default" 
                onClick={() => handleUseVeto(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Use Veto
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleUseVeto(false)}
              >
                Do Not Use
              </Button>
            </div>
          </div>
        )}
        
        {useVeto === true && !savedNominee && (
          <div className="space-y-4">
            <p className="text-gray-300 mb-2">Select a nominee to save:</p>
            <div className="grid grid-cols-2 gap-2">
              {nominees.map(nomineeId => {
                const nominee = players.find(p => p.id === nomineeId);
                return nominee ? (
                  <Button 
                    key={nomineeId}
                    onClick={() => handleSaveNominee(nomineeId)}
                    variant="outline"
                    className="border-purple-700 text-purple-200 hover:bg-purple-900/30"
                  >
                    Save {nominee.name}
                  </Button>
                ) : null;
              })}
            </div>
          </div>
        )}
        
        {savedNominee && !replacementNominee && (
          <div className="space-y-4">
            <p className="text-gray-300 mb-2">
              {players.find(p => p.id === savedNominee)?.name} has been saved!
              Select a replacement nominee:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {eligibleReplacements.map(player => (
                <Button 
                  key={player.id}
                  onClick={() => handleReplaceNominee(player.id)}
                  variant="outline"
                  className="border-red-700 text-red-200 hover:bg-red-900/30"
                >
                  Nominate {player.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {savedNominee && replacementNominee && (
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              You're replacing {players.find(p => p.id === savedNominee)?.name} with {players.find(p => p.id === replacementNominee)?.name}.
            </p>
            <Button 
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Replacement
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4 flex justify-end">
        {(useVeto === null || (savedNominee && replacementNominee)) && (
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VetoCeremonyUI;
