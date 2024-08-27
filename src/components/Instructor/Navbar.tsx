import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store/store";
import { getUnreadMessages } from "../redux/slices/chatSlice";
import { UnreadMessage } from "../../types/chat";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [userUnreadMessages,setUserUnreadMessages] = useState<UnreadMessage[]>([])

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { user, allUsers } = useSelector((state: RootState) => state.user);
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
      const userMessages = filteredUnreadMessages()
      setUserUnreadMessages(userMessages)
    }
  }, [dispatch, user?._id])

  const handleViewAllClick = () => {
    if (user?.role == 'student') {
      navigate('/student/chat')
    } else if (user?.role == 'instructor') {
      navigate('/instructor/chat')
    }
  }

  const filteredUnreadMessages = () => {
  
    const userUnreadMessages = unreadMessages.filter((item) => {
      const [id1, id2] = item.conversationId.split("-");
  
      // Check if the current user's ID is present in the conversation ID
      return id1 === user?._id || id2 === user?._id;
    });
  
    return userUnreadMessages;
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
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="bg-purple-500 text-white font-bold py-2 px-4">Notifications</div>
                <div className="max-h-96 overflow-y-auto">
                  {userUnreadMessages.length > 0 ? (
                    userUnreadMessages.map((message, index) => (
                      <div key={index} className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100">
                        <img
                          src={message.latestMessage.senderProfile || '/assets/png/user.png'}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{message.latestMessage.senderName}</p>
                          <p className="text-sm text-gray-600 truncate">{message.latestMessage.text}</p>
                        </div>
                        <span className="text-xs text-purple-500 font-semibold">{message.unreadCount}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No new notifications</div>
                  )}
                </div>
                <div className="bg-gray-50 p-2 text-center">
                  <button className="text-purple-500 hover:text-purple-700 font-semibold text-sm" onClick={handleViewAllClick}>
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;