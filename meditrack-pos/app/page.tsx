'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const mockMedicines = [
  { name: 'Amoxicillin 500mg', stock: 145, price: '₱12.50' },
  { name: 'Paracetamol 500mg', stock: 89, price: '₱8.00' },
  { name: 'Mefenamic Acid', stock: 67, price: '₱15.00' },
];

const HomeIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11.5 12 4l9 7.5M5 10.25V20h5.5v-5.5h3V20H19V10.25" />
  </svg>
);

const BenefitsIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l2.5 6.5H21l-5 3.5 1.9 6.9L12 15.8 6.1 18.9 8 12 3 8.5h6.5L12 2Z" />
  </svg>
);

const FeaturesIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
  </svg>
);

const PricingIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1.5v21m4.5-16.5h-6a3 3 0 100 6h3a3 3 0 110 6h-6" />
  </svg>
);

const navItems = [
  { id: 'home', label: 'Home', target: 'hero', Icon: HomeIcon },
  { id: 'benefits', label: 'Benefits', target: 'benefits', Icon: BenefitsIcon },
  { id: 'features', label: 'Features', target: 'features', Icon: FeaturesIcon },
  { id: 'pricing', label: 'Pricing', target: 'pricing', Icon: PricingIcon },
];

const Capsule = ({ label }: { label?: string }) => (
  <div className="relative w-20 h-40 flex flex-col items-center shrink-0">
    {/* High-quality 3D Shadow */}
    <div className="absolute top-[10%] w-[90%] h-[90%] bg-black/10 blur-2xl rounded-full translate-y-4" />
    
    {/* Hyper-Realistic Capsule Body */}
    <div className="relative w-full h-full rounded-full overflow-hidden flex flex-col shadow-xl ring-1 ring-white/20">
      {/* Top Half - White with Studio Lighting */}
      <div className="h-1/2 w-full bg-[radial-gradient(circle_at_35%_35%,_#ffffff_0%,_#f1f5f9_50%,_#cbd5e1_100%)] relative">
        {/* Primary Shine */}
        <div className="absolute top-[15%] left-[20%] w-[25%] h-[45%] bg-white/90 blur-[4px] rounded-full rotate-[-15deg]" />
      </div>
      
      {/* Bottom Half - Dark Blue with Deep Lighting */}
      <div className="h-1/2 w-full bg-[radial-gradient(circle_at_35%_35%,_#334155_0%,_#334155_55%,_#1e293b_100%)] relative">
        {/* Cap overlap shadow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-black/40" />
        {/* Secondary reflection */}
        <div className="absolute top-[10%] left-[25%] w-[15%] h-[30%] bg-white/10 blur-[2px] rounded-full rotate-[-15deg]" />
      </div>
      
      {/* Overall surface sheen */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </div>

    {label && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[140%] pointer-events-none">
        <div className={`px-2 py-1 rounded shadow-2xl border-l-4 ${
          label === 'Expired' ? 'bg-red-600 border-red-400 text-white' : 'bg-amber-500 border-amber-300 text-slate-950'
        } font-black uppercase text-[9px] tracking-widest text-center transform -rotate-2 ring-1 ring-black/5`}>
          {label}
        </div>
      </div>
    )}
  </div>
);

