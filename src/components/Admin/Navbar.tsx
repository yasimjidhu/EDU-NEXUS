import { ThunkDispatch } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../redux/slices/authSlice";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type AppDispatch = ThunkDispatch<any, any, any>;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await (dispatch as AppDispatch)(logoutUser());
      navigate("/login");
      toast.success("Logout Successfull");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Logout failed:", error);
    }
  };

  const handleProfile = () => {
    console.log("viewing profile");
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4  ml-64 p-3 border bottom-4">
        <div className=" col-span-10 w-full m-auto">
          <form className="max-w-md mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                className="block p-4 ps-10 text-sm text-gray-900 rounded-lg w-full bg-gray-100"
                placeholder="Search Mockups, Logos..."
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-medium-rose hover:bg-strong-rose focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="cursor-pointer p-2" onClick={toggleDropdown}>
              <img
                src="/assets/png/user.png"
                className="w-12"
                alt="User Profile"
              />
            </div>
            {isOpen && (
              <div className="absolute top-0 right-0 mt-10 w-40 bg-white border border-gray-200 rounded-lg shadow p-2">
                <ul>
                  <li
                    className="cursor-pointer p-2 bg-pure-white text-black  hover:bg-medium-rose hover:rounded-md hover:text-white"
                    onClick={handleProfile}
                  >
                    Profile
                  </li>
                  <li
                    className="cursor-pointer p-2  bg-pure-white text-black hover:bg-medium-rose hover:rounded-md hover:text-white"
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
              className="w-8"
              alt="Notifications"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
