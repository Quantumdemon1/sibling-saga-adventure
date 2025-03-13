
import React, { useState } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PlayersList from './PlayersList';
import PlayerRelationships from './PlayerRelationships';

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
            <PlayersList 
              players={otherPlayers}
              humanPlayer={humanPlayer}
              selectedPlayerId={selectedPlayerId}
              onPlayerSelect={handlePlayerSelect}
            />
          </div>
          
          {/* Relationship details */}
          <div className="col-span-1 md:col-span-2">
            <PlayerRelationships
              selectedPlayer={selectedPlayer}
              humanPlayer={humanPlayer}
              players={players}
              onRelationshipChange={handleRelationshipChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RelationshipManager;
