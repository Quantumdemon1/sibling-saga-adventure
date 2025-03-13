
import React from 'react';

interface GameOverlayProps {
  isLocked: boolean;
  handleLock: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ isLocked, handleLock }) => {
  return (
    <>
      {/* Overlay instructions - only show when pointer isn't locked */}
      {!isLocked && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-4 rounded-lg text-white text-center">
          <p className="text-xl font-bold mb-2">Big Brother RPG</p>
          <p>Click to enter first-person mode</p>
          <p className="text-sm mt-2">WASD to move, SPACE to jump, SHIFT to sprint, E to interact</p>
          <p className="text-sm mt-1">ESC to exit first-person mode</p>
          <button 
            onClick={handleLock}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Enter Game
          </button>
        </div>
      )}
      
      {/* Game controls reminder - only show when locked */}
      {isLocked && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded text-white text-xs">
          <p>WASD: Move | SPACE: Jump | SHIFT: Sprint | E: Interact | ESC: Exit</p>
        </div>
      )}
    </>
  );
};

export default GameOverlay;
