import React, { useState } from "react";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { LuFileStack } from "react-icons/lu";
import { AiOutlineSwap } from "react-icons/ai";
import { FaRecycle } from "react-icons/fa";
import { MdOutlineMan3 } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { SiTicktick } from "react-icons/si";

import logo from "../assets/26.png";
import usdt from "../assets/usdt.svg";
function Profile() {
  const [selectedButton, setSelectedButton] = useState("buy");

  // Function to handle button click
  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };
  return (
    <div>
      {" "}
      <div class="bg-[#0d1b34] text-white min-h-screen flex flex-col">
        <div class="flex flex-col lg:flex-row flex-1 w-full  mx-auto">

          {/* <!-- Main Content --> */}
          <main class="flex-1 ">

            {/* <!-- Exchange Section --> */}

            <div className="p-6 flex flex-col">
              <h1 className="text-2xl mb-4">My Profile</h1>
              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0  lg:space-x-4">
                <div className="bg-[#1c2340] p-4 lg:w-1/2 rounded-xl">
                  <div className="border-b border-gray-900 mb-4">
                    <button className="pb-2 border-b-2 border-yellow-500">
                      Personal Info
                    </button>
                    <button className="ml-4 pb-2">Change Password</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-xl"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Email Id</label>
                      <input
                        type="email"
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-xl"
                        placeholder="Email"
                      />
                      <p className="text-red-500 text-sm">Email is required</p>
                    </div>
                    <div className="flex items-center justify-center">
                      {" "}
                      <button className="bg-[#c18c2e] text-white whitespace-nowrap font-semibold px-4 py-2 rounded-2xl">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 flex flex-col space-y-4">
                  <div className="bg-[#1c2340]  p-4 rounded-xl">
                    <h2 className="mb-2 text-center">Wallet Address</h2>
                    <hr className="border-b border-gray-900 mb-3" />
                    <input
                      type="text"
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-xl"
                      placeholder="Address"
                    />
                    <p className="mt-2 text-center">Ethereum</p>
                  </div>
                  <div className="bg-[#1c2340]  p-4 rounded-xl">
                    <h2 className="text-center">KYC Status</h2>
                    <hr className="border-b border-gray-900 mt-2 mb-3" />
                    <div className="flex items-center justify-center gap-2">
                      {" "}
                      <SiTicktick className="text-green-500  text-lg" />
                      <p className="text-green-500 font-medium ">
                        KYC verification is pending
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;
