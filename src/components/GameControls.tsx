
import React from 'react';

const GameControls: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-center z-40">
      <div className="bg-black bg-opacity-70 p-2 rounded">
        <div className="text-white text-sm font-bold mb-1 text-center">Controls</div>
        <div className="flex gap-4 text-xs text-white">
          <div>WASD: Move</div>
          <div>SHIFT: Run</div>
          <div>SPACE: Jump</div>
          <div>E: Interact</div>
          <div>ESC: Unlock Mouse</div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
