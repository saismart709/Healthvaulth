import React, { useState } from 'react';
import { User, Role } from '../types';

interface SettingsProps {
  user: User;
  role: Role;
  onLogout: () => void;
  onUpdateUser: (name: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, role, onLogout, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [accentColor, setAccentColor] = useState('#0066FF');

  const handleSave = () => {
    onUpdateUser(name);
    alert('Settings saved successfully!');
  };

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--color-primary', color);
  };

  return (
    <>
      <div className="page-head flex items-start justify-between mb-6">
        <div>
          <div className="page-title text-[22px] font-extrabold tracking-tight">Settings</div>
          <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Manage your account and preferences</div>
        </div>
        <div className="page-actions flex gap-2">
          <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all" onClick={handleSave}>💾 Save Changes</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="card overflow-hidden">
            <div className="profile-cover bg-gradient-to-br from-[#0A0F1E] to-[#0d1a3a] p-7 pb-16 relative">
              <div className="text-[12px] text-white/50 font-bold uppercase tracking-wider">Profile</div>
            </div>
            <div className="profile-avatar-wrap absolute mt-[-40px] ml-6">
              <div className="profile-avatar w-20 h-20 rounded-full bg-gradient-to-br from-primary to-teal-custom flex items-center justify-center text-[32px] font-extrabold text-white border-4 border-white shadow-lg">
                {user.name[0]}
              </div>
            </div>
            <div className="profile-body p-6 pt-13">
              <div className="profile-name text-xl font-extrabold">{user.name}</div>
              <div className="profile-meta text-[13px] text-text-2 flex flex-wrap items-center gap-2 mt-1">
                <span className="flex items-center gap-1">✉️ {user.email}</span>
                <span className="flex items-center gap-1">🏷️ {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                {user.specialty && <span className="flex items-center gap-1">🩺 {user.specialty}</span>}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn btn-secondary btn-sm bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary-bg transition-all">📷 Change Photo</button>
                <button className="btn btn-danger btn-sm bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-all" onClick={onLogout}>⏻ Logout</button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-head p-4.5 border-b border-border-custom">
              <div className="card-title text-sm font-bold">🔔 Notifications</div>
            </div>
            <div className="card-inner p-5">
              {[
                ['Email Notifications', 'Receive updates via email', true],
                ['SMS Alerts', 'Text message reminders', true],
                ['Appointment Reminders', '24hr before appointments', true],
                ['Lab Result Alerts', 'When results are ready', false],
                ['Newsletter', 'Weekly health tips', false]
              ].map(([l, d, c], idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 border-b border-border-custom last:border-none">
                  <div>
                    <div className="text-[13px] font-semibold">{l as string}</div>
                    <div className="text-[11px] text-text-3">{d as string}</div>
                  </div>
                  <label className="relative cursor-pointer w-10 h-5.5 shrink-0">
                    <input type="checkbox" defaultChecked={c as boolean} className="sr-only peer" />
                    <div className="w-full h-full bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors"></div>
                    <div className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all peer-checked:translate-x-4.5 shadow-sm"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="card-head p-4.5 border-b border-border-custom">
              <div className="card-title text-sm font-bold">👤 Personal Information</div>
            </div>
            <div className="card-inner p-5">
              <div className="form-group mb-4">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Full Name</label>
                <input className="form-input w-full px-3.5 py-2.5 border-1.5 border-border-custom rounded-lg text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom focus:border-primary focus:bg-white" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group mb-4">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Email Address</label>
                <input className="form-input w-full px-3.5 py-2.5 border-1.5 border-border-custom rounded-lg text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom focus:border-primary focus:bg-white" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group mb-4">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Phone Number</label>
                <input className="form-input w-full px-3.5 py-2.5 border-1.5 border-border-custom rounded-lg text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom focus:border-primary focus:bg-white" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">New Password</label>
                <input className="form-input w-full px-3.5 py-2.5 border-1.5 border-border-custom rounded-lg text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom focus:border-primary focus:bg-white" type="password" placeholder="Leave blank to keep current" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-head p-4.5 border-b border-border-custom">
              <div className="card-title text-sm font-bold">🎨 Appearance</div>
            </div>
            <div className="card-inner p-5">
              <div className="text-[12px] font-bold uppercase tracking-wider text-text-3 mb-2.5">Accent Color</div>
              <div className="flex gap-2.5 mb-4">
                {[
                  ['#0066FF', 'Blue'],
                  ['#00C9A7', 'Teal'],
                  ['#7C3AED', 'Purple'],
                  ['#FF8B00', 'Amber'],
                  ['#FF3B3B', 'Red']
                ].map(([clr, nm]) => (
                  <div
                    key={clr}
                    onClick={() => handleAccentChange(clr)}
                    title={nm}
                    className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all ${accentColor === clr ? 'border-text-custom scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: clr }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
