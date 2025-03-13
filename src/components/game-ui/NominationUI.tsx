
import React, { useState } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Check, UserCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NominationUIProps {
  onClose: () => void;
}

const NominationUI: React.FC<NominationUIProps> = ({ onClose }) => {
  const { players, hoh, setNominees, setPhase } = useGameStateStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmStep, setConfirmStep] = useState(false);
  
  // Get the HoH player
  const hohPlayer = players.find(p => p.id === hoh);
  
  // Get eligible nominees (not HoH and not evicted)
  const eligiblePlayers = players.filter(p => p.status === 'active' && p.id !== hoh);
  
  const handleSelect = (playerId: string) => {
    if (selected.includes(playerId)) {
      setSelected(selected.filter(id => id !== playerId));
    } else if (selected.length < 2) {
      setSelected([...selected, playerId]);
    }
  };
  
  const handleConfirm = () => {
    setConfirmStep(true);
  };
  
  const handleFinalConfirm = () => {
    if (selected.length === 2) {
      setNominees(selected);
      setPhase('vetoCompetition');
      onClose();
    }
  };
  
  const handleCancel = () => {
    setConfirmStep(false);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-[90vw] max-w-[550px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <UserCheck className="h-5 w-5 mr-2 text-red-500" /> 
          Nomination Ceremony
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 px-6">
        <AnimatePresence mode="wait">
          {!confirmStep ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-gray-300 mb-6">
                {hohPlayer ? `${hohPlayer.name} (HoH)` : 'The Head of Household'} must nominate two houseguests for eviction.
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium">
                  Selected Nominees: {selected.length}/2
                </h3>
                <div className="mt-2 flex gap-2 h-12">
                  {selected.map((nomineeId) => {
                    const nominee = players.find(p => p.id === nomineeId);
                    return nominee ? (
                      <div 
                        key={nomineeId}
                        className="flex items-center gap-2 px-3 py-1 bg-red-900/40 border border-red-900/50 rounded-full"
                      >
                        <span>{nominee.name}</span>
                        <button 
                          onClick={() => handleSelect(nomineeId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {eligiblePlayers.map((player) => (
                  <motion.button
                    key={player.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect(player.id)}
                    className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                      selected.includes(player.id)
                        ? 'bg-red-900/30 border-red-900/50 text-white'
                        : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-16 w-16 mb-2">
                        {player.avatarUrl ? (
                          <AvatarImage src={player.avatarUrl} />
                        ) : (
                          <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      {selected.includes(player.id) && (
                        <div className="absolute bottom-1 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <span className="text-center font-medium">{player.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Confirm Nominations</h3>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to nominate the following houseguests?
              </p>
              
              <div className="flex justify-center gap-4 mb-6">
                {selected.map(nomineeId => {
                  const nominee = players.find(p => p.id === nomineeId);
                  return nominee ? (
                    <div key={nomineeId} className="text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-2">
                        {nominee.avatarUrl ? (
                          <AvatarImage src={nominee.avatarUrl} />
                        ) : (
                          <AvatarFallback>{getInitials(nominee.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <p className="font-medium">{nominee.name}</p>
                    </div>
                  ) : null;
                })}
              </div>
              
              <p className="text-gray-400 text-sm mb-6">
                These houseguests will be nominated for eviction. One of them may win the Power of Veto and save themselves.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4 flex gap-3">
        {!confirmStep ? (
          <Button
            className="w-full"
            onClick={handleConfirm}
            disabled={selected.length !== 2}
          >
            Confirm Nominations
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="w-1/2"
              onClick={handleCancel}
            >
              Go Back
            </Button>
            <Button 
              className="w-1/2 bg-red-600 hover:bg-red-700"
              onClick={handleFinalConfirm}
            >
              Finalize
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default NominationUI;
