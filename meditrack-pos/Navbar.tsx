import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl tracking-tight">
              MediTrack<span className="text-blue-400">POS</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/dashboard" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/inventory" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Inventory
              </Link>
              <Link href="/sales" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Sales
              </Link>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md">
                New Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;