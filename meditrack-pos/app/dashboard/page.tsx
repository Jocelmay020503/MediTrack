'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; // Para sa interactivity

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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      if (!response.ok) {
        setSignupError(data.message || 'Unable to create account. Please try again.');
        return;
      }

      setSignupSuccess(`Account created. Redirecting...`);
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      setSignupError('Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar - Upgraded glassmorphism */}
      <nav
        className={`fixed left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ${
          isScrolled ? 'top-2' : 'top-6'
        }`}
      >
        <div className={`w-full max-w-6xl transition-all duration-300 rounded-2xl border ${
          isScrolled 
          ? 'bg-blue-950/80 backdrop-blur-md border-white/20 shadow-xl py-2' 
          : 'bg-transparent border-transparent py-4'
        } px-6 text-white`}>
          <div className="flex justify-between items-center h-12">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="hidden xs:block leading-tight">
                <span className="block text-xl font-black tracking-tighter">MEDI<span className="text-blue-400">TRACK</span></span>
                <span className="block text-[8px] uppercase font-bold tracking-[0.3em] text-blue-200/50">Pharmacy Intelligence</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              {['home', 'benefits', 'features'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveMenu(item);
                    document.getElementById(item === 'home' ? 'hero' : item)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeMenu === item ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/login')} className="hidden sm:block text-sm font-bold hover:text-blue-400 transition">Log In</button>
              <button 
                onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-5 py-2.5 bg-white text-blue-950 text-sm font-black rounded-xl hover:bg-blue-50 transition active:scale-95 shadow-lg shadow-blue-900/20"
              >
                Sign Up
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                <div className="space-y-1.5">
                  <div className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <div className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                  <div className={`h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                TRUSTED BY PHARMACISTS
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Control your <span className="text-blue-600">Pharmacy</span> anywhere.
              </h1>
              <p className="mt-8 text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Monitor stock, prevent expirations, and track sales in real-time. The smartest POS for your medicine store.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 active:scale-95">
                  Start Free Trial
                </button>
                <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition">
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Interactive Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-full" />
              <div className="relative bg-slate-900 rounded-3xl p-2 shadow-2xl border border-slate-800">
                <div className="bg-white rounded-2xl overflow-hidden shadow-inner">
                  <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                    <span className="font-black text-slate-900 text-sm tracking-tighter">MEDITRACK DASHBOARD</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[{ label: 'Sales', val: '₱12k', color: 'text-green-600' }, { label: 'Stock', val: '301', color: 'text-blue-600' }, { label: 'Low', val: '02', color: 'text-red-500' }].map((stat, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {mockMedicines.map((med, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition group">
                          <div>
                            <p className="font-bold text-slate-900">{med.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{med.stock} in stock</p>
                          </div>
                          <button className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition">View</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits - Icons upgraded */}
        <section id="benefits" className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Why Choose MediTrack?</h2>
              <p className="text-slate-500 mt-4 font-medium">Built specifically for the needs of local pharmacies.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Smart Inventory', desc: 'Real-time stock tracking with low-supply indicators.', icon: '📦', color: 'blue' },
                { title: 'Lightning Fast', desc: 'Process sales in seconds. No more long queues.', icon: '⚡', color: 'orange' },
                { title: 'Zero Waste', desc: 'Track expiration dates and reduce profit loss.', icon: '📉', color: 'green' }
              ].map((b, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                    {b.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{b.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - Grid refined */}
        <section id="features" className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-blue-950 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition duration-500">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                </div>
                <h3 className="text-2xl font-black mb-4">Analytics & Reports</h3>
                <p className="text-blue-200 font-medium">Understand which products make you the most profit with automated daily reports.</p>
              </div>
              <div className="p-8 rounded-3xl bg-blue-600 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition duration-500">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                </div>
                <h3 className="text-2xl font-black mb-4">Cloud Security</h3>
                <p className="text-blue-100 font-medium">Your store data is encrypted and backed up daily. Accessible only by you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Signup - Form UI Upgraded */}
        <section id="signup" className="py-24 px-4 relative overflow-hidden">
          <div className="max-w-xl mx-auto relative">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900">Get Started Free</h2>
                <p className="text-slate-500 mt-2 font-medium">Create your store account in seconds.</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                {signupError && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{signupError}</div>}
                {signupSuccess && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-100">{signupSuccess}</div>}
                
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">Store Name</label>
                  <input 
                    type="text" 
                    value={signupData.storeName}
                    onChange={(e) => setSignupData({...signupData, storeName: e.target.value})}
                    placeholder="e.g. Generika Branch 1" 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    placeholder="owner@pharmacy.com" 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">Security Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      placeholder="••••••••" 
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Create My Store'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
             </div>
             <span className="text-xl font-black tracking-tighter uppercase">MediTrack</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Support</a>
          </div>
          <p className="text-slate-500 text-sm font-medium">© 2026 MediTrack Intelligence. Proudly Philippine Made.</p>
        </div>
      </footer>
    </div>
  );
}