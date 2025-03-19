import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPills,
  FaCashRegister,
  FaMoneyBillWave,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaMoneyCheck,
  FaReceipt
} from 'react-icons/fa';
import AdminDropdown from '../profile/AdminDropdown';

const SaleServicesPage = () => {
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

  const menuItems = [
    {
      icon: FaPills,
      title: 'Pharmacy Services',
      route: '/sales-services/pharmacy',
      color: 'text-green-600'
    },
    {
      icon: FaCashRegister,
      title: 'Sell Now',
      route: '/sales-services/sell-now',
      color: 'text-blue-600'
    },
    {
      icon: FaMoneyBillWave,
      title: 'Service Pay',
      route: '/sales-services/service-pay',
      color: 'text-purple-600'
    },
    {
      icon: FaShoppingCart,
      title: 'Produts/Item Sales',
      route: '/sales-services/product-sales',
      color: 'text-red-600'
    },
    {
      icon: FaFileInvoiceDollar,
      title: 'Services Payments',
      route: '/sales-services/services-payments',
      color: 'text-yellow-600'
    },
    {
      icon: FaMoneyCheck,
      title: 'Expenses',
      route: '/sales-services/expenses',
      color: 'text-gray-600'
    },
    {
      icon: FaReceipt,
      title: 'Search Invoice',
      route: '/sales-services/search-invoice',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Services</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-4"
            onClick={() => navigate(item.route)}
          >
            <item.icon className={`text-4xl ${item.color}`} />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
              <p className="text-gray-500">Manage {item.title.toLowerCase()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleServicesPage;