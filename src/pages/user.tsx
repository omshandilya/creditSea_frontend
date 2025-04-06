import { useState } from 'react';

export default function UserPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    loanTenure: '',
    reason: '',
    amount: '',
    employmentStatus: '',
    employmentAddress: '',
  });

  const [checkboxes, setCheckboxes] = useState({
    importantInfo: false,
    creditDisclosure: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxes({
      ...checkboxes,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          loanTenure: parseInt(formData.loanTenure),
          reason: formData.reason,
          amount: parseInt(formData.amount),
          employmentStatus: formData.employmentStatus,
          employmentAddress: formData.employmentAddress,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Application submitted successfully!');
        setFormData({
          fullName: '',
          loanTenure: '',
          reason: '',
          amount: '',
          employmentStatus: '',
          employmentAddress: '',
        });
        setCheckboxes({
          importantInfo: false,
          creditDisclosure: false,
        });
      } else {
        const error = await response.json();
        setErrorMessage(error.message || 'Failed to submit application.');
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading || !checkboxes.importantInfo || !checkboxes.creditDisclosure;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">APPLY FOR A LOAN</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Full name as it appears on bank account</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">How much do you need?</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Loan tenure (in months)</label>
          <input
            type="number"
            name="loanTenure"
            value={formData.loanTenure}
            onChange={handleChange}
            placeholder="Tenure"
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Employment status</label>
          <input
            type="text"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            placeholder="Employment status"
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Reason for loan</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Reason"
            className="w-full border rounded-lg p-2"
            rows={3}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Employment address</label>
          <input
            type="text"
            name="employmentAddress"
            value={formData.employmentAddress}
            onChange={handleChange}
            placeholder="Employment address"
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Checkboxes */}
        <div className="md:col-span-2">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="importantInfo"
              checked={checkboxes.importantInfo}
              onChange={handleCheckboxChange}
            />
            <span>I have read the important information and accept that by completing the application I will be bound by the terms.</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="creditDisclosure"
              checked={checkboxes.creditDisclosure}
              onChange={handleCheckboxChange}
            />
            <span>
              Any personal and credit information obtained may be disclosed from time to time to other lenders,
              credit bureaus or other credit reporting agencies.
            </span>
          </label>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className={`${
              isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
            } text-white px-6 py-2 rounded-lg w-full`}
            disabled={isSubmitDisabled}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {successMessage && (
          <div className="md:col-span-2 text-green-700 font-semibold text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="md:col-span-2 text-red-600 font-semibold text-center">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}
