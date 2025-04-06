'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://creditsea-backend-78oc.onrender.com/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.role === 'admin') router.push('/admin');
      else if (data.role === 'verifier') router.push('/verifier');
      else if (data.role === 'user') router.push('/user');
      else throw new Error('Unknown role');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white tracking-tight">
          Login to <span className="text-blue-500">CreditSea</span>
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
