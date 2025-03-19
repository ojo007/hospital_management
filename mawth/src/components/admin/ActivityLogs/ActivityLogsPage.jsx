import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminDropdown from '../profile/AdminDropdown';

const ActivityLogsPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

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
        fetchActivityLogs();
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

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/activity-logs');
      console.log('Fetched Activity Logs:', response.data);
      setActivityLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setError('Failed to fetch activity logs');
      setLoading(false);
    }
  };

  const filteredLogs = activityLogs.filter(log => {
    if (!log) return false;

    const searchTermLower = searchTerm.toLowerCase();

    return (
      (log.name && log.name.toLowerCase().includes(searchTermLower)) ||
      (log.email && log.email.toLowerCase().includes(searchTermLower)) ||
      (log.activity_type && log.activity_type.toLowerCase().includes(searchTermLower))
    );
  });

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Logs");
    XLSX.writeFile(workbook, "activity_logs_export.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLogs);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "activity_logs_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    const tableColumn = ["S/N", "Name", "Email", "Activity", "IP Address", "Device", "Role", "Date"];
    const tableRows = filteredLogs.map((log, index) => [
      index + 1,
      log.name || 'N/A',
      log.email || 'N/A',
      log.activity_type || 'N/A',
      log.ip_address || 'N/A',
      log.device_type || 'N/A',
      log.user_role || 'N/A',
      log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Activity Logs Report", 14, 15);
    doc.save("activity_logs_export.pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(
                filteredLogs.map(log =>
                  `${log.name || ''}\t${log.email || ''}\t${log.activity_type || ''}\t${log.device_type || ''}\t${new Date(log.created_at).toLocaleString()}`
                ).join('\n')
              )}
              className="border px-3 py-1 rounded hover:bg-gray-100"
            >
              Copy
            </button>
            <button onClick={exportToExcel} className="border px-3 py-1 rounded hover:bg-gray-100">Excel</button>
            <button onClick={exportToCSV} className="border px-3 py-1 rounded hover:bg-gray-100">CSV</button>
            <button onClick={exportToPDF} className="border px-3 py-1 rounded hover:bg-gray-100">PDF</button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-1 rounded w-64"
          />
        </div>

        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left">S/N</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Activity</th>
                  <th className="p-3 text-left">IP Address</th>
                  <th className="p-3 text-left">Device</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={log.log_id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{log.name || 'N/A'}</td>
                    <td className="p-3">{log.email || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.activity_type === 'Login'
                          ? 'bg-green-100 text-green-800'
                          : log.activity_type === 'Logout'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.activity_type || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3">{log.ip_address || 'N/A'}</td>
                    <td className="p-3">{log.device_type || 'N/A'}</td>
                    <td className="p-3">{log.user_role || 'N/A'}</td>
                    <td className="p-3">
                      {log.created_at
                        ? new Date(log.created_at).toLocaleString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })
                        : 'N/A'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No activity logs found
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;