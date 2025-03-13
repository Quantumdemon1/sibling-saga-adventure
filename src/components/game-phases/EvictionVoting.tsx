
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';

interface EvictionVotingProps {
  players: Player[];
  nominees: string[];
  hoh: string | null;
}

const EvictionVoting: React.FC<EvictionVotingProps> = ({ players, nominees, hoh }) => {
  const { advanceWeek, setPhase } = useGameStateStore();
  const [votes, setVotes] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  
  const voters = players.filter(player => 
    player.status === 'active' && 
    !nominees.includes(player.id) && 
    player.id !== hoh
  );
  
  const handleVote = (voterId: string, nomineeId: string) => {
    setVotes({...votes, [voterId]: nomineeId});
  };
  
  const handleCompleteVoting = () => {
    setShowResults(true);
  };
  
  const handleCompleteEviction = () => {
    // In a real implementation, we would handle eviction here
    // For now, we'll just move to the next phase and week
    advanceWeek();
    setPhase('hohCompetition');
  };
  
  // Count votes
  const voteCounts = nominees.reduce((counts, nominee) => {
    counts[nominee] = 0;
    return counts;
  }, {} as {[key: string]: number});
  
  Object.values(votes).forEach(nomineeId => {
    voteCounts[nomineeId] += 1;
  });
  
  // Determine evictee (most votes)
  let evicteeId: string | null = null;
  let maxVotes = -1;
  for (const [nomineeId, count] of Object.entries(voteCounts)) {
    if (count > maxVotes) {
      maxVotes = count;
      evicteeId = nomineeId;
    }
  }
  
  if (showResults) {
    return (
      <div className="game-panel p-6">
        <h2 className="game-text-title mb-4">Eviction Results</h2>
        
        {nominees.map(nomineeId => {
          const nominee = players.find(p => p.id === nomineeId);
          return nominee ? (
            <div key={nomineeId} className="mb-4">
              <h3 className="game-text-subtitle">{nominee.name}: {voteCounts[nomineeId]} votes</h3>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(votes)
                  .filter(([_, targetId]) => targetId === nomineeId)
                  .map(([voterId]) => {
                    const voter = players.find(p => p.id === voterId);
                    return voter ? (
                      <div key={voterId} className="game-chip bg-game-surface">
                        {voter.name}
                      </div>
                    ) : null;
                  })}
              </div>
            </div>
          ) : null;
        })}
        
        {evicteeId && (
          <div className="mt-8">
            <h2 className="game-text-title text-game-destructive">
              {players.find(p => p.id === evicteeId)?.name} has been evicted!
            </h2>
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <Button onClick={handleCompleteEviction} className="game-button-primary">
            Continue to Next Week
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-panel p-6">
      <h2 className="game-text-title mb-4">Eviction Voting</h2>
      <p className="game-text-body mb-6">
        Each houseguest must vote to evict one of the nominees.
      </p>
      
      <div className="space-y-6">
        {voters.map(voter => (
          <div key={voter.id} className="glass-panel p-4">
            <h3 className="game-text-subtitle mb-2">{voter.name}'s Vote</h3>
            
            <div className="flex gap-2">
              {nominees.map(nomineeId => {
                const nominee = players.find(p => p.id === nomineeId);
                return nominee ? (
                  <Button
                    key={nomineeId}
                    onClick={() => handleVote(voter.id, nomineeId)}
                    className={`game-button ${
                      votes[voter.id] === nomineeId ? 'bg-game-warning text-black' : ''
                    }`}
                  >
                    Evict {nominee.name}
                  </Button>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleCompleteVoting}
          disabled={Object.keys(votes).length < voters.length}
          className="game-button-primary"
        >
          Finalize Votes
        </Button>
      </div>
    </div>
  );
};

export default EvictionVoting;
