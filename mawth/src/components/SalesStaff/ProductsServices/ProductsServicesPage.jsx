import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesStaffDropdown from '../profile/SalesStaffDropdown';
import { FaBox, FaClipboardList, FaTags } from 'react-icons/fa';

const ProductsServicesPage = () => {
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

  const handleAddProducts = () => {
    navigate('/sales/products-services/our-products/add');
  };

  const handleAddServices = () => {
    navigate('/sales/products-services/our-services/add');
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Products & Services</h1>
        <SalesStaffDropdown userData={userData} />
      </div>

      <div className="space-y-4">
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
          onClick={handleAddProducts}
        >
          <div className="bg-green-100 p-3 rounded-full">
            <FaBox className="text-green-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Add Products</h2>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
          onClick={handleAddServices}
        >
          <div className="bg-blue-100 p-3 rounded-full">
            <FaClipboardList className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Add Services</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsServicesPage;