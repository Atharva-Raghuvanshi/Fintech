import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

export function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-white/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-md shadow-black/20 border border-white/10 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Sign in to Dhan Drishti</h1>
          <p className="text-slate-400 mt-2 text-sm">Securely connect to your private wealth management portal.</p>
        </div>
        <button
          onClick={login}
          className="w-full glass-button-amber text-amber-500 font-bold text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
