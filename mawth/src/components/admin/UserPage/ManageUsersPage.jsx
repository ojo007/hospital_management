import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUsers } from 'react-icons/fa';
import AdminDropdown from '../profile/AdminDropdown';

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
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
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
          onClick={() => navigate('/manage-users/add')}
        >
          <FaUserPlus className="text-4xl text-green-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Add User</h2>
            <p className="text-gray-500">Create a new user account</p>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
          onClick={() => navigate('/manage-users/view')}
        >
          <FaUsers className="text-4xl text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">View Users</h2>
            <p className="text-gray-500">View and manage existing users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;