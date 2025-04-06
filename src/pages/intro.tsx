'use client';

import { useRouter } from 'next/navigation';

export default function IntroPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-4">
      <h1 className="text-5xl font-extrabold mb-4 text-white tracking-tight">
        Welcome to <span className="text-blue-500">CreditSea</span>
      </h1>
      <p className="text-lg mb-8 text-gray-300 max-w-md text-center">
        Your trusted platform for simplified and secure loan management.
      </p>
      <button
        onClick={() => router.push('/login')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-semibold transition"
      >
        Login
      </button>
    </main>
  );
}
