import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface LoanApplication {
  _id: string;
  fullName: string;
  reason: string;
  status: string;
  createdAt: string;
  employmentStatus: string;
  amount: number;
}

interface User {
  _id: string;
  name: string;
  role: string;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  const router = useRouter();

  const goToCreateAdmin = () => {
    router.push('/create.admin');
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/applications/');
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'verified' ? 'approve' : 'pending';

    try {
      const response = await fetch(`http://localhost:5000/applications/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          role: 'admin',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating status:', errorData.message);
        return;
      }

      const updatedApp = await response.json();

      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: updatedApp.status } : app))
      );
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const deleteAdmin = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:5000/users/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ byAdmin: true }),
          });
          
      if (!response.ok) {
        const err = await response.json();
        console.error('Failed to delete admin:', err.message);
        return;
      }

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Delete admin error:', error);
    }
  };

  const totalLoans = applications.length;
  const totalBorrowers = new Set(applications.map((app) => app.fullName)).size;
  const totalCashDisbursed = applications.reduce((sum, app) => sum + app.amount, 0);
  const totalRepaidLoans = applications.filter((app) => app.status === 'repaid').length;
  const totalCashReceived = applications
    .filter((app) => app.status === 'approved')
    .reduce((sum, app) => sum + app.amount, 0);

  const adminUsers = users.filter((user) => user.role === 'admin');

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Page</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          [totalLoans, 'Loans'],
          [totalBorrowers, 'Borrowers'],
          ['450,000', 'Savings'],
          [totalRepaidLoans, 'Repaid Loans'],
          [totalCashDisbursed.toLocaleString(), 'Cash Disbursed'],
          [totalCashReceived.toLocaleString(), 'Cash Received'],
        ].map(([value, label]) => (
          <div key={label} className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-2xl font-bold text-blue-700">{value}</h2>
            <p className="text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">User Recent Activity</th>
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Employment</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-medium">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-4 px-6 text-center">Loading...</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{app.reason}</td>
                  <td className="py-3 px-6">{app.fullName}</td>
                  <td className="py-3 px-6">
                    {new Date(app.createdAt).toLocaleDateString()} <br />
                    <span className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleTimeString()}</span>
                  </td>
                  <td className="py-3 px-6">{app.employmentStatus}</td>
                  <td className="py-3 px-6">₹{app.amount.toLocaleString()}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => toggleStatus(app._id, app.status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'verified'
                          ? 'bg-blue-500 text-white cursor-pointer'
                          : app.status === 'approved'
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : 'bg-gray-300 text-white cursor-not-allowed'
                      }`}
                      disabled={app.status !== 'verified'}
                    >
                      {app.status.toUpperCase()}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Users Header & Button */}
      <div className="flex justify-between items-center mt-10 mb-4">
        <h2 className="text-2xl font-bold text-blue-600">Admin Users</h2>
        <button
          onClick={goToCreateAdmin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          + Create Admin
        </button>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-medium">
            {userLoading ? (
              <tr>
                <td colSpan={3} className="py-4 px-6 text-center">Loading...</td>
              </tr>
            ) : adminUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 px-6 text-center">No admin users found.</td>
              </tr>
            ) : (
              adminUsers.map((admin) => (
                <tr key={admin._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{admin.name}</td>
                  <td className="py-3 px-6">{admin.role}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => deleteAdmin(admin._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
                    >
                      Delete Admin
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
