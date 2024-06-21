import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { useNavigate } from 'react-router-dom';
import { ApproveInstructor, RejectInstructor } from '../../components/redux/slices/instructorSlice';
import { fetchAllInstructors } from '../../components/redux/slices/instructorSlice';
import { toast } from 'react-toastify';
import Pagination from '../../components/common/Pagination';
import { formatDate } from '../../utils/dateFormater';

const Requests: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [instructorEmail,setInstructorEmail] = useState<string>('');
  const [approvedInstructors, setApprovedInstructors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, allInstructors,data, error } = useSelector((state: RootState) => state.instructor);
  

  useEffect(() => {
    (dispatch as AppDispatch)(fetchAllInstructors());
  }, []);

  useEffect(() => {
    (dispatch as AppDispatch)(fetchAllInstructors());
  }, [data]);

  const handleApproval = async (email:string) => {
    try {
      const response:any = await dispatch(ApproveInstructor({email}));
      toast.success('Instructor approved successfully')
      setApprovedInstructors([...approvedInstructors, email]);
    } catch (error) {
      toast.error('error occured')
      console.log(error)
    }
  };
  
  const handleRejection = async (email:string)=>{
    try {
      const response:any = await dispatch(RejectInstructor({email}))
      toast.success('Instructor rejected successfully')
    } catch (error) {
      toast.error('error occured')
      console.log(error)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const itemsPerPage = 10; 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allInstructors ? allInstructors.instructors.slice(indexOfFirstItem, indexOfLastItem) : []

  const totalPages = allInstructors ? Math.ceil(allInstructors.instructors.length / itemsPerPage) :  1;

  return (
    <div className="">
      <div className="rounded-xl shadow-md p-4 bg-pure-white max-w-6xl mx-auto ml-52">
        <div className="grid grid-cols-12 justify-between gap-4 text-sm">
          <div className="col-span-3">
            <h2 className="inter">User</h2>
          </div>
          <div className="col-span-2">
            <h2 className="inter">Email Address</h2>
          </div>
          <div className="col-span-2 flex justify-center items-start">
            <h2 className="inter">Qualification</h2>
          </div>
          <div className="col-span-2 flex justify-center items-center">
            <h2 className="inter">Date</h2>
          </div>
          <div className="col-span-3 flex justify-center items-start">
            <h2 className="inter">Action</h2>
          </div>
        </div>
        <div className="border-2 border-gray-300 w-full mt-2"></div>
        {currentItems.map((item) => (
          <div key={item._id} className="grid grid-cols-12 items-center py-2 text-sm">
            <div className="flex col-span-3 justify-start items-center space-x-2">
              <div className="rounded-full w-10 h-10 shadow-sm border-2 border-gray-600 overflow-hidden">
                <img
                  src={`${item.profile.avatar}?${new Date().getTime()}`}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
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
              <h3 className="inter">{formatDate(item.profile.dateOfBirth)}</h3>
            </div>
            <div className="col-span-3 flex justify-end items-center space-x-2">
              
              {!approvedInstructors.includes(item.email) && !item.isVerified && (
                <button
                  className="text-center bg-medium-rose text-white inter py-1 px-3 rounded-lg cursor-pointer"
                  onClick={() => {
                    setInstructorEmail(item.email);
                    handleApproval(item.email);
                  }}
                >
                  Approve
                </button>
              )}
              <button className="text-center bg-strong-rose text-white inter py-1 px-3 rounded-lg cursor-pointer"
              onClick={()=>{
                handleRejection(item.email)
              }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Requests;
