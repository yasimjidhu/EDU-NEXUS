import Navbar from "../../components/authentication/Navbar";
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { signupUser } from "../../components/redux/slices/authSlice";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { getSignupValidationSchema } from "../../utils/Authvalidation";
import { ErrorMessage, Field, Formik, Form } from "formik";
import GoogleSignInButton from "../../components/authentication/GoogleSigninButton";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { toast } from "react-toastify";

const SignupPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type AppDispatch = ThunkDispatch<any, any, any>;

  // const { username, email, password } = useSelector(
  //   (state: RootState) => state?.auth
  // );

  useDocumentTitle('Signup')

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = getSignupValidationSchema();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    try {
      const { username, email, password } = values;
      const response: any = await (dispatch as AppDispatch)(
        signupUser({ username, email, password })
      );

      if (response.error) {
        throw new Error(response.payload.error);
      }

      navigate("/verify-otp");
    } catch (error: any) {
      const errorMessage = error?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
      console.error("Signup failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar isAuthenticated={false} />
      <div className="flex justify-around">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 justify-center items-center w-[90%] mt-4 ">
            <div className="bg-gray-200 px-12 rounded-3xl">
              <h2 className="text-2xl font-sans mt-3">Signup</h2>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mt-4 mb-4">
                      <label
                        htmlFor="username"
                        className="block w-full text-sm"
                      >
                        Username
                      </label>
                      <Field
                        type="text"
                        id="username"
                        name="username"
                        className="signup-input w-full py-1 rounded-md border pl-2 text-lg focus:outline-none"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block w-full text-sm">
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="signup-input w-full py-1 rounded-md border pl-2 text-lg focus:outline-none"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block w-full text-sm"
                      >
                        Password
                      </label>
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        className="signup-input w-full py-1 rounded-md border pl-2 text-lg focus:outline-none"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="block w-full text-sm"
                      >
                        Confirm Password
                      </label>
                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="signup-input w-full py-1 rounded-md border pl-2 text-lg focus:outline-none"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>
                    {isSubmitting ? (
                      <button
                        type="submit"
                        className="bg-strong-rose w-full py-2 text-xl text-white rounded-md"
                      >
                        <BeatLoader
                          color="white"
                          className="mr-4 text-center text-white mx-auto"
                        />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-medium-rose w-full py-2 text-lg text-white rounded-md"
                      >
                        Signup
                      </button>
                    )}
                  </Form>
                )}
              </Formik>
              {/* <div id="g-signin2" className="g-signin2"></div> */}
              <div className="w-full mx-auto flex justify-center items-center mt-3 rounded-sm">
                <GoogleSignInButton message="Signup" />
              </div>
              <h5 className="text-center mt-3 mb-3">
                I have an account?{" "}
                <Link to="/login">
                  <span className="text-violet-900 font-semibold"> Login </span>
                </Link>
              </h5>
            </div>
            <div className="p-4">
              <img
                src="/assets/images/signup.png"
                alt="Signup illustration"
                width='90%'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
