import React from 'react';
import { AppContext } from '../App';
import PatientHome from './PatientHome';
import DoctorDashboard from './DoctorDashboard';

export default function MainRouter() {
  const { view } = React.useContext(AppContext);
  if (view === 'doctor') return <DoctorDashboard />;
  return <PatientHome />;
}
