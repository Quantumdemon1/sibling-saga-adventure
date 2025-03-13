
import React from 'react';
import { Vote } from 'lucide-react';
import NomineeDisplay from './NomineeDisplay';
import VoteControl from './VoteControl';
import { Player } from '@/types/PlayerProfileTypes';

interface VotingPhaseProps {
  voters: Player[];
  nomineePlayers: Player[];
  votes: { [key: string]: string };
  onVote: (voterId: string, nomineeId: string) => void;
}

const VotingPhase: React.FC<VotingPhaseProps> = ({ 
  voters, 
  nomineePlayers, 
  votes, 
  onVote 
}) => {
  return (
    <>
      <p className="text-gray-300 mb-6">
        Houseguests will now vote to evict one of the nominees.
      </p>
      
      <NomineeDisplay nominees={nomineePlayers} />
      
      <div className="space-y-3 mt-4">
        <h3 className="text-lg font-medium text-gray-200">Votes</h3>
        
        {voters.map(voter => (
          <VoteControl
            key={voter.id}
            voter={voter}
            nominees={nomineePlayers}
            hasVoted={votes[voter.id] !== undefined}
            onVote={onVote}
          />
        ))}
      </div>
    </>
  );
};

export default VotingPhase;
