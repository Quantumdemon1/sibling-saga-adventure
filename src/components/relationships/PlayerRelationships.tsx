
import React from 'react';
import { Player } from '@/types/PlayerProfileTypes';
import { getRelationshipBetweenPlayers, getRelationshipVisuals } from '@/utils/relationshipUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import RelationshipIndicator from './RelationshipIndicator';

interface PlayerRelationshipsProps {
  selectedPlayer: Player | null;
  humanPlayer: Player | undefined;
  players: Player[];
  onRelationshipChange: (playerId: string, points: number) => void;
}

const PlayerRelationships: React.FC<PlayerRelationshipsProps> = ({
  selectedPlayer,
  humanPlayer,
  players,
  onRelationshipChange
}) => {
  if (!selectedPlayer) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center text-gray-500">
          <Heart className="h-12 w-12 mb-4 opacity-30" />
          <p>Select a houseguest to view and manage your relationship</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Relationship with {selectedPlayer.name}</span>
          {humanPlayer && (
            <div className="flex items-center">
              <RelationshipIndicator 
                relationship={getRelationshipBetweenPlayers(humanPlayer, selectedPlayer)} 
              />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {humanPlayer && (
          <>
            <p className="mb-4">
              Manage your relationship with {selectedPlayer.name}. 
              Actions in the game will affect your relationship.
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button 
                onClick={() => onRelationshipChange(selectedPlayer.id, -10)} 
                variant="destructive"
                size="sm"
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Negative Interaction
              </Button>
              <Button 
                onClick={() => onRelationshipChange(selectedPlayer.id, 10)}
                variant="default"
                size="sm"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Positive Interaction
              </Button>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">
              {selectedPlayer.name}'s Other Relationships
            </h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Houseguest</TableHead>
                    <TableHead>Relationship</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players
                    .filter(p => p.id !== selectedPlayer.id && p.status === 'active')
                    .map(player => {
                      const relationship = selectedPlayer.relationships?.[player.id];
                      if (!relationship) return null;
                      
                      const { color, textColor } = getRelationshipVisuals(relationship);
                      
                      return (
                        <TableRow key={player.id}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded ${color} ${textColor} text-sm`}>
                              {relationship.type}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerRelationships;
