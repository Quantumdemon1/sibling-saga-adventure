
import React from 'react';
import { Button } from '@/components/ui/button';
import { Box, Layout } from 'lucide-react';

interface ViewSwitcherProps {
  is3DActive: boolean;
  onToggle: () => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ is3DActive, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="bg-transparent text-gray-400 cursor-not-allowed opacity-60"
        disabled={true}
        title="3D view is currently disabled for stability"
      >
        <Box className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">3D</span>
      </Button>
      
      <Button
        variant="default"
        size="sm"
        className="bg-game-accent text-white"
        disabled={true}
      >
        <Layout className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">2D</span>
      </Button>
    </div>
  );
};

export default ViewSwitcher;
