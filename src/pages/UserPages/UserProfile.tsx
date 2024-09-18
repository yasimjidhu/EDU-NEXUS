import React from 'react';
import {  useSelector } from 'react-redux';
import {  RootState } from '../../components/redux/store/store';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Shield,  
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const UserProfile: React.FC = () => {

  const authData = useSelector((state:RootState)=>state.auth)
  const {user} = useSelector((state:RootState)=>state.user)

  useDocumentTitle('Profile')

  if (!user) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  const getStatusIcon = () => {
    if (user.isBlocked) return <XCircle className="text-red-500" />;
    if (user.isRejected) return <AlertCircle className="text-yellow-500" />;
    return <CheckCircle className="text-green-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
        <div className="relative">
          <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-100 rounded-full flex items-center justify-center shadow-lg">
            {user.profile.avatar ? (
              <img
                src={authData.user.profileImage || user.profile.avatar}
                alt={`${authData.user.username}`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <UserIcon size={64} className="text-gray-400" />
            )}
            {user.isVerified && (
              <span className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                <CheckCircle size={20} />
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {authData.user.username}
          </h1>
          {/* <p className="text-lg text-gray-600 mb-4">{user.qualification}</p> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <InfoItem icon={<Mail size={18} />} label="Email" value={authData.user.email} />
            <InfoItem icon={<Phone size={18} />} label="Phone" value={user.contact.phone} />
            <InfoItem icon={<MapPin size={18} />} label="Address" value={user.contact.address} />
            <InfoItem icon={<Calendar size={18} />} label="Date of Birth" value={new Date(user.profile.dateOfBirth).toLocaleDateString()} />
            <InfoItem icon={<Users size={18} />} label="Gender" value={user.profile.gender} />
          </div>
        </div>
      </div>
      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Additional Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatusCard
            icon={<Shield size={20} />}
            title="Account Status"
            value={user.isBlocked ? 'Blocked' : user.isRejected ? 'Rejected' : 'Active'}
            statusIcon={getStatusIcon()}
          />

          <StatusCard
            icon={<Globe size={20} />}
            title="Social"
            value={user.contact.social || 'Not provided'}
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-600 overflow-hidden">
    <span className="flex-shrink-0">{icon}</span>
    <span className="font-semibold flex-shrink-0">{label}:</span>
    <span className="truncate">{value}</span>
  </div>
);

const StatusCard: React.FC<{ icon: React.ReactNode; title: string; value: string; statusIcon?: React.ReactNode }> = ({ icon, title, value, statusIcon }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center space-x-4">
    <div className="text-gray-700">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-sm sm:text-base text-gray-700">{title}</p>
      <p className="text-lg sm:text-xl text-gray-800 truncate">{value}</p>
    </div>
    {statusIcon}
  </div>
);

export default UserProfile;
