
import React from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Calendar, X } from 'lucide-react';

interface WeekSidebarOverlayProps {
  onClose: () => void;
}

const WeekSidebarOverlay: React.FC<WeekSidebarOverlayProps> = ({ onClose }) => {
  const { 
    currentPhase, 
    setPhase, 
    weekCount, 
    dayCount, 
    hoh, 
    nominees, 
    vetoHolder,
    players 
  } = useGameStateStore();
  
  // List of game phases in order
  const phases = [
    { id: 'hohCompetition', name: 'HoH Competition', day: 1 },
    { id: 'nominationCeremony', name: 'Nomination Ceremony', day: 2 },
    { id: 'vetoCompetition', name: 'Veto Competition', day: 3 },
    { id: 'vetoCeremony', name: 'Veto Ceremony', day: 4 },
    { id: 'evictionVoting', name: 'Eviction Voting', day: 5 },
  ];
  
  // Get the current phase index
  const currentPhaseIndex = phases.findIndex(phase => phase.id === currentPhase);
  
  // Handle phase change
  const handlePhaseChange = (phaseId: string) => {
    setPhase(phaseId as any);
    onClose();
  };
  
  // Game status data
  const hohPlayer = players.find(p => p.id === hoh);
  const nomineeNames = nominees
    .map(id => players.find(p => p.id === id)?.name || 'Unknown')
    .join(', ');
  const vetoPlayer = players.find(p => p.id === vetoHolder);
  const activePlayersCount = players.filter(p => p.status !== 'evicted').length;
  const evictedPlayersCount = players.filter(p => p.status === 'evicted').length;

  return (
    <Card className="w-[90vw] max-w-[400px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-white">
          <Calendar className="inline-block mr-2 h-5 w-5" /> 
          Week {weekCount} - Day {dayCount}
        </CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
          <X size={20} />
        </Button>
      </CardHeader>
      
      <CardContent className="pt-4 px-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Phase Timeline</h3>
          <ul className="space-y-1">
            {phases.map((phase, index) => {
              const isCompleted = currentPhaseIndex > index;
              const isCurrent = currentPhaseIndex === index;
              return (
                <motion.li 
                  key={phase.id}
                  whileHover={{ x: 5 }}
                  className={`flex items-center p-2 rounded cursor-pointer
                    ${isCompleted ? 'text-gray-400' : ''}
                    ${isCurrent ? 'bg-gray-800 font-medium text-white' : 'hover:bg-gray-800/50'}`}
                  onClick={() => handlePhaseChange(phase.id)}
                >
                  <div className="w-6 h-6 flex items-center justify-center mr-3">
                    {isCompleted ? (
                      <Check size={16} className="text-green-500" />
                    ) : isCurrent ? (
                      <ChevronRight size={16} className="text-blue-400" />
                    ) : (
                      <span className="text-xs text-gray-500">Day {phase.day}</span>
                    )}
                  </div>
                  <span>{phase.name}</span>
                </motion.li>
              );
            })}
          </ul>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Week Status</h3>
          
          <div className="p-3 bg-gray-800/50 rounded-md">
            <p className="text-sm text-gray-300">Head of Household</p>
            <p className="font-medium">{hohPlayer?.name || 'Not selected yet'}</p>
          </div>
          
          {nominees.length > 0 && (
            <div className="p-3 bg-gray-800/50 rounded-md">
              <p className="text-sm text-gray-300">Nominees</p>
              <p className="font-medium">{nomineeNames}</p>
            </div>
          )}
          
          {vetoHolder && (
            <div className="p-3 bg-gray-800/50 rounded-md">
              <p className="text-sm text-gray-300">Veto Holder</p>
              <p className="font-medium">{vetoPlayer?.name || 'None'}</p>
            </div>
          )}
          
          <div className="p-3 bg-gray-800/50 rounded-md">
            <p className="text-sm text-gray-300">Houseguests</p>
            <p className="font-medium">{activePlayersCount} Active, {evictedPlayersCount} Evicted</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4">
        <Button className="w-full" onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeekSidebarOverlay;
