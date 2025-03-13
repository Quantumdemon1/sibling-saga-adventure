
import React from 'react';
import { Heart, X, Flame, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Relationship } from '@/types/gameTypes';
import { getRelationshipScore, getRelationshipVisuals } from '@/utils/relationshipUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface RelationshipIndicatorProps {
  relationship: Relationship;
  showIcon?: boolean;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const RelationshipIndicator: React.FC<RelationshipIndicatorProps> = ({ 
  relationship, 
  showIcon = true, 
  showScore = true,
  size = 'md',
  showTooltip = false
}) => {
  const score = getRelationshipScore(relationship);
  const { color, textColor } = getRelationshipVisuals(relationship);
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  // Icon based on relationship type and score
  const getIcon = () => {
    if (relationship.type === 'friendly') {
      return score > 70 ? <Flame className="h-4 w-4 mr-1 fill-current" /> : <Heart className="h-4 w-4 mr-1 fill-current" />;
    } else if (relationship.type === 'hostile') {
      return <X className="h-4 w-4 mr-1" />;
    } else if (relationship.extraPoints > 10) {
      return <ThumbsUp className="h-4 w-4 mr-1" />;
    } else if (relationship.extraPoints < -10) {
      return <ThumbsDown className="h-4 w-4 mr-1" />;
    }
    return null;
  };

  const indicator = (
    <div className={`${sizeClasses[size]} rounded-full ${color} ${textColor} font-medium flex items-center`}>
      {showIcon && getIcon()}
      {showScore && <span>{score} / 100</span>}
      {!showScore && <span className="capitalize">{relationship.type}</span>}
    </div>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {indicator}
        </TooltipTrigger>
        <TooltipContent>
          <p>Relationship: {score}/100</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return indicator;
};

export default RelationshipIndicator;
