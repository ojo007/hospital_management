import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaListAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import StoreOfficerDropdown from './profile/StoreOfficerDropdown';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
    criticalProducts: 0
  });

  const [criticalItems, setCriticalItems] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/dashboard-stats');

        // Update state with fetched data
        setStats({
          totalProducts: response.data.total_products,
          totalCategories: response.data.total_categories,
          activeProducts: response.data.active_products,
          criticalProducts: response.data.critical_products.length
        });

        // Update critical items
        setCriticalItems(response.data.critical_products.map(item => ({
          id: item.product_id,
          name: item.name,
          weight: item.weight,
          category: item.category_name,
          quantity: item.quantity_in_stock,
          criticalLevel: item.critical_level,
          expiryDate: item.expiry_date
            ? new Date(item.expiry_date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            : 'N/A',
          lastAccessed: new Date(item.last_accessed).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        })));

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        fetchDashboardStats();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const StatCard = ({ title, value, icon: Icon, borderColor, textColor }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-sm font-semibold ${textColor} uppercase`}>{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${textColor} opacity-50`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  // If user data is not loaded, show a loading state
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Store Dashboard</h1>
        <StoreOfficerDropdown userData={userData} />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="TOTAL PRODUCT LIST"
          value={stats.totalProducts}
          icon={FaBox}
          borderColor="border-blue-500"
          textColor="text-blue-600"
        />
        <StatCard
          title="TOTAL CATEGORIES OF PRODUCT"
          value={stats.totalCategories}
          icon={FaListAlt}
          borderColor="border-blue-500"
          textColor="text-blue-600"
        />
        <StatCard
          title="TOTAL ACTIVE PRODUCTS"
          value={stats.activeProducts}
          icon={FaCheckCircle}
          borderColor="border-green-500"
          textColor="text-green-600"
        />
        <StatCard
          title="CRITICAL LEVEL PRODUCTS"
          value={stats.criticalProducts}
          icon={FaExclamationTriangle}
          borderColor="border-red-500"
          textColor="text-red-600"
        />
      </div>

      {/* Critical Items Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Items At Critical Level</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity in Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critical Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Accessed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {criticalItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-red-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-500">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.criticalLevel || ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.expiryDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.lastAccessed}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;