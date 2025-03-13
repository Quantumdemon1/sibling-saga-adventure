
import React, { useState, useEffect } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, CheckCircle, UserX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EvictionVotingUIProps {
  onClose: () => void;
}

const EvictionVotingUI: React.FC<EvictionVotingUIProps> = ({ onClose }) => {
  const { players, nominees, hoh, setPlayers, setPhase } = useGameStateStore();
  const [votes, setVotes] = useState<{ [key: string]: string }>({});
  const [votingComplete, setVotingComplete] = useState(false);
  const [evictedId, setEvictedId] = useState<string | null>(null);

  // Get voters (active players who are not HoH and not nominees)
  const voters = players.filter(
    p => p.status === 'active' && p.id !== hoh && !nominees.includes(p.id)
  );

  // Get nominee players
  const nomineePlayers = players.filter(p => nominees.includes(p.id));

  useEffect(() => {
    // Simulate AI voting
    const newVotes = { ...votes };
    let changed = false;

    voters.forEach(voter => {
      if (voter.isAI && !newVotes[voter.id]) {
        // AI voting logic (simple random choice for now)
        const targetNominee = nominees[Math.floor(Math.random() * nominees.length)];
        newVotes[voter.id] = targetNominee;
        changed = true;
      }
    });

    if (changed) {
      setVotes(newVotes);
    }
  }, [voters, nominees, votes]);

  const handleVote = (voterId: string, nomineeId: string) => {
    setVotes(prev => ({
      ...prev,
      [voterId]: nomineeId
    }));
  };

  const handleCompleteVoting = () => {
    // Count votes
    const voteCounts: { [key: string]: number } = {};
    nominees.forEach(id => { voteCounts[id] = 0 });
    
    Object.values(votes).forEach(nomineeId => {
      voteCounts[nomineeId] = (voteCounts[nomineeId] || 0) + 1;
    });
    
    // Find evicted player (most votes)
    let maxVotes = -1;
    let evictedPlayerId: string | null = null;
    
    for (const [nomineeId, voteCount] of Object.entries(voteCounts)) {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        evictedPlayerId = nomineeId;
      }
    }
    
    setEvictedId(evictedPlayerId);
    setVotingComplete(true);
  };

  const handleFinalize = () => {
    if (evictedId) {
      // Update player status to evicted
      setPlayers(
        players.map(p => 
          p.id === evictedId 
            ? { ...p, status: 'evicted' } 
            : p
        )
      );
      setPhase('weeklySummary');
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Check if all votes are cast
  const allVotesCast = voters.every(voter => votes[voter.id]);

  return (
    <Card className="w-[90vw] max-w-[550px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Vote className="h-5 w-5 mr-2 text-red-500" /> 
          Eviction Voting
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 px-6">
        {!votingComplete ? (
          <>
            <p className="text-gray-300 mb-6">
              Houseguests will now vote to evict one of the nominees.
            </p>
            
            <div className="flex justify-center gap-8 mb-6">
              {nomineePlayers.map(nominee => (
                <div key={nominee.id} className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    {nominee.avatarUrl ? (
                      <AvatarImage src={nominee.avatarUrl} />
                    ) : (
                      <AvatarFallback>{getInitials(nominee.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="font-medium">{nominee.name}</div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mt-4">
              <h3 className="text-lg font-medium text-gray-200">Votes</h3>
              
              {voters.map(voter => {
                const hasVoted = votes[voter.id] !== undefined;
                return (
                  <div key={voter.id} className="flex items-center justify-between py-2 border-b border-gray-700">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        {voter.avatarUrl ? (
                          <AvatarImage src={voter.avatarUrl} />
                        ) : (
                          <AvatarFallback>{getInitials(voter.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span>{voter.name}</span>
                    </div>
                    
                    {voter.isHuman && !hasVoted ? (
                      <div className="flex gap-2">
                        {nomineePlayers.map(nominee => (
                          <Button
                            key={nominee.id}
                            size="sm"
                            variant="outline"
                            className="border-red-700 text-red-200 hover:bg-red-900/30"
                            onClick={() => handleVote(voter.id, nominee.id)}
                          >
                            Evict {nominee.name}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        {hasVoted ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            <span>Vote cast</span>
                          </>
                        ) : (
                          <span>Voting...</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <UserX className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-bold mb-4">Eviction Results</h3>
            <p className="text-lg text-gray-300 mb-6">
              By a vote of {Object.keys(votes).length}, 
              <span className="text-red-400 font-bold">
                {" "}{players.find(p => p.id === evictedId)?.name}
              </span>{" "}
              has been evicted from the Big Brother house.
            </p>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleFinalize}
            >
              Continue
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4 flex justify-between">
        {!votingComplete && (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCompleteVoting}
              disabled={!allVotesCast}
            >
              Complete Voting
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default EvictionVotingUI;
