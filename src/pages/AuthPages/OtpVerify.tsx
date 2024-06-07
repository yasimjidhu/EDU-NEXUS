import React, { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import Navbar from "../../components/authentication/Navbar";
import { RootState } from "../../components/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { verifyOTP } from "../../components/redux/slices/authSlice";

const OtpVerify: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  type AppDispatch = ThunkDispatch<any, any, any>;

  const userEmail = useSelector((state: RootState) => state.auth?.email);

  const [otps, setOtps] = useState<string[]>(Array(4));
  const [timer, setTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem('timer');
    return savedTimer !== null ? parseInt(savedTimer, 10) : 180;
  });

  const handleChange = (value: string, index: number) => {
    const newOtps = [...otps];
    newOtps[index] = value;
    setOtps(newOtps);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpValue: string = otps.join("");

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Token not found in local storage.");
    }

    try {
      if (!userEmail) {
        throw new Error("User email is not available.");
      }

      const response: any = await (dispatch as AppDispatch)(
        verifyOTP({ email: userEmail, otp: otpValue, token: token })
      );

      if (response.error) {
        throw new Error(response.error.message);
      }
      navigate('/home');
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const allFieldsFilled = otps.every((otp) => otp !== "");

  // Get references to all the input fields
  const inputFields = document.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

  // Add event listener to each input field
  inputFields.forEach((field, index) => {
    field.addEventListener('input', () => {
      // Check if the current field is the last one
      if (index === inputFields.length - 1) {
        // Move focus back to the first field
        inputFields[0].focus();
      } else {
        // Move focus to the next field
        inputFields[index + 1].focus();
      }
    });
  });

  useEffect(() => {
    localStorage.setItem('timer', timer.toString());

    if (allFieldsFilled && timer > 0) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => {
        clearInterval(timerId);
      };
    }
  }, [allFieldsFilled, timer]);

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTimer = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;


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
                  Timer remaining : {formattedTimer}
                </h5>
                {!allFieldsFilled ? (
                  <button
                    disabled
                    type="submit"
                    className="bg-strong-rose w-full py-3 text-white mt-5 rounded-xl font-semibold secondary-font "
                  >
                    Verify
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-strong-rose w-full text-white cursor-pointer py-3 mt-5 rounded-xl font-semibold secondary-font "
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
