
import React from 'react';
import { Heart, X } from 'lucide-react';
import { Relationship } from '@/types/gameTypes';
import { getRelationshipScore, getRelationshipVisuals } from '@/utils/relationshipUtils';

interface RelationshipIndicatorProps {
  relationship: Relationship;
}

const RelationshipIndicator: React.FC<RelationshipIndicatorProps> = ({ relationship }) => {
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

export default RelationshipIndicator;
