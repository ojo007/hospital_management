import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDropdown from '../profile/AdminDropdown';

const SearchInvoicePage = () => {
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [invoiceType, setInvoiceType] = useState('product');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInvoiceDetails(null);
    setLoading(true);

    // Validate invoice number
    if (!invoiceNumber.trim()) {
      setError('Please enter an invoice number');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (invoiceType === 'product') {
        response = await axios.get(`http://127.0.0.1:8000/search-invoice/${invoiceNumber}`);
      } else {
        response = await axios.get(`http://127.0.0.1:8000/search-service-invoice/${invoiceNumber}`);
      }

      // Attach invoice type to the response data
      const invoiceData = {
        ...response.data,
        type: invoiceType
      };

      setInvoiceDetails(invoiceData);
      setLoading(false);
    } catch (err) {
      console.error('Error searching invoice:', err);
      setError(err.response?.data?.detail || 'Invoice not found');
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!invoiceDetails) return;

    try {
      // Create a popup window for the receipt
      const receiptWindow = window.open('', '_blank', 'width=400,height=600');

      if (receiptWindow) {
        // Generate receipt HTML
        receiptWindow.document.write(`
          <html>
            <head>
              <title>Invoice Receipt - ${invoiceDetails.receipt_number}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .receipt { width: 100%; max-width: 350px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .receipt-info { margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
                .items { margin-bottom: 15px; }
                .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .total { font-weight: bold; border-top: 1px solid #000; padding-top: 10px; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <div class="header">
                  <h2>MAWTH</h2>
                  <p>HEIGHTENS GENERAL VENTURES LTD</p>
                </div>

                <div class="receipt-info">
                  <p>Receipt No: ${invoiceDetails.receipt_number}</p>
                  <p>Date: ${new Date(invoiceDetails.created_at).toLocaleString()}</p>
                  <p>Payment Status: ${invoiceDetails.payment_status}</p>
                  <p>Payment Mode: ${invoiceDetails.payment_mode}</p>
                  ${invoiceDetails.type === 'product' ?
                    `<p>Cashier: ${invoiceDetails.created_by}</p>` :
                    `<p>Customer: ${invoiceDetails.customer_name}</p>`
                  }
                </div>

                <div class="items">
                  <h3>Items</h3>
                  ${invoiceDetails.items ? invoiceDetails.items.map(item => `
                    <div class="item">
                      <span>${item.name || item.service_name} x ${item.quantity}</span>
                      <span>₦${item.total.toFixed(2)}</span>
                    </div>
                  `).join('') : ''}
                </div>

                <div class="total">
                  <div class="item">
                    <span>TOTAL</span>
                    <span>₦${parseFloat(invoiceDetails.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                <div class="footer">
                  <p>Thank you for your business!</p>
                  <p>For inquiries, contact us at: info@mawth.com</p>
                </div>
              </div>
              <script>
                // Auto print when loaded
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
          </html>
        `);

        receiptWindow.document.close();
      } else {
        // If popup blocked, fallback to regular print
        window.print();
      }
    } catch (printError) {
      console.error("Error printing receipt:", printError);
      // Fallback to regular print
      window.print();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Search Invoice</h1>
        <AdminDropdown />
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="invoiceType" className="block text-sm font-bold text-gray-700 mb-2">
              Invoice Type
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="invoiceType"
                  value="product"
                  checked={invoiceType === 'product'}
                  onChange={() => setInvoiceType('product')}
                />
                <span className="ml-2">Product Sales</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="invoiceType"
                  value="service"
                  checked={invoiceType === 'service'}
                  onChange={() => setInvoiceType('service')}
                />
                <span className="ml-2">Service Payments</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-bold text-gray-700 mb-2">
              Invoice Number
            </label>
            <input
              id="invoiceNumber"
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="Enter invoice number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Submit'}
          </button>
        </form>

        {invoiceDetails && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            <div className="space-y-2">
              <p><strong>Receipt Number:</strong> {invoiceDetails.receipt_number}</p>
              <p><strong>Total Amount:</strong> ₦{parseFloat(invoiceDetails.total_amount).toLocaleString()}</p>
              <p><strong>Payment Status:</strong> {invoiceDetails.payment_status}</p>
              <p><strong>Payment Mode:</strong> {invoiceDetails.payment_mode}</p>

              {invoiceDetails.type === 'product' ? (
                <p><strong>Cashier:</strong> {invoiceDetails.created_by}</p>
              ) : (
                <p><strong>Customer:</strong> {invoiceDetails.customer_name}</p>
              )}

              <p><strong>Date:</strong> {new Date(invoiceDetails.created_at).toLocaleString()}</p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Items</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-right">Quantity</th>
                      <th className="border p-2 text-right">Unit Price</th>
                      <th className="border p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails.items && invoiceDetails.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.name || item.service_name}</td>
                        <td className="border p-2 text-right">{item.quantity}</td>
                        <td className="border p-2 text-right">₦{parseFloat(item.unit_price).toLocaleString()}</td>
                        <td className="border p-2 text-right">₦{parseFloat(item.total).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 space-x-4">
                <button
                  onClick={handlePrintReceipt}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInvoicePage;