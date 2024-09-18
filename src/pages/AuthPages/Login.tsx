import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { ThunkDispatch } from "@reduxjs/toolkit";
import Navbar from "../../components/authentication/Navbar";
import { getLoginValidationSchema } from "../../utils/Authvalidation";
import { userLogin } from "../../components/redux/slices/authSlice";
import { toast } from "react-toastify";
import GoogleSignInButton from "../../components/authentication/GoogleSigninButton";
import { RootState } from "../../components/redux/store/store";
import { BeatLoader } from "react-spinners";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  type AppDispatch = ThunkDispatch<any, any, any>;

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const {user} = useSelector((state: RootState) => state.user);

  useDocumentTitle('Login')

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = getLoginValidationSchema();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    try {
      const { email, password } = values;
      const response: any = await (dispatch as AppDispatch)(
        userLogin({ email, password })
      );

      if (response.payload && response.payload.error) {
        throw new Error(response.payload.error);
      }
      console.log('response of login',response)
      
      if (response.payload?.user?.role == "admin") {
        navigate("/admin/overview");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Login failed:", error.message)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar isAuthenticated={false} />
      <div className="flex justify-center py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full lg:w-4/5 mx-auto">
            <div className="flex justify-center p-2">
              <img
                src="/public/assets/images/login.png"
                className=" h-auto object-contain"
                alt="Login illustration"
                width='90%'
              />
            </div>
            <div className="bg-gray-200 px-8 py-4 rounded-3xl">
              <h2 className="text-3xl font-sans mb-6">Login</h2>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-lg font-medium"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="Login-input w-full py-1 rounded-md border pl-2 text-lg focus:outline-none focus:ring-2 focus:ring-medium-rose"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-600 mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-lg font-medium"
                      >
                        Password
                      </label>
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        className="Login-input w-full py-1 rounded-md border pl-2 text-lg focus:outline-none focus:ring-2 focus:ring-medium-rose"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600 mt-1 text-sm"
                      />
                    </div>
                     {loading ? (
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
                        Login
                      </button>
                    )}
                  </Form>
                )}
              </Formik>
              <div className="mt-3">
                <GoogleSignInButton message="Login" />
              </div>
              <Link to="/forgot-password">
                <h4 className="text-center text-violet-950 font-semibold mt-4 cursor-pointer">
                  Forgot Password
                </h4>
              </Link>
              <h5 className="text-center mt-4">
                Don't have an account?{" "}
                <Link to="/">
                  <span className="text-violet-900 font-semibold">Signup</span>
                </Link>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
