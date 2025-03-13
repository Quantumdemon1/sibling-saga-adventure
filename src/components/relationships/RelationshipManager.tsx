
import React, { useState } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';
import { 
  getRelationshipBetweenPlayers, 
  getRelationshipScore,
  getRelationshipVisuals 
} from '@/utils/relationshipUtils';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart, X, ThumbsUp, ThumbsDown } from 'lucide-react';

interface RelationshipManagerProps {
  open: boolean;
  onClose: () => void;
}

const RelationshipManager: React.FC<RelationshipManagerProps> = ({ open, onClose }) => {
  const { players, setPlayers } = useGameStateStore();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  
  const humanPlayer = players.find(p => p.isHuman);
  const otherPlayers = players.filter(p => !p.isHuman && p.status === 'active');
  
  const handleRelationshipChange = (playerId: string, points: number) => {
    if (!humanPlayer) return;
    
    const updatedPlayers = players.map(player => {
      if (player.id !== humanPlayer.id) return player;
      
      const relationships = player.relationships || {};
      const currentRelationship = relationships[playerId] || { type: 'neutral', extraPoints: 0 };
      let newExtraPoints = currentRelationship.extraPoints + points;
      
      // Determine new relationship type based on points
      let newType = currentRelationship.type;
      if (newExtraPoints > 20) newType = 'friendly';
      else if (newExtraPoints < -20) newType = 'hostile';
      else newType = 'neutral';
      
      return {
        ...player,
        relationships: {
          ...relationships,
          [playerId]: {
            type: newType,
            extraPoints: newExtraPoints
          }
        }
      };
    });
    
    setPlayers(updatedPlayers);
  };
  
  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };
  
  const selectedPlayer = selectedPlayerId 
    ? players.find(p => p.id === selectedPlayerId) 
    : null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Houseguest Relationships</DialogTitle>
          <DialogDescription>
            View and manage your relationships with other houseguests
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Players list */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Houseguests</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {otherPlayers.map(player => {
                    if (!humanPlayer) return null;
                    
                    const relationship = getRelationshipBetweenPlayers(humanPlayer, player);
                    const { color, textColor } = getRelationshipVisuals(relationship);
                    
                    return (
                      <div 
                        key={player.id}
                        onClick={() => handlePlayerSelect(player.id)}
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
          </div>
          
          {/* Relationship details */}
          <div className="col-span-1 md:col-span-2">
            {selectedPlayer ? (
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
                          onClick={() => handleRelationshipChange(selectedPlayer.id, -10)} 
                          variant="destructive"
                          size="sm"
                        >
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Negative Interaction
                        </Button>
                        <Button 
                          onClick={() => handleRelationshipChange(selectedPlayer.id, 10)}
                          variant="default"
                          size="sm"
                        >
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Positive Interaction
                        </Button>
                      </div>
                      
                      {/* Show other relationships (who they like/dislike) */}
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
            ) : (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center text-gray-500">
                  <Heart className="h-12 w-12 mb-4 opacity-30" />
                  <p>Select a houseguest to view and manage your relationship</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Relationship indicator component
const RelationshipIndicator: React.FC<{ relationship: Relationship }> = ({ relationship }) => {
  const score = getRelationshipScore(relationship);
  const { color, textColor } = getRelationshipVisuals(relationship);
  
  return (
    <div className={`px-3 py-1 rounded-full ${color} ${textColor} font-medium flex items-center`}>
      {relationship.type === 'friendly' ? (
        <Heart className="h-4 w-4 mr-1 fill-current" />
      ) : relationship.type === 'hostile' ? (
        <X className="h-4 w-4 mr-1" />
      ) : null}
      <span>{score} / 100</span>
    </div>
  );
};

export default RelationshipManager;
