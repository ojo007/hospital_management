// AdminLayout.jsx
import React from 'react';
import Sidebar from '../admin/Sidebar'
import AdminDropdown from '../admin/profile/AdminDropdown';

export const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </div>
    </div>
  );
};