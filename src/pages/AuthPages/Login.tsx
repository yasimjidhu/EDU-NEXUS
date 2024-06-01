import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../components/authentication/Navbar";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Perform your Login logic here
      const response = await axios.post("/api/Login", formData);
      console.log(response.data);
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const responseGoogle = (response: string) => {
    console.log(response);
    // Handle Google sign-in response for Login
    // Extract user information from the response and perform Login
    const { profileObj } = response;
    setFormData({
      ...formData,
      username: profileObj.name,
      email: profileObj.email,
    });
    // You can also perform automatic form submission after setting formData
    // handleSubmit();
  };

  return (
    <>
      <Navbar />
      <div className=" flex justify-around">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-8">
              <img src="/public/assets/images/login-img.png" alt="" />
            </div>
            <div className="bg-gray-200 p-20 rounded-3xl">
              <h2 className="text-3xl font-sans">Login</h2>
              <form onSubmit={handleSubmit} className="mt-10">
                <div className="mb-4">
                  <label htmlFor="email" className="block w-full">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="Login-input w-full py-2 rounded-md border pl-2  text-lg focus:outline-none "
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block w-full">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="Login-input w-full py-2 rounded-md border pl-2  text-lg focus:outline-none "
                  />
                </div>
                <button
                  type="submit"
                  className="bg-prime-blue w-full py-3 text-xl text-white rounded-md "
                >
                  Login
                </button>
              </form>
              <h4 className="text-center mt-10 text-violet-950 font-semibold">
                Forgot Password
              </h4>
              {/* <div className=" flex justify-around p-5 mt-3">
                <div>
                  <GoogleLogin
                    className=""
                    clientId="62678914472-kp2rb8toqrpg72g3fii7kq6r0g83lchj.apps.googleusercontent.com"
                    buttonText="Sign up with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
                <div>
                  <GoogleLogin
                    className=""
                    clientId="62678914472-kp2rb8toqrpg72g3fii7kq6r0g83lchj.apps.googleusercontent.com"
                    buttonText="Sign up with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
              </div> */}
              <h5 className="text-center mt-8 ">
                don't have an account ?{" "}
                <Link to="/">
                  <span className="text-violet-900 font-semibold">
                    {" "}
                    Signup{" "}
                  </span>
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
