
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import VetoDecision from './VetoDecision';
import NomineeSaveSelection from './NomineeSaveSelection';
import ReplacementSelection from './ReplacementSelection';
import ConfirmReplacement from './ConfirmReplacement';
import useVetoCeremony from './useVetoCeremony';

interface VetoCeremonyUIProps {
  onClose: () => void;
}

const VetoCeremonyUI: React.FC<VetoCeremonyUIProps> = ({ onClose }) => {
  const {
    vetoHolderPlayer,
    nomineeNames,
    useVeto,
    setUseVeto,
    savedNominee,
    setSavedNominee,
    replacementNominee,
    setReplacementNominee,
    handleConfirm,
    handleUseVeto,
    handleSaveNominee,
    handleReplaceNominee
  } = useVetoCeremony(onClose);

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
          <VetoDecision onDecision={handleUseVeto} />
        )}
        
        {useVeto === true && !savedNominee && (
          <NomineeSaveSelection onSaveNominee={handleSaveNominee} />
        )}
        
        {savedNominee && !replacementNominee && (
          <ReplacementSelection 
            savedNomineeId={savedNominee} 
            onSelectReplacement={handleReplaceNominee} 
          />
        )}
        
        {savedNominee && replacementNominee && (
          <ConfirmReplacement 
            savedNomineeId={savedNominee} 
            replacementNomineeId={replacementNominee} 
            onConfirm={handleConfirm} 
          />
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4 flex justify-end">
        {(useVeto === null || (savedNominee && replacementNominee)) && (
          <button className="text-gray-400 hover:text-white bg-transparent px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VetoCeremonyUI;
