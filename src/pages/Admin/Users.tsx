import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { User } from "../../components/redux/slices/instructorSlice";
import {
  blockUser,
  getAllUsers,
  unblockUser,
} from "../../components/redux/slices/studentSlice";

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentRole, setCurrentRole] = useState<"student" | "instructor">(
    "student"
  );
  const { allUsers = [] } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);


  const handleBlock = async (email: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await dispatch(unblockUser(email));
      } else {
        await dispatch(blockUser(email));
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage: number = 10;
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;

  const filteredUsers: User[] = allUsers
    ? allUsers.filter((user) => user.role === currentRole)
    : [];
  const currentUsers: User[] = filteredUsers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages: number = Math.ceil(filteredUsers.length / itemsPerPage);

  const switchRole = () => {
    setCurrentRole((prevRole) =>
      prevRole === "student" ? "instructor" : "student"
    );
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            className={`py-1 px-2 rounded-lg mr-2 ${
              currentRole === "student"
                ? "bg-medium-rose text-white"
                : "bg-strong-rose text-white"
            }`}
            onClick={switchRole}
          >
            {currentRole === "student" ? "Students" : "Instructors" }
          </button>
        </div>

        <div className="rounded-xl shadow-md p-4 bg-white ml-36">
          <div className="grid grid-cols-12 justify-between gap-4 text-sm">
            <div className="col-span-3">
              <h2 className="font-semibold">User</h2>
            </div>
            <div className="col-span-2">
              <h2 className="font-semibold">Email Address</h2>
            </div>
            <div className="col-span-2 flex justify-center items-start">
              <h2 className="font-semibold">Qualification</h2>
            </div>
            <div className="col-span-2 flex justify-center items-center">
              <h2 className="font-semibold">Date of Birth</h2>
            </div>
            <div className="col-span-2 flex justify-center items-center">
              <h2 className="font-semibold">Status</h2>
            </div>
            <div className="col-span-1 flex justify-center items-start">
              <h2 className="font-semibold">Action</h2>
            </div>
          </div>
          <div className="border-2 border-gray-300 w-full mt-2"></div>

          {currentUsers.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-12 items-center py-2 text-sm"
            >
              <div className="flex col-span-3 justify-start items-center space-x-2">
                <div className="rounded-full w-10 h-10 shadow-sm border-2 border-gray-600 overflow-hidden">
                  <img
                    src={`${user.profile.avatar}?${new Date().getTime()}`}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h4 className="inter">
                  {user.firstName} {user.lastName}
                </h4>
              </div>
              <div className="col-span-2 text-justify">
                <h4 className="inter">{user.email}</h4>
              </div>
              <div className="col-span-2 flex justify-center items-center text-justify">
                <h6 className="inter">{user.qualification}</h6>
              </div>
              <div className="col-span-2 flex justify-center items-center">
                <h3 className="inter">
                  {new Date(user.profile.dateOfBirth).toLocaleDateString()}
                </h3>
              </div>
              <div className="col-span-2 flex justify-center items-center">
                <h3
                  className={`inter ${
                    user.isBlocked ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </h3>
              </div>
              <div className="col-span-1 flex justify-center items-center space-x-2 ml-3">
                <button
                  className={`text-center ${
                    user.isBlocked ? "bg-green-500" : "bg-red-500"
                  } text-white py-1 px-3 rounded-lg cursor-pointer`}
                  onClick={() => handleBlock(user.email, user.isBlocked)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          currentUsers={currentUsers.length}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Users;
