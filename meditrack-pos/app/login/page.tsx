'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 flex-col items-center justify-center p-12">
          <Image
            src="/logo.PNG"
            alt="MediTrack Logo"
            width={180}
            height={180}
            priority
            className="object-contain rounded-xl mb-6"
          />
          <h1 className="text-4xl font-bold text-white text-center">MediTrack</h1>
          <p className="text-slate-400 text-center mt-3">Medicine Store Management System</p>
        </div>

        <div className="w-full md:w-1/2 p-10">
          <div className="md:hidden text-center mb-8">
            <Image
              src="/logo.PNG"
              alt="MediTrack Logo"
              width={100}
              height={100}
              priority
              className="object-contain rounded-lg mx-auto mb-3"
            />
            <h1 className="text-2xl font-bold text-slate-800">MediTrack</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-slate-700 font-medium mb-2 text-sm">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-700 font-medium mb-2 text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-2">Demo Credentials</p>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-center gap-2">
                <span><span className="font-medium">Admin:</span> admin / password123</span>
              </div>
              <div className="flex justify-center gap-2">
                <span><span className="font-medium">Seller:</span> seller / password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
