import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminDropdown from '../profile/AdminDropdown';

const ServicesPaymentsPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [servicePayments, setServicePayments] = useState([]);
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
        fetchServicePayments();
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

  const fetchServicePayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/service-payments');
      setServicePayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service payments:', error);
      setLoading(false);
    }
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(servicePayments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service Payments");
    XLSX.writeFile(workbook, "service_payments_export.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(servicePayments);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "service_payments_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    const tableColumn = ["S/N", "Invoice No.", "Amount", "Status", "Payment Mode", "Cashier", "Date"];
    const tableRows = servicePayments.map((payment, index) => [
      index + 1,
      payment.receipt_number,
      `₦${parseFloat(payment.total_amount).toLocaleString()}`,
      payment.payment_status,
      payment.payment_mode,
      payment.created_by,
      new Date(payment.created_at).toLocaleString()
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Services Payments Report", 14, 15);
    doc.save("service_payments_export.pdf");
  };

  // Filter payments based on search term
  const filteredPayments = servicePayments.filter(payment =>
    payment.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.payment_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (paymentId) => {
    // TODO: Implement view details functionality
    console.log('View details for service payment:', paymentId);
  };

  const handlePrintReceipt = (paymentId) => {
    // TODO: Implement print receipt functionality
    console.log('Print receipt for service payment:', paymentId);
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
        <h1 className="text-2xl font-bold text-gray-800">My Services Payments</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Export and Search Section */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(
                filteredPayments.map(payment =>
                  `${payment.receipt_number}\t${payment.total_amount}\t${payment.payment_status}\t${payment.payment_mode}\t${payment.created_by}\t${new Date(payment.created_at).toLocaleString()}`
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

        {/* Service Payments Table */}
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
              {filteredPayments.map((payment, index) => (
                <tr key={payment.payment_id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{payment.receipt_number}</td>
                  <td className="p-3">₦{parseFloat(payment.total_amount).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      payment.payment_status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="p-3">{payment.payment_mode}</td>
                  <td className="p-3">{payment.created_by}</td>
                  <td className="p-3">
                    {new Date(payment.created_at).toLocaleString('en-US', {
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
                      onClick={() => handleViewDetails(payment.payment_id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handlePrintReceipt(payment.payment_id)}
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

export default ServicesPaymentsPage;