'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const currentPath = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [logoKey, setLogoKey] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/sales', label: 'Sales', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/admin/medicines', label: 'Medicines', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { href: '/admin/accounts', label: 'Accounts', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [currentPath]);

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Ignore logout API failures and clear local state anyway.
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSidebarToggle = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((prev) => !prev);
      return;
    }
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 fixed inset-y-0 left-0 z-40 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {sidebarOpen && (
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/admin')}>
              <div className="relative">
                <Image
                  key={logoKey}
                  src="/logo.PNG"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                />
                <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </div>
              <span className="text-lg font-bold relative overflow-hidden">
                <span className="transition-all duration-300 group-hover:text-blue-300">MediTrack</span>
              </span>
            </div>
          )}
          <button
            onClick={handleSidebarToggle}
            className="p-2 hover:bg-white/10 rounded-lg transition group relative overflow-hidden"
            aria-label="Toggle sidebar"
          >
            <div className="relative w-5 h-5">
              <svg 
                className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${sidebarOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <svg 
                className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${sidebarOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg scale-0 group-hover:scale-150 transition-transform duration-300" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = item.href === '/admin' 
              ? currentPath === '/admin' 
              : currentPath.startsWith(item.href);
            const isHovered = hoveredItem === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                    ? 'bg-white text-slate-800 shadow-lg shadow-white/20' 
                    : 'text-slate-300 hover:bg-white/10'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-300 ${isHovered && !isActive ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`relative transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                  <svg className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${isActive ? 'text-slate-800' : isHovered ? 'text-blue-300' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                {sidebarOpen && (
                  <span className={`font-medium relative transition-all duration-300 ${isHovered && !isActive ? 'translate-x-1' : ''}`}>
                    {item.label}
                  </span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Link
            href="/dashboard"
            onClick={() => setMobileSidebarOpen(false)}
            onMouseEnter={() => setHoveredItem('/dashboard')}
            onMouseLeave={() => setHoveredItem(null)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
              hoveredItem === '/dashboard' ? 'bg-white/10' : ''
            } ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <div className={`relative transition-transform duration-300 ${hoveredItem === '/dashboard' ? 'scale-110' : 'scale-100'}`}>
              <svg className="w-5 h-5 flex-shrink-0 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            {sidebarOpen && <span className="font-medium transition-all duration-300">POS / Seller</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                POS / Seller
              </div>
            )}
          </Link>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="bg-white shadow-md border-b relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 relative">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition group relative overflow-hidden"
                aria-label="Open sidebar"
              >
                <div className="relative w-5 h-5">
                  <span className="absolute top-0 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 group-hover:w-3" />
                  <span className="absolute top-1/2 left-0 w-5 h-0.5 bg-current transform -translate-y-1/2" />
                  <span className="absolute bottom-0 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 group-hover:w-3" />
                </div>
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg scale-0 group-hover:scale-125 transition-transform duration-300" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 relative">
                <span className="relative inline-block">
                  Admin Dashboard
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-lg transition group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                    A
                  </div>
                  <span className="text-sm font-medium text-slate-800 hidden sm:block group-hover:text-blue-600 transition-colors duration-300">Admin</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-200"
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
        </header>

        <main className="p-4 sm:p-6 bg-slate-50 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
