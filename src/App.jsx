import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BookSection from './components/BookSection';
import MainRouter from './components/MainRouter';
import LoginModal from './components/LoginModal';

export const AppContext = React.createContext(null);

const defaultHospitals = [
  {
    id: 'hosp1',
    name: 'Apollo Health City',
    location: 'Downtown',
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine'],
  },
  {
    id: 'hosp2',
    name: 'Sunrise Multispeciality',
    location: 'Midtown',
    departments: ['Pediatrics', 'Dermatology', 'ENT', 'General Medicine'],
  },
  {
    id: 'hosp3',
    name: 'St. Mary Clinic',
    location: 'Uptown',
    departments: ['General Medicine', 'Gynecology', 'Ophthalmology'],
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem('app_state_v1');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem('app_state_v1', JSON.stringify(state));
  } catch {}
}

export default function App() {
  const persisted = loadState();
  const [view, setView] = useState(persisted?.view || 'home'); // home | patient | doctor
  const [user, setUser] = useState(persisted?.user || null); // {role: 'patient'|'doctor', name, phone}
  const [hospitals] = useState(defaultHospitals);

  // queues: { [hospitalId]: { [dept]: { waiting: [appt], completed: [appt] } } }
  const [queues, setQueues] = useState(persisted?.queues || {});
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    saveState({ view, user, queues });
  }, [view, user, queues]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      view,
      setView,
      hospitals,
      queues,
      setQueues,
      openLogin: () => setShowLogin(true),
      closeLogin: () => setShowLogin(false),
    }),
    [user, view, hospitals, queues]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-neutral-950 text-white">
        <Header onLoginClick={() => setShowLogin(true)} />
        {view === 'home' && (
          <>
            <Hero />
            <div className="max-w-6xl mx-auto px-4">
              <BookSection />
            </div>
          </>
        )}
        {view !== 'home' && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <MainRouter />
          </div>
        )}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLogin={(role, name) => {
              const next = { role, name };
              setUser(next);
              setShowLogin(false);
              setView(role === 'doctor' ? 'doctor' : 'patient');
            }}
          />
        )}
      </div>
    </AppContext.Provider>
  );
}
