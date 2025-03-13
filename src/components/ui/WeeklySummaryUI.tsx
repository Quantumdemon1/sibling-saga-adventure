
import React from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Trophy, UserX, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator'; 

interface WeeklySummaryUIProps {
  onClose: () => void;
}

const WeeklySummaryUI: React.FC<WeeklySummaryUIProps> = ({ onClose }) => {
  const { players, weekCount, dayCount, hoh, nominees, vetoHolder, setPhase } = useGameStateStore();
  
  const evictedPlayer = players.find(p => 
    p.status === 'evicted' && 
    nominees.includes(p.id)
  );
  
  const handleNextWeek = () => {
    // Check if we should end the game
    const activePlayers = players.filter(p => p.status !== 'evicted');
    if (activePlayers.length <= 2) {
      setPhase('endGame');
    } else {
      setPhase('hohCompetition');
    }
    onClose();
  };

  return (
    <Card className="w-[90vw] max-w-[550px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <CalendarDays className="h-5 w-5 mr-2 text-blue-500" /> 
          Week {weekCount} Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 px-6">
        <div className="space-y-4">
          <div className="flex items-center px-4 py-3 bg-yellow-900/20 border border-yellow-900/40 rounded-md">
            <Trophy className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <div className="text-sm text-yellow-400 font-medium">Head of Household</div>
              <div className="text-gray-200">{players.find(p => p.id === hoh)?.name || 'None'}</div>
            </div>
          </div>
          
          <div className="flex items-center px-4 py-3 bg-purple-900/20 border border-purple-900/40 rounded-md">
            <Shield className="h-5 w-5 text-purple-500 mr-3" />
            <div>
              <div className="text-sm text-purple-400 font-medium">Power of Veto</div>
              <div className="text-gray-200">{players.find(p => p.id === vetoHolder)?.name || 'None'}</div>
            </div>
          </div>
          
          <div className="flex items-center px-4 py-3 bg-red-900/20 border border-red-900/40 rounded-md">
            <UserX className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <div className="text-sm text-red-400 font-medium">Evicted</div>
              <div className="text-gray-200">{evictedPlayer?.name || 'None'}</div>
            </div>
          </div>
          
          <Separator className="my-4 bg-gray-700" />
          
          <div>
            <h3 className="text-lg font-medium text-gray-200 mb-3">Remaining Houseguests</h3>
            <div className="grid grid-cols-2 gap-2">
              {players
                .filter(p => p.status !== 'evicted')
                .map(player => (
                  <div key={player.id} className="px-3 py-2 bg-gray-800/50 rounded-md">
                    {player.name}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4 flex justify-center">
        <Button 
          onClick={handleNextWeek}
          className="px-8"
        >
          Start Week {weekCount + 1}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeeklySummaryUI;
