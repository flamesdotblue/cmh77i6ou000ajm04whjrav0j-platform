import React from 'react';
import { CalendarCheck, ShieldPlus } from 'lucide-react';
import { AppContext } from '../App';

export default function BookSection() {
  const { user, setView, openLogin } = React.useContext(AppContext);
  return (
    <section id="book" className="py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Book Appointment</h2>
          <p className="text-neutral-300">Reserve a slot at your preferred hospital and department. Get a digital token, live queue updates, and a reminder before your visit.</p>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800">
              <CalendarCheck className="text-sky-400" size={18} />
              <span className="text-sm">Instant token & time</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800">
              <ShieldPlus className="text-emerald-400" size={18} />
              <span className="text-sm">Smart department suggestions</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (user) {
                setView(user.role === 'doctor' ? 'doctor' : 'patient');
              } else {
                openLogin();
              }
            }}
            className="mt-4 px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500"
          >
            {user ? 'Go to Dashboard' : 'Login to Book'}
          </button>
        </div>
        <div id="how" className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <ol className="list-decimal list-inside space-y-2 text-neutral-300">
            <li>Login as Patient or Doctor.</li>
            <li>Patients select a hospital and department to book.</li>
            <li>Receive a token and appointment time; get a reminder before visit.</li>
            <li>Doctors manage queue and mark patients as completed.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
