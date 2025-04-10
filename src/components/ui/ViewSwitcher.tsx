
import React from 'react';
import { Button } from '@/components/ui/button';
import { Box, Layout, Eye } from 'lucide-react';

interface ViewSwitcherProps {
  is3DActive: boolean;
  onToggle: () => void;
  is3DDisabled?: boolean;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ 
  is3DActive, 
  onToggle, 
  is3DDisabled = false 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={is3DActive ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        className={`
          ${is3DActive ? "bg-game-accent text-white" : "bg-transparent text-gray-400"}
          ${is3DDisabled ? "opacity-60 cursor-not-allowed" : ""}
          transition-all duration-200 ease-in-out hover:scale-105
        `}
        disabled={is3DDisabled}
      >
        <Box className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">3D</span>
      </Button>
      
      <Button
        variant={!is3DActive ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        className={`
          ${!is3DActive ? "bg-game-accent text-white" : "bg-transparent text-gray-400"}
          transition-all duration-200 ease-in-out hover:scale-105
        `}
      >
        <Layout className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">2D</span>
      </Button>
    </div>
  );
};

export default ViewSwitcher;
