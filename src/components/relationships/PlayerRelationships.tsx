
import React from 'react';
import { Player } from '@/types/PlayerProfileTypes';
import { getRelationshipBetweenPlayers, getRelationshipVisuals } from '@/utils/relationshipUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Heart, UserPlus, Smile, Frown, MessageSquare, Gift } from 'lucide-react';
import RelationshipIndicator from './RelationshipIndicator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { InteractionAction, useRelationshipInteractions } from '@/hooks/useRelationshipInteractions';

const RELATIONSHIP_ACTIONS: InteractionAction[] = [
  { id: 'smalltalk', name: 'Small Talk', icon: <MessageSquare />, points: 5, description: 'A casual conversation' },
  { id: 'compliment', name: 'Compliment', icon: <Smile />, points: 10, description: 'Say something nice' },
  { id: 'gift', name: 'Give a Gift', icon: <Gift />, points: 15, description: 'Share something they might like' },
  { id: 'criticize', name: 'Criticize', icon: <Frown />, points: -10, description: 'Point out their flaws' },
  { id: 'ignore', name: 'Ignore', icon: <UserPlus />, points: -5, description: 'Cold shoulder treatment' },
];

const RelationshipHistory = ({ events }: { events: {date: string, action: string, points: number}[] }) => {
  if (events.length === 0) {
    return <p className="text-sm text-gray-500 italic">No interaction history yet.</p>;
  }
  
  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-semibold">Recent Interactions</h4>
      <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
        {events.map((event, i) => (
          <div key={i} className="text-sm border-l-2 pl-2 py-1 border-gray-300">
            <span className="text-gray-500 text-xs">{event.date}</span>
            <div className="flex justify-between items-center">
              <span>{event.action}</span>
              <span className={event.points > 0 ? 'text-green-500' : event.points < 0 ? 'text-red-500' : 'text-gray-500'}>
                {event.points > 0 ? '+' : ''}{event.points}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    setCustomPoints,
    getRelationshipDescription
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
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Relationship Status</span>
                <span className="text-sm font-semibold capitalize">{relationship.type}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className={`h-2.5 rounded-full ${relationshipScore > 70 ? 'bg-green-500' : relationshipScore > 40 ? 'bg-blue-500' : relationshipScore > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{ width: `${relationshipScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {getRelationshipDescription(relationshipScore)}
              </p>
            </div>
            
            <Collapsible className="w-full mb-6">
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                <span className="font-medium">Interaction History</span>
                <span className="text-xs text-gray-500">{interactionHistory.length} interactions</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 pb-4 px-4 mt-2 border rounded-md">
                <RelationshipHistory events={interactionHistory} />
              </CollapsibleContent>
            </Collapsible>
            
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Interact with {selectedPlayer.name}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {RELATIONSHIP_ACTIONS.map(action => (
                  <Button 
                    key={action.id}
                    onClick={() => handleActionSelect(action.id, RELATIONSHIP_ACTIONS)}
                    variant={action.points > 0 ? "default" : "destructive"}
                    size="sm"
                    className={`justify-start ${selectedAction === action.id ? 'ring-2 ring-offset-2' : ''}`}
                  >
                    {action.icon}
                    <div className="flex flex-col items-start">
                      <span className="text-xs">{action.name}</span>
                      <span className="text-xs opacity-70">{action.points > 0 ? '+' : ''}{action.points}</span>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Custom Interaction</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Impact Strength</Label>
                      <span className="text-sm font-medium">{customPoints[0] > 0 ? '+' : ''}{customPoints[0]}</span>
                    </div>
                    <Slider 
                      value={customPoints} 
                      min={-20} 
                      max={20} 
                      step={5} 
                      onValueChange={setCustomPoints} 
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCustomInteraction}
                    variant={customPoints[0] >= 0 ? "default" : "destructive"}
                    size="sm"
                    className="w-full"
                    disabled={customPoints[0] === 0}
                  >
                    {customPoints[0] > 0 ? <ThumbsUp className="mr-2 h-4 w-4" /> : <ThumbsDown className="mr-2 h-4 w-4" />}
                    Apply Custom Interaction
                  </Button>
                </div>
              </div>
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
                      
                      return (
                        <TableRow key={player.id}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>
                            <RelationshipIndicator 
                              relationship={relationship}
                              showScore={false}
                              size="sm"
                            />
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
