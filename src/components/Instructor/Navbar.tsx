import { ThunkDispatch } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutAdmin, logoutUser } from "../redux/slices/authSlice";
import { RootState } from "../redux/store/store";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type AppDispatch = ThunkDispatch<any, any, any>;

  const {user} = useSelector((state:RootState)=>state.user)
  console.log('user blocked',user)

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

  // useEffect(()=>{
  //   if(user?.isBlocked){
  //     (dispatch as AppDispatch)(logoutAdmin());
  //     navigate('/login')
  //     toast.error('Access Denied')
  //   }
  // },[user])

  const handleProfile = () => {
    console.log("viewing profile");
  };

  return (
    <div className="bg-white border-b border-gray-200 ml-52 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left section */}
        <div className="flex items-center space-x-4 ">
          <h3 className="text-medium-rose font-bold text-3xl">Edu-Nexus</h3>
          </div>
            <div className="relative w-80 ">
              <form className="max-w-md ">
              <input
                type="search"
                id="default-search"
                className="block w-full p-3 rounded-lg bg-gray-100 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Search Mockups, Logos..."
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-2 bg-medium-rose text-white rounded-lg text-sm hover:bg-strong-rose focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Search
              </button>
          </form>
            </div>
        <div className="flex items-center space-x-4 ">
          <div className="relative">
            <div className="cursor-pointer w-11 h-11 shadow-sm border-2 border-gray-300 rounded-full overflow-hidden" onClick={toggleDropdown}>
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
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <ul className="divide-y divide-gray-200">
                  <li
                    className="px-4 py-2 text-sm text-gray-900 hover:bg-medium-rose hover:text-white cursor-pointer"
                    onClick={handleProfile}
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
          <div className="cursor-pointer p-2 bg-purple-500 rounded-xl">
            <img
              src="/assets/png/bell.png"
              className="w-8 h-8"
              alt="Notifications"
            />
          </div>
        </div>
      </div>
    </div>
  );

};

export default Navbar;
