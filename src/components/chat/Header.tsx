import { Phone, Video } from 'lucide-react'
import React from 'react'
import { User } from '../redux/slices/studentSlice'

interface HeaderProps{
    selectedStudent:User;
    isTyping:boolean;
    onlineUsers:{[email:string]:string}
}
export const Header : React.FC<HeaderProps> = ({selectedStudent,isTyping,onlineUsers}) => {
    return (
        <div className="flex items-center p-4 bg-white border-b border-gray-200">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                <img
                    src={selectedStudent.profile?.avatar || '/default-avatar.png'}
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="ml-3 flex-grow">
                <p className="font-semibold text-gray-800">{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</p>
                <p className="text-sm text-gray-500">
                    {isTyping ? (
                        <p className="text-sm text-black">Typing...</p>
                    ) : (
                        onlineUsers[selectedStudent.email] === 'online' ? (
                            <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                Online
                            </span>
                        ) : (
                            'Offline'
                        )
                    )}
                </p>
            </div>
            <div className="flex space-x-4">
                <button
                    // onClick={() => onStartCall?.(selectedStudent._id, 'audio')}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <Phone size={20} />
                </button>
                <button
                    // onClick={() => onStartCall?.(selectedStudent._id, 'video')}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <Video size={20} />
                </button>
            </div>
        </div>
    )
}
