import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDropdown from '../profile/AdminDropdown';

const SalesReportPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users and departments on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');

    if (!storedUserData) {
      navigate('/');
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData && parsedUserData.email) {
        setUserData(parsedUserData);
        fetchUsersAndDepartments();
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

  const fetchUsersAndDepartments = async () => {
    try {
      // Fetch users
      const usersResponse = await axios.get('http://127.0.0.1:8000/users');
      const formattedUsers = usersResponse.data.map(user =>
        `${user.first_name} ${user.last_name} of ${user.department} DEPARTMENT`
      );
      setUsers(['Select Sales User', ...formattedUsers]);

      // Fetch departments
      const departmentsResponse = await axios.get('http://127.0.0.1:8000/departments');
      const formattedDepartments = departmentsResponse.data.map(dept => dept.department_name);
      setDepartments(['Select Department', ...formattedDepartments]);
    } catch (error) {
      console.error('Error fetching users and departments:', error);
    }
  };

  const handleGenerateReport = async () => {
    // Validate inputs
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError('');
    setSalesReport(null);

    try {
      // Prepare query parameters
      const params = {
        start_date: startDate,
        end_date: endDate,
        user: selectedUser === 'Select Sales User' ? null : selectedUser,
        department: selectedDepartment === 'Select Department' ? null : selectedDepartment
      };

      // Remove null values
      Object.keys(params).forEach(key => params[key] === null && delete params[key]);

      const response = await axios.get('http://127.0.0.1:8000/sales-report', { params });

      setSalesReport({
        dateRange: `Report generated from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
        summary: {
          totalTransactions: response.data.length,
          paidSales: response.data.filter(sale => sale.payment_status === 'PAID').length,
          totalSalesPaid: response.data
            .filter(sale => sale.payment_status === 'PAID')
            .reduce((total, sale) => total + parseFloat(sale.total_amount), 0),
          paymentMethods: {
            cash: response.data
              .filter(sale => sale.payment_mode === 'CASH' && sale.payment_status === 'PAID')
              .reduce((total, sale) => total + parseFloat(sale.total_amount), 0),
            pos: response.data
              .filter(sale => sale.payment_mode === 'POS' && sale.payment_status === 'PAID')
              .reduce((total, sale) => total + parseFloat(sale.total_amount), 0),
            bank: response.data
              .filter(sale => sale.payment_mode === 'TRANSFER' && sale.payment_status === 'PAID')
              .reduce((total, sale) => total + parseFloat(sale.total_amount), 0)
          }
        },
        details: response.data
      });
      setLoading(false);
    } catch (error) {
      console.error('Error generating sales report:', error);
      setError('Failed to generate sales report');
      setLoading(false);
    }
  };

  const resetReport = () => {
    setStartDate('');
    setEndDate('');
    setSelectedUser('Select Sales User');
    setSelectedDepartment('Select Department');
    setSalesReport(null);
    setError('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-2">From:</label>
            <input
              type="date"
              id="from-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-2">To:</label>
            <input
              type="date"
              id="to-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="staff-user" className="block text-sm font-medium text-gray-700 mb-2">Staff/User:</label>
            <select
              id="staff-user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {users.map((user, index) => (
                <option key={index} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Department:</label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          {salesReport && (
            <button
              onClick={resetReport}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear Report
            </button>
          )}
        </div>

        {error && (
          <div className="text-red-500 mt-4">{error}</div>
        )}
      </div>

      {salesReport && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-50 p-4 rounded-t-lg mb-6">
            <p className="text-blue-800 font-semibold">{salesReport.dateRange}</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm text-gray-600 uppercase mb-2">TOTAL TRANSACTIONS</h3>
              <p className="text-2xl font-bold">{salesReport.summary.totalTransactions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm text-gray-600 uppercase mb-2">NUMBER OF SALES (PAID)</h3>
              <p className="text-2xl font-bold">{salesReport.summary.paidSales}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm text-gray-600 uppercase mb-2">TOTAL SALES (PAID)</h3>
              <p className="text-2xl font-bold">₦{salesReport.summary.totalSalesPaid.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="text-sm text-green-600 uppercase mb-2">PAYMENT THROUGH CASH</h3>
              <p className="text-2xl font-bold text-green-800">₦{salesReport.summary.paymentMethods.cash.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="text-sm text-blue-600 uppercase mb-2">PAYMENT THROUGH POS</h3>
              <p className="text-2xl font-bold text-blue-800">₦{salesReport.summary.paymentMethods.pos.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <h3 className="text-sm text-yellow-600 uppercase mb-2">PAYMENT THROUGH BANK TRANSFER</h3>
              <p className="text-2xl font-bold text-yellow-800">₦{salesReport.summary.paymentMethods.bank.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReportPage;