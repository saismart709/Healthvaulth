import { Role } from './types';

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  badge?: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export const NAV_CONFIG: Record<Role, NavSection[]> = {
  admin: [
    {
      section: 'Overview', items: [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'analytics', icon: '📈', label: 'Analytics' },
      ]
    },
    {
      section: 'Management', items: [
        { id: 'patients', icon: '👥', label: 'Patients', badge: '6' },
        { id: 'doctors', icon: '🩺', label: 'Doctors' },
        { id: 'appointments', icon: '📅', label: 'Appointments', badge: '4' },
      ]
    },
    {
      section: 'Records', items: [
        { id: 'files', icon: '📁', label: 'File Manager' },
        { id: 'prescriptions', icon: '💊', label: 'Prescriptions' },
        { id: 'hospitals', icon: '🏥', label: 'Nearby Hospitals' },
      ]
    },
    {
      section: 'System', items: [
        { id: 'settings', icon: '⚙️', label: 'Settings' },
      ]
    },
  ],
  doctor: [
    {
      section: 'Overview', items: [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      ]
    },
    {
      section: 'Patients', items: [
        { id: 'patients', icon: '👥', label: 'My Patients', badge: '5' },
        { id: 'appointments', icon: '📅', label: 'Appointments', badge: '3' },
        { id: 'records', icon: '📋', label: 'Health Records' },
      ]
    },
    {
      section: 'Tools', items: [
        { id: 'prescriptions', icon: '💊', label: 'Prescriptions' },
        { id: 'files', icon: '📁', label: 'Files' },
      ]
    },
    {
      section: 'Account', items: [
        { id: 'settings', icon: '⚙️', label: 'Settings' },
      ]
    },
  ],
  patient: [
    {
      section: 'My Health', items: [
        { id: 'dashboard', icon: '📊', label: 'My Dashboard' },
        { id: 'records', icon: '📋', label: 'Health Records' },
        { id: 'vitals', icon: '💗', label: 'My Vitals' },
      ]
    },
    {
      section: 'Appointments', items: [
        { id: 'appointments', icon: '📅', label: 'Appointments' },
        { id: 'doctors', icon: '🩺', label: 'Find Doctors' },
      ]
    },
    {
      section: 'Documents', items: [
        { id: 'files', icon: '📁', label: 'My Files' },
        { id: 'prescriptions', icon: '💊', label: 'Prescriptions' },
      ]
    },
    {
      section: 'Support', items: [
        { id: 'hospitals', icon: '🏥', label: 'Nearby Hospitals' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
      ]
    },
  ],
};
