import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function LoginModal({ onClose, onLogin }) {
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-neutral-950 border border-neutral-800 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Login</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-neutral-800"><X size={18} /></button>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 px-3 py-2 rounded-md border ${role==='patient' ? 'border-sky-500 bg-sky-500/10' : 'border-neutral-700'}`}
            >
              Patient
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 px-3 py-2 rounded-md border ${role==='doctor' ? 'border-sky-500 bg-sky-500/10' : 'border-neutral-700'}`}
            >
              Doctor
            </button>
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={() => name.trim() && onLogin(role, name.trim())}
            className="w-full mt-2 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 disabled:opacity-50"
            disabled={!name.trim()}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
