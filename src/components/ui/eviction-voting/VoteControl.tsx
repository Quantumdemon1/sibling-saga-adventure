
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/types/PlayerProfileTypes';

interface VoteControlProps {
  voter: Player;
  nominees: Player[];
  hasVoted: boolean;
  onVote: (voterId: string, nomineeId: string) => void;
}

const VoteControl: React.FC<VoteControlProps> = ({ 
  voter, 
  nominees, 
  hasVoted, 
  onVote 
}) => {
  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-700">
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
          {nominees.map(nominee => (
            <Button
              key={nominee.id}
              size="sm"
              variant="outline"
              className="border-red-700 text-red-200 hover:bg-red-900/30"
              onClick={() => onVote(voter.id, nominee.id)}
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
};

export default VoteControl;
