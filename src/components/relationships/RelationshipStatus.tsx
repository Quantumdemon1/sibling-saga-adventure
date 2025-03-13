
import React from 'react';
import { Relationship } from '@/types/gameTypes';
import RelationshipIndicator from './RelationshipIndicator';

interface RelationshipStatusProps {
  relationship: Relationship;
  relationshipScore: number;
  getRelationshipDescription: (score: number) => string;
}

const RelationshipStatus: React.FC<RelationshipStatusProps> = ({
  relationship,
  relationshipScore,
  getRelationshipDescription
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Relationship Status</span>
        <span className="text-sm font-semibold capitalize">{relationship.type}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className={`h-2.5 rounded-full ${
            relationshipScore > 70 ? 'bg-green-500' : 
            relationshipScore > 40 ? 'bg-blue-500' : 
            relationshipScore > 20 ? 'bg-yellow-500' : 'bg-red-500'
          }`} 
          style={{ width: `${relationshipScore}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {getRelationshipDescription(relationshipScore)}
      </p>
    </div>
  );
};

export default RelationshipStatus;
