
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cube, Layout } from 'lucide-react';

interface ViewSwitcherProps {
  is3DActive: boolean;
  onToggle: () => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ is3DActive, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={is3DActive ? "default" : "outline"}
        size="sm"
        onClick={() => !is3DActive && onToggle()}
        className={is3DActive ? "bg-game-accent text-white" : "bg-transparent text-game-primary"}
      >
        <Cube className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">3D</span>
      </Button>
      
      <Button
        variant={!is3DActive ? "default" : "outline"}
        size="sm"
        onClick={() => is3DActive && onToggle()}
        className={!is3DActive ? "bg-game-accent text-white" : "bg-transparent text-game-primary"}
      >
        <Layout className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">2D</span>
      </Button>
    </div>
  );
};

export default ViewSwitcher;
