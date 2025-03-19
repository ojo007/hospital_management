import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewDepartmentsPage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/departments');

      // Transform data to ensure uppercase
      const formattedDepartments = response.data.map(dept => ({
        ...dept,
        department_name: dept.department_name.toUpperCase(),
        department_description: dept.department_description.toUpperCase()
      }));

      setDepartments(formattedDepartments);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch departments');
      setLoading(false);
      console.error('Error fetching departments:', err);
    }
  };

  const handleAddNewDepartment = () => {
    navigate('/manage-department/add');
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(departments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");
    XLSX.writeFile(workbook, "departments_export.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(departments);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "departments_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["S/N", "Department Name", "Department Description"];
    const tableRows = departments.map((dept, index) => [
      index + 1,
      dept.department_name,
      dept.department_description
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Departments Report", 14, 15);
    doc.save("departments_export.pdf");
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept =>
    dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.department_description.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-800">Manage Departments</h1>
        <button
          onClick={handleAddNewDepartment}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          Add New Department
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Export and Search Section */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Copy to clipboard
                const departmentText = filteredDepartments.map(dept =>
                  `${dept.department_name}, ${dept.department_description}`
                ).join('\n');
                navigator.clipboard.writeText(departmentText);
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

        {/* Departments Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Department Name</th>
                <th className="p-3 text-left">Department Description</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{dept.department_name}</td>
                  <td className="p-3">{dept.department_description}</td>
                  <td className="p-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        console.log('Edit department:', dept);
                      }}
                    >
                      <FaEdit />
                    </button>
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

export default ViewDepartmentsPage;