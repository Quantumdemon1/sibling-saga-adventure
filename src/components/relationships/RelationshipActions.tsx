
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquare, Smile, Frown, Gift, UserPlus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { InteractionAction } from '@/hooks/useRelationshipInteractions';

// These could be moved to a constants file if needed
export const RELATIONSHIP_ACTIONS: InteractionAction[] = [
  { id: 'smalltalk', name: 'Small Talk', icon: <MessageSquare />, points: 5, description: 'A casual conversation' },
  { id: 'compliment', name: 'Compliment', icon: <Smile />, points: 10, description: 'Say something nice' },
  { id: 'gift', name: 'Give a Gift', icon: <Gift />, points: 15, description: 'Share something they might like' },
  { id: 'criticize', name: 'Criticize', icon: <Frown />, points: -10, description: 'Point out their flaws' },
  { id: 'ignore', name: 'Ignore', icon: <UserPlus />, points: -5, description: 'Cold shoulder treatment' },
];

interface RelationshipActionsProps {
  selectedAction: string;
  customPoints: number[];
  playerName: string;
  handleActionSelect: (actionId: string, actions: InteractionAction[]) => void;
  handleCustomInteraction: () => void;
  setCustomPoints: (points: number[]) => void;
}

const RelationshipActions: React.FC<RelationshipActionsProps> = ({
  selectedAction,
  customPoints,
  playerName,
  handleActionSelect,
  handleCustomInteraction,
  setCustomPoints
}) => {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold">Interact with {playerName}</h3>
      
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
  );
};

export default RelationshipActions;
