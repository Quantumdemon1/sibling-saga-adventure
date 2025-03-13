
import React, { useState } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Plus, User, Users, X } from 'lucide-react';

interface AllianceManagementUIProps {
  onClose: () => void;
}

const AllianceManagementUI: React.FC<AllianceManagementUIProps> = ({ onClose }) => {
  const { players, alliances, createAlliance, proposeAlliance, allianceProposals } = useGameStateStore();
  const { currentPlayerId } = useGameContext();
  
  const [newAllianceName, setNewAllianceName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('current');
  
  // Filter the active players only
  const activePlayers = players.filter(p => p.status !== 'evicted');
  
  // Get alliances that the current player is a part of
  const playerAlliances = alliances.filter(alliance => 
    alliance.members.includes(currentPlayerId || '')
  );
  
  // Get proposals that involve the current player
  const pendingProposals = allianceProposals.filter(proposal =>
    proposal.invitees.includes(currentPlayerId || '') && 
    !proposal.accepted.includes(currentPlayerId || '') &&
    !proposal.rejected.includes(currentPlayerId || '')
  );

  const handleProposeAlliance = () => {
    if (newAllianceName && selectedMembers.length > 0 && currentPlayerId) {
      proposeAlliance(newAllianceName, currentPlayerId, selectedMembers);
      setNewAllianceName('');
      setSelectedMembers([]);
      setActiveTab('pending');
    }
  };

  const toggleMember = (playerId: string) => {
    setSelectedMembers(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };
  
  const getPlayerNameById = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown';
  };

  return (
    <Card className="w-[90vw] max-w-[500px] bg-black bg-opacity-90 border-gray-700 shadow-xl">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-400" /> 
          Alliance Management
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 pt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="current" className="p-6">
          <h3 className="text-lg font-medium mb-4">Your Alliances</h3>
          {playerAlliances.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>You aren't part of any alliances yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {playerAlliances.map(alliance => (
                <div key={alliance.id} className="p-4 bg-gray-800/50 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{alliance.name}</h4>
                    {alliance.isSecret && (
                      <span className="px-2 py-1 bg-gray-700 text-xs rounded">Secret</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Members:</p>
                  <div className="flex flex-wrap gap-2">
                    {alliance.members.map(memberId => (
                      <div 
                        key={memberId} 
                        className="px-2 py-1 bg-gray-700 rounded-full text-sm flex items-center"
                      >
                        <User className="h-3 w-3 mr-1" />
                        <span>
                          {getPlayerNameById(memberId)}
                          {memberId === currentPlayerId && " (You)"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="p-6">
          <h3 className="text-lg font-medium mb-4">Create New Alliance</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="alliance-name">Alliance Name</Label>
              <Input 
                id="alliance-name"
                placeholder="Enter alliance name"
                value={newAllianceName}
                onChange={(e) => setNewAllianceName(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Select Members</Label>
              <div className="grid grid-cols-2 gap-2">
                {activePlayers
                  .filter(player => player.id !== currentPlayerId)
                  .map(player => (
                    <Button
                      key={player.id}
                      type="button"
                      variant={selectedMembers.includes(player.id) ? "default" : "outline"}
                      className={`justify-start ${
                        selectedMembers.includes(player.id) 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'hover:bg-gray-800'
                      }`}
                      onClick={() => toggleMember(player.id)}
                    >
                      {selectedMembers.includes(player.id) ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {player.name}
                    </Button>
                  ))}
              </div>
            </div>
            
            <Button
              className="w-full"
              onClick={handleProposeAlliance}
              disabled={!newAllianceName || selectedMembers.length === 0}
            >
              Propose Alliance
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="p-6">
          <h3 className="text-lg font-medium mb-4">Pending Proposals</h3>
          {pendingProposals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No pending alliance proposals.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProposals.map(proposal => (
                <div key={proposal.id} className="p-4 bg-gray-800/50 rounded-md">
                  <h4 className="font-medium">{proposal.name}</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Proposed by: {getPlayerNameById(proposal.proposerId)}
                  </p>
                  <p className="text-sm text-gray-400 mb-3">Invited:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proposal.invitees.map(inviteeId => (
                      <div 
                        key={inviteeId} 
                        className="px-2 py-1 bg-gray-700 rounded-full text-sm flex items-center"
                      >
                        <User className="h-3 w-3 mr-1" />
                        <span>
                          {getPlayerNameById(inviteeId)}
                          {inviteeId === currentPlayerId && " (You)"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      className="w-1/2 bg-red-900/30 hover:bg-red-900/50 border-red-900/50"
                      onClick={() => {
                        if (currentPlayerId) {
                          // Handle rejection
                        }
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button 
                      className="w-1/2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        if (currentPlayerId) {
                          // Handle acceptance
                        }
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <CardFooter className="border-t border-gray-700 pt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClose}
        >
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AllianceManagementUI;
