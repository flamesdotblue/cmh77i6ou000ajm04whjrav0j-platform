import React, { useEffect, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { BotMessageSquare, Building2, Phone, Plus, Send } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

function suggestDepartment(message) {
  const m = message.toLowerCase();
  if (/chest|heart|cardiac|palpitation|bp|pressure/.test(m)) return 'Cardiology';
  if (/headache|seizure|stroke|memory|migraine|dizzy|brain|numb/.test(m)) return 'Neurology';
  if (/bone|fracture|joint|knee|hip|back pain|sprain/.test(m)) return 'Orthopedics';
  if (/skin|rash|acne|eczema|itch/.test(m)) return 'Dermatology';
  if (/child|kid|pediatric|fever|cough|cold/.test(m)) return 'Pediatrics';
  if (/ear|nose|throat|sinus|hearing/.test(m)) return 'ENT';
  if (/eye|vision|blurry|red eye|itchy eyes/.test(m)) return 'Ophthalmology';
  if (/pregnan|gyne|period|uterus/.test(m)) return 'Gynecology';
  return 'General Medicine';
}

export default function PatientHome() {
  const { hospitals, queues, setQueues, user } = React.useContext(AppContext);
  const [phone, setPhone] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatSuggestion, setChatSuggestion] = useState('');
  const [selected, setSelected] = useState(null); // {hospitalId}
  const [dept, setDept] = useState('');
  const [confirmAppt, setConfirmAppt] = useState(null);

  useEffect(() => {
    if (chatInput.trim().length === 0) setChatSuggestion('');
  }, [chatInput]);

  const hospitalQueues = (hospitalId) => queues[hospitalId] || {};

  const patientsAhead = (hospitalId, department) => {
    const hq = hospitalQueues(hospitalId);
    const dq = hq[department] || { waiting: [] };
    return dq.waiting?.length || 0;
    };

  const scheduleNotification = (title, body, whenMs) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      const delay = Math.max(0, whenMs - Date.now());
      setTimeout(() => new Notification(title, { body }), delay);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          const delay = Math.max(0, whenMs - Date.now());
          setTimeout(() => new Notification(title, { body }), delay);
        }
      });
    }
  };

  const bookAppointment = (hospital) => {
    if (!dept) return;
    const now = Date.now();
    const ahead = patientsAhead(hospital.id, dept);
    const slotMs = 10 * 60 * 1000; // 10 minutes per patient
    const time = now + (ahead + 1) * slotMs; // next available slot
    const token = `${hospital.id.toUpperCase()}-${dept.split(' ').map(s=>s[0]).join('')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

    const appt = {
      id: token,
      token,
      userName: user?.name || 'Guest',
      phone,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      department: dept,
      createdAt: now,
      time,
      status: 'waiting',
    };

    setQueues((prev) => {
      const next = { ...prev };
      next[hospital.id] = next[hospital.id] || {};
      next[hospital.id][dept] = next[hospital.id][dept] || { waiting: [], completed: [] };
      next[hospital.id][dept].waiting = [...next[hospital.id][dept].waiting, appt];
      return next;
    });

    // schedule reminder 10 minutes before appointment
    const reminderAt = time - 10 * 60 * 1000;
    scheduleNotification(
      'Appointment Reminder',
      `Token ${token} at ${hospital.name} (${dept}) in 10 minutes`,
      reminderAt
    );

    setConfirmAppt({
      token,
      hospitalName: hospital.name,
      department: dept,
      time,
      patientsAhead: ahead,
    });

    setSelected(null);
    setDept('');
    setPhone('');
  };

  const hospitalsList = useMemo(() => hospitals, [hospitals]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Hospitals</h2>
        <p className="text-neutral-400">Choose a hospital to book an appointment.</p>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {hospitalsList.map((h) => (
            <div key={h.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-neutral-800"><Building2 className="text-sky-400" /></div>
                <div className="flex-1">
                  <h3 className="font-medium">{h.name}</h3>
                  <p className="text-sm text-neutral-400">{h.location}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-neutral-300">Department</label>
                <select
                  className="mt-1 w-full bg-neutral-950 border border-neutral-700 rounded-md px-3 py-2 focus:border-sky-500"
                  value={selected?.id === h.id ? (dept || '') : ''}
                  onChange={(e) => {
                    setSelected(h);
                    setDept(e.target.value);
                  }}
                >
                  <option value="" disabled>Select department</option>
                  {h.departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="mt-3">
                  <label className="text-sm text-neutral-300 flex items-center gap-2"><Phone size={16} /> Phone for reminders</label>
                  <input
                    value={selected?.id === h.id ? (phone || '') : ''}
                    onChange={(e) => {
                      setSelected(h);
                      setPhone(e.target.value);
                    }}
                    placeholder="e.g., 9876543210"
                    className="mt-1 w-full bg-neutral-950 border border-neutral-700 rounded-md px-3 py-2 focus:border-sky-500"
                  />
                </div>
                <div className="mt-3 text-sm text-neutral-400">
                  Patients ahead: {dept && selected?.id === h.id ? patientsAhead(h.id, dept) : 0}
                </div>
                <button
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
                  disabled={!dept || !phone || selected?.id !== h.id}
                  onClick={() => bookAppointment(h)}
                >
                  <Plus size={16} /> Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat assistant */}
      <button
        onClick={() => setChatOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-20 p-3 rounded-full bg-sky-600 hover:bg-sky-500 shadow-lg"
        title="Symptom Assistant"
      >
        <BotMessageSquare />
      </button>
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-20 w-80 rounded-xl bg-neutral-950 border border-neutral-800 shadow-xl overflow-hidden">
          <div className="p-3 border-b border-neutral-800 font-medium">Symptom Assistant</div>
          <div className="p-3 space-y-2 max-h-64 overflow-auto">
            <p className="text-sm text-neutral-300">Describe your symptoms, and we’ll suggest a department.</p>
            {chatSuggestion && (
              <div className="text-sm bg-neutral-900 border border-neutral-800 p-2 rounded">
                Suggested department: <span className="text-sky-400 font-medium">{chatSuggestion}</span>
              </div>
            )}
          </div>
          <div className="p-3 flex items-center gap-2 border-t border-neutral-800">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g., chest pain and high BP"
              className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 outline-none focus:border-sky-500"
            />
            <button
              onClick={() => {
                const s = suggestDepartment(chatInput);
                setChatSuggestion(s);
                setDept(s);
              }}
              className="p-2 rounded-md bg-sky-600 hover:bg-sky-500"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal appointment={confirmAppt} onClose={() => setConfirmAppt(null)} />
    </div>
  );
}
