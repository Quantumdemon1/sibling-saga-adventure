
import React from 'react';
import { Button } from '@/components/ui/button';

interface VetoDecisionProps {
  onDecision: (useVeto: boolean) => void;
}

const VetoDecision: React.FC<VetoDecisionProps> = ({ onDecision }) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-gray-300">Will you use the Power of Veto?</p>
      <div className="flex justify-center gap-4">
        <Button 
          variant="default" 
          onClick={() => onDecision(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Use Veto
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onDecision(false)}
        >
          Do Not Use
        </Button>
      </div>
    </div>
  );
};

export default VetoDecision;
