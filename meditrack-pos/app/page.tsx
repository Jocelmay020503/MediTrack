'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockMedicines = [
  { name: 'Amoxicillin 500mg', stock: 145, price: '₱12.50' },
  { name: 'Paracetamol 500mg', stock: 89, price: '₱8.00' },
  { name: 'Mefenamic Acid', stock: 67, price: '₱15.00' },
];

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    storeName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/login'), 800);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-slate-700 text-white transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl'
            : 'bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[74px]">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-xl bg-white/10 ring-1 ring-white/20 overflow-hidden shadow-lg">
                <Image
                  src="/logo.PNG"
                  alt="MediTrack Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="leading-tight">
                <span className="block text-xl font-bold text-white">MediTrack</span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-300">Medicine Store Platform</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-bold text-slate-100 border border-white/30 rounded-lg hover:bg-white/10 transition"
              >
                Log In
              </button>
              <button
                onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-sm font-bold bg-white text-slate-900 rounded-lg hover:bg-slate-100 shadow-md transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-[74px]">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                  Manage Your Pharmacy with Ease
                </h1>
                <p className="mt-6 text-xl font-semibold text-slate-700 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Track medicine stock and process sales — all in one simple system built for Philippine pharmacies.
                </p>
                <div className="mt-8 flex gap-4 justify-center lg:justify-start">
                  <button onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
                    Get Started Free
                  </button>
                  <button onClick={() => router.push('/login')} className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50">
                    Log In
                  </button>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.5), 0 10px 10px -5px rgba(15, 23, 42, 0.3)' }}>
                  <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="ml-3 text-base font-semibold text-white">MediTrack POS</span>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-slate-900">301</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">Products</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">₱12,450</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">Today</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">47</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">Orders</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wide">Medicine List</p>
                    <div className="space-y-2">
                      {mockMedicines.map((med, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="text-base font-bold text-slate-900">{med.name}</p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">{med.stock} in stock</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-slate-900">{med.price}</span>
                            <button className="px-2 py-1 text-sm bg-slate-900 text-white rounded font-bold">+ Add</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 Main Features */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything You Need</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 text-white">
                <div className="w-12 h-12 bg-white/10 text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2-2 2-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Stock Monitoring</h3>
                <p className="text-slate-200 text-base font-semibold leading-relaxed">Track medicine inventory in real-time. Get alerts when stock runs low.</p>
              </div>
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 text-white">
                <div className="w-12 h-12 bg-white/10 text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Fast POS Checkout</h3>
                <p className="text-slate-200 text-base font-semibold leading-relaxed">Fast checkout with automatic price calculation and digital receipts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sign Up */}
        <section id="signup" className="py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Start Using MediTrack</h2>
              <p className="mt-2 text-slate-600 text-base font-semibold">Create your account — no credit card needed</p>
            </div>
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-lg p-6 text-white">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="relative h-12 w-12 rounded-xl bg-white/10 ring-1 ring-white/20 overflow-hidden shadow-lg">
                    <Image
                      src="/logo.PNG"
                      alt="MediTrack Logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-2xl font-bold text-white">MediTrack</span>
                </div>
              </div>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-base font-bold text-slate-100 mb-2">Store Name</label>
                  <input type="text" value={signupData.storeName} onChange={(e) => setSignupData({...signupData, storeName: e.target.value})} placeholder="Your pharmacy name" className="w-full px-4 py-3 border border-slate-500 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200" required />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-100 mb-2">Email</label>
                  <input type="email" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} placeholder="you@example.com" className="w-full px-4 py-3 border border-slate-500 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200" required />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-100 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} placeholder="Create password" className="w-full px-4 py-3 border border-slate-500 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 pr-12" required />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-slate-600 hover:bg-slate-500 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg transition text-base">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
              <p className="mt-4 text-center text-base text-slate-200 font-semibold">
                Already have an account? <button onClick={() => router.push('/login')} className="text-white font-bold underline underline-offset-2">Log In</button>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 rounded-lg bg-white/10 ring-1 ring-white/20 overflow-hidden shadow-lg">
              <Image
                src="/logo.PNG"
                alt="MediTrack Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="text-lg font-bold text-white">MediTrack</span>
          </div>
          <p className="text-slate-200 text-base font-semibold">© 2026 MediTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
