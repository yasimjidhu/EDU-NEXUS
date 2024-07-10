import React, { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import Navbar from "../../components/authentication/Navbar";
import { RootState } from "../../components/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resendOtp, verifyOTP } from "../../components/redux/slices/authSlice";
import {
  startCountdown,
  decrementTimer,
  resetTimer,
} from "../../components/redux/slices/otpSlice";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

const OtpVerify: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  type AppDispatch = ThunkDispatch<any, any, any>;

  const userEmail = useSelector((state: RootState) => state.auth?.email);
  const { timeLeft, isActive } = useSelector((state: RootState) => state.otp);
  const {loading} = useSelector((state:RootState)=>state.auth)

  const [otpExpired,setOtpExpired] = useState<boolean>(false)

  useEffect(() => {
    const timerStarted = localStorage.getItem("timerStarted");
    const savedTimeLeft = localStorage.getItem("timeLeft");

    if (!timerStarted) {
      dispatch(startCountdown(180));
      localStorage.setItem("timerStarted", "true");
      localStorage.setItem("timeLeft", "180");
    } else if (savedTimeLeft) {
      dispatch(startCountdown(parseInt(savedTimeLeft, 10)));
    }
  }, [dispatch]);

  useEffect(() => {
    let interval: any = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());

        localStorage.setItem("timeLeft", timeLeft.toString());
      }, 1000);
    } else if (!isActive || timeLeft === 0) {
      setOtpExpired(true)
      clearInterval(interval);
      localStorage.removeItem("timerStarted");
      localStorage.removeItem("timeLeft");
    }
    return () => {
      clearInterval(interval);
      localStorage.removeItem("timerStarted");
      localStorage.removeItem("timeLeft");
    };
  }, [isActive, timeLeft, dispatch]);




  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const [otps, setOtps] = useState<string[]>(Array(4));

  const handleChange = (value: string, index: number) => {
    const newOtps = [...otps];
    newOtps[index] = value;
    setOtps(newOtps);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpValue: string = otps.join("");

    const token = localStorage.getItem("signupToken");
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
      console.log('this is the respones of verfifyotp dispatch',response)
      if (response.error) {
        throw new Error(response.payload.error);
      }
      localStorage.setItem('email',userEmail)
      navigate("/home");
    } catch (error: any) {
      console.log('error inverifyotp fronteend',error)
      const errorMessage = error?.message || "otp verification failed";
      toast.error(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    const email: string = localStorage.getItem('userEmail') as string;

    try {
      const response: any = await (dispatch as AppDispatch)(
        resendOtp({ email })
      );
      toast.success(response.payload.message);
      dispatch(startCountdown(180));
      setOtpExpired(false);
    } catch (error: any) {
      console.log("error in frontend", error);
      toast.error(error.message);
    }
  };


  const allFieldsFilled = otps.every((otp) => otp !== "");

  // Get references to all the input fields
  const inputFields = document.querySelectorAll(
    'input[type="text"]'
  ) as NodeListOf<HTMLInputElement>;

  inputFields.forEach((field, index) => {
    field.addEventListener("input", () => {
      if (index === inputFields.length - 1) {
        inputFields[index].focus();
      } else {
        inputFields[index + 1].focus();
      }
    });
  });

  return (
    <>
      <Navbar isAuthenticated={false} />
      <div className="container mx-auto p-10">
        <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="w-[80%]">
            <img src="/public/assets/images/verify.png" alt="" />
          </div>
          <div className="h-full flex flex-col justify-center p-6 ">
            <form onSubmit={handleSubmit}>
              <div className=" bg-gray-400 p-6 rounded-3xl h-full ">
                <h3 className="text-2xl text-black text-center mb-6 secondary-font font-bold">
                  please enter the OTP
                </h3>
                <h5 className="text-center mb-4 font-semibold">
                  Please enter the otp to continue with Registration
                </h5>
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
                  Time remaining : {formatTime(timeLeft)}
                </h5>
                <div className="flex justify-center space-x-6">
                  <button
                    disabled={!allFieldsFilled}
                    type="submit"
                    className="bg-medium-rose px-8 py-3 hover:bg-strong-rose text-white mt-5 rounded-xl font-semibold secondary-font"
                  >
                    {loading ? <BeatLoader color="white" className="text-center" /> : 'Verify'}
                  </button>
                  <button
                    onClick={handleResendOtp}
                    disabled={!otpExpired}
                    type="button"
                    className={`bg-lite-black px-8 py-3 hover:bg-hash-black border border-black text-white mt-5 rounded-xl font-semibold secondary-font ${otpExpired ? '' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    Resend
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerify;
