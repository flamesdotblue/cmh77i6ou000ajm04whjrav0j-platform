import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="w-full h-[70vh] relative">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent pointer-events-none" />
      <div className="relative h-full max-w-6xl mx-auto px-4 flex items-center">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Smarter Doctor–Patient Appointments</h1>
          <p className="mt-4 text-neutral-300">Book hospital visits with live queues, digital tokens, and a smart symptom assistant. For doctors, manage your waiting room in real-time.</p>
          <div className="mt-6 flex gap-3">
            <a href="#book" className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500">Book Appointment</a>
            <a href="#how" className="px-4 py-2 rounded-md border border-neutral-700 hover:bg-neutral-800">How it works</a>
          </div>
        </div>
      </div>
    </section>
  );
}
