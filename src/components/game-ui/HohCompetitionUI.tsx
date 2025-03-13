
import React, { useState, useEffect } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, User, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface HohCompetitionUIProps {
  onClose: () => void;
}

const HohCompetitionUI: React.FC<HohCompetitionUIProps> = ({ onClose }) => {
  const { players, setHohWinner, setPhase } = useGameStateStore();
  const [scores, setScores] = useState<{ [playerId: string]: number }>({});
  const [competitionStarted, setCompetitionStarted] = useState(false);
  const [competitionFinished, setCompetitionFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [aiInterval, setAiInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Eligible players are those who are still active
  const eligiblePlayers = players.filter(player => player.status === 'active');
  
  // Initialize scores
  useEffect(() => {
    const initialScores: { [playerId: string]: number } = {};
    eligiblePlayers.forEach(player => {
      initialScores[player.id] = 0;
    });
    setScores(initialScores);
  }, [eligiblePlayers]);
  
  // Handle competition timing
  useEffect(() => {
    if (competitionStarted && !competitionFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endCompetition();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [competitionStarted, competitionFinished]);
  
  // Simulated AI clicks
  useEffect(() => {
    if (competitionStarted && !competitionFinished) {
      const interval = setInterval(() => {
        setScores(prevScores => {
          const newScores = { ...prevScores };
          
          // Each AI player gets a random number of clicks each interval
          eligiblePlayers.forEach(player => {
            if (player.isAI) {
              // AI skill level can vary based on game balance
              const clickMultiplier = Math.random() < 0.2 ? 2 : 1; // Sometimes AI gets double points
              const aiScore = newScores[player.id] || 0;
              newScores[player.id] = aiScore + Math.floor(Math.random() * 3) * clickMultiplier;
            }
          });
          
          return newScores;
        });
      }, 500); // AI updates its score every 500ms
      
      setAiInterval(interval);
      return () => clearInterval(interval);
    }
  }, [competitionStarted, competitionFinished, eligiblePlayers]);
  
  // End competition
  const endCompetition = () => {
    if (aiInterval) clearInterval(aiInterval);
    setCompetitionFinished(true);
  };
  
  const handleStartCompetition = () => {
    setCompetitionStarted(true);
  };
  
  const handlePlayerClick = (playerId: string) => {
    if (competitionStarted && !competitionFinished) {
      setScores(prevScores => ({
        ...prevScores,
        [playerId]: (prevScores[playerId] || 0) + 1,
      }));
    }
  };
  
  const handleDetermineWinner = () => {
    let winnerId: string | null = null;
    let highestScore = -1;
    
    // Find the player with highest score
    for (const playerId in scores) {
      if (scores[playerId] > highestScore) {
        highestScore = scores[playerId];
        winnerId = playerId;
      }
    }
    
    if (winnerId) {
      setHohWinner(winnerId);
      setPhase('nominationCeremony');
    }
    
    onClose();
  };
  
  // Sort players by score for ranking
  const sortedPlayers = [...eligiblePlayers].sort((a, b) => 
    (scores[b.id] || 0) - (scores[a.id] || 0)
  );
  
  // Find the human player (if any)
  const humanPlayer = eligiblePlayers.find(p => p.isHuman);

  return (
    <Card className="w-[90vw] max-w-[500px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" /> 
          Head of Household Competition
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 px-6">
        {!competitionStarted && (
          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Compete for the Head of Household power! The winner will nominate two houseguests for eviction.
            </p>
            <Button 
              size="lg" 
              className="bg-yellow-600 hover:bg-yellow-700 text-white" 
              onClick={handleStartCompetition}
            >
              Start Competition
            </Button>
          </div>
        )}
        
        {competitionStarted && !competitionFinished && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Click Competition</h3>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                <span className="text-yellow-500 font-bold">{timeLeft}s</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">
              Click as fast as you can to increase your score!
            </p>
            
            {humanPlayer && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>{humanPlayer.name} (You)</span>
                  <span className="font-bold">{scores[humanPlayer.id] || 0} points</span>
                </div>
                <Button 
                  className="w-full h-16 text-xl bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handlePlayerClick(humanPlayer.id)}
                >
                  CLICK!
                </Button>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Leaderboard</h4>
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id} 
                  className={`flex items-center justify-between p-2 ${
                    index === 0 ? 'bg-yellow-900/30 rounded' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-right mr-2 text-gray-500">#{index + 1}</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{player.name}</span>
                    {player.isHuman && <span className="text-blue-400 ml-1">(You)</span>}
                  </div>
                  <span className="font-medium">{scores[player.id] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {competitionFinished && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-center mb-4">Competition Results</h3>
              
              {sortedPlayers.length > 0 && (
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-3"
                  >
                    <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                    <h4 className="text-lg font-semibold">{sortedPlayers[0].name}</h4>
                    <p className="text-yellow-500 font-medium">{scores[sortedPlayers[0].id]} points</p>
                  </motion.div>
                </div>
              )}
              
              <div className="space-y-2 mb-4">
                {sortedPlayers.map((player, index) => (
                  <motion.div 
                    key={player.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className="flex items-center justify-between p-3 rounded"
                    style={{ 
                      backgroundColor: index === 0 ? 'rgba(234, 179, 8, 0.2)' : undefined
                    }}
                  >
                    <div className="flex items-center">
                      <span className="w-8 text-center mr-2 font-bold">
                        {index === 0 ? '🏆' : `#${index + 1}`}
                      </span>
                      <span>{player.name}</span>
                      {player.isHuman && <span className="text-blue-400 ml-1">(You)</span>}
                    </div>
                    <span className="font-medium">{scores[player.id] || 0}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4">
        {competitionFinished && (
          <Button 
            className="w-full" 
            onClick={handleDetermineWinner}
          >
            Continue
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HohCompetitionUI;
