import { Metadata } from 'next';
import { useState } from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Audit - Fascinante Digital',
  description: 'Request a free local audit for your business with Fascinante Digital.',
};

export default function AuditPage() {
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ businessName, address, phone });
    alert('Audit request submitted successfully!');
  };

  return (
    <main className={`${inter.className} min-h-screen bg-gray-100 flex items-center justify-center p-8`}>
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">Request a Free Local Audit</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl"
              placeholder="e.g., Fascinante Digital"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Business Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl"
              placeholder="e.g., 123 Main St, West Palm Beach, FL"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Business Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl"
              placeholder="e.g., (561) 123-4567"
              required
            />
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700">Submit Audit Request</button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
