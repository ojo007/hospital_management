import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PharmacyServiceInvoice = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [paymentMode, setPaymentMode] = useState('CASH');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      item: 'Pharmacy Service',
      amount,
      name,
      paymentStatus,
      paymentMode
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Pharmacy Service Invoice
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item (Fixed) */}
          <div>
            <label
              htmlFor="item"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Item
            </label>
            <input
              type="text"
              value="Pharmacy Service"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
            />
          </div>

          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <div className="flex items-center">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="paymentStatus"
                  value="PAID"
                  checked={paymentStatus === 'PAID'}
                  onChange={() => setPaymentStatus('PAID')}
                />
                <span className="ml-2">PAID</span>
              </label>
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Mode
            </label>
            <div className="flex space-x-4">
              {['CASH', 'POS', 'TRANSFER'].map((mode) => (
                <label key={mode} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors font-semibold text-lg shadow-md mt-4"
          >
            Save & Print Receipt
          </button>
        </form>
      </div>
    </div>
  );
};

export default PharmacyServiceInvoice;