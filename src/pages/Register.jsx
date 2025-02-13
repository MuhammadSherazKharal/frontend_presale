import React from "react";
import logo from "../assets/26.png";
import { Link } from "react-router-dom";
const Register = () => {
  return (
    <div className="flex flex-col gap-12  items-center justify-center  min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Circles */}
      {/* <div className="fixed lg:block hidden top-4 left-96 w-40 h-40 bg-yellow-500 rounded-full opacity-75 blur-lg"></div>
      <div className="fixed lg:block hidden bottom-4 right-96 w-40 h-40 bg-yellow-500 rounded-full opacity-75 "></div> */}
      <div className="">
        {" "}
        <img src={logo} alt="Logo" class="rounded-full md:absolute md:top-2 md:left-0 h-24" />
      </div>
      {/* Form Container */}
      <div className="bg-gray-800/30 backdrop-blur-md p-8  rounded-lg shadow-lg w-full max-w-md z-10 border border-white/20">
        <h2 className="text-center text-2xl font-semibold mb-6 text-white">
          Register
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email Id</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                👁️
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
