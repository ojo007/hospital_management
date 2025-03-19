import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesStaffDropdown from './profile/SalesStaffDropdown';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Staff Dashboard</h1>
        <SalesStaffDropdown userData={userData} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">TOTAL SALES THIS MONTH</h3>
          <p className="text-2xl font-bold text-gray-800">₦0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">TOTAL SALES TODAY</h3>
          <p className="text-2xl font-bold text-gray-800">₦0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">HOSPITAL SERVICES PAYMENT THIS MONTH</h3>
          <p className="text-2xl font-bold text-gray-800">₦9,500</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">HOSPITAL SERVICES PAYMENT TODAY</h3>
          <p className="text-2xl font-bold text-gray-800">₦0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">PHARMACY SERVICES PAYMENT THIS MONTH</h3>
          <p className="text-2xl font-bold text-gray-800">₦0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">PHARMACY SERVICES PAYMENT TODAY</h3>
          <p className="text-2xl font-bold text-gray-800">₦0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">TOTAL EXPENSES THIS MONTH</h3>
          <p className="text-2xl font-bold text-gray-800">₦0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">TOTAL EXPENSES THIS MONTH (PAYROLL)</h3>
          <p className="text-2xl font-bold text-gray-800">₦0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-blue-600 uppercase mb-2">TOTAL EXPENSES THIS MONTH (OTHERS)</h3>
          <p className="text-2xl font-bold text-gray-800">₦0</p>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        Copyright © HEIGHTENS GENERAL VENTURES LTD
      </div>
    </div>
  );
};

export default Dashboard;