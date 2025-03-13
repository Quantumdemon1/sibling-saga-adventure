
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import RelationshipManager from '@/components/relationships/RelationshipManager';

interface GameIdleProps {
  onStartHohCompetition: () => void;
  onManageAlliances: () => void;
}

const GameIdle: React.FC<GameIdleProps> = ({
  onStartHohCompetition,
  onManageAlliances
}) => {
  const [showRelationships, setShowRelationships] = useState(false);
  
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="game-chip bg-game-accent mb-3">Development Mode</div>
        <h1 className="game-text-title mb-4">Big Brother RPG</h1>
        <p className="game-text-body mb-6">
          The 3D game world is currently in development. In the meantime, you can test the game mechanics.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={onStartHohCompetition} className="game-button">
            Start HoH Competition
          </Button>
          <Button onClick={onManageAlliances} className="game-button-secondary">
            Manage Alliances
          </Button>
          <Button 
            onClick={() => setShowRelationships(true)} 
            className="game-button-secondary"
          >
            Manage Relationships
          </Button>
        </div>
      </div>
      
      {/* Relationship Manager Dialog */}
      <RelationshipManager 
        open={showRelationships} 
        onClose={() => setShowRelationships(false)} 
      />
    </div>
  );
};

export default GameIdle;
