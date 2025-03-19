import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaBriefcase, FaTags, FaClipboardList } from 'react-icons/fa';
import AdminDropdown from '../profile/AdminDropdown';

const ProductsServicesPage = () => {
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
        <h1 className="text-2xl font-bold text-gray-800">Products & Services</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
          onClick={() => navigate('/products-services/our-products')}
        >
          <FaBox className="text-4xl text-green-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Our Products</h2>
            <p className="text-gray-500">View and manage products</p>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
          onClick={() => navigate('/products-services/our-services')}
        >
          <FaClipboardList className="text-4xl text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Our Services</h2>
            <p className="text-gray-500">View and manage services</p>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
          onClick={() => navigate('/products-services/categories')}
        >
          <FaTags className="text-4xl text-purple-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Product Categories</h2>
            <p className="text-gray-500">Manage product categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsServicesPage;