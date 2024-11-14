// GroupHeader.tsx
import React from 'react';
import { UserPlus, LogOut, MoreVertical } from 'lucide-react';

interface GroupHeaderProps {
  groupName: string;
  participantsCount: number;
  onJoinGroup: () => void;
  onLeaveGroup: () => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({ groupName, participantsCount, onJoinGroup, onLeaveGroup }) => (
  <div className="bg-[#075e54] p-3 text-white flex items-center justify-between">
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
      <div>
        <h2 className="text-lg font-semibold">{groupName}</h2>
        <p className="text-sm">{participantsCount} participants</p>
      </div>
    </div>
    <div className="flex space-x-4">
      <UserPlus size={20} onClick={onJoinGroup} className="cursor-pointer" />
      <LogOut size={20} onClick={onLeaveGroup} className="cursor-pointer" />
      <MoreVertical size={20} className="cursor-pointer" />
    </div>
  </div>
);