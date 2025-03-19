import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBuilding, FaBoxOpen, FaChartLine, FaClipboardList, FaFileAlt, FaCog } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar bg-white w-64 h-screen shadow-lg p-4 relative">
      <div
        className="sidebar-header text-center mb-8 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <img
          src="/loginlogo.png"
          alt="MAWTH Logo"
          className="mx-auto h-24 w-auto mb-6"
        />
      </div>
      <ul className="sidebar-nav space-y-2">
        <li className="group">
          <div
            className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            <FaTachometerAlt className="mr-4 text-lg group-hover:text-green-600" />
            <span className="text-base font-medium">Dashboard</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </li>
        <li className="group">
          <div
            className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => navigate('/manage-users')}
          >
            <FaUsers className="mr-4 text-lg group-hover:text-green-600" />
            <span className="text-base font-medium">Manage Users</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </li>
        <li className="group">
          <div
            className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => navigate('/manage-department')}
          >
            <FaBuilding className="mr-4 text-lg group-hover:text-green-600" />
            <span className="text-base font-medium">Manage Department</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </li>
        <li className="group">
          <div
            className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => navigate('/products-services')}
          >
            <FaBoxOpen className="mr-4 text-lg group-hover:text-green-600" />
            <span className="text-base font-medium">Products & Services</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </li>
        <li className="group">
          <div
            className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => navigate('/sales-services')}
          >
            <FaChartLine className="mr-4 text-lg group-hover:text-green-600" />
            <span className="text-base font-medium">Sales Services</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </li>
        <li className="group">
          <div
            className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => navigate('/departments-services')}
          >
            <FaClipboardList className="mr-4 text-lg group-hover:text-green-600" />
            <span className="text-base font-medium">Departments Services</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </li>
        <li className="group">
        <div
          className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
          onClick={() => navigate('/activity-logs')}
        >
          <FaCog className="mr-4 text-lg group-hover:text-green-600" />
          <span className="text-base font-medium">Activity Logs</span>
         </div>
        </li>
        <li className="group">
          <div
            className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => navigate('/reports')}
          >
            <FaFileAlt className="mr-4 text-lg group-hover:text-green-600" />
            <span className="text-base font-medium">Reports</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </li>
        <li className="group absolute bottom-0 left-0 right-0 px-4 pb-4 bg-white">
          <div className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer py-3 px-4 hover:bg-green-50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span className="text-base font-medium">Collapse</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;