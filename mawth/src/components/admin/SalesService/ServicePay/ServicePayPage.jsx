import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import AdminDropdown from '../../profile/AdminDropdown';

const ServicePayPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // State variables for form
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [paymentStatus, setPaymentStatus] = useState('PAID');

  // Fetch services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/services');
        console.log('Fetched services:', response.data);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        fetchServices();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleAddService = () => {
    if (!selectedService) {
      alert('Please select a service');
      return;
    }

    const service = services.find(s => s.name === selectedService);
    if (!service) {
      alert('Service not found');
      return;
    }

    console.log('Selected service FULL OBJECT:', service);

    // Extract numeric price from string (e.g., "₦300" to 300)
    let unitPrice = service.price;
    if (typeof unitPrice === 'string') {
      unitPrice = parseFloat(unitPrice.replace(/[^\d.-]/g, ''));
    }

    // Ensure you have a service_id or id
    if (!service.service_id && !service.id) {
      alert('Service does not have a valid ID');
      return;
    }

    const newItem = {
      id: Date.now(), // Use timestamp as unique ID
      serviceId: service.service_id || service.id, // Use service_id or id
      name: service.name,
      quantity: parseInt(quantity),
      unitCost: unitPrice,
      total: parseInt(quantity) * unitPrice
    };

    console.log('Adding item to invoice:', newItem);
    setInvoiceItems([...invoiceItems, newItem]);

    // Reset form fields
    setSelectedService('');
    setQuantity(1);
  };

  const handleRemoveItem = (id) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => total + item.total, 0);
  };

  const handleSaveAndPrint = async () => {
    if (invoiceItems.length === 0) {
      alert('Please add at least one service to the invoice');
      return;
    }

    if (!customerName.trim()) {
      alert('Please enter a customer name');
      return;
    }

    try {
      // Prepare the invoice data
      const invoiceData = {
        items: invoiceItems.map(item => {
          console.log('Individual Item:', item); // Log each item
          return {
            service_id: item.serviceId,
            quantity: item.quantity,
            unit_price: item.unitCost,
            total: item.total
          };
        }),
        customer_name: customerName,
        payment_status: paymentStatus,
        payment_mode: paymentMode,
        total_amount: calculateTotal(),
        created_by: userData.email
      };

      console.log("FULL Sending service payment data:", invoiceData);

      // Send to backend to process the payment
      const response = await axios.post('http://127.0.0.1:8000/create-service-payment', invoiceData);

      console.log("Service payment response:", response.data);

      if (response.status === 200) {
        // Show success message
        alert(`Service payment completed successfully! Receipt Number: ${response.data.receipt_number}`);

        // Clear the invoice
        setInvoiceItems([]);
        setCustomerName('');

        // Handle receipt printing
        try {
          // Create a popup window for the receipt
          const receiptWindow = window.open('', '_blank', 'width=400,height=600');

          if (receiptWindow) {
            // Generate receipt HTML (your existing receipt generation code)
            receiptWindow.document.write(`
              <html>
                <head>
                  <title>Service Receipt - ${response.data.receipt_number}</title>
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
                      <p>Receipt No: ${response.data.receipt_number}</p>
                      <p>Date: ${new Date().toLocaleString()}</p>
                      <p>Customer: ${customerName}</p>
                      <p>Payment: ${paymentMode}</p>
                      <p>Status: ${paymentStatus}</p>
                    </div>

                    <div class="items">
                      <h3>Services</h3>
                      ${invoiceItems.map(item => `
                        <div class="item">
                          <span>${item.name} x ${item.quantity}</span>
                          <span>₦${item.total.toFixed(2)}</span>
                        </div>
                      `).join('')}
                    </div>

                    <div class="total">
                      <div class="item">
                        <span>TOTAL</span>
                        <span>₦${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <div class="footer">
                      <p>Thank you for choosing our services!</p>
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
      }
    } catch (error) {
      console.error('FULL Error object:', error.response);
      let errorMessage = 'Failed to process service payment. Please try again.';

      if (error.response && error.response.data) {
        errorMessage = error.response.data.detail || JSON.stringify(error.response.data);
      }

      alert(errorMessage);
    }
  };

  // Safety check if userData is not yet loaded
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
        <h1 className="text-2xl font-bold text-gray-800">Service Pay</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">New Invoice</h2>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
              Service:
            </label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option
                  key={service.service_id || service.id}
                  value={service.name}
                >
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              min="1"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={handleAddService}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
        >
          Add
        </button>

        {/* Invoice Table */}
        <table className="w-full mb-6 border-collapse border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left border">S/N</th>
              <th className="p-2 text-left border">Item</th>
              <th className="p-2 text-center border">Quantity</th>
              <th className="p-2 text-center border">Unit Cost</th>
              <th className="p-2 text-center border">Total</th>
              <th className="p-2 text-center border">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-2 text-center border">No items added yet</td>
              </tr>
            ) : (
              invoiceItems.map((item, index) => (
                <tr key={item.id} className="border">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 text-center border">{item.quantity}</td>
                  <td className="p-2 text-center border">₦{item.unitCost.toFixed(2)}</td>
                  <td className="p-2 text-center border">₦{item.total.toFixed(2)}</td>
                  <td className="p-2 text-center border">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800 bg-red-100 p-1 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
            {invoiceItems.length > 0 && (
              <tr>
                <td colSpan="4" className="p-2 text-right font-bold border">Total:</td>
                <td className="p-2 text-center font-bold text-red-600 border">₦{calculateTotal().toFixed(2)}</td>
                <td className="border"></td>
              </tr>
            )}
          </tbody>
        </table>

        {invoiceItems.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6 border p-4 rounded">
              <div>
                <h3 className="text-sm font-bold mb-2">Payment Status:</h3>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="paymentStatus"
                      value="PAID"
                      checked={paymentStatus === 'PAID'}
                      onChange={() => setPaymentStatus('PAID')}
                    />
                    <span className="ml-2 text-green-600">PAID</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-2">Mode of Payment:</h3>
                <div className="flex space-x-4">
                  {['CASH', 'POS', 'TRANSFER'].map((mode) => (
                    <label key={mode} className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="paymentMode"
                        value={mode}
                        checked={paymentMode === mode}
                        onChange={() => setPaymentMode(mode)}
                      />
                      <span className="ml-2">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveAndPrint}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            >
              Save & Print Receipt
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ServicePayPage;