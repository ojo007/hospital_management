import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDropdown from '../profile/AdminDropdown';

const AddDepartmentPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // User authentication check (similar to other pages)
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
  
    // Basic validation
    if (!departmentName.trim()) {
      setError('Department name is required');
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/create-department', {
        department_name: departmentName,
        department_description: departmentDescription,
        created_by: userData.email,  // Pass the logged-in user's email
        last_modified_by: userData.email  // Pass the logged-in user's email
      });
  
      setSuccess('Department created successfully');
  
      // Reset form
      setDepartmentName('');
      setDepartmentDescription('');
  
    } catch (err) {
      console.error('Department creation error:', err);
      setError(err.response?.data?.detail || 'Failed to create department');
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
        <h1 className="text-2xl font-bold text-gray-800">Create New Department</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="departmentName" className="block text-sm font-bold text-gray-700 mb-2">
              Department Name
            </label>
            <input
              id="departmentName"
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter Department Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="departmentDescription" className="block text-sm font-bold text-gray-700 mb-2">
              Department Description
            </label>
            <textarea
              id="departmentDescription"
              value={departmentDescription}
              onChange={(e) => setDepartmentDescription(e.target.value)}
              placeholder="Enter Department Description"
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
            Create Department
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentPage;