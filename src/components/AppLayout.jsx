import { useEffect, useState } from "react";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { LuFileStack } from "react-icons/lu";
import { AiOutlineSwap } from "react-icons/ai";
import { FaRecycle } from "react-icons/fa";
import { MdOutlineMan3 } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { inherits } from 'util';
import { useWallet } from "../context/WalletConnection";


import logo from "../assets/26.png";
// import usdt from "../assets/usdt.svg";
import { Link, Outlet } from "react-router-dom";
import { ethers } from "ethers";
import Web3Modal, { injected } from "web3modal";
function AppLayout() {
  const [selectedButton, setSelectedButton] = useState("buy");
  // const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletOptionsVisible, setWalletOptionsVisible] = useState(false);
  const { account, connectWallet, disconnectWallet, shortenAddress, loading } = useWallet();

  const toggleWalletOptions = () => {
    setWalletOptionsVisible(!walletOptionsVisible);
  };
  const handleWalletSelect = (walletName) => {
    setSelectedWallet(walletName);
    connectWallet(walletName);
    setWalletOptionsVisible(false);
  };
  // Function to handle button click
  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };
  return (
    <div>
      {" "}
      <div className="bg-[#0d1b34] text-white min-h-screen flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1 w-full  mx-auto">
          {/* <!-- Sidebar --> */}
          <aside className="lg:w-[260px] bg-[#1c2340]   flex-col py-6 lg:py-4 px-4 flex lg:flex">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <img src={logo} alt="Logo" className="rounded-full  h-24" />
              {/* <span className="text-xl font-bold text-[#f5cd63]">
                Angels & Dragons
              </span> */}
            </div>
            <nav className="flex-1  justify-center flex flex-col space-y-6">
              <Link
                to={"/"}
                className="flex items-center text-[#e0e3ea] hover:text-white space-x-3"
              >
                <RiDashboardHorizontalFill />

                <span>Dashboard</span>
              </Link>
              <Link
                to={"/stake"}
                className="flex items-center  text-[#e0e3ea] hover:text-white space-x-3"
              >
                <LuFileStack />

                <span>Sell</span>
              </Link>
              <Link
                to={"/swap"}
                className="flex items-center text-[#e0e3ea] hover:text-white space-x-3"
              >
                <AiOutlineSwap />

                <span>Purchase</span>
              </Link>
              <Link
                to={"/presale"}
                className="flex items-center text-[#e0e3ea] hover:text-white space-x-3"
              >
                <AiOutlineSwap />

                <span>Presale</span>
              </Link>
              <Link
                to={"/sepa"}
                className="flex items-center text-[#e0e3ea] hover:text-white space-x-3"
              >
                <FaRecycle />

                <span>SEPA</span>
              </Link>
              <Link
                to={"/profile"}
                className="flex items-center text-[#e0e3ea] hover:text-white space-x-3"
              >
                <MdOutlineMan3 />

                <span>Profile Setting</span>
              </Link>
            </nav>
            <Link
              to={"/login"}
              className="flex items-center text-[#e0e3ea] hover:text-white space-x-3 mt-8 lg:mt-auto"
            >
              <span>Logout</span>
              <IoIosArrowForward />
            </Link>
          </aside>

          {/* <!-- Main Content --> */}
          <main className="flex-1 ">
            {/* <!-- Header --> */}
            <header className="flex  bg-[#141833]  py-6 border-b-[0.1px] border-b-gray-600 justify-between items-center mb-6">
              <div className="flex items-center ml-6">
                <button className="text-white">
                  <MdMenu size={20} />
                </button>
              </div>
              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 items-center space-x-4">
                <span className=" mr-4 lg:mr-0 text-sm text-[#e0e3ea]">
                  KYC verification is pending!{" "}
                  <a href="#" className="text-[#5c93d3] underline">
                    Verify
                  </a>
                </span>
                <div className="relative">
                  <button
                    className="bg-[#d4a440] hover:bg-[#e4bf5c] text-white py-2 px-4 rounded-full"
                    onClick={toggleWalletOptions}
                  >
                    {account
                      ? `Connected: ${shortenAddress(account)}`
                      : "Connect Wallet"}
                    <IoIosArrowDown className="inline ml-2" />
                  </button>
                  {walletOptionsVisible && (
                    <div className="absolute bg-white text-black rounded shadow mt-2">
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleWalletSelect("injected")}
                      >
                        MetaMask
                      </div>
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleWalletSelect("walletconnect")}
                      >
                        WalletConnect
                      </div>
                      <div
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleWalletSelect("coinbasewallet")}
                      >
                        Coinbase Wallet
                      </div>
                    </div>
                  )}
                </div>
                <button className="border border-[#d4a440] text-[#5c93d3] py-2 px-4 rounded-full">
                  KYC Application
                </button>
                <div className="flex items-center gap-1 pr-4">
                  {" "}
                  <IoPersonSharp />
                  <IoIosArrowDown size={15} />
                </div>
              </div>
            </header>

            <Outlet />
            {/* Add element to here */}

          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