const InfiniteCapsuleBelt = () => {
  const capsuleData = [{ label: null }, { label: "Expired" }, { label: null }, { label: "Out of Stock" }, { label: null }, { label: "Expired" }];
  return (
    <div className="relative h-[550px] w-full flex justify-center items-center overflow-hidden">
      <motion.div 
        className="flex flex-col gap-16 py-8"
        animate={{ y: [0, 1248] }} // Fixed distance for perfect loop (6 capsules * (160px height + 48px gap))
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {[...capsuleData, ...capsuleData, ...capsuleData].map((cap, i) => (
          <Capsule key={i} label={cap.label ?? undefined} />
        ))}
      </motion.div>
      {/* Fade edges */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white" />
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setScrollY(window.scrollY);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [mobileMenuOpen]);

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
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] border-b border-slate-200/70'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/50'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center justify-between gap-3">
            {/* Left Nav - Bubble Pills */}
            <div className="hidden lg:flex items-center gap-1.5">
              {navItems.map((item, index) => {
                const isActive = activeMenu === item.id;
                const Icon = item.Icon;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveMenu(item.id);
                      document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative inline-flex h-9 min-w-[108px] items-center justify-center px-4 text-sm font-bold tracking-wide transition-all duration-300 rounded-full overflow-hidden ${
                      isActive ? 'text-white' : 'text-[#334155]'
                    }`}
                  >
                    {/* Bubble Background */}
                    <motion.span
                      layoutId="bubble-bg"
                      className={`absolute inset-0 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#334155] to-[#1e293b] shadow-[0_4px_20px_rgba(30,41,59,0.45)]' 
                          : 'bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-900 group-hover:text-white'
                      }`}
                    />
                    
                    {/* Shine Effect */}
                    <span className={`absolute top-0 left-0 w-full h-1/2 rounded-t-full ${
                      isActive ? 'bg-white/20' : 'bg-white/50 group-hover:bg-white/15'
                    }`} />
                    
                    {/* Content */}
                    <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                      <motion.div
                        animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </motion.div>
                      <span>{item.label}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Center Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2"
            >
              <button
                type="button"
                onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full transition-all duration-300"
              >
                <motion.div 
                  className="relative h-9 w-9"
                  whileHover={{ rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Image
                    src="/logo.PNG"
                    alt="MediTrack Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-xl font-black tracking-tight text-slate-900">MediTrack</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">Medicine Store Platform</span>
                </span>
              </button>
            </motion.div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Login Bubble */}
              <motion.button
                type="button"
                onClick={() => router.push('/login')}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex relative px-4.5 py-2 text-sm font-bold rounded-full transition-all duration-300 bg-slate-200 text-slate-800 hover:bg-slate-300"
              >
                <span className="absolute top-0 left-0 w-full h-1/2 rounded-t-full bg-white/60 group-hover:bg-white/40" />
                <span className="relative z-10">Log in</span>
              </motion.button>

              {/* Sign Up Bubble */}
              <motion.button
                type="button"
                onClick={() => {
                  setActiveMenu('signup');
                  document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative px-4.5 py-2 text-sm font-bold text-white rounded-full transition-all duration-300 bg-gradient-to-r from-[#334155] to-[#1e293b] shadow-[0_4px_20px_rgba(30,41,59,0.4)]"
              >
                <span className="absolute top-0 left-0 w-full h-1/2 rounded-t-full bg-white/15" />
                <span className="relative z-10">Sign Up</span>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                type="button"
                onClick={() => setMobileMenuOpen((value) => !value)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="lg:hidden relative h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition-all duration-300 hover:bg-slate-200"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <span className="absolute top-0 left-0 w-full h-1/2 rounded-t-full bg-white/80" />
                <motion.svg 
                  className="relative z-10 h-5 w-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] lg:hidden bg-white overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
              >
                <div className="flex min-h-full flex-col px-6 py-6">
                  <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                      className="flex items-center gap-2"
                    >
                      <div className="relative h-9 w-9">
                        <Image
                          src="/logo.PNG"
                          alt="MediTrack Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-lg font-black tracking-tight text-slate-900">MediTrack</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
                      aria-label="Close menu"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col justify-center py-8">
                    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
                      {navItems.map((item, index) => {
                        const Icon = item.Icon;
                        const isActive = activeMenu === item.id;

                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              setActiveMenu(item.id);
                              document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' });
                              setMobileMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-bold transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-to-r from-[#334155] to-[#1e293b] text-white shadow-[0_8px_24px_rgba(30,41,59,0.25)]'
                                : 'bg-slate-100 text-[#334155] hover:bg-slate-200'
                            }`}
                          >
                            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive ? 'bg-white/15' : 'bg-white'}`}>
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-center">{item.label}</span>
                          </motion.button>
                        );
                      })}

                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            router.push('/login');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full rounded-2xl bg-slate-100 px-4 py-4 text-base font-bold text-[#334155]"
                        >
                          Log in
                        </motion.button>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setActiveMenu('signup');
                            document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
                            setMobileMenuOpen(false);
                          }}
                          className="w-full rounded-2xl bg-gradient-to-r from-[#334155] to-[#1e293b] px-4 py-4 text-base font-bold text-white"
                        >
                          Sign Up
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <main className="pt-[52px] snap-y snap-mandatory overflow-y-auto">
        {/* Hero - Who is this for? What problem does it solve? */}
        <section id="hero" className="scroll-mt-[52px] min-h-screen snap-start flex items-center py-4 lg:py-6 px-6 sm:px-6 lg:px-4">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-10 items-center">
              <div className="text-center lg:text-left lg:pr-4">
                <span className="inline-block px-4 py-1.5 bg-slate-800/10 text-slate-800 text-sm font-bold rounded-full mb-3">
                  For Philippine Pharmacies
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
                  Your Medicine Store, Always Under Control
                </h1>
                <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#334155] max-w-xl lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Know your stock. Catch expiring medicines early. Monitor every sale — even when you're miles away from your store.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <button onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-[#1e293b]">
                    Start Free Trial
                  </button>
                  <button onClick={() => router.push('/login')} className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-[#334155] font-bold rounded-lg hover:bg-slate-50">
                    See Demo
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium">
                  ✓ No credit card required &nbsp; ✓ Free forever plan
                </p>
              </div>
              
              <div className="hidden md:block lg:justify-self-center md:mt-6 lg:mt-0 lg:-translate-y-10 lg:pl-10">
                <div className="mx-auto w-full max-w-[340px] sm:max-w-[420px] md:max-w-[520px] rounded-2xl overflow-hidden md:scale-[1.04] lg:scale-[1.42] md:origin-center lg:origin-center">
                  <Image
                    src="/animavid.gif"
                    alt="Animated medicine preview"
                    width={900}
                    height={560}
                    unoptimized
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What changes after they use? */}
        <section id="benefits" className="relative min-h-screen snap-start flex items-center py-6 lg:py-8 px-6 sm:px-6 lg:px-4 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute -top-28 -left-28 w-[420px] h-[420px] bg-gradient-to-br from-slate-800/8 via-slate-800/5 to-transparent rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 45, 0],
                x: [0, 24, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute -bottom-28 -right-28 w-[500px] h-[500px] bg-gradient-to-tl from-slate-800/10 via-slate-800/5 to-transparent rounded-full"
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, -45, 0],
                x: [0, -24, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-slate-800/5 to-transparent rounded-full opacity-50"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto w-full">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-6 sm:mb-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#334155] to-[#1e293b] text-white text-sm font-bold shadow-lg shadow-slate-800/25 mb-5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Why MediTrack?
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-black text-slate-900 mb-2 leading-tight">What Changes After You<br className="hidden sm:block" /> Use MediTrack?</h2>
              <p className="text-sm sm:text-base lg:text-base text-slate-600 max-w-2xl mx-auto font-medium">You'll save time, reduce losses, and serve customers faster.</p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
              {/* Card 1 - Stock Alert */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.015 }}
                className="group relative bg-white rounded-3xl p-4 lg:p-5 shadow-xl shadow-slate-800/5 border border-slate-200/60 overflow-hidden transition-all duration-500"
              >
                <motion.div 
                  className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-slate-800/15 to-transparent rounded-full"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-tr from-slate-800/10 to-transparent rounded-full"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-[#334155] to-[#1e293b] rounded-2xl flex items-center justify-center mb-4 lg:mb-5 shadow-xl shadow-slate-800/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </motion.div>
                  <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-slate-900 mb-2">Never Run Out of Stock</h3>
                  <p className="text-slate-600 leading-relaxed mb-3 text-sm lg:text-sm">Get instant alerts when medicines are running low, so you can reorder before you run out.</p>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-gradient-to-r from-[#334155] to-[#1e293b] text-white text-sm font-bold shadow-lg shadow-slate-800/20 cursor-pointer"
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Low stock alerts</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Card 2 - Fast Checkout */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.015 }}
                className="group relative bg-white rounded-3xl p-4 lg:p-5 shadow-xl shadow-slate-800/5 border border-slate-200/60 overflow-hidden transition-all duration-500 md:mt-4"
              >
                <motion.div 
                  className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-slate-800/15 to-transparent rounded-full"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-tr from-slate-800/10 to-transparent rounded-full"
                  animate={{ rotate: [-360, 0] }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-[#334155] to-[#1e293b] rounded-2xl flex items-center justify-center mb-4 lg:mb-5 shadow-xl shadow-slate-800/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    whileHover={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-slate-900 mb-2">Checkout in Seconds</h3>
                  <p className="text-slate-600 leading-relaxed mb-3 text-sm lg:text-sm">Process sales instantly with automatic price calculation and digital receipts.</p>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-gradient-to-r from-[#334155] to-[#1e293b] text-white text-sm font-bold shadow-lg shadow-slate-800/20 cursor-pointer"
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Fast transactions</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Card 3 - Reduce Waste */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.015 }}
                className="group relative bg-white rounded-3xl p-4 lg:p-5 shadow-xl shadow-slate-800/5 border border-slate-200/60 overflow-hidden transition-all duration-500"
              >
                <motion.div 
                  className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-slate-800/15 to-transparent rounded-full"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-tr from-slate-800/10 to-transparent rounded-full"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-[#334155] to-[#1e293b] rounded-2xl flex items-center justify-center mb-4 lg:mb-5 shadow-xl shadow-slate-800/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-slate-900 mb-2">Reduce Waste & Save Money</h3>
                  <p className="text-slate-600 leading-relaxed mb-3 text-sm lg:text-sm">Know exactly which medicines are expiring soon and sell them before they go to waste.</p>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-gradient-to-r from-[#334155] to-[#1e293b] text-white text-sm font-bold shadow-lg shadow-slate-800/20 cursor-pointer"
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Expiry tracking</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section id="features" className="relative min-h-screen snap-start flex items-center py-6 lg:py-8 px-6 sm:px-6 lg:px-4 overflow-hidden">
          {/* Floating Background Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute -top-10 -left-10 md:top-20 md:left-0 w-[220px] md:w-[320px] h-[220px] md:h-[320px] bg-gradient-to-br from-[#334155]/8 to-transparent rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.15, 1],
                x: [0, 20, 0],
                y: [0, -15, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute -bottom-10 -right-10 md:bottom-20 md:right-0 w-[220px] md:w-[360px] h-[220px] md:h-[360px] bg-gradient-to-tl from-[#334155]/10 to-transparent rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.12, 1],
                x: [0, -25, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto w-full">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-5 md:mb-6 lg:mb-7"
            >
              <motion.span
                className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-gradient-to-r from-[#334155] to-[#1e293b] text-white text-xs md:text-sm font-bold shadow-lg shadow-slate-800/20 mb-4 md:mb-5"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Features
              </motion.span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-slate-900 mb-2 leading-tight">Everything You Need</h2>
              <p className="text-sm md:text-sm lg:text-sm text-slate-500 max-w-2xl mx-auto">Powerful tools designed for modern pharmacy management.</p>
            </motion.div>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-4 items-stretch">
              {/* Large Featured Card - Top on mobile, Left on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="lg:col-span-3 group relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-4 lg:p-5 shadow-xl shadow-slate-800/5 border border-slate-200/60 overflow-hidden transition-all duration-500"
              >
                <motion.div 
                  className="absolute -top-12 -right-12 md:-top-20 md:-right-20 w-28 md:w-44 h-28 md:h-44 bg-gradient-to-br from-[#334155]/10 to-transparent rounded-full"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-9 h-9 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#334155] to-[#1e293b] rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg md:shadow-xl shadow-slate-800/20 md:shadow-slate-800/25 group-hover:scale-105 md:group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <svg className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-lg md:text-xl lg:text-xl font-bold text-slate-900 mb-2">Smart Stock Monitoring</h3>
                  <p className="text-sm md:text-sm text-slate-500 leading-relaxed mb-3 max-w-lg">Track medicine inventory in real-time. Get instant alerts when stock runs low, expiration dates approach, or anomalies are detected.</p>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#334155] to-[#1e293b] text-white text-xs md:text-sm font-bold shadow-lg shadow-slate-800/20 cursor-pointer"
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn more
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - Responsive Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 lg:gap-4">
                {/* Card 2 - POS Checkout */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group relative bg-white rounded-2xl md:rounded-3xl p-3.5 md:p-4 lg:p-4.5 shadow-xl shadow-slate-800/5 border border-slate-200/60 overflow-hidden transition-all duration-500"
                >
                  <motion.div 
                    className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-20 md:w-28 h-20 md:h-28 bg-gradient-to-br from-[#334155]/12 to-transparent rounded-full"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className="w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-[#334155] to-[#1e293b] rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-3.5 shadow-lg shadow-slate-800/20 group-hover:scale-105 transition-all duration-300"
                      whileHover={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H15V10.5z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mb-1.5">Fast POS Checkout</h3>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Quick transactions with automatic calculations.</p>
                  </div>
                </motion.div>

                {/* Card 3 - Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group relative bg-white rounded-2xl md:rounded-3xl p-3.5 md:p-4 lg:p-4.5 shadow-xl shadow-slate-800/5 border border-slate-200/60 overflow-hidden transition-all duration-500"
                >
                  <motion.div 
                    className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 w-20 md:w-28 h-20 md:h-28 bg-gradient-to-tr from-[#334155]/10 to-transparent rounded-full"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 7, repeat: Infinity, delay: 2 }}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className="w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-[#334155] to-[#1e293b] rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-3.5 shadow-lg shadow-slate-800/20 group-hover:scale-105 transition-all duration-300"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mb-1.5">Real-time Analytics</h3>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Visualize sales trends and insights.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative min-h-screen snap-start flex items-center py-8 lg:py-8 px-6 sm:px-6 lg:px-4 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full bg-gradient-to-br from-[#334155]/8 to-transparent blur-3xl"
              animate={{ y: [0, -18, 0], x: [0, 14, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-24 -right-24 w-[440px] h-[440px] rounded-full bg-gradient-to-tl from-[#334155]/10 to-transparent blur-3xl"
              animate={{ y: [0, 20, 0], x: [0, -16, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#334155]/10 text-[#334155] text-sm font-bold border border-[#334155]/10 mb-4">
                Simple Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-slate-900 tracking-tight">Choose the plan that fits your store</h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base lg:text-sm font-medium">Start free, then upgrade when your pharmacy needs more power.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4 lg:gap-5 items-stretch">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="rounded-3xl border border-slate-200 bg-white p-5 lg:p-5 shadow-xl shadow-slate-800/5"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#334155]/10 text-[#334155] text-sm font-bold mb-5">Free</div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl lg:text-4xl font-black text-slate-900">₱0</span>
                  <span className="pb-1 text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm lg:text-sm">A simple starter plan for small pharmacies that want to manage stock without paying upfront.</p>
                <ul className="space-y-2.5 text-sm font-semibold text-[#334155] mb-5">
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />Basic stock tracking</li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />Low-stock alerts</li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />Starter dashboard access</li>
                </ul>
                <button onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-[#334155] hover:bg-slate-50 transition-colors">
                  Get Started
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="relative rounded-3xl border border-slate-200 bg-white p-5 lg:p-5 shadow-xl shadow-slate-800/5"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-[#334155] px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg">Most Popular</span>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#334155]/10 text-[#334155] text-sm font-bold mb-5">Pro</div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl lg:text-4xl font-black text-slate-900">₱399</span>
                  <span className="pb-1 text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm lg:text-sm">Built for growing stores that need faster workflows, better reporting, and stronger control.</p>
                <ul className="space-y-2.5 text-sm font-semibold text-[#334155] mb-5">
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />Everything in Free</li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />POS checkout tools</li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />Sales analytics and reports</li>
                </ul>
                <button onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })} className="w-full rounded-xl bg-[#334155] px-4 py-2.5 font-bold text-white hover:bg-[#1e293b] transition-colors">
                  Start Pro
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: 0.19, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="rounded-3xl border border-slate-200 bg-white p-5 lg:p-5 shadow-xl shadow-slate-800/5"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#334155]/10 text-[#334155] text-sm font-bold mb-5">Premium</div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl lg:text-4xl font-black text-slate-900">₱799</span>
                  <span className="pb-1 text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm lg:text-sm">For multi-branch pharmacies that need advanced visibility, deeper control, and priority support.</p>
                <ul className="space-y-2.5 text-sm font-semibold text-[#334155] mb-5">
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />Everything in Pro</li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />Multi-branch ready</li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#334155]" />Priority onboarding support</li>
                </ul>
                <button onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-[#334155] hover:bg-slate-50 transition-colors">
                  Contact Sales
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sign Up - What should they do next? */}
        <section id="signup" className="relative min-h-screen snap-start flex items-center py-6 lg:py-8 px-6 sm:px-6 lg:px-4 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute -top-24 left-0 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-slate-800/10 to-transparent blur-3xl"
              animate={{ y: [0, -22, 0], x: [0, 16, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-24 right-0 w-[480px] h-[480px] rounded-full bg-gradient-to-tl from-slate-900/12 to-transparent blur-3xl"
              animate={{ y: [0, 24, 0], x: [0, -18, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-5 sm:mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/10 text-slate-800 text-sm font-bold border border-slate-800/10 mb-4">
                Start with MediTrack
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-slate-900 tracking-tight">Start Your Free Trial Today</h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base lg:text-sm font-medium">No credit card required. Set up in 2 minutes.</p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-4 lg:gap-5 items-center">
              <motion.div
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-2 rounded-3xl border border-slate-200/70 bg-white/65 backdrop-blur-xl p-4 lg:p-4 shadow-[0_22px_60px_rgba(30,41,59,0.08)]"
              >
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#334155] to-[#1e293b] text-white flex items-center justify-center shadow-lg shadow-slate-800/20">
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Built for Pharmacies</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-3 text-sm lg:text-sm">Start small, scale fast. Get inventory tracking, checkout speed, and cleaner reporting in one premium dashboard.</p>
                <div className="space-y-1.5 text-sm font-semibold text-[#334155]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-800" />
                    Real-time stock visibility
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-800" />
                    Fast, reliable POS workflow
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-800" />
                    Expiry and low-stock alerts
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3, scale: 1.005 }}
                className="lg:col-span-3 rounded-3xl border border-[#334155]/70 bg-gradient-to-b from-[#334155] to-[#1e293b] shadow-[0_24px_70px_rgba(30,41,59,0.35)] p-4 lg:p-4 text-white"
              >
                <div className="flex items-center gap-3 mb-3 lg:mb-4">
                  <div className="relative h-10 w-10 rounded-xl bg-white/10 ring-1 ring-white/20 overflow-hidden shadow-lg">
                    <Image
                      src="/logo.PNG"
                      alt="MediTrack Logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-xl lg:text-2xl font-black tracking-tight text-white">MediTrack</span>
                </div>

                <form onSubmit={handleSignup} className="space-y-2.5">
                  {signupError && (
                    <div className="bg-red-500/15 border border-red-300/30 text-red-100 px-4 py-2 rounded-xl text-sm">
                      {signupError}
                    </div>
                  )}

                  {signupSuccess && (
                    <div className="bg-green-500/15 border border-green-300/30 text-green-100 px-4 py-2 rounded-xl text-sm">
                      {signupSuccess}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs lg:text-sm font-bold uppercase tracking-wide text-slate-100/90 mb-1.5">Store Name</label>
                    <input type="text" value={signupData.storeName} onChange={(e) => setSignupData({...signupData, storeName: e.target.value})} placeholder="Your pharmacy name" className="w-full px-4 py-2 border border-slate-500 bg-[#334155]/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm lg:text-base" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-bold uppercase tracking-wide text-slate-100/90 mb-1.5">Email</label>
                    <input type="email" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} placeholder="you@example.com" className="w-full px-4 py-2 border border-slate-500 bg-[#334155]/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm lg:text-base" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-xs lg:text-sm font-bold uppercase tracking-wide text-slate-100/90 mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} placeholder="Create password" className="w-full px-4 py-2 border border-slate-500 bg-[#334155]/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 pr-12 text-sm lg:text-base" required disabled={loading} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#334155] hover:bg-[#1e293b] disabled:bg-slate-400 text-white font-bold py-2 lg:py-2.5 rounded-xl transition text-sm lg:text-sm">
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </form>

                <p className="mt-3 text-center text-xs sm:text-sm text-slate-200 font-semibold">
                  Already have an account? <button onClick={() => router.push('/login')} className="touch-inline text-white font-bold underline underline-offset-2">Log In</button>
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative bg-gradient-to-b from-[#334155] to-[#1e293b] border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,41,59,0.45)_0%,_transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-6 sm:px-6 lg:px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-12 w-12">
                  <Image
                    src="/logo.PNG"
                    alt="MediTrack Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight">MediTrack</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering Philippine pharmacies with intelligent inventory management and seamless POS solutions.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-400 text-sm hover:text-white transition-colors">Features</a></li>
                <li><a href="#benefits" className="text-slate-400 text-sm hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#pricing" className="text-slate-400 text-sm hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#334155]/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6">
                  <Image
                    src="/logo.PNG"
                    alt="MediTrack Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-slate-500 text-sm">© 2026 MediTrack. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}





