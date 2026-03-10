'use client';

import { useState } from 'react';

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  cash: number;
  change: number;
  seller: string;
}

const mockSales: Sale[] = [
  {
    id: '1',
    date: '2026-03-10 09:30:00',
    items: [
      { id: '1', name: 'Paracetamol 500mg', quantity: 2, price: 25.00, total: 50.00 },
      { id: '3', name: 'Ibuprofen 400mg', quantity: 1, price: 35.00, total: 35.00 },
    ],
    subtotal: 85.00,
    discount: 0,
    total: 85.00,
    cash: 100.00,
    change: 15.00,
    seller: 'Seller 1',
  },
  {
    id: '2',
    date: '2026-03-10 10:15:00',
    items: [
      { id: '4', name: 'Cetirizine 10mg', quantity: 3, price: 45.00, total: 135.00 },
    ],
    subtotal: 135.00,
    discount: 10.00,
    total: 125.00,
    cash: 125.00,
    change: 0,
    seller: 'Seller 1',
  },
  {
    id: '3',
    date: '2026-03-10 11:45:00',
    items: [
      { id: '2', name: 'Amoxicillin 250mg', quantity: 1, price: 85.00, total: 85.00 },
      { id: '6', name: 'Omeprazole 20mg', quantity: 2, price: 65.00, total: 130.00 },
    ],
    subtotal: 215.00,
    discount: 15.00,
    total: 200.00,
    cash: 250.00,
    change: 50.00,
    seller: 'Seller 2',
  },
  {
    id: '4',
    date: '2026-03-09 14:20:00',
    items: [
      { id: '8', name: 'Vitamin C 500mg', quantity: 5, price: 55.00, total: 275.00 },
    ],
    subtotal: 275.00,
    discount: 25.00,
    total: 250.00,
    cash: 300.00,
    change: 50.00,
    seller: 'Seller 1',
  },
  {
    id: '5',
    date: '2026-03-09 16:00:00',
    items: [
      { id: '7', name: 'Salbutamol Inhaler', quantity: 1, price: 150.00, total: 150.00 },
      { id: '5', name: 'Metformin 500mg', quantity: 2, price: 120.00, total: 240.00 },
    ],
    subtotal: 390.00,
    discount: 0,
    total: 390.00,
    cash: 400.00,
    change: 10.00,
    seller: 'Seller 2',
  },
  {
    id: '6',
    date: '2026-03-08 09:00:00',
    items: [
      { id: '1', name: 'Paracetamol 500mg', quantity: 10, price: 25.00, total: 250.00 },
      { id: '3', name: 'Ibuprofen 400mg', quantity: 5, price: 35.00, total: 175.00 },
      { id: '4', name: 'Cetirizine 10mg', quantity: 2, price: 45.00, total: 90.00 },
    ],
    subtotal: 515.00,
    discount: 50.00,
    total: 465.00,
    cash: 500.00,
    change: 35.00,
    seller: 'Seller 1',
  },
  {
    id: '7',
    date: '2026-03-08 11:30:00',
    items: [
      { id: '6', name: 'Omeprazole 20mg', quantity: 3, price: 65.00, total: 195.00 },
    ],
    subtotal: 195.00,
    discount: 0,
    total: 195.00,
    cash: 200.00,
    change: 5.00,
    seller: 'Seller 2',
  },
  {
    id: '8',
    date: '2026-03-07 15:00:00',
    items: [
      { id: '2', name: 'Amoxicillin 250mg', quantity: 2, price: 85.00, total: 170.00 },
      { id: '8', name: 'Vitamin C 500mg', quantity: 4, price: 55.00, total: 220.00 },
    ],
    subtotal: 390.00,
    discount: 20.00,
    total: 370.00,
    cash: 400.00,
    change: 30.00,
    seller: 'Seller 1',
  },
];

export default function AdminSalesPage() {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week'>('all');

  const filteredSales = mockSales.filter(sale => {
    if (filterDate === 'today') {
      return sale.date.startsWith('2026-03-10');
    }
    if (filterDate === 'week') {
      return sale.date.startsWith('2026-03');
    }
    return true;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = filteredSales.length;
  const totalItemsSold = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  const totalDiscount = filteredSales.reduce((sum, sale) => sum + sale.discount, 0);

  const salesBySeller = filteredSales.reduce((acc, sale) => {
    if (!acc[sale.seller]) {
      acc[sale.seller] = 0;
    }
    acc[sale.seller] += sale.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Sales Report</h1>
        <p className="text-slate-500">View total sales and transaction history</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterDate('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterDate === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setFilterDate('today')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterDate === 'today' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilterDate('week')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterDate === 'week' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          This Month
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Sales</p>
              <p className="text-2xl font-bold text-slate-800">₱{totalSales.toFixed(2)}</p>
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
              <p className="text-sm text-slate-500">Transactions</p>
              <p className="text-2xl font-bold text-slate-800">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Items Sold</p>
              <p className="text-2xl font-bold text-slate-800">{totalItemsSold}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Discount</p>
              <p className="text-2xl font-bold text-yellow-600">-₱{totalDiscount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Transaction History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Seller</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">#{sale.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{sale.date}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{sale.seller}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{sale.items.length} item(s)</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">₱{sale.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="text-slate-800 hover:text-slate-900 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Sales by Seller</h2>
          </div>
          <div className="p-4">
            {Object.entries(salesBySeller).map(([seller, total]) => (
              <div key={seller} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-slate-800">{seller}</p>
                  <p className="text-xs text-slate-500">{filteredSales.filter(s => s.seller === seller).length} transactions</p>
                </div>
                <p className="font-bold text-slate-800">₱{total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-xl">
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <button onClick={() => setSelectedSale(null)} className="hover:bg-white/10 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500">Transaction ID</p>
                  <p className="font-medium text-slate-800">#{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Seller</p>
                  <p className="font-medium text-slate-800">{selectedSale.seller}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Date & Time</p>
                  <p className="font-medium text-slate-800">{selectedSale.date}</p>
                </div>
              </div>

              <div className="border-t border-b py-4 mb-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Items</p>
                <div className="space-y-2">
                  {selectedSale.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.name} x{item.quantity}</span>
                      <span className="font-medium">₱{item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span>₱{selectedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Discount</span>
                  <span className="text-green-600">-₱{selectedSale.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span>₱{selectedSale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Cash</span>
                  <span>₱{selectedSale.cash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Change</span>
                  <span>₱{selectedSale.change.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 rounded-b-xl">
              <button
                onClick={() => setSelectedSale(null)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
