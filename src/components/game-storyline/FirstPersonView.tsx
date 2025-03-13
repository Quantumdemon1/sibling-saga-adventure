
import React from 'react';
import { useGameContext } from '@/contexts/GameContext';
import useGameStateStore from '@/stores/gameStateStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { User, Trophy, Shield, Clock, Home, AlertTriangle } from 'lucide-react';
import RelationshipIndicator from '@/components/relationships/RelationshipIndicator';

interface FirstPersonViewProps {
  currentPlayerId: string | null;
}

const FirstPersonView: React.FC<FirstPersonViewProps> = ({ currentPlayerId }) => {
  const { players, alliances } = useGameContext();
  const { currentPhase, dayCount, weekCount, hoh, nominees, vetoHolder } = useGameStateStore();
  
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  
  if (!currentPlayer) return null;

  const isHOH = currentPlayer.id === hoh;
  const isNominated = nominees.includes(currentPlayer.id);
  const hasVeto = currentPlayer.id === vetoHolder;
  
  // Game progress as percentage
  const totalDaysEstimate = 28; // Approx 4 weeks
  const progressPercentage = Math.min((dayCount / totalDaysEstimate) * 100, 100);
  
  const getPhaseDisplay = (phase: string) => {
    switch(phase) {
      case 'hohCompetition': return 'HoH Competition';
      case 'nominationCeremony': return 'Nomination Ceremony';
      case 'vetoCompetition': return 'Veto Competition';
      case 'vetoCeremony': return 'Veto Ceremony';
      case 'evictionVoting': return 'Eviction Vote';
      case 'weeklySummary': return 'Weekly Summary';
      default: return phase.charAt(0).toUpperCase() + phase.slice(1);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-black bg-opacity-80 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-200">
            <User className="inline-block mr-2 h-4 w-4" /> 
            {currentPlayer.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-2">
              {isHOH && (
                <Badge variant="outline" className="bg-yellow-900/40 text-yellow-400 border-yellow-700/50">
                  <Trophy className="mr-1 h-3 w-3" /> HoH
                </Badge>
              )}
              {isNominated && (
                <Badge variant="outline" className="bg-red-900/40 text-red-400 border-red-700/50">
                  <AlertTriangle className="mr-1 h-3 w-3" /> Nominated
                </Badge>
              )}
              {hasVeto && (
                <Badge variant="outline" className="bg-purple-900/40 text-purple-400 border-purple-700/50">
                  <Shield className="mr-1 h-3 w-3" /> Veto
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-400">
              Day {dayCount}
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-500">Week {weekCount}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">Current Phase</span>
                <Badge variant="outline" className="bg-gray-800">
                  <Clock className="mr-1 h-3 w-3" /> 
                  {getPhaseDisplay(currentPhase)}
                </Badge>
              </div>
            </div>
            
            <Separator className="my-3 bg-gray-800" />
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Statistics</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-xl font-bold">{currentPlayer.stats?.hohWins || 0}</div>
                  <div className="text-xs text-gray-400">HoH Wins</div>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-xl font-bold">{currentPlayer.stats?.povWins || 0}</div>
                  <div className="text-xs text-gray-400">Veto Wins</div>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-xl font-bold">{currentPlayer.stats?.nominations || 0}</div>
                  <div className="text-xs text-gray-400">Nominations</div>
                </div>
              </div>
            </div>
            
            <Separator className="my-3 bg-gray-800" />
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Alliances</h3>
              {currentPlayer.alliances && currentPlayer.alliances.length > 0 ? (
                <div className="space-y-2">
                  {currentPlayer.alliances.map(allianceId => {
                    const alliance = alliances.find(a => a.id === allianceId);
                    if (!alliance) return null;
                    
                    return (
                      <div key={allianceId} className="px-3 py-2 bg-gray-800/50 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-400" />
                          <span>{alliance.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-gray-700">
                          {alliance.members.length} members
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  No alliances formed yet
                </div>
              )}
            </div>
            
            <Separator className="my-3 bg-gray-800" />
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Key Relationships</h3>
              {currentPlayer.relationships && Object.keys(currentPlayer.relationships).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(currentPlayer.relationships)
                    .sort((a, b) => getRelationshipScore(b[1]) - getRelationshipScore(a[1]))
                    .slice(0, 3)
                    .map(([playerId, relationship]) => {
                      const relatedPlayer = players.find(p => p.id === playerId);
                      if (!relatedPlayer) return null;
                      
                      return (
                        <div key={playerId} className="px-3 py-2 bg-gray-800/50 rounded-md flex justify-between items-center">
                          <span>{relatedPlayer.name}</span>
                          <RelationshipIndicator 
                            relationship={relationship} 
                            size="sm"
                          />
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500 text-sm">
                  No significant relationships yet
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstPersonView;
