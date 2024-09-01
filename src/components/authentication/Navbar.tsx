import React, { useEffect, useState } from "react";
import "../../index.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../redux/store/store";
import { fetchUserData, clearUserState } from "../redux/slices/studentSlice";
import { clearInstructorState } from "../redux/slices/instructorSlice";
import useDebounce from "../../hooks/useDebounce";
import { CourseState, searchCourses } from "../redux/slices/courseSlice";
import { ArrowDownCircle, Bell, Image, Headphones, FileText } from "lucide-react";
import { clearUnreadMessages, getUnreadMessages } from "../redux/slices/chatSlice";
import { UnreadMessage } from "../../types/chat";

interface NavbarProps {
  isAuthenticated: boolean;
  onSearch: (results: CourseState[]) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userUnreadMessages, setUserUnreadMessages] = useState<UnreadMessage[]>([])
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { user, allUsers } = useSelector((state: RootState) => state.user);
  const authData = useSelector((state: RootState) => state.auth);
  const { unreadMessages } = useSelector((state: RootState) => state.chat);

  const navigate = useNavigate();
  type AppDispatch = ThunkDispatch<any, any, any>;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowMessage(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      (dispatch as AppDispatch)(fetchUserData());
    }
  }, [authData.email, isAuthenticated, dispatch]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      dispatch(searchCourses(debouncedSearchQuery)).then((result) => {
        if (searchCourses.fulfilled.match(result)) {
          onSearch(result.payload);
          setShowMessage(true);
        }
      });
    }
  }, [debouncedSearchQuery, dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUnreadMessages(user._id));
      const userMessages = filteredUnreadMessages()
      setUserUnreadMessages(userMessages)
    }
  }, [dispatch, user?._id]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const filteredUnreadMessages = () => {

    const userUnreadMessages = unreadMessages.filter((item) => {
      const [id1, id2] = item.conversationId.split("-");
      console.log('id1', id1)
      console.log('id1', id2)
      // Check if the current user's ID is present in the conversation ID
      return id1 === user?._id || id2 === user?._id;
    });
    console.log('userUnread messages filtered', userUnreadMessages)
    return userUnreadMessages;
  };


  const handleLogout = async () => {
    try {
      await (dispatch as AppDispatch)(logoutAdmin());
      dispatch(clearUserState());
      dispatch(clearInstructorState());
      navigate("/login");
      toast.success("Logout Successful");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Logout failed:", error);
    }
  };

  const handleProfile = () => {
    if (user?.role === "student") {
      navigate("/student/profile");
    } else if (user?.role === "instructor") {
      navigate("/instructor/profile");
    } else {
      navigate("/admin/overview");
    }
  };

  const renderProfileImage = () => {
    if (authData.user.profileImage) {
      return (
        <img
          src={authData.user.profileImage}
          alt="avatar"
          className="w-full h-full object-cover rounded-full"
        />
      );
    } else if (user && user.profile?.avatar) {
      return (
        <img
          src={`${user.profile.avatar}?${new Date().getTime()}`}
          alt="avatar"
          className="w-full h-full object-cover rounded-full"
        />
      );
    } else {
      return (
        <img
          src="/assets/png/user.png"
          alt="User Profile"
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
  };

  const handleCoursesClick = ()=>{
    navigate('/allcourses')
  }

  const handleViewAllClick = () => {
    if (user?.role == 'student') {
      navigate('/student/chat')
    } else if (user?.role == 'instructor') {
      navigate('/instructor/chat')
    }
  }
  const totalUnreadMessages = unreadMessages.reduce((total, msg) => total + msg.unreadCount, 0);

  const renderMessagePreview = (message: any) => {
    switch (message.fileType) {
      case 'image':
        return (
          <div className="flex items-center">
            <Image className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-sm text-gray-600">Image</span>
          </div>
        );
      case 'audio':
        return (
          <div className="flex items-center">
            <Headphones className="w-5 h-5 mr-2 text-green-500" />
            <span className="text-sm text-gray-600">Audio message</span>
          </div>
        );
      default:
        return (
          <p className="text-sm text-gray-600 truncate">
            {message.text || <FileText className="inline w-4 h-4 mr-1 text-gray-400" />}
          </p>
        );
    }
  };


  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white shadow-md h-20">
        <div className="w-1/6">
          <h3 className="text-medium-rose font-bold text-3xl">Edu-Nexus</h3>
        </div>
        <div className="w-2/5">
          <ul className="flex justify-around items-center space-x-4">
            <li className="text-md font-medium inter bg-purple-500 text-white p-2 rounded-xl cursor-pointer">
              Home
            </li>
            <li className="text-md font-medium inter bg-white p-2 rounded-xl cursor-pointer" onClick={handleCoursesClick}>
              Courses
            </li>
            <li className="text-md font-medium inter bg-white p-2 rounded-xl">
              Teach
            </li>
            <li className="text-md font-medium inter bg-white p-2 rounded-xl">
              Contact Us
            </li>
            <li className="text-md font-medium inter bg-white p-2 rounded-xl">
              About Us
            </li>
          </ul>
        </div>
        {isAuthenticated && (
          <div className="w-2/5 flex justify-end items-center space-x-4">
            <form className="relative w-full max-w-md">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border rounded-xl focus:border-blue-500"
                  placeholder="Search courses...."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {showMessage && (
                  <div className="absolute top-16 left-0 right-0 bg-blue-50 text-blue-800 p-4 text-sm rounded-lg shadow-lg flex items-center">
                    <ArrowDownCircle className="mr-2 h-5 w-5 text-blue-600" />
                    <strong>Heads Up!</strong> Scroll down to see the results.
                  </div>
                )}
              </div>
            </form>

            <div className="flex items-center space-x-4 z-50">
              <div className="relative">
                <div
                  className="cursor-pointer w-11 h-11 shadow-sm border-2 border-gray-300 rounded-full overflow-hidden"
                  onClick={toggleDropdown}
                >
                  {renderProfileImage()}
                </div>
                {isOpen && (
                  <div className="absolute top-0 right-0 mt-10 w-40 bg-white border border-gray-200 rounded-lg shadow p-2">
                    <ul>
                      <li
                        className="cursor-pointer p-2 bg-pure-white text-black hover:bg-medium-rose hover:rounded-md hover:text-white"
                        onClick={handleProfile}
                      >
                        Profile
                      </li>
                      <li
                        className="cursor-pointer p-2 bg-pure-white text-black hover:bg-medium-rose hover:rounded-md hover:text-white"
                        onClick={handleLogout}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative" onClick={toggleNotificationDropdown}>
                <div className="cursor-pointer p-2 bg-purple-500 rounded-xl">
                  <img
                    src="/assets/png/bell.png"
                    className="w-16"
                    alt="Notifications"
                  />
                  {totalUnreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1">
                      {totalUnreadMessages}
                    </span>
                  )}
                </div>
                {isNotificationOpen && unreadMessages.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
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
                              {message.latestMessage.text !== "" ?(
                                <p className=" text-sm">{message.latestMessage.text}</p>
                              ):(
                                renderMessagePreview(message.latestMessage)
                              )}
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
        )}
      </div>
    </>
  );
};

export default Navbar;

