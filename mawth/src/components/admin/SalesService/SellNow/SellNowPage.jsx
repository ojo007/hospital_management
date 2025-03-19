import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import AdminDropdown from '../../profile/AdminDropdown';

const SellNowPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [paymentStatus, setPaymentStatus] = useState('NOT PAID');
  // Add a state variable to track reserved quantities
  const [reservedQuantities, setReservedQuantities] = useState({});

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        fetchProducts();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Function to get available quantity for a product
  const getAvailableQuantity = (product) => {
    const productId = product.product_id || product.id;
    const reserved = reservedQuantities[productId] || 0;
    return product.quantity - reserved;
  };

  // Function to format product display string with adjusted stock count
  const formatProductOption = (product) => {
    const availableQuantity = getAvailableQuantity(product);
    return `${product.name} ${product.weight || ''} (${availableQuantity} in stock)`;
  };

  const handleAddItem = () => {
    if (!selectedProduct || !quantity) return;

    // Extract product ID from the selected option string
    const selectedProductName = selectedProduct.split(' (')[0].trim();
    const product = products.find(p => {
      const productDisplayName = `${p.name} ${p.weight || ''}`.trim();
      return productDisplayName === selectedProductName;
    });

    if (!product) return;

    const productId = product.product_id || product.id;
    const quantityNum = parseInt(quantity);

    // Check if quantity is valid
    if (quantityNum <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    // Check if enough stock is available
    const availableQuantity = getAvailableQuantity(product);
    if (quantityNum > availableQuantity) {
      alert(`Only ${availableQuantity} units available in stock`);
      return;
    }

    const newItem = {
      id: Date.now(), // Use timestamp as unique ID
      productId: productId,
      name: product.name,
      quantity: quantityNum,
      unitCost: parseFloat(product.price),
      total: quantityNum * parseFloat(product.price)
    };

    setInvoiceItems([...invoiceItems, newItem]);

    // Update reserved quantities
    setReservedQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantityNum
    }));

    // Reset selection
    setSelectedProduct('');
    setQuantity('');
  };

  const handleRemoveItem = (itemToRemove) => {
    // Get the item to be removed
    const item = invoiceItems.find(item => item.id === itemToRemove);

    if (item) {
      // Update reserved quantities by reducing the reserved amount
      setReservedQuantities(prev => ({
        ...prev,
        [item.productId]: Math.max(0, (prev[item.productId] || 0) - item.quantity)
      }));
    }

    // Remove item from invoice
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemToRemove));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => total + item.total, 0);
  };

  const handleSaveAndPrint = async () => {
  if (invoiceItems.length === 0) {
    alert('Please add at least one item to the invoice');
    return;
  }

  try {
    // Show loading indicator or disable button if you have one
    // setIsSubmitting(true);

    // Prepare the invoice data
    const invoiceData = {
      items: invoiceItems.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitCost,
        total: item.total
      })),
      payment_status: paymentStatus,
      payment_mode: paymentMode,
      total_amount: calculateTotal(),
      created_by: userData.email
    };

    console.log("Sending sale data:", invoiceData);

    // Send to backend to process the sale
    const response = await axios.post('http://127.0.0.1:8000/create-sale', invoiceData);

    console.log("Sale response:", response.data);

    if (response.status === 200) {
      // Show success message
      alert(`Sale completed successfully! Receipt Number: ${response.data.receipt_number}`);

      // Clear the invoice
      setInvoiceItems([]);
      setReservedQuantities({});

      // Refresh product data to get updated stock counts
      const refreshResponse = await axios.get('http://127.0.0.1:8000/products');
      setProducts(refreshResponse.data);

      // Handle receipt printing
      try {
        // Create a popup window for the receipt
        const receiptWindow = window.open('', '_blank', 'width=400,height=600');

        if (receiptWindow) {
          // Generate receipt HTML
          receiptWindow.document.write(`
            <html>
              <head>
                <title>Sales Receipt - ${response.data.receipt_number}</title>
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
                    <p>Payment: ${paymentMode}</p>
                    <p>Status: ${paymentStatus}</p>
                  </div>

                  <div class="items">
                    <h3>Items</h3>
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
                    <p>Thank you for your business!</p>
                    <p>For inquiries, contact us at: info@mawth.com</p>
                  </div>
                </div>
                <script>
                  // Auto print when loaded
                  window.onload = function() {
                    window.print();
                    // Close the window after printing (optional)
                    // setTimeout(function() { window.close(); }, 500);
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

      // Optionally, you could redirect to a receipt page or reset the form
      // navigate('/sales-services');
    }
  } catch (error) {
    console.error('Error saving sale:', error);
    let errorMessage = 'Failed to process sale. Please try again.';

    if (error.response && error.response.data) {
      errorMessage = error.response.data.detail || errorMessage;
    }

    alert(errorMessage);
  } finally {
    // Hide loading indicator if you have one
    // setIsSubmitting(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Sell Now</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="item" className="block text-sm font-bold text-gray-700 mb-2">
              Item:
            </label>
            <select
              id="item"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Item</option>
              {products.map((product, index) => (
                <option
                  key={index}
                  value={formatProductOption(product)}
                  disabled={getAvailableQuantity(product) <= 0}
                >
                  {formatProductOption(product)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-bold text-gray-700 mb-2">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
        >
          Add
        </button>

        {/* Invoice Table */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">S/N</th>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Unit Cost</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">₦{item.unitCost.toFixed(2)}</td>
                <td className="p-2">₦{item.total.toFixed(2)}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoiceItems.length > 0 && (
          <div className="mb-6">
            <div className="text-right font-bold text-xl">
              Total: ₦{calculateTotal().toFixed(2)}
            </div>
          </div>
        )}

        {invoiceItems.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-bold mb-2">Payment Status</h3>
              <div className="flex space-x-4">
                {['PAID', 'NOT PAID'].map((status) => (
                  <label key={status} className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="paymentStatus"
                      value={status}
                      checked={paymentStatus === status}
                      onChange={() => setPaymentStatus(status)}
                    />
                    <span className="ml-2">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2">Payment Mode</h3>
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
        )}

        {invoiceItems.length > 0 && (
          <button
            onClick={handleSaveAndPrint}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Save & Print Receipt
          </button>
        )}
      </div>
    </div>
  );
};

export default SellNowPage;