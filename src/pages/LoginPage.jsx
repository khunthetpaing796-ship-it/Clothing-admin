import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-slate-400">Sign in to access your admin panel</p>
        </div>
        {error && (
          <div className="flex items-center p-3 text-red-400 border border-red-800 rounded-lg bg-red-900/20 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300">Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500" placeholder="admin@company.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative mt-1">
              <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200" placeholder="••••••••" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-slate-400 text-sm">
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-500 transition">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
