import React from 'react'
import { Link } from 'react-router-dom'
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <div className="flex justify-between dark:bg-[#2B2D3C]  flex-wrap shadow-inset-custom border-t-[0.1px] border-t-gray-200  py-4  bg-[#F1F1F3] min-h-full w-full ">
      {/* left side footer */}
      <div className="  gap-5 flex sm:gap-3  justify-start items-center text-xs sm:text-sm font-semibold ml-2 sm:ml-8 my-2 ">
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="/">Terms</Link>
        </div>
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="/">Privacy</Link>
        </div>
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="https://docs.aave.com/hub" target="_blank">
            Docs
          </Link> 
        </div>
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="https://docs.aave.com/faq" target="_blank">
            FAQS
          </Link>
        </div>
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="https://discord.com/invite/aave" target="_blank">
            Send Feedbacks
          </Link>
        </div>
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="/">Manage analytics</Link>
        </div>
      </div>

      {/* right side footer */}
      <div className="  flex justify-end items-center gap-4 ml-4 sm:ml-0 sm:mr-8    my-2">
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="https://x.com/aave" target="_blank">
            <FaTwitter size={20} />
          </Link>
        </div>
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="https://github.com/aave" target="_blank">
            <FaGithub size={20} />
          </Link>
        </div>
        <div className="text-gray-500 dark:hover:text-white hover:text-black">
          <Link to="https://discord.com/invite/aave" target="_blank">
            <FaDiscord size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer