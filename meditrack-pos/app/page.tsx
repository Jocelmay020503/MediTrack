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
  const [activeMenu, setActiveMenu] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    storeName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        setSignupError(data.message || 'Unable to create account. Please try again.');
        return;
      }

      setSignupSuccess(
        `Account created. You can now log in using ${data.username || 'your username'} or your email.`
      );

      setTimeout(() => router.push('/login'), 1000);
    } catch {
      setSignupError('Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <div className="flex justify-between items-center h-[74px] gap-3">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
              onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="relative h-11 w-11 rounded-xl bg-white/10 ring-1 ring-white/20 overflow-hidden shadow-lg hover:ring-white/40 transition">
                <Image
                  src="/logo.PNG"
                  alt="MediTrack Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="leading-tight">
                <span className="block text-lg sm:text-xl font-bold text-white">MediTrack</span>
                <span className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-slate-300">Medicine Store Platform</span>
              </div>
            </div>
            
            {/* Navigation Menu - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {/* Home */}
              <button
                onClick={() => {
                  setActiveMenu('home');
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 group flex items-center gap-2 ${
                  activeMenu === 'home'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-100 hover:bg-white/10'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4v4m0-11l-4 4m0 0l-4-4" />
                </svg>
                <span className="text-sm font-semibold">Home</span>
              </button>

              {/* Benefits */}
              <button
                onClick={() => {
                  setActiveMenu('benefits');
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 group flex items-center gap-2 ${
                  activeMenu === 'benefits'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-100 hover:bg-white/10'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-semibold">Benefits</span>
              </button>

              {/* Features */}
              <button
                onClick={() => {
                  setActiveMenu('features');
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 group flex items-center gap-2 ${
                  activeMenu === 'features'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-100 hover:bg-white/10'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold">Features</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-100 border border-white/30 rounded-lg hover:bg-white/10 hover:border-white/50 transition duration-300"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setActiveMenu('signup');
                  document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold bg-white text-slate-900 rounded-lg hover:bg-slate-100 shadow-md transition duration-300 transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-slate-700 pt-4 animate-in fade-in">
              <button
                onClick={() => {
                  setActiveMenu('home');
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4v4m0-11l-4 4m0 0l-4-4" />
                </svg>
                <span className="text-sm font-semibold">Home</span>
              </button>

              <button
                onClick={() => {
                  setActiveMenu('benefits');
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-semibold">Benefits</span>
              </button>

              <button
                onClick={() => {
                  setActiveMenu('features');
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold">Features</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-[74px]">
        {/* Hero - Who is this for? What problem does it solve? */}
        <section id="hero" className="pt-14 sm:pt-24 lg:pt-32 pb-14 sm:pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-full mb-4">
                  For Philippine Pharmacies
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
                  Your Medicine Store, Always Under Control
                </h1>
                <p className="mt-6 text-base sm:text-lg lg:text-xl font-semibold text-slate-700 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Know your stock. Catch expiring medicines early. Monitor every sale — even when you're miles away from your store.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <button onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
                    Start Free Trial
                  </button>
                  <button onClick={() => router.push('/login')} className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50">
                    See Demo
                  </button>
                </div>
                <p className="mt-4 text-sm text-slate-500 font-medium">
                  ✓ No credit card required &nbsp; ✓ Free forever plan
                </p>
              </div>

              {/* Dashboard Preview - What outcome will they get? */}
              <div className="hidden md:block">
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
                        <p className="text-sm font-bold text-slate-700 mt-1">Sold</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Medicine List</p>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">2 Low Stock</span>
                    </div>
                    <div className="space-y-2">
                      {mockMedicines.map((med, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="text-base font-bold text-slate-900">{med.name}</p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">{med.stock} pcs in stock</p>
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

        {/* What changes after they use? */}
        <section id="benefits" className="py-16 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What Changes After You Use MediTrack?</h2>
              <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">You'll save time, reduce losses, and serve customers faster.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Never Run Out of Stock</h3>
                <p className="text-slate-600">Get instant alerts when medicines are running low, so you can reorder before you run out.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Checkout in Seconds</h3>
                <p className="text-slate-600">Process sales instantly with automatic price calculation and digital receipts.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Reduce Waste & Save Money</h3>
                <p className="text-slate-600">Know exactly which medicines are expiring soon and sell them before they go to waste.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section id="features" className="py-16 px-4 bg-slate-50">
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
                <h3 className="text-xl font-bold text-white mb-2">Smart Stock Monitoring</h3>
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

        {/* Sign Up - What should they do next? */}
        <section id="signup" className="py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Start Your Free Trial Today</h2>
              <p className="mt-2 text-slate-600 text-base font-semibold">No credit card required. Set up in 2 minutes.</p>
            </div>
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-lg p-5 sm:p-6 text-white">
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
                {signupError && (
                  <div className="bg-red-500/15 border border-red-300/30 text-red-100 px-4 py-3 rounded-lg text-sm">
                    {signupError}
                  </div>
                )}

                {signupSuccess && (
                  <div className="bg-green-500/15 border border-green-300/30 text-green-100 px-4 py-3 rounded-lg text-sm">
                    {signupSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-base font-bold text-slate-100 mb-2">Store Name</label>
                  <input type="text" value={signupData.storeName} onChange={(e) => setSignupData({...signupData, storeName: e.target.value})} placeholder="Your pharmacy name" className="w-full px-4 py-3 border border-slate-500 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200" required disabled={loading} />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-100 mb-2">Email</label>
                  <input type="email" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} placeholder="you@example.com" className="w-full px-4 py-3 border border-slate-500 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200" required disabled={loading} />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-100 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} placeholder="Create password" className="w-full px-4 py-3 border border-slate-500 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 pr-12" required disabled={loading} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition"
                      disabled={loading}
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
                Already have an account? <button onClick={() => router.push('/login')} className="touch-inline text-white font-bold underline underline-offset-2">Log In</button>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
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
          <p className="text-slate-200 text-sm sm:text-base font-semibold">© 2026 MediTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
