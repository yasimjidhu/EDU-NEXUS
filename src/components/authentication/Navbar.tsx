import React, { useEffect, useState } from "react";
import "../../index.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../redux/store/store";
import { fetchUserData, clearUserState } from "../redux/slices/studentSlice";

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const authData = useSelector((state: RootState) => state.auth);


  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type AppDispatch = ThunkDispatch<any, any, any>;

  useEffect(() => {
    if (isAuthenticated) {
      (dispatch as AppDispatch)(fetchUserData());
    }
  }, [authData.email, isAuthenticated, dispatch]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await (dispatch as AppDispatch)(logoutAdmin());
      dispatch(clearUserState()); // Clear user state on logout
      navigate("/login");
      toast.success("Logout Successful");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Logout failed:", error);
    }
  };

  const handleProfile = () => {
    if(user?.role == 'student'){
      navigate('/home')
    }else if(user?.role == 'instructor'){
      navigate('/instructor/overview')
    }else{
      navigate('/admin/overview')
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
            <li className="text-lg font-medium inter bg-purple-500 text-white p-2 rounded-xl">
              Home
            </li>
            <li className="text-lg font-medium inter bg-white p-2 rounded-xl">
              Courses
            </li>
            <li className="text-lg font-medium inter bg-white p-2 rounded-xl">
              Teach
            </li>
            <li className="text-lg font-medium inter bg-white p-2 rounded-xl">
              Contact Us
            </li>
            <li className="text-lg font-medium inter bg-white p-2 rounded-xl">
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
                  placeholder="Search courses, mentors..."
                />
                <button
                  type="submit"
                  className="text-white absolute right-2.5 bottom-2.5 bg-medium-rose font-medium rounded-lg text-sm px-4 py-2"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div
                  className="cursor-pointer w-11 h-11 shadow-sm border-2 border-gray-300 rounded-full overflow-hidden"
                  onClick={toggleDropdown}
                >
                  {user ? (
                    <img
                      src={`${user.profile.avatar}?${new Date().getTime()}`} // Append timestamp to force new image fetch
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
              <div className="cursor-pointer p-2 bg-purple-500 rounded-xl">
                <img
                  src="/assets/png/bell.png"
                  className="w-9"
                  alt="Notifications"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
