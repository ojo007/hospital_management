import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaBan, FaCheckCircle } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/users');

      // Transform data to ensure uppercase for name, role, and department
      const formattedUsers = response.data.map(user => ({
        ...user,
        first_name: user.first_name.toUpperCase(),
        last_name: user.last_name.toUpperCase(),
        role: user.role.toUpperCase(),
        department: user.department ? user.department.toUpperCase() : ''
      }));

      setUsers(formattedUsers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
      console.error('Error fetching users:', err);
    }
  };

  const handleAddNewUser = () => {
    navigate('/manage-users/add');
  };

  const handleEditUser = (email) => {
    // TODO: Implement edit user functionality
    console.log('Edit user:', email);
  };

  const handleToggleUserStatus = async (email, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';

      // TODO: Implement backend endpoint for status update
      await axios.put('http://127.0.0.1:8000/update-user-status', {
        email,
        status: newStatus
      });

      // Update local state
      setUsers(users.map(user =>
        user.email === email
          ? { ...user, status: newStatus }
          : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    }
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_export.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "users_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Phone", "Email", "Role", "Department", "Status"];
    const tableRows = users.map(user => [
      `${user.first_name} ${user.last_name}`,
      user.phone,
      user.email,
      user.role,
      user.department,
      user.status
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Users Report", 14, 15);
    doc.save("users_export.pdf");
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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
        <button
          onClick={handleAddNewUser}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Export and Search Section */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Copy to clipboard
                const userText = filteredUsers.map(user =>
                  `${user.first_name} ${user.last_name}, ${user.email}, ${user.role}, ${user.department}`
                ).join('\n');
                navigator.clipboard.writeText(userText);
              }}
              className="border px-3 py-1 rounded hover:bg-gray-100"
            >
              Copy
            </button>
            <button
              onClick={exportToExcel}
              className="border px-3 py-1 rounded hover:bg-gray-100"
            >
              Excel
            </button>
            <button
              onClick={exportToCSV}
              className="border px-3 py-1 rounded hover:bg-gray-100"
            >
              CSV
            </button>
            <button
              onClick={exportToPDF}
              className="border px-3 py-1 rounded hover:bg-gray-100"
            >
              PDF
            </button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-1 rounded w-64"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{`${user.first_name} ${user.last_name}`}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{user.department || 'N/A'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user.email)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user.email, user.status)}
                        className={user.status === 'Active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}
                        title={user.status === 'Active' ? 'Disable' : 'Enable'}
                      >
                        {user.status === 'Active' ? <FaBan /> : <FaCheckCircle />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewUsersPage;