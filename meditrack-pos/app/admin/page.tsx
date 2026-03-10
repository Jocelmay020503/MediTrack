'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../utils/useAuth';

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  instructions: string;
  expiryDate: string;
}

const medicines: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 25.00, stock: 150, image: '/logo.PNG', instructions: 'Every 4 hours, take with meals', expiryDate: '2026-06-15' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 85.00, stock: 80, image: '/logo.PNG', instructions: 'Every 8 hours, take with meals', expiryDate: '2026-05-20' },
  { id: '3', name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 35.00, stock: 120, image: '/logo.PNG', instructions: 'Every 6 hours, take after meals', expiryDate: '2026-12-01' },
  { id: '4', name: 'Cetirizine 10mg', category: 'Allergy', price: 45.00, stock: 200, image: '/logo.PNG', instructions: 'Once daily, take at night', expiryDate: '2026-08-30' },
  { id: '5', name: 'Metformin 500mg', category: 'Diabetes', price: 120.00, stock: 60, image: '/logo.PNG', instructions: 'Twice daily, take with meals', expiryDate: '2026-03-15' },
  { id: '6', name: 'Omeprazole 20mg', category: 'Gastric', price: 65.00, stock: 90, image: '/logo.PNG', instructions: 'Once daily, before breakfast', expiryDate: '2026-11-20' },
  { id: '7', name: 'Salbutamol Inhaler', category: 'Respiratory', price: 150.00, stock: 40, image: '/logo.PNG', instructions: 'When needed, max 2 puffs', expiryDate: '2026-04-01' },
  { id: '8', name: 'Vitamin C 500mg', category: 'Supplements', price: 55.00, stock: 300, image: '/logo.PNG', instructions: 'Once daily, take with meals', expiryDate: '2027-01-15' },
  { id: '9', name: 'Aspirin 100mg', category: 'Pain Relief', price: 30.00, stock: 15, image: '/logo.PNG', instructions: 'Once daily, after meals', expiryDate: '2026-03-20' },
  { id: '10', name: 'Co-Trimoxazole', category: 'Antibiotic', price: 75.00, stock: 5, image: '/logo.PNG', instructions: 'Every 12 hours, take with meals', expiryDate: '2026-05-10' },
];

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date('2026-03-10');
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth('admin');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'expiring'>('overview');

  const totalProducts = medicines.length;
  const totalStock = medicines.reduce((sum, med) => sum + med.stock, 0);
  const lowStockItems = medicines.filter(med => med.stock < 20).length;
  const expiringItems = medicines.filter(med => getDaysUntilExpiry(med.expiryDate) <= 30).length;
  const outOfStock = medicines.filter(med => med.stock === 0).length;
  
  const totalValue = medicines.reduce((sum, med) => sum + (med.price * med.stock), 0);
  const lowStockValue = medicines.filter(med => med.stock < 20).reduce((sum, med) => sum + (med.price * med.stock), 0);

  const expiringSoon = medicines
    .filter(med => getDaysUntilExpiry(med.expiryDate) <= 30)
    .sort((a, b) => getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate));

  const lowStock = medicines
    .filter(med => med.stock < 20)
    .sort((a, b) => a.stock - b.stock);

  const categories = [...new Set(medicines.map(med => med.category))];
  const categoryStats = categories.map(cat => ({
    name: cat,
    count: medicines.filter(med => med.category === cat).length,
    totalStock: medicines.filter(med => med.category === cat).reduce((sum, med) => sum + med.stock, 0)
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Overview and analytics report</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedTab === 'overview' 
              ? 'bg-slate-800 text-white' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('expiring')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedTab === 'expiring' 
              ? 'bg-slate-800 text-white' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Expiring Soon
        </button>
      </div>

      {selectedTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Products</p>
                  <p className="text-2xl font-bold text-slate-800">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Stock</p>
                  <p className="text-2xl font-bold text-slate-800">{totalStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Low Stock Items</p>
                  <p className="text-2xl font-bold text-slate-800">{lowStockItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Expiring Soon</p>
                  <p className="text-2xl font-bold text-slate-800">{expiringItems}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
              <div className="p-4 border-b bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Stock Value</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-600">Total Inventory Value</span>
                  <span className="text-2xl font-bold text-slate-800">₱{totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Low Stock Value</span>
                  <span className="text-xl font-semibold text-yellow-600">₱{lowStockValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
              <div className="p-4 border-b bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Out of Stock</h2>
              </div>
              <div className="p-6">
                <p className="text-4xl font-bold text-red-600 mb-2">{outOfStock}</p>
                <p className="text-slate-500">Products with zero stock</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
              <div className="p-4 border-b bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Low Stock Medicines</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {lowStock.map((med) => (
                  <div key={med.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Image
                        src={med.image}
                        alt={med.name}
                        width={40}
                        height={40}
                        className="rounded object-contain bg-slate-100"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{med.name}</p>
                        <p className="text-xs text-slate-500">{med.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{med.stock} units</p>
                      <p className="text-xs text-slate-500">₱{med.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
                {lowStock.length === 0 && (
                  <div className="p-4 text-center text-slate-500">No low stock items</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
              <div className="p-4 border-b bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Category Distribution</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {categoryStats.map((cat) => (
                  <div key={cat.name} className="p-4 flex items-center justify-between">
                    <span className="font-medium text-slate-800">{cat.name}</span>
                    <div className="text-right">
                      <p className="font-semibold text-slate-700">{cat.count} products</p>
                      <p className="text-xs text-slate-500">{cat.totalStock} units in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedTab === 'expiring' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Medicines Expiring Soon</h2>
            <span className="text-sm text-slate-500">Within 30 days</span>
          </div>
          <div className="divide-y divide-slate-100">
            {expiringSoon.map((med) => {
              const daysLeft = getDaysUntilExpiry(med.expiryDate);
              const isCritical = daysLeft <= 7;
              const isWarning = daysLeft <= 14;
              
              return (
                <div key={med.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Image
                      src={med.image}
                      alt={med.name}
                      width={50}
                      height={50}
                      className="rounded object-contain bg-slate-100"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{med.name}</p>
                      <p className="text-xs text-slate-500">{med.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      isCritical ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-slate-700'
                    }`}>
                      {daysLeft} days left
                    </p>
                    <p className="text-xs text-slate-500">Expires: {med.expiryDate}</p>
                  </div>
                </div>
              );
            })}
            {expiringSoon.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No medicines expiring soon!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
