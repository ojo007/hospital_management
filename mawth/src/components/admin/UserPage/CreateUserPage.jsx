import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDropdown from '../profile/AdminDropdown';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [createdByEmail, setCreatedByEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New state for departments
  const [departments, setDepartments] = useState([]);

  // Fetch departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/departments');
        // Transform department data and add a default option
        const departmentList = ['Select Department', ...response.data.map(dept => dept.department_name)];
        setDepartments(departmentList);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUserData = localStorage.getItem('userData');

    if (!storedUserData) {
      // No user data, redirect to login
      navigate('/');
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);

      // Additional validation if needed
      if (parsedUserData && parsedUserData.email) {
        setUserData(parsedUserData);
        setCreatedByEmail(parsedUserData.email);
      } else {
        // Invalid user data
        localStorage.removeItem('userData');
        navigate('/');
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data
      localStorage.removeItem('userData');
      navigate('/');
    }
  }, [navigate]);

  const userRoles = [
    'Select User Role',
    'ADMIN',
    'STORE OFFICER',
    'SALES POINT STAFF',
    'ACCOUNTANT'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate input fields
    if (!firstName || !lastName) {
      setError('Please enter both first and last name');
      return;
    }

    if (!email.endsWith('@mawth')) {
      setError('Email must end with @mawth');
      return;
    }

    if (role === 'Select User Role') {
      setError('Please select a user role');
      return;
    }

    if (department === 'Select Department') {
      setError('Please select a department');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      role,
      department,
      password,
      created_by: createdByEmail || 'system@mawth.com'
    };

    console.log('Sending user data:', userData);

    try {
      const response = await axios.post('http://127.0.0.1:8000/create-user', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess('User created successfully');

      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRole('');
      setDepartment('');
      setPassword('');

    } catch (err) {
      console.error('Full error object:', err);

      if (err.response) {
        // Handle different types of errors
        if (err.response.status === 422) {
          // Specifically handle validation errors
          const errorDetails = err.response.data;

          // Check if errorDetails is an array
          if (Array.isArray(errorDetails)) {
            const errorMessages = errorDetails.map(error =>
              `${error.loc ? error.loc[1] + ': ' : ''}${error.msg}`
            ).join(', ');

            setError(errorMessages);
          } else {
            // Fallback if the error format is unexpected
            setError('Validation failed. Please check your input.');
          }
        } else {
          // Other error responses
          setError(err.response.data.detail || 'Failed to create user');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error setting up the request: ' + err.message);
      }
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
        <h1 className="text-2xl font-bold text-gray-800">Create New User</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email (e.g., johndoe@mawth)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
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
            <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              {userRoles.map((userRole, index) => (
                <option key={index} value={userRole}>
                  {userRole}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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

export default CreateUserPage;