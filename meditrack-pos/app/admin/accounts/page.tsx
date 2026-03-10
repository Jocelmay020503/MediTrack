'use client';

import { useState } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'seller';
  createdAt: string;
  lastLogin: string;
}

const initialUsers: User[] = [
  { id: '1', username: 'admin', role: 'admin', createdAt: '2026-01-01', lastLogin: '2026-03-10' },
  { id: '2', username: 'seller', role: 'seller', createdAt: '2026-01-15', lastLogin: '2026-03-10' },
  { id: '3', username: 'seller2', role: 'seller', createdAt: '2026-02-01', lastLogin: '2026-03-09' },
];

export default function AdminAccountsPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'password' | 'create'>('password');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenPassword = (user: User) => {
    setSelectedUser(user);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setModalType('password');
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleOpenCreate = () => {
    setCreateForm({ username: '', password: '', confirmPassword: '' });
    setModalType('create');
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSuccess('Password changed successfully!');
    setTimeout(() => setShowModal(false), 1500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (users.some(u => u.username === createForm.username)) {
      setError('Username already exists');
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (createForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: createForm.username,
      role: 'seller',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: '-',
    };

    setUsers([...users, newUser]);
    setSuccess('Seller account created successfully!');
    setTimeout(() => setShowModal(false), 1500);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Account Management</h1>
          <p className="text-slate-500">Manage user accounts and passwords</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Create Seller Account
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden mb-6">
        <div className="p-4 border-b bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">User Accounts</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Username</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Login</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{user.createdAt}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPassword(user)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Change Password"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </button>
                      {user.role === 'seller' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete Account"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Admin Account</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">You are currently logged in as the administrator. Admin accounts have full access to all features including user management.</p>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm"><span className="font-medium">Username:</span> admin</p>
            <p className="text-sm"><span className="font-medium">Role:</span> Administrator</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Seller Accounts</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Seller accounts can access the POS system to manage sales and transactions. They cannot access admin features.</p>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm"><span className="font-medium">Total Sellers:</span> {users.filter(u => u.role === 'seller').length}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-xl">
              <h2 className="text-lg font-semibold">
                {modalType === 'password' ? 'Change Password' : 'Create Seller Account'}
              </h2>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={modalType === 'password' ? handlePasswordSubmit : handleCreateSubmit} className="p-4 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {modalType === 'password' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={selectedUser?.username || ''}
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={createForm.username}
                      onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                      placeholder="Enter username"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      placeholder="Enter password"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={createForm.confirmPassword}
                      onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  {modalType === 'password' ? 'Change Password' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
