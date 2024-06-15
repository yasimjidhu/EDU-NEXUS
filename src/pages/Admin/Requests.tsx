import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { useNavigate } from 'react-router-dom';
import { ApproveInstructor } from '../../components/redux/slices/instructorSlice';
import { fetchAllInstructors } from '../../components/redux/slices/instructorSlice';

const Requests: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [instructorEmail,setInstructorEmail] = useState<string>('');
  const [approvedInstructors, setApprovedInstructors] = useState<string[]>([]);

  const { loading, data, error } = useSelector((state: RootState) => state.instructor);

  const handleApproval = async (email:string) => {
    console.log('email of user')
    const response =await dispatch(ApproveInstructor({email}));
    setApprovedInstructors([...approvedInstructors, email]);
    console.log('response from the approve', response);
  };

  useEffect(() => {
    (dispatch as AppDispatch)(fetchAllInstructors());
  }, [dispatch]);

  return (
    <div className="container ml-64 p-6">
      <div className="rounded-xl shadow-md p-4 bg-pure-white">
        <div className="grid grid-cols-12 justify-between">
          <div className="col-span-3 md:ml-5">
            <h2 className="inter">User</h2>
          </div>
          <div className="col-span-3">
            <h2 className="inter">Email Address</h2>
          </div>
          <div className="col-span-2 flex justify-center items-center">
            <h2 className="inter">Qualification</h2>
          </div>
          <div className="col-span-2 flex justify-center items-center">
            <h2 className="inter">Date</h2>
          </div>
          <div className="col-span-2 flex justify-center items-center">
            <h2 className="inter">Action</h2>
          </div>
        </div>
        <div className="border-2 border-gray-300 w-full mt-4"></div>
        {data && data?.instructors?.map((item) => (
          <div key={item._id} className="grid grid-cols-12 items-center py-3">
            <div className="flex col-span-3 justify-start items-center space-x-4">
              <div className="rounded-full bg-yellow-500 w-16 h-16 shadow-sm border-2 border-black overflow-hidden">
                {item ? (
                  <img
                    src={`${item?.profile?.avatar}?${new Date().getTime()}`}
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
              <h4 className="inter">{item.firstName} {item.lastName}</h4>
            </div>
            <div className="col-span-2 text-justify">
              <h4 className="inter">{item.email}</h4>
            </div>
            <div className="col-span-2 flex justify-center items-center text-justify">
              <h6 className="inter-sm">{item.qualification}</h6>
            </div>
            <div className="col-span-2 flex justify-center items-center">
              <h3 className="inter">24 June 2024</h3>
            </div>
            <div className="col-span-3 flex justify-end items-center space-x-3">
              <button className="text-center bg-black text-white py-2 inter px-4 rounded-lg cursor-pointer">
                View
              </button>
              {!approvedInstructors.includes(item.email) && !item.isVerified && (
                <button
                  className="text-center bg-medium-rose text-white inter py-2 px-4 rounded-lg cursor-pointer"
                  onClick={()=>{
                      setInstructorEmail(item.email)
                      handleApproval(item.email)
                  }}
                >
                  Approve
                </button>
              )}
              <button className="text-center bg-strong-rose text-white inter py-2 px-4 rounded-lg cursor-pointer">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
