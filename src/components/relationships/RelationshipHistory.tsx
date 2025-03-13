
import React from 'react';
import { InteractionHistoryEvent } from '@/hooks/useRelationshipInteractions';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

interface RelationshipHistoryProps {
  events: InteractionHistoryEvent[];
}

const RelationshipHistory: React.FC<RelationshipHistoryProps> = ({ events }) => {
  return (
    <Collapsible className="w-full mb-6">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
        <span className="font-medium">Interaction History</span>
        <span className="text-xs text-gray-500">{events.length} interactions</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 px-4 mt-2 border rounded-md">
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold">Recent Interactions</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
            {events.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No interaction history yet.</p>
            ) : (
              events.map((event, i) => (
                <div key={i} className="text-sm border-l-2 pl-2 py-1 border-gray-300">
                  <span className="text-gray-500 text-xs">{event.date}</span>
                  <div className="flex justify-between items-center">
                    <span>{event.action}</span>
                    <span className={event.points > 0 ? 'text-green-500' : event.points < 0 ? 'text-red-500' : 'text-gray-500'}>
                      {event.points > 0 ? '+' : ''}{event.points}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RelationshipHistory;
