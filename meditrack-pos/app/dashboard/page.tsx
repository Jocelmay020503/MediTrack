'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 25.00, stock: 150, image: '/logo.png', instructions: 'Every 4 hours, take with meals', expiryDate: '2026-06-15' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 85.00, stock: 80, image: '/logo.png', instructions: 'Every 8 hours, take with meals', expiryDate: '2026-05-20' },
  { id: '3', name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 35.00, stock: 120, image: '/logo.png', instructions: 'Every 6 hours, take after meals', expiryDate: '2026-12-01' },
  { id: '4', name: 'Cetirizine 10mg', category: 'Allergy', price: 45.00, stock: 200, image: '/logo.png', instructions: 'Once daily, take at night', expiryDate: '2026-08-30' },
  { id: '5', name: 'Metformin 500mg', category: 'Diabetes', price: 120.00, stock: 60, image: '/logo.png', instructions: 'Twice daily, take with meals', expiryDate: '2026-03-15' },
  { id: '6', name: 'Omeprazole 20mg', category: 'Gastric', price: 65.00, stock: 90, image: '/logo.png', instructions: 'Once daily, before breakfast', expiryDate: '2026-11-20' },
  { id: '7', name: 'Salbutamol Inhaler', category: 'Respiratory', price: 150.00, stock: 40, image: '/logo.png', instructions: 'When needed, max 2 puffs', expiryDate: '2026-04-01' },
  { id: '8', name: 'Vitamin C 500mg', category: 'Supplements', price: 55.00, stock: 300, image: '/logo.png', instructions: 'Once daily, take with meals', expiryDate: '2027-01-15' },
];

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date('2026-03-09');
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ medicine: Medicine; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState(3);
  const [cash, setCash] = useState('');
  const [deduction, setDeduction] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToOrder = (medicine: Medicine) => {
    setAnimatingId(medicine.id);
    setTimeout(() => setAnimatingId(null), 500);

    const existing = cart.find(item => item.medicine.id === medicine.id);
    if (existing) {
      setCart(cart.map(item =>
        item.medicine.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.medicine.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(cart.map(item =>
      item.medicine.id === id ? { ...item, quantity: qty } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deductionAmount = parseFloat(deduction) || 0;
  const finalTotal = cartTotal - deductionAmount;
  const cashAmount = parseFloat(cash) || 0;
  const change = cashAmount - finalTotal;
  const canCheckout = cashAmount >= finalTotal && cart.length > 0;

  const handleConfirm = () => {
    if (canCheckout) {
      setShowReceipt(true);
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
            ${cart.map(item => `
              <div class="item">
                <span>${item.medicine.name} x${item.quantity}</span>
                <span>₱${(item.medicine.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <div>Subtotal: ₱${cartTotal.toFixed(2)}</div>
            ${deductionAmount > 0 ? `<div>Discount: -₱${deductionAmount.toFixed(2)}</div>` : ''}
            <div>Total: ₱${finalTotal.toFixed(2)}</div>
            <div class="change">Cash: ₱${cashAmount.toFixed(2)}</div>
            <div class="change">Change: ₱${change.toFixed(2)}</div>
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
    setOrderComplete(false);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg object-contain"
            />
            <span className="text-xl font-bold">MediTrack</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-blue-400 font-medium border-b-2 border-blue-400 pb-1">
              Medicines
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48 md:w-64"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

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

            <div className="flex items-center gap-2 ml-2">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                S
              </div>
              <span className="text-sm hidden md:block">Seller</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Medicines</h1>
          <p className="text-slate-500">Browse and add medicines to order</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMedicines.map((medicine) => {
            const daysUntilExpiry = getDaysUntilExpiry(medicine.expiryDate);
            const isExpiringSoon = daysUntilExpiry <= 7;
            const isAnimating = animatingId === medicine.id;

            return (
              <div
                key={medicine.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border border-slate-100 ${isAnimating ? 'scale-105 ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
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
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-slate-800">₱{medicine.price.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${medicine.stock > 50 ? 'bg-green-100 text-green-700' : medicine.stock > 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    Stock: {medicine.stock}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-2">{medicine.instructions}</p>

                {isExpiringSoon && (
                  <p className="text-xs text-red-600 font-medium mb-3">
                    ⚠️ Expires in {daysUntilExpiry} days - Notify customer!
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
                          {isExpiringSoon && (
                            <p className="text-xs text-red-600">⚠️ Expiring soon!</p>
                          )}
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
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-3 rounded-lg transition"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
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
