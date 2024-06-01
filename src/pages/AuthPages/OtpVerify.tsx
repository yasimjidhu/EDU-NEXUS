import React, { useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import Navbar from "../../components/authentication/Navbar";
import { RootState } from "../../components/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'
import { verifyOTP } from "../../components/redux/slices/authSlice";

const OtpVerify: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  type AppDispatch = ThunkDispatch<any, any, any>;

  const userEmail = useSelector((state: RootState) => state.auth?.userEmail);

  const [otps, setOtps] = useState<string[]>(Array(4));

  const handleChange = (value: string, index: number) => {
    const newOtps = [...otps];
    newOtps[index] = value;
    setOtps(newOtps);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpValue: string = otps.join("");

    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Token not found in local storage.");
    }

    try {
      if (!userEmail) {
        throw new Error("User email is not available.");
      }
      const response: any = await (dispatch as AppDispatch)(
        verifyOTP({ email: userEmail, otp: otpValue,token:token })
      );
      if (response.error) {
        throw new Error(response.error.message);
      }
      navigate('/home')
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const allFieldsFilled = otps.every((otp) => otp !== "");

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-10">
        <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="">
            <img src="/public/assets/images/otp-page.png" alt="" />
          </div>
          <div className="h-full flex flex-col justify-center p-6 ">
            <form onSubmit={handleSubmit}>
              <div className=" bg-gray-400 p-6 rounded-3xl h-full ">
                <h3 className="text-2xl text-black text-center mb-6 secondary-font font-bold">
                  please enter the OTP
                </h3>
                <div className="flex justify-around items-center p-5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <input
                    min={0}
                      key={index}
                      type="text"
                      value={otps[index]}
                      maxLength={1}
                      onChange={(e) => handleChange(e.target.value, index)}
                      className="rounded-3xl w-24 h-16 text-center text-2xl"
                    />
                  ))}
                </div>
                <h5 className="text-center font-bold mt-5 text-red-700">
                  Otp will expire within 60 minutes
                </h5>
                {!allFieldsFilled ? (
                  <button
                    disabled
                    type="submit"
                    className="bg-prime-blue w-full py-3 text-white mt-5 rounded-xl font-semibold secondary-font "
                  >
                    Verify
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-prime-blue w-full text-white cursor-pointer py-3 mt-5 rounded-xl font-semibold secondary-font "
                  >
                    Verify
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerify;
