import React from "react";
import Navbar from "../../components/authentication/Navbar";
import { Link } from "react-router-dom";

const Enrollment = () => {

  const setRole = (role:string)=>{
    localStorage.setItem('role',role)
  }
  
  return (
    <>
      <Navbar isAuthenticated={true} />
      <div className=" grid grid-cols-2 gap-4 py-4 px-10 bg-pure-white">
        <div className=" text-center">
          <div className=" flex items-center justify-center">
            <img src="/assets/svg/student.svg" width="50%" alt="" />
          </div>
          <Link to='/register/student'><button className="bg-medium-rose py-2 px-3  rounded-full  text-white poppins-normal mt-2 border-2 border-medium-rose hover:bg-strong-rose hover:text-white" onClick={()=>setRole('student')}>
            Enroll as a Student
          </button></Link>
        </div>
        <div className="text-center">
          <div className=" flex items-center justify-center">
            <img src="/assets/svg/teacher.svg" width="50%" alt="" />
          </div>
          <Link to='/register/instructor'><button className="bg-hash-black py-2 px-3  rounded-full  text-white poppins-normal text-md mt-2 border-2 border-medium-rose hover:bg-lite-black" onClick={()=>setRole('instructor')}>
            Enroll as a Teacher
          </button></Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 p-2 bg-pure-white">
        <div className=" mx-auto p-8 text-justify w-[70%] bg-gray-300  rounded-lg">
            <h6 className="thin-font">"Join as a student to unlock a world of learning opportunities. Access a diverse range of courses, engage with interactive content, collaborate with peers, and track your progress as you embark on your educational journey."</h6>
        </div>
    <div className="mx-auto p-8 text-justify w-[70%] bg-gray-300 rounded-lg">
        <h6 className="thin-font ">"Join as a student to unlock a world of learning opportunities. Access a diverse range of courses, engage with interactive content, collaborate with peers, and track your progress as you embark on your educational journey."</h6>
    </div>
</div>
    </>
  );
};

export default Enrollment;
