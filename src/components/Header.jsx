import React from 'react';
import { Hospital, LogIn } from 'lucide-react';
import { AppContext } from '../App';

export default function Header({ onLoginClick }) {
  const { user, setUser, setView } = React.useContext(AppContext);
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 bg-neutral-900/70 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div onClick={() => setView('home')} className="flex items-center gap-2 cursor-pointer">
          <Hospital className="text-sky-400" />
          <span className="font-semibold tracking-tight">MediQueue</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-300">Signed in as {user.name} ({user.role})</span>
              <button
                onClick={() => {
                  setUser(null);
                  setView('home');
                }}
                className="px-3 py-1.5 text-sm rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm"
            >
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
