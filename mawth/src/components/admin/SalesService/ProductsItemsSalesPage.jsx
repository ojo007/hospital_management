import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminDropdown from '../profile/AdminDropdown';

const ProductsItemsSalesPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [sales, setSales] = useState([]);
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
        fetchSales();
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

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/sales');
      setSales(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setLoading(false);
    }
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, "sales_export.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "sales_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    const tableColumn = ["S/N", "Invoice No.", "Amount", "Status", "Payment Mode", "Cashier", "Date"];
    const tableRows = sales.map((sale, index) => [
      index + 1,
      sale.receipt_number,
      `₦${parseFloat(sale.total_amount).toLocaleString()}`,
      sale.payment_status,
      sale.payment_mode,
      sale.created_by,
      new Date(sale.created_at).toLocaleString()
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Products/Items Sales Report", 14, 15);
    doc.save("sales_export.pdf");
  };

  // Filter sales based on search term
  const filteredSales = sales.filter(sale =>
    sale.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.payment_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (saleId) => {
    // TODO: Implement view details functionality
    console.log('View details for sale:', saleId);
  };

  const handlePrintReceipt = (saleId) => {
    // TODO: Implement print receipt functionality
    console.log('Print receipt for sale:', saleId);
  };

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
        <h1 className="text-2xl font-bold text-gray-800">My Sales</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Export and Search Section */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(
                filteredSales.map(sale =>
                  `${sale.receipt_number}\t${sale.total_amount}\t${sale.payment_status}\t${sale.payment_mode}\t${sale.created_by}\t${new Date(sale.created_at).toLocaleString()}`
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

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Invoice No.</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment Mode</th>
                <th className="p-3 text-left">Cashier</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => (
                <tr key={sale.sale_id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{sale.receipt_number}</td>
                  <td className="p-3">₦{parseFloat(sale.total_amount).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      sale.payment_status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sale.payment_status}
                    </span>
                  </td>
                  <td className="p-3">{sale.payment_mode}</td>
                  <td className="p-3">{sale.created_by}</td>
                  <td className="p-3">
                    {new Date(sale.created_at).toLocaleString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(sale.sale_id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handlePrintReceipt(sale.sale_id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      Print Receipt
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

export default ProductsItemsSalesPage;