import React, { useEffect } from "react";
import Navbar from "../../components/authentication/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { toast } from "react-toastify";
import { createAccountLink } from "../../components/redux/slices/paymentSlice";

const NotVerified: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user);
  
  // useEffect(()=>{
  //   console.log('useris',user)
  //   console.log('useEffect triggered');
  //   handleInstructorOnboarding()
  // },[])

  // const handleInstructorOnboarding = async () => {
  //   try {
  //     if(user){
  //       console.log('handle isntructor onboard called')
  //       const accountLinkResponse = await dispatch(createAccountLink({instructorId:user?._id,email:user?.email}));
  //       console.log('accoutn link response',accountLinkResponse)
  //       window.location.href = accountLinkResponse.payload.url;
  //     }

  //   } catch (error) {
  //     toast.error('Failed to start onboarding');
  //     console.error(error);
  //   }
  // };
  

  useEffect(() => {
    if (user?.isVerified) {
      navigate("/home");
    }
  }, [user?.isVerified,navigate]); 

  return (
    <div>
      <Navbar isAuthenticated={true} />
      <div className="flex justify-center items-center">
        <img src="/assets/svg/wait.svg" alt="" className="" width="35%" />
      </div>
      <div>
        <h1 className="text-black text-xl inter text-center">
          Your Application is Under Review
        </h1>
        <h5 className="text-black inter text-center mt-4">
          Thank you for your interest in becoming an instructor on our platform.
          We have received your application and it is currently under review by
          our team.
        </h5>
      </div>
    </div>
  );
};

export default NotVerified;
