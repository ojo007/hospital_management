import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesStaffDropdown from './profile/SalesStaffDropdown';

const SearchInvoicePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');

    if (!storedUserData) {
      navigate('/');
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData && parsedUserData.email) {
        setUserData(parsedUserData);
      } else {
        localStorage.removeItem('userData');
        navigate('/');
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem('userData');
      navigate('/');
    }
  }, [navigate]);

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
        <h1 className="text-2xl font-bold text-gray-800">Search Invoice</h1>
        <SalesStaffDropdown userData={userData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Search Invoice functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default SearchInvoicePage;