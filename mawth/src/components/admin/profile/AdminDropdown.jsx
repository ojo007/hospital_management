import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUserCircle,
  FaUserCog,
  FaCog,
  FaClipboardList,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminDropdown = ({ userData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
      try {
        // Get user data from local storage
        const userData = JSON.parse(localStorage.getItem('userData'));

        // Call logout endpoint
        await axios.post('http://127.0.0.1:8000/auth/logout', {
          email: userData.email
        });

        // Clear ALL user data from local storage
        localStorage.clear();

        // Redirect to the root/login page
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback logout
        localStorage.clear();
        navigate('/');
      }
    };

  const firstName = userData?.first_name || userData?.firstName || 'Admin';
  const firstLetter = firstName[0].toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
          {firstLetter}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-sm font-semibold text-gray-700 flex items-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
              {firstLetter}
            </div>
            {firstName}
          </div>
          <hr className="my-2" />

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => {
              // TODO: Implement profile page navigation
              navigate('/profile')
            }}
          >
            <FaUserCircle className="mr-3" /> Profile
          </button>

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => {
              // TODO: Implement settings page navigation
              console.log('Navigate to Settings');
            }}
          >
            <FaCog className="mr-3" /> Settings
          </button>

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => {
              // TODO: Implement activity log page navigation
              console.log('Navigate to Activity Log');
            }}
          >
            <FaClipboardList className="mr-3" /> Activity Log
          </button>

          <hr className="my-2" />

          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3" /> Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;