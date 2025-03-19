import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDropdown from './AdminDropdown';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
        setName(parsedUserData.first_name || 'admin');
        setEmail(parsedUserData.email);
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

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updateData = {
        email,
        first_name: name
      };

      const response = await axios.put('http://127.0.0.1:8000/update-profile', updateData);

      // Update local storage with new user data
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        first_name: name
      }));

      setSuccess('Profile updated successfully');
      setUserData(prevData => ({
        ...prevData,
        first_name: name
      }));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
      console.error('Profile update error:', err);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate password fields
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Prepare update data
    const updateData = {
      email,
      first_name: name,
      current_password: currentPassword,
      new_password: newPassword
    };

    // Log the payload for debugging
    console.log('Password Update Payload:', updateData);

    try {
      const response = await axios.put('http://127.0.0.1:8000/update-profile', updateData);

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setSuccess('Password updated successfully');
    } catch (err) {
      // Log full error response for debugging
      console.error('Full Error Response:', err.response);

      const errorMessage = err.response?.data?.detail || 'Failed to update password';
      setError(errorMessage);
      console.error('Password update error:', errorMessage);
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
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <AdminDropdown userData={userData} />
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Profile Information</h2>
          <p className="text-sm text-gray-500 mb-4">Update your account's profile information and email address.</p>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
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
              SAVE
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Update Password</h2>
          <p className="text-sm text-gray-500 mb-4">Ensure your account is using a long, random password to stay secure.</p>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-bold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-bold text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              SAVE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;