import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaTools,
  FaSearch,
  FaShoppingCart,
  FaClipboardList,
  FaPills,
  FaFileAlt,
  FaChartLine
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: FaTachometerAlt,
      text: 'Dashboard',
      path: '/sales/dashboard'
    },
    {
      icon: FaTools,
      text: 'Products & Services',
      path: '/sales/products-services'
    },
    {
      icon: FaSearch,
      text: 'Search Invoice',
      path: '/sales/search-invoice'
    },
    {
      icon: FaShoppingCart,
      text: 'Sell Now',
      path: '/sales/sell-now'
    },
    {
      icon: FaClipboardList,
      text: 'Service Pay',
      path: '/sales/service-pay'
    },
    {
      icon: FaPills,
      text: 'Pharmacy Services',
      path: '/sales/pharmacy-services'
    },
    {
      icon: FaFileAlt,
      text: 'Products/Items Sales',
      path: '/sales/products-items-sales'
    },
    {
      icon: FaClipboardList,
      text: 'Services Payments',
      path: '/sales/services-payments'
    },
    {
      icon: FaChartLine,
      text: 'Reports',
      path: '/sales/reports'
    }
  ];

  return (
    <div className="sidebar bg-white w-64 h-screen shadow-lg p-4 relative">
      <div
        className="sidebar-header text-center mb-8 cursor-pointer"
        onClick={() => navigate('/sales/dashboard')}
      >
        <img
          src="/loginlogo.png"
          alt="MAWTH Logo"
          className="mx-auto h-24 w-auto mb-6"
        />
      </div>
      <ul className="sidebar-nav space-y-2">
        {menuItems.map((item, index) => (
          <li key={index} className="group">
            <div
              className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-4 text-lg group-hover:text-green-600" />
              <span className="text-base font-medium">{item.text}</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;