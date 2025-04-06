import { useState } from 'react';

export default function CreateAdminPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://creditsea-backend-78oc.onrender.com/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, role: 'admin' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create admin');
      }

      setMessage('✅ Admin created successfully!');
      setForm({ name: '', email: '', password: '' });
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Create Admin</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Create Admin
        </button>

        {message && (
          <div className="mt-4 text-center text-sm font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
