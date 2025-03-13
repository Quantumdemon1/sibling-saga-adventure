
import React, { useState, useEffect } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote } from 'lucide-react';
import VotingPhase from './VotingPhase';
import EvictionResult from './EvictionResult';
import { Player } from '@/types/PlayerProfileTypes';

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

  // Check if all votes are cast
  const allVotesCast = voters.every(voter => votes[voter.id]);

  const evictedPlayer = evictedId 
    ? players.find(p => p.id === evictedId) 
    : undefined;

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
          <VotingPhase 
            voters={voters}
            nomineePlayers={nomineePlayers}
            votes={votes}
            onVote={handleVote}
          />
        ) : (
          <EvictionResult 
            evictedPlayer={evictedPlayer}
            voteCount={Object.keys(votes).length}
            onFinalize={handleFinalize}
          />
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
