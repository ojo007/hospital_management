import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUpload, FaTags, FaEye } from 'react-icons/fa';
import StoreOfficerDropdown from '../profile/StoreOfficerDropdown';

const ManageItemsPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Item(s)</h1>
        <StoreOfficerDropdown userData={userData} />
      </div>

      <div className="space-y-4">
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-green-50 flex items-center"
          onClick={() => navigate('/store/manage-items/add-new')}
        >
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FaPlus className="text-green-600 text-xl" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">Add New Item</h2>
            <p className="text-sm text-gray-500">Create a new item in the inventory</p>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-green-50 flex items-center"
          onClick={() => navigate('/store/manage-items/upload')}
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaUpload className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">Upload New Items</h2>
            <p className="text-sm text-gray-500">Upload multiple items via file</p>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-green-50 flex items-center"
          onClick={() => navigate('/store/manage-items/add-category')}
        >
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FaTags className="text-purple-600 text-xl" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">Add New Category</h2>
            <p className="text-sm text-gray-500">Create a new item category</p>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-green-50 flex items-center"
          onClick={() => navigate('/store/manage-items/view-categories')}
        >
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <FaEye className="text-indigo-600 text-xl" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">View Categories</h2>
            <p className="text-sm text-gray-500">Browse existing item categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageItemsPage;