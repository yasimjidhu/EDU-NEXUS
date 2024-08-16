import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store/store";
import { getUnreadMessages } from "../redux/slices/chatSlice";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { user,allUsers } = useSelector((state: RootState) => state.user);
  const { unreadMessages } = useSelector((state: RootState) => state.chat);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleLogout = async () => {
    try {
      await (dispatch as AppDispatch)(logoutUser());
      navigate("/login");
      toast.success("Logout Successful");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUnreadMessages(user?._id!))
    }
  }, [dispatch, user?._id])

  const getSenderImage = (senderId: string) => {
    const sender = allUsers?.find((user) => user._id === senderId);
    return sender?.profile.avatar || "/assets/png/user.png";
  };


  const totalUnreadMessages = unreadMessages.reduce((total, msg) => total + msg.unreadCount, 0);

  return (
    <div className="bg-white border-b border-gray-200 shadow-lg ml-52">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-medium-rose font-bold text-3xl">Edu-Nexus</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div
              className="cursor-pointer w-11 h-11 shadow-sm border-2 border-gray-300 rounded-full overflow-hidden"
              onClick={toggleDropdown}
            >
              {user ? (
                <img
                  src={`${user.profile.avatar}?${new Date().getTime()}`}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <img
                  src="/assets/png/user.png"
                  className="w-full h-full object-cover rounded-full"
                  alt="User Profile"
                />
              )}
            </div>
            {isOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="divide-y divide-gray-200">
                  <li
                    className="px-4 py-2 text-sm text-gray-900 hover:bg-medium-rose hover:text-white cursor-pointer"
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 text-sm text-gray-900 hover:bg-medium-rose hover:text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="relative" onClick={toggleNotificationDropdown}>
            <div className="cursor-pointer p-2 bg-purple-500 hover:bg-purple-600 transition-colors rounded-full ml-4 relative">
              <img
                src="/assets/png/bell.png"
                className="w-8 h-8"
                alt="Notifications"
              />
              {totalUnreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalUnreadMessages}
                </span>
              )}
            </div>
               {/* Notification Dropdown */}
               {isNotificationOpen && unreadMessages.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200">
                  {unreadMessages.map((msg) => (
                    <li
                      key={msg.conversationId}
                      className="px-4 py-2 flex items-center space-x-4 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={getSenderImage(msg.latestMessage.senderId)}
                        alt="Sender"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold">
                          {msg.latestMessage.senderName}
                        </div>
                        <div className="text-gray-600">
                          {msg.latestMessage.text || "File attachment"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(msg.latestMessage.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;