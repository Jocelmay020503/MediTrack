'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/utils/useAuth';
import { apiFetch } from '@/app/utils/apiClient';

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

interface SalesResponse {
  sales: Sale[];
}

type DateFilter = 'all' | 'today' | '7days' | '30days';

function parseSaleDate(value: string) {
  return new Date(value.replace(' ', 'T'));
}

function isWithinFilter(date: Date, filter: DateFilter) {
  if (filter === 'all') {
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const saleDay = new Date(date);
  saleDay.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - saleDay.getTime()) / (1000 * 60 * 60 * 24));

  if (filter === 'today') return diffDays === 0;
  if (filter === '7days') return diffDays >= 0 && diffDays <= 6;
  return diffDays >= 0 && diffDays <= 29;
}

export default function AdminSalesPage() {
  const { loading } = useAuth('admin');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [filterDate, setFilterDate] = useState<DateFilter>('all');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [error, setError] = useState('');

  const loadSales = async () => {
    setLoadingSales(true);
    setError('');

    try {
      const data = await apiFetch<SalesResponse>('/api/sales');
      setSales(data.sales);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sales';
      setError(message);
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const filteredSales = sales.filter((sale) => isWithinFilter(parseSaleDate(sale.date), filterDate));

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = filteredSales.length;
  const totalItemsSold = filteredSales.reduce(
    (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const totalDiscount = filteredSales.reduce((sum, sale) => sum + sale.discount, 0);

  const salesBySeller = filteredSales.reduce((acc, sale) => {
    if (!acc[sale.seller]) {
      acc[sale.seller] = 0;
    }
    acc[sale.seller] += sale.total;
    return acc;
  }, {} as Record<string, number>);

  if (loading || loadingSales) {
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
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Sales Report</h1>
        <p className="text-slate-500">View total sales and transaction history</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
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
          onClick={() => setFilterDate('7days')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterDate === '7days' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          7 Days
        </button>
        <button
          onClick={() => setFilterDate('30days')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterDate === '30days' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          30 Days
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-slate-100">
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

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-slate-100">
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

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-slate-100">
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

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-slate-100">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Transaction History</h2>
          </div>

          {filteredSales.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No sales found for this period.</div>
          ) : (
            <>
              <div className="md:hidden divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <div key={sale.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">#{sale.id.slice(-8)}</p>
                      <p className="font-semibold text-slate-800">₱{sale.total.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-slate-600">{sale.date}</p>
                    <p className="text-sm text-slate-600">Seller: {sale.seller}</p>
                    <p className="text-sm text-slate-600">Items: {sale.items.length}</p>
                    <button
                      onClick={() => setSelectedSale(sale)}
                      className="text-slate-800 hover:text-slate-900 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
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
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">#{sale.id.slice(-8)}</td>
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
            </>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">Sales by Seller</h2>
          </div>
          <div className="p-4">
            {Object.keys(salesBySeller).length === 0 ? (
              <p className="text-sm text-slate-500">No seller sales found for this period.</p>
            ) : (
              Object.entries(salesBySeller).map(([seller, total]) => (
                <div key={seller} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-slate-800">{seller}</p>
                    <p className="text-xs text-slate-500">
                      {filteredSales.filter((sale) => sale.seller === seller).length} transactions
                    </p>
                  </div>
                  <p className="font-bold text-slate-800">₱{total.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-xl">
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <button onClick={() => setSelectedSale(null)} className="hover:bg-white/10 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
