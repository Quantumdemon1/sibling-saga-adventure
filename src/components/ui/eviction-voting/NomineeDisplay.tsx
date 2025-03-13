
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/types/PlayerProfileTypes';

interface NomineeDisplayProps {
  nominees: Player[];
}

const NomineeDisplay: React.FC<NomineeDisplayProps> = ({ nominees }) => {
  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex justify-center gap-8 mb-6">
      {nominees.map(nominee => (
        <div key={nominee.id} className="text-center">
          <Avatar className="h-16 w-16 mx-auto mb-2">
            {nominee.avatarUrl ? (
              <AvatarImage src={nominee.avatarUrl} />
            ) : (
              <AvatarFallback>{getInitials(nominee.name)}</AvatarFallback>
            )}
          </Avatar>
          <div className="font-medium">{nominee.name}</div>
        </div>
      ))}
    </div>
  );
};

export default NomineeDisplay;
