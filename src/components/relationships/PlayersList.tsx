
import React from 'react';
import { Player } from '@/types/PlayerProfileTypes';
import { getRelationshipBetweenPlayers, getRelationshipVisuals } from '@/utils/relationshipUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PlayersListProps {
  players: Player[];
  humanPlayer: Player | undefined;
  selectedPlayerId: string | null;
  onPlayerSelect: (playerId: string) => void;
}

const PlayersList: React.FC<PlayersListProps> = ({ 
  players, 
  humanPlayer, 
  selectedPlayerId, 
  onPlayerSelect 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Houseguests</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {players.map(player => {
            if (!humanPlayer) return null;
            
            const relationship = getRelationshipBetweenPlayers(humanPlayer, player);
            const { color, textColor } = getRelationshipVisuals(relationship);
            
            return (
              <div 
                key={player.id}
                onClick={() => onPlayerSelect(player.id)}
                className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 ${
                  selectedPlayerId === player.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  {player.avatarUrl && (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="font-medium">{player.name}</span>
                </div>
                <div className={`px-2 py-1 rounded ${color} ${textColor} text-sm`}>
                  {relationship.type}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayersList;
