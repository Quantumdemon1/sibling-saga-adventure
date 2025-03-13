
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserX } from 'lucide-react';
import { Player } from '@/types/PlayerProfileTypes';

interface EvictionResultProps {
  evictedPlayer: Player | undefined;
  voteCount: number;
  onFinalize: () => void;
}

const EvictionResult: React.FC<EvictionResultProps> = ({ 
  evictedPlayer, 
  voteCount, 
  onFinalize 
}) => {
  return (
    <div className="text-center py-8">
      <UserX className="h-16 w-16 mx-auto mb-4 text-red-500" />
      <h3 className="text-xl font-bold mb-4">Eviction Results</h3>
      <p className="text-lg text-gray-300 mb-6">
        By a vote of {voteCount}, 
        <span className="text-red-400 font-bold">
          {" "}{evictedPlayer?.name || "Unknown"}
        </span>{" "}
        has been evicted from the Big Brother house.
      </p>
      <Button
        className="bg-red-600 hover:bg-red-700"
        onClick={onFinalize}
      >
        Continue
      </Button>
    </div>
  );
};

export default EvictionResult;
