'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../utils/useAuth';
import { apiFetch } from '@/app/utils/apiClient';

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

interface SaleResponse {
  message: string;
  sale: {
    id: string;
  };
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const { loading, logout } = useAuth('seller');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loadingMedicines, setLoadingMedicines] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ medicine: Medicine; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState(0);
  const [cash, setCash] = useState('');
  const [deduction, setDeduction] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  const loadMedicines = async () => {
    setLoadingMedicines(true);

    try {
      const data = await apiFetch<{ medicines: Medicine[] }>('/api/medicines');
      setMedicines(data.medicines);
      const lowStockCount = data.medicines.filter((m) => m.stock <= 10).length;
      setNotification(lowStockCount);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load medicines';
      setError(message);
    } finally {
      setLoadingMedicines(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const filteredMedicines = medicines.filter(
    (med) => med.name.toLowerCase().includes(searchQuery.toLowerCase()) || med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToOrder = (medicine: Medicine) => {
    setAnimatingId(medicine.id);
    setTimeout(() => setAnimatingId(null), 500);

    const existing = cart.find((item) => item.medicine.id === medicine.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.medicine.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(
      cart.map((item) =>
        item.medicine.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deductionAmount = Math.max(0, parseFloat(deduction) || 0);
  const finalTotal = Math.max(0, cartTotal - deductionAmount);
  const cashAmount = parseFloat(cash) || 0;
  const change = cashAmount - finalTotal;
  const canCheckout = cashAmount >= finalTotal && cart.length > 0;

  const handleConfirm = async () => {
    if (!canCheckout) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const payload = {
        items: cart.map((item) => ({
          medicineId: item.medicine.id,
          quantity: item.quantity,
        })),
        discount: deductionAmount,
        cash: cashAmount,
      };

      await apiFetch<SaleResponse>('/api/sales', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      await loadMedicines();
      setShowReceipt(true);
      setSuccess('Order confirmed successfully.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confirm order';
      setError(message);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - MediTrack</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; }
            .items { margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #ccc; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
            .change { font-size: 16px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">MediTrack</div>
            <p>Medicine Store Management System</p>
            <p>Date: ${new Date().toLocaleString()}</p>
          </div>
          <div class="items">
            ${cart
              .map(
                (item) => `
              <div class="item">
                <span>${item.medicine.name} x${item.quantity}</span>
                <span>PHP ${(item.medicine.price * item.quantity).toFixed(2)}</span>
              </div>
            `
              )
              .join('')}
          </div>
          <div class="total">
            <div>Subtotal: PHP ${cartTotal.toFixed(2)}</div>
            ${deductionAmount > 0 ? `<div>Discount: -PHP ${deductionAmount.toFixed(2)}</div>` : ''}
            <div>Total: PHP ${finalTotal.toFixed(2)}</div>
            <div class="change">Cash: PHP ${cashAmount.toFixed(2)}</div>
            <div class="change">Change: PHP ${change.toFixed(2)}</div>
          </div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>Please come again</p>
          </div>
        </body>
        </html>
      `;
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleNewOrder = () => {
    setCart([]);
    setCash('');
    setDeduction('');
    setShowReceipt(false);
    setShowCart(false);
    setError('');
  };

  if (loading || loadingMedicines) {
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.PNG"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg object-contain"
            />
            <span className="text-lg sm:text-xl font-bold">MediTrack</span>
          </div>

          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            <Link href="/dashboard" className="text-white font-medium border-b-2 border-white pb-1">
              Medicines
            </Link>
            <Link href="/sales" className="text-white/70 hover:text-white font-medium transition">
              Sales
            </Link>
          </nav>

          <div className="relative order-3 basis-full sm:order-none sm:basis-auto">
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-52 md:w-52 lg:w-64"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notification > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notification}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 ml-1 sm:ml-2 relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-white/10 p-1 rounded-lg transition"
              >
                <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-sm font-medium">
                  S
                </div>
                <span className="text-sm hidden md:block">Seller</span>
                <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="md:hidden px-4 pb-3 flex items-center gap-2">
          <Link href="/dashboard" className="touch-target px-3 py-1.5 rounded-md bg-white text-slate-900 text-sm font-semibold">
            Medicines
          </Link>
          <Link href="/sales" className="touch-target px-3 py-1.5 rounded-md bg-white/10 text-white text-sm font-semibold">
            Sales
          </Link>
        </nav>
      </header>

      <main className="flex-1 bg-slate-50 p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Medicines</h1>
          <p className="text-slate-500">Browse and add medicines to order</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredMedicines.map((medicine) => {
            const daysUntilExpiry = getDaysUntilExpiry(medicine.expiryDate);
            const isExpiringSoon = daysUntilExpiry <= 7;
            const isAnimating = animatingId === medicine.id;

            return (
              <div
                key={medicine.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border border-slate-100 ${isAnimating ? 'scale-105 ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Image
                      src={medicine.image}
                      alt={medicine.name}
                      width={48}
                      height={48}
                      className="object-contain rounded"
                    />
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {medicine.category}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-800 mb-1">{medicine.name}</h3>

                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-lg font-bold text-slate-800">₱{medicine.price.toFixed(2)}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      medicine.stock > 50
                        ? 'bg-green-100 text-green-700'
                        : medicine.stock > 20
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    Stock: {medicine.stock}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-2">{medicine.instructions}</p>

                {isExpiringSoon && (
                  <p className="text-xs text-red-600 font-medium mb-3">
                    Expires in {daysUntilExpiry} days - Notify customer.
                  </p>
                )}

                <button
                  onClick={() => addToOrder(medicine)}
                  disabled={medicine.stock === 0}
                  className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
                >
                  {medicine.stock === 0 ? 'Out of Stock' : 'Add to Order'}
                </button>
              </div>
            );
          })}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No medicines found</p>
          </div>
        )}
      </main>

      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} className="hover:bg-white/10 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const daysUntilExpiry = getDaysUntilExpiry(item.medicine.expiryDate);
                    const isExpiringSoon = daysUntilExpiry <= 7;

                    return (
                      <div key={item.medicine.id} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                        <Image
                          src={item.medicine.image}
                          alt={item.medicine.name}
                          width={50}
                          height={50}
                          className="object-contain rounded bg-white"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 text-sm">{item.medicine.name}</h4>
                          <p className="text-blue-600 font-semibold">₱{item.medicine.price.toFixed(2)}</p>
                          {isExpiringSoon && <p className="text-xs text-red-600">Expiring soon</p>}
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.medicine.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                              className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center hover:bg-slate-300"
                            >
                              -
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                              className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center hover:bg-slate-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-slate-50">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">₱{cartTotal.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Deduction/Discount</label>
                  <input
                    type="number"
                    value={deduction}
                    onChange={(e) => setDeduction(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-slate-800">₱{finalTotal.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Cash</label>
                  <input
                    type="number"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {cashAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Change</span>
                    <span className={`font-bold ${change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₱{change.toFixed(2)}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleConfirm}
                  disabled={!canCheckout}
                  className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-medium py-3 rounded-lg transition"
                >
                  Confirm & Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReceipt && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Order Complete!</h2>
              <p className="text-slate-500 text-sm">Transaction successful</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Items</span>
                  <span className="font-medium">{cartCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span>₱{cartTotal.toFixed(2)}</span>
                </div>
                {deductionAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Discount</span>
                    <span className="text-green-600">-₱{deductionAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span>₱{finalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Cash</span>
                  <span>₱{cashAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Change</span>
                  <span>₱{change.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button
                onClick={handleNewOrder}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
