import React from "react";
import Navbar from "../../components/authentication/Navbar";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getForgotPasswordSchema } from "../../utils/Authvalidation";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { forgotPassword } from "../../components/redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  type AppDispatch = ThunkDispatch<any, any, any>;

  const forgotPasswordSchema = getForgotPasswordSchema();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    try {
      const { email } = values;

      localStorage.setItem("userEmail", email);
      const response: any = await (dispatch as AppDispatch)(
        forgotPassword({ email })
      );
      if (response.error) {
        throw new Error(response.error.message);
      }
      navigate("/forgot-pass-verify-otp");
    } catch (error) {
      toast.warning("User not found, please register");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Navbar isAuthenticated={false} />
      <div className="grid grid-cols-2  p-5">
        <div className="flex justify-center items-center">
          <img
            src="/assets/images/forgot-pass.png"
            width="80%"
            height="auto"
            alt=""
          />
        </div>
        <div className="bg-gray-200 py-2 px-10 flex  items-center rounded-3xl">
          <div className="w-full">
            <h1 className="text-center text-xl font-bold mb-2">
              Forgot password
            </h1>
            <h4 className="text-md text-green-800 text-center">
              Enter your email and we'll send you an otp to reset the password
            </h4>
            <Formik
              initialValues={initialValues}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4 mt-8">
                    <label
                      htmlFor="email"
                      className="block w-full font-semibold"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="Login-input w-full py-2 rounded-md border pl-2  text-lg focus:outline-none "
                    />
                    <ErrorMessage
                      name="email"
                      id="email"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                  {isSubmitting ? (
                    <button
                      type="submit"
                      className="bg-medium-rose w-full p-3 text-xl text-white rounded-md"
                    >
                      <BeatLoader className="mr-4 text-center mx-auto" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-medium-rose w-full p-2 text-lg text-white rounded-md"
                    >
                      Submit
                    </button>
                  )}
                </Form>
              )}
            </Formik>
            <div className="flex justify-center items-center mt-5">
              <Link to="/login">
                <span className="material-symbols-outlined font-medium mt-1 mr-1">
                  arrow_back
                </span>
              </Link>
              <Link to="/login">
                <h5 className="font-medium">Back to Login</h5>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
