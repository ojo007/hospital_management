import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Role-based redirect paths
  const ROLE_REDIRECTS = {
    'ADMIN': '/admin-dashboard',
    'STORE OFFICER': '/store/dashboard',
    'SALES POINT STAFF': '/sales/dashboard',
    'ACCOUNTANT': '/accounts/dashboard'
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    console.log("Initial userData check:", userData);

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        console.log("Parsed userData:", parsedData);

        if (parsedData && parsedData.email) {
          // Redirect based on role
          const role = parsedData.role || 'ADMIN'; // Default to ADMIN if no role
          const redirectPath = ROLE_REDIRECTS[role] || '/';
          console.log("Redirecting to:", redirectPath, "for role:", role);
          navigate(redirectPath);
        }
      } catch (error) {
        console.error("Error parsing userData:", error);
        localStorage.removeItem('userData');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@mawth$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format. Must end with @mawth');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const loginPayload = {
      email,
      password,
    };

    console.log("Attempting login with:", loginPayload);

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", loginPayload);
      console.log("Login response:", response.data);

      if (response.status === 200 && response.data) {
        // Add role if not present in response
        const userData = {
          ...response.data,
          role: response.data.role || 'ADMIN' // Default to ADMIN if no role
        };

        console.log("Storing userData:", userData);
        localStorage.setItem('userData', JSON.stringify(userData));

        setSuccess("Login successful");

        // Get redirect path based on role
        const redirectPath = ROLE_REDIRECTS[userData.role] || '/';
        console.log("Redirecting to:", redirectPath, "for role:", userData.role);

        // Add a small delay to ensure state updates are complete
        setTimeout(() => {
          navigate(redirectPath);
        }, 100);
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Full Error Response:", err.response);

      if (err.response) {
        if (err.response.data.detail === "Invalid email or password") {
          setError("Invalid email or password");
        } else {
          setError(err.response.data.detail || "Login failed");
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred during login");
      }
    }
  };

  // Rest of your component remains the same...
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <img
          src="/loginlogo.png"
          alt="MAWTH Logo"
          className="h-80 w-100"
        />
      </div>

      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-lg shadow-md border-2 border-black">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
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
            LOG IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;