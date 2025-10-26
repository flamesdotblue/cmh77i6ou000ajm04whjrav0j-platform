import React from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function ConfirmationModal({ appointment, onClose }) {
  if (!appointment) return null;
  const { token, hospitalName, department, time, patientsAhead } = appointment;
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl bg-neutral-950 border border-neutral-800 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2"><CheckCircle className="text-emerald-400" /> Appointment Confirmed</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-neutral-800"><X size={18} /></button>
        </div>
        <div className="mt-4 text-neutral-200 space-y-2">
          <p><span className="text-neutral-400">Token:</span> <span className="font-mono">{token}</span></p>
          <p><span className="text-neutral-400">Hospital:</span> {hospitalName}</p>
          <p><span className="text-neutral-400">Department:</span> {department}</p>
          <p><span className="text-neutral-400">Visit Time:</span> {new Date(time).toLocaleString()}</p>
          <p><span className="text-neutral-400">Patients ahead of you:</span> {patientsAhead}</p>
          <p className="text-sm text-neutral-400">A reminder will be sent 10 minutes before your appointment time.</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700">Close</button>
        </div>
      </div>
    </div>
  );
}
