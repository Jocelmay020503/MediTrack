'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Step = 'email' | 'otp' | 'reset' | 'success';
type View = 'login' | 'forgot';

export default function LoginPage() {
  const router = useRouter();
  
  // Login states
  const [view, setView] = useState<View>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password states
  const [forgotStep, setForgotStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [generatedTempPassword, setGeneratedTempPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      
      // Check user role and redirect to appropriate dashboard
      const userRole = data.user.role?.toLowerCase() || '';
      if (userRole === 'admin') {
        router.push('/admin');
      } else if (userRole === 'sales staff') {
        router.push('/dashboard');
      } else {
        // Default redirect for unknown roles
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTempPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock temporary password generation (in real app, this would send email)
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      let tempPass = '';
      for (let i = 0; i < 8; i++) {
        tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedTempPassword(tempPass);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show temporary password in alert for demo purposes
      console.log('Generated Temporary Password:', tempPass);
      alert(`Temporary Password: ${tempPass}\n(In production, this would be sent to your email)`);
      
      setForgotStep('otp');
    } catch (err) {
      setError('Failed to send temporary password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTempPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (tempPassword === generatedTempPassword) {
        setForgotStep('reset');
      } else {
        setError('Invalid temporary password. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setForgotStep('success');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setView('login');
    setForgotStep('email');
    setError('');
    setEmail('');
    setStoreName('');
    setTempPassword('');
    setGeneratedTempPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden" style={{ boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.5), 0 10px 10px -5px rgba(15, 23, 42, 0.3)' }}>
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 flex-col items-center justify-center p-12 relative">
          <button
            onClick={() => router.push('/')}
            className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold">Back</span>
          </button>
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

          {view === 'login' ? (
            <>
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
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition pr-12"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-sm text-slate-600 hover:text-slate-800 font-medium transition"
                  >
                    Forgot Password?
                  </button>
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
            </>
          ) : (
            <>
              <button
                onClick={handleBackToLogin}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold text-sm">Back to Login</span>
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-800">
                  {forgotStep === 'email' && 'Forgot Password'}
                  {forgotStep === 'otp' && 'Verify Temporary Password'}
                  {forgotStep === 'reset' && 'Reset Password'}
                  {forgotStep === 'success' && 'Success!'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {forgotStep === 'email' && 'Enter your account details to receive temporary password'}
                  {forgotStep === 'otp' && 'Enter the temporary password sent to your email'}
                  {forgotStep === 'reset' && 'Create a new password for your account'}
                  {forgotStep === 'success' && 'Your password has been reset'}
                </p>
              </div>

              {/* Step 1: Email & Store Name */}
              {forgotStep === 'email' && (
                <form onSubmit={handleSendTempPassword} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="storeName" className="block text-slate-700 font-medium mb-2 text-sm">
                      Store Name
                    </label>
                    <input
                      id="storeName"
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Enter your store name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-slate-700 font-medium mb-2 text-sm">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                  >
                    {loading ? 'Sending...' : 'Send Temporary Password'}
                  </button>
                </form>
              )}

              {/* Step 2: Temporary Password Verification */}
              {forgotStep === 'otp' && (
                <form onSubmit={handleVerifyTempPassword} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="tempPassword" className="block text-slate-700 font-medium mb-2 text-sm">
                      Temporary Password
                    </label>
                    <div className="relative">
                      <input
                        id="tempPassword"
                        type={showTempPassword ? 'text' : 'password'}
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        placeholder="Enter temporary password"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition pr-12"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowTempPassword(!showTempPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                        disabled={loading}
                      >
                        {showTempPassword ? (
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

                  <button
                    type="submit"
                    disabled={loading || tempPassword.length < 6}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                  >
                    {loading ? 'Verifying...' : 'Verify Password'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendTempPassword({ preventDefault: () => {} } as React.FormEvent)}
                    className="w-full text-slate-600 hover:text-slate-800 text-sm font-medium"
                    disabled={loading}
                  >
                    Resend Temporary Password
                  </button>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {forgotStep === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="newPassword" className="block text-slate-700 font-medium mb-2 text-sm">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition pr-12"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                      >
                        {showNewPassword ? (
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

                  <div>
                    <label htmlFor="confirmPassword" className="block text-slate-700 font-medium mb-2 text-sm">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition pr-12"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                      >
                        {showConfirmPassword ? (
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </form>
              )}

              {/* Step 4: Success */}
              {forgotStep === 'success' && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600">
                    Your password has been successfully reset. You can now login with your new password.
                  </p>
                  <button
                    onClick={handleBackToLogin}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg"
                  >
                    Go to Login
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
