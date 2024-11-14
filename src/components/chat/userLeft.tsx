import { UserMinus } from 'lucide-react';

const UserLeftMessage = ({ message }:{message:string}) => {
  if (!message || message.trim() == '') return null;

  return (
    <div className="flex justify-center my-2">
      <div className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
        <UserMinus size={16} className="mr-2" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default UserLeftMessage;