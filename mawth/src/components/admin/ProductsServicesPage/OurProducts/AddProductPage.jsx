import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDropdown from '../../profile/AdminDropdown';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Medicine weight units dropdown
  const weightUnits = [
    'Select Unit',
    'mg',
    'g',
    'mcg',
    'ml',
    'L',
    'tabs',
    'capsules',
    'softgel',
    'suppository',
    'injection',
    'vial',
    'sachet'
  ];

  // New state variables
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // Add this line
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [weightUnit, setWeightUnit] = useState('Select Unit');
  const [weightValue, setWeightValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState('Active');
  const [criticalLevel, setCriticalLevel] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/product-categories');

        const formattedCategories = response.data.map(cat => ({
          id: cat.category_id,
          name: cat.category_name
        }));

        setCategories(formattedCategories);

        if (formattedCategories.length > 0) {
          setSelectedCategory(formattedCategories[0].name);
        }
      } catch (error) {
        console.error('Error fetching product categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // User authentication check
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation checks
    if (!productName.trim()) {
      setError('Product name is required');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a valid category');
      return;
    }

    if (!price.trim()) {
      setError('Price is required');
      return;
    }

    if (weightUnit === 'Select Unit') {
      setError('Please select a weight unit');
      return;
    }

    // Prepare product data
    const productData = {
      name: productName,
      category_name: selectedCategory,  // Change this line
      price: price,
      weight_value: parseFloat(weightValue),
      weight_unit: weightUnit,
      quantity: parseInt(quantity),
      expiry_date: expiryDate || null,
      status: status,
      critical_level: criticalLevel ? parseInt(criticalLevel) : null,
      description: description || null,
      created_by: userData.email
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/create-product', productData);

      setSuccess('Product created successfully');

      // Reset form fields
      setProductName('');
      setSelectedCategory(categories[0]?.name || '');
      setPrice('');
      setWeightUnit('Select Unit');
      setWeightValue('');
      setQuantity('');
      setExpiryDate('');
      setStatus('Active');
      setCriticalLevel('');
      setDescription('');

    } catch (err) {
      console.error('Full Error Response:', err.response);
      setError(err.response?.data?.detail || 'Failed to create product');
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
        <h1 className="text-2xl font-bold text-gray-800">Create New Product</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-bold text-gray-700 mb-2">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}  // Use selectedCategory instead of selectedCategoryId
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Weight and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weightUnit" className="block text-sm font-bold text-gray-700 mb-2">
                Weight Unit
              </label>
              <select
                id="weightUnit"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {weightUnits.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="weightValue" className="block text-sm font-bold text-gray-700 mb-2">
                Weight Value
              </label>
              <input
                id="weightValue"
                type="text"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                placeholder="Enter weight value"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Quantity and Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-bold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-bold text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">
              Price (₦)
            </label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Status and Critical Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label htmlFor="criticalLevel" className="block text-sm font-bold text-gray-700 mb-2">
                  Critical Level
                </label>
                <input
                  id="criticalLevel"
                  type="number"
                  value={criticalLevel}
                  onChange={(e) => setCriticalLevel(e.target.value)}
                  placeholder="Enter critical level"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows="4"
            />
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;