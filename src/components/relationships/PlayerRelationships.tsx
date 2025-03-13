
import React from 'react';
import { Player } from '@/types/PlayerProfileTypes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import RelationshipIndicator from './RelationshipIndicator';
import { useRelationshipInteractions } from '@/hooks/useRelationshipInteractions';
import RelationshipStatus from './RelationshipStatus';
import RelationshipHistory from './RelationshipHistory';
import RelationshipActions, { RELATIONSHIP_ACTIONS } from './RelationshipActions';
import OtherRelationships from './OtherRelationships';

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
  const {
    selectedAction,
    customPoints,
    interactionHistory,
    relationship,
    relationshipScore,
    handleActionSelect,
    handleCustomInteraction,
    setCustomPoints
  } = useRelationshipInteractions(selectedPlayer, humanPlayer, onRelationshipChange);

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
          {humanPlayer && relationship && (
            <div className="flex items-center">
              <RelationshipIndicator 
                relationship={relationship} 
              />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {humanPlayer && relationship && (
          <>
            <RelationshipStatus 
              relationship={relationship}
              relationshipScore={relationshipScore}
            />
            
            <RelationshipHistory events={interactionHistory} />
            
            <RelationshipActions
              selectedAction={selectedAction}
              customPoints={customPoints}
              playerName={selectedPlayer.name}
              handleActionSelect={handleActionSelect}
              handleCustomInteraction={handleCustomInteraction}
              setCustomPoints={setCustomPoints}
            />
            
            <OtherRelationships 
              selectedPlayer={selectedPlayer}
              players={players}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerRelationships;
