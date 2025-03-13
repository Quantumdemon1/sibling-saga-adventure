
import { useState } from 'react';
import useGameStateStore from '@/stores/gameStateStore';

const useVetoCeremony = (onClose: () => void) => {
  const { players, nominees, vetoHolder, hoh, setNominees, setPhase } = useGameStateStore();
  const [useVeto, setUseVeto] = useState<boolean | null>(null);
  const [savedNominee, setSavedNominee] = useState<string | null>(null);
  const [replacementNominee, setReplacementNominee] = useState<string | null>(null);

  const vetoHolderPlayer = players.find(p => p.id === vetoHolder);
  const nomineeNames = nominees.map(id => players.find(p => p.id === id)?.name).filter(Boolean);

  // Eligible replacement nominees (not HoH, not veto holder, not current nominees)
  const eligibleReplacements = players.filter(
    p => p.status === 'active' && 
    p.id !== hoh && 
    p.id !== vetoHolder && 
    !nominees.includes(p.id)
  );

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

  return {
    players,
    nominees,
    vetoHolderPlayer,
    nomineeNames,
    useVeto,
    setUseVeto,
    savedNominee,
    setSavedNominee,
    replacementNominee,
    setReplacementNominee,
    eligibleReplacements,
    handleUseVeto,
    handleSaveNominee,
    handleReplaceNominee,
    handleConfirm
  };
};

export default useVetoCeremony;
