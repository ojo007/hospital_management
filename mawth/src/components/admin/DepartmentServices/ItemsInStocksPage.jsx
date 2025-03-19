import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminDropdown from '../profile/AdminDropdown';

const ItemsInStocksPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        fetchStockItems();
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

  const fetchStockItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/current-stock');
      setStockItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stock items:', error);
      setLoading(false);
    }
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(stockItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Current Stock");
    XLSX.writeFile(workbook, "current_stock_export.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(stockItems);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "current_stock_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    const tableColumn = ["S/N", "Item Name", "Quantity in Stock"];
    const tableRows = stockItems.map((item, index) => [
      index + 1,
      item.name,
      item.quantity_in_stock
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Current Stock Report", 14, 15);
    doc.save("current_stock_export.pdf");
  };

  // Filter items based on search term
  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-800">Items in Stocks</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Export and Search Section */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(
                filteredItems.map(item =>
                  `${item.name}\t${item.quantity_in_stock}`
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

        {/* Stock Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Item Name</th>
                <th className="p-3 text-left">Quantity in Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.quantity_in_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsInStocksPage;