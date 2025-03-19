import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDropdown from '../../profile/AdminDropdown';

const AddServicePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [department, setDepartment] = useState('Select Department');
  const [serviceCost, setServiceCost] = useState('');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments, setDepartments] = useState([]);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/departments');
        setDepartments(['Select Department', ...response.data.map(dept => dept.department_name)]);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };

    fetchDepartments();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!serviceName.trim()) {
      setError('Service name is required');
      return;
    }

    if (department === 'Select Department') {
      setError('Please select a department');
      return;
    }

    const serviceData = {
      name: serviceName,
      department,
      price: serviceCost,
      status,
      description,
      created_by: userData.email
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/create-service', serviceData);

      setSuccess('Service created successfully');

      // Reset form
      setServiceName('');
      setDepartment('Select Department');
      setServiceCost('');
      setStatus('Active');
      setDescription('');

    } catch (err) {
      console.error('Service creation error:', err);
      setError(err.response?.data?.detail || 'Failed to create service');
    }
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
        <h1 className="text-2xl font-bold text-gray-800">Create New Service</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceName" className="block text-sm font-bold text-gray-700 mb-2">
              Services Title
            </label>
            <input
              id="serviceName"
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Enter Title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-bold text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="serviceCost" className="block text-sm font-bold text-gray-700 mb-2">
              Service Cost (₦)
            </label>
            <input
              id="serviceCost"
              type="text"
              value={serviceCost}
              onChange={(e) => setServiceCost(e.target.value)}
              placeholder="Enter Service Cost"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

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
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Service Description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows="4"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

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

export default AddServicePage;