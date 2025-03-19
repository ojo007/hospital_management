import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDropdown from './profile/AdminDropdown';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUserData = localStorage.getItem('userData');

    if (!storedUserData) {
      // No user data, redirect to login
      navigate('/');
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);

      // Additional validation if needed
      if (parsedUserData && parsedUserData.email) {
        setUserData(parsedUserData);
      } else {
        // Invalid user data
        localStorage.removeItem('userData');
        navigate('/');
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data
      localStorage.removeItem('userData');
      navigate('/');
    }
  }, [navigate]);

  // Safety check if userData is not yet loaded
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Function to render stat cards
  const renderStatCard = (title, value) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
        <span className="text-sm text-blue-600 uppercase mb-2">{title}</span>
        <span className="text-xl font-bold text-gray-800">{value}</span>
        <div className="mt-2 self-end opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-5 border border-gray-300 rounded-md shadow-sm focus:outline-none">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin page</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 mt-20">
        <div className="grid grid-cols-4 gap-4">
          {renderStatCard('TOTAL CASH INFLOW THIS MONTH', '₦0')}
          {renderStatCard('TOTAL CASH INFLOW TODAY', '₦0')}

          {renderStatCard('TOTAL HOSPITAL SERVICES PAYMENTS THIS MONTH', '₦0')}
          {renderStatCard('TOTAL HOSPITAL SERVICES PAYMENTS TODAY', '0')}
          {renderStatCard('TOTAL PHARMACY SERVICES PAYMENTS THIS MONTH', '₦0')}
          {renderStatCard('TOTAL PHARMACY SERVICES PAYMENTS TODAY', '₦0')}
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm mt-20 text-bold">
        Copyright © HEIGHTENS GENERAL VENTURES LTD
      </div>
    </div>
  );
};

export default Dashboard;