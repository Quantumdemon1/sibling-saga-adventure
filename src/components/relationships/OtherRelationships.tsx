
import React from 'react';
import { Player } from '@/types/PlayerProfileTypes';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import RelationshipIndicator from './RelationshipIndicator';

interface OtherRelationshipsProps {
  selectedPlayer: Player;
  players: Player[];
}

const OtherRelationships: React.FC<OtherRelationshipsProps> = ({ selectedPlayer, players }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {selectedPlayer.name}'s Other Relationships
      </h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Houseguest</TableHead>
              <TableHead>Relationship</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players
              .filter(p => p.id !== selectedPlayer.id && p.status === 'active')
              .map(player => {
                const relationship = selectedPlayer.relationships?.[player.id];
                if (!relationship) return null;
                
                return (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>
                      <RelationshipIndicator 
                        relationship={relationship}
                        showScore={false}
                        size="sm"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OtherRelationships;
