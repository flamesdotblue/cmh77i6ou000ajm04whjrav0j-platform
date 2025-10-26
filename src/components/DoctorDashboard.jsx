import React, { useMemo, useState } from 'react';
import { AppContext } from '../App';
import { Clock3, Check, Users } from 'lucide-react';

export default function DoctorDashboard() {
  const { hospitals, queues, setQueues } = React.useContext(AppContext);
  const [hospitalId, setHospitalId] = useState(hospitals[0]?.id || '');
  const departments = useMemo(() => hospitals.find(h => h.id === hospitalId)?.departments || [], [hospitals, hospitalId]);
  const [department, setDepartment] = useState(departments[0] || '');

  React.useEffect(() => {
    setDepartment(departments[0] || '');
  }, [departments.length]);

  const q = queues[hospitalId]?.[department] || { waiting: [], completed: [] };

  const waitingCount = q.waiting.length;
  const completedCount = q.completed.length;

  const nextPatient = q.waiting[0] || null;

  const waitingTime = (appt) => {
    const mins = Math.max(0, Math.round((Date.now() - (appt?.createdAt || Date.now())) / 60000));
    return `${mins} min`;
  };

  const markCompleted = () => {
    if (!nextPatient) return;
    setQueues((prev) => {
      const next = { ...prev };
      next[hospitalId] = next[hospitalId] || {};
      next[hospitalId][department] = next[hospitalId][department] || { waiting: [], completed: [] };
      const [first, ...rest] = next[hospitalId][department].waiting;
      first.status = 'completed';
      first.completedAt = Date.now();
      next[hospitalId][department].waiting = rest;
      next[hospitalId][department].completed = [first, ...next[hospitalId][department].completed];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Doctor Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <label className="text-sm text-neutral-300">Hospital</label>
          <select
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            className="mt-1 w-full bg-neutral-950 border border-neutral-700 rounded-md px-3 py-2 focus:border-sky-500"
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <label className="text-sm text-neutral-300">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mt-1 w-full bg-neutral-950 border border-neutral-700 rounded-md px-3 py-2 focus:border-sky-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Users className="text-sky-400" />
            <div>
              <div className="text-sm text-neutral-400">Waiting</div>
              <div className="text-xl font-semibold">{waitingCount}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Check className="text-emerald-400" />
            <div>
              <div className="text-sm text-neutral-400">Completed</div>
              <div className="text-xl font-semibold">{completedCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900 font-medium">Current Queue</div>
        <div className="divide-y divide-neutral-800">
          {q.waiting.length === 0 && (
            <div className="p-4 text-neutral-400">No patients waiting.</div>
          )}
          {q.waiting.map((p, idx) => (
            <div key={p.id} className={`p-4 ${idx===0 ? 'bg-neutral-950' : ''} flex items-center justify-between`}>
              <div>
                <div className="font-medium">{p.userName} <span className="font-mono text-xs text-neutral-400">({p.token})</span></div>
                <div className="text-sm text-neutral-400 flex items-center gap-2"><Clock3 size={14} /> Waiting: {waitingTime(p)}</div>
                <div className="text-xs text-neutral-500">Scheduled: {new Date(p.time).toLocaleString()}</div>
              </div>
              {idx === 0 && (
                <button onClick={markCompleted} className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500">Mark Completed</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900 font-medium">Recently Completed</div>
        <div className="divide-y divide-neutral-800">
          {q.completed.length === 0 && (
            <div className="p-4 text-neutral-400">No completed patients yet.</div>
          )}
          {q.completed.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.userName} <span className="font-mono text-xs text-neutral-400">({p.token})</span></div>
                <div className="text-xs text-neutral-500">Completed at {new Date(p.completedAt).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
