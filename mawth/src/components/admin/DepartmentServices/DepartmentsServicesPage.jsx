import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxes } from 'react-icons/fa';
import AdminDropdown from '../profile/AdminDropdown';

const DepartmentsServicesPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
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
        <h1 className="text-2xl font-bold text-gray-800">Departments Services</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
          onClick={() => navigate('/departments-services/current-stock')}
        >
          <FaBoxes className="text-4xl text-green-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">View Current Stock</h2>
            <p className="text-gray-500">Check current inventory levels</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsServicesPage;