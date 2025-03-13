
import React from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, XCircle, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AllianceProposalUIProps {
  proposalId: string;
  proposerId: string;
  allianceName: string;
  onClose: () => void;
}

const AllianceProposalUI: React.FC<AllianceProposalUIProps> = ({
  proposalId,
  proposerId,
  allianceName,
  onClose,
}) => {
  const { acceptAlliance, rejectAlliance, players, allianceProposals } = useGameStateStore();
  
  // Get the current proposal
  const proposal = allianceProposals.find(p => p.id === proposalId);
  
  // Get the proposer's name
  const proposerName = players.find(p => p.id === proposerId)?.name || 'Another player';
  
  // Get current player ID
  const humanPlayerId = players.find(p => p.isHuman)?.id;
  
  const handleAccept = () => {
    if (humanPlayerId) {
      acceptAlliance(proposalId, humanPlayerId);
      onClose();
    }
  };

  const handleReject = () => {
    rejectAlliance(proposalId);
    onClose();
  };
  
  // Count how many players accepted already
  const acceptedCount = proposal?.accepted.length || 0;
  const totalInvitees = (proposal?.invitees.length || 0) + 1; // +1 for proposer
  
  // List of other players in the proposal
  const otherPlayers = proposal?.invitees
    .filter(id => id !== humanPlayerId)
    .map(id => players.find(p => p.id === id)?.name)
    .filter(Boolean) || [];

  return (
    <Card className="w-[90vw] max-w-[400px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-blue-400" /> 
          Alliance Proposal
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-500/30 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center mb-2">{allianceName}</h3>
          
          <p className="text-center text-gray-300 mb-6">
            {proposerName} has invited you to join an alliance
          </p>
          
          {otherPlayers.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Also invited:</h4>
              <div className="bg-gray-800/50 p-3 rounded-md text-sm">
                {otherPlayers.join(', ')}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Status:</h4>
            <div className="bg-gray-800/50 p-3 rounded-md">
              <p className="text-sm">
                <span className="text-blue-400">{acceptedCount}</span> of <span className="text-blue-400">{totalInvitees}</span> members have accepted
              </p>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-400 mb-2">
            Do you want to join this alliance?
          </p>
        </motion.div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4 flex gap-3">
        <Button 
          variant="outline" 
          className="w-1/2 bg-red-900/30 hover:bg-red-900/50 border-red-900/50"
          onClick={handleReject}
        >
          <XCircle className="h-4 w-4 mr-2" /> Decline
        </Button>
        
        <Button 
          className="w-1/2 bg-green-600 hover:bg-green-700"
          onClick={handleAccept}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" /> Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AllianceProposalUI;
