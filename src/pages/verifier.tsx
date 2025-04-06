import { useEffect, useState } from 'react';

interface LoanApplication {
  _id: string;
  fullName: string;
  reason: string;
  status: string;
  createdAt: string;
  employmentStatus: string;
  amount: number;
}

export default function VerifierPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

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

  const toggleStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'pending' ? 'verify' : 'reject';

    try {
      const response = await fetch(`http://localhost:5000/applications/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          role: 'verifier',
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

  // Dynamic metric calculations
  const totalLoans = applications.length;
  const totalBorrowers = new Set(applications.map((app) => app.fullName)).size;
  const totalCashDisbursed = applications.reduce((sum, app) => sum + app.amount, 0);
  const totalRepaidLoans = applications.filter((app) => app.status === 'repaid').length;
  const totalCashReceived = applications
    .filter((app) => app.status === 'verified')
    .reduce((sum, app) => sum + app.amount, 0);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Verifiers Page</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          [totalLoans, 'Loans'],
          [totalBorrowers, 'Borrowers'],
          ['450,000', 'Savings'],
          [totalRepaidLoans, 'Repaid Loans'],
          [totalCashDisbursed.toLocaleString(), 'Cash Recieved'],
          [totalCashReceived.toLocaleString(), 'Cash Disbursed'],
        ].map(([value, label]) => (
          <div key={label} className="bg-white shadow-md rounded-lg p-4 text-center">
            <h2 className="text-2xl font-bold text-green-700">{value}</h2>
            <p className="text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
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
                <td colSpan={6} className="py-4 px-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-6 text-center">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{app.reason}</td>
                  <td className="py-3 px-6">{app.fullName}</td>
                  <td className="py-3 px-6">
                    {new Date(app.createdAt).toLocaleDateString()} <br />
                    <span className="text-xs text-gray-500">
                      {new Date(app.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="py-3 px-6">{app.employmentStatus}</td>
                  <td className="py-3 px-6">₹{app.amount.toLocaleString()}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => toggleStatus(app._id, app.status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'pending'
                          ? 'bg-yellow-400 text-white'
                          : app.status === 'verified'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-500 text-white'
                      }`}
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
    </div>
  );
}

