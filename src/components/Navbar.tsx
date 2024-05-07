"use client";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";


interface NavbarProps {
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const { data: session } = useSession();
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
     signOut();
  };
  const handleLogin = () => {
     router.push('/')
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow-lg px-6 py-3">
      <div className="flex items-center">
        <img src="/path/to/logo.png" alt="Logo" className="w-10 h-10 mr-4" />
        <span className="text-lg font-bold">Your Brand</span>
      </div>
      <div className="flex items-center">
        <div className="relative mr-4 cursor-pointer" onClick={toggleDropdown}>
          <div className="flex items-center hover:text-lg">
            <div className="mr-2">{username}</div>
            <svg
              className="fill-current text-gray-600 h-4 w-4 rotate-180 hover:text-lg hover:text-black"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 0l8 9H4l8-9zM6 11h12v2H6z" />
            </svg>
          </div>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <ul className="py-1">
                {session ? (
                <li
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
                ) : (
                    <li
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogin}
                >
                  Login
                </li>
                )}
              </ul>
            </div>
          )}
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Payment
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
