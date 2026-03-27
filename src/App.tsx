import React, { useState, useEffect } from 'react';
import { User, Role, Appointment, HealthFile, Prescription, Doctor as DoctorType } from './types';
import { NAV_CONFIG } from './navConfig';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Patients } from './components/Patients';
import { Appointments } from './components/Appointments';
import { DEMO_APPOINTMENTS, DEMO_FILES, DEMO_PRESCRIPTIONS } from './constants';
import { Files } from './components/Files';
import { Chat } from './components/Chat';
import { Settings } from './components/Settings';
import { NearbyHospitals } from './components/NearbyHospitals';
import { Analytics, Doctors, Prescriptions, Records, Vitals } from './components/OtherPages';
import { Modal } from './components/Modal';
import { Toast } from './components/Toast';
import { onAuthStateChanged, logout, auth } from './firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: any }[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(DEMO_APPOINTMENTS);
  const [files, setFiles] = useState<HealthFile[]>(DEMO_FILES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(DEMO_PRESCRIPTIONS);
  const [newApptData, setNewApptData] = useState({ patient: '', doctor: 'Dr. Sarah Kim', date: '', time: '' });
  const [newRxData, setNewRxData] = useState({ medication: '', dosage: '', instructions: '', reminders: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const isMfaPending = sessionStorage.getItem('mfa_pending') === 'true';
      
      if (firebaseUser && !isMfaPending) {
        // If user is already logged in via Firebase but not in our state
        if (!user) {
          try {
            const { getUserProfile } = await import('./firebase');
            const profile = await getUserProfile(firebaseUser.uid);
            
            if (profile) {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: profile.name || firebaseUser.displayName || 'User',
                role: profile.role || 'patient',
                avatar: profile.avatar || firebaseUser.photoURL || profile.name?.charAt(0) || 'U'
              });
            } else {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || 'User',
                role: 'patient', // Default role for auto-login
                avatar: firebaseUser.photoURL || firebaseUser.displayName?.charAt(0) || 'U'
              });
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'patient', // Default role for auto-login
              avatar: firebaseUser.photoURL || firebaseUser.displayName?.charAt(0) || 'U'
            });
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

      prescriptions.forEach(rx => {
        if (rx.reminders?.includes(currentTime)) {
          addToast(`💊 Time to take ${rx.medication} (${rx.dosage})`, 'info');
          
          // Also add to notifications panel
          // (In a real app, this would be persisted to a notifications collection)
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user, prescriptions]);

  const addToast = (msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => removeToast(id), 3500);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogin = (u: User) => {
    setUser(u);
    addToast(`Welcome back, ${u.name.split(' ')[0]}! 👋`, 'success');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setActivePage('dashboard');
      addToast('Logged out successfully', 'info');
    } catch (error) {
      console.error('Logout Error:', error);
      addToast('Failed to log out', 'error');
    }
  };

  const renderContent = () => {
    if (!user) return null;
    
    const props = {
      role: user.role,
      user,
      onNavigate: setActivePage,
      onOpenModal: setActiveModal,
      onLogout: handleLogout,
      onUpdateUser: (name: string) => setUser({ ...user, name }),
      appointments
    };

    switch (activePage) {
      case 'dashboard': return <Dashboard {...props} />;
      case 'analytics': return <Analytics />;
      case 'patients': return <Patients onOpenModal={setActiveModal} />;
      case 'doctors': return <Doctors onOpenModal={setActiveModal} onViewProfile={(doc) => { setSelectedDoctor(doc); setActiveModal('modal-doctor-profile'); }} />;
      case 'appointments': return (
        <Appointments 
          onOpenModal={setActiveModal} 
          appointments={appointments} 
          onDeleteAppt={(id) => {
            setAppointments(prev => prev.filter(a => a.id !== id));
            addToast('Appointment cancelled', 'info');
          }}
        />
      );
      case 'files': return (
        <Files 
          onOpenModal={setActiveModal} 
          files={files} 
          onDeleteFile={(id) => {
            setFiles(prev => prev.filter(f => f.id !== id));
            addToast('File deleted', 'info');
          }}
        />
      );
      case 'prescriptions': return (
        <Prescriptions 
          onOpenModal={setActiveModal} 
          prescriptions={prescriptions}
          onDeleteRx={(id) => {
            setPrescriptions(prev => prev.filter(rx => rx.id !== id));
            addToast('Prescription removed', 'info');
          }}
          onUpdateReminders={(id, reminders) => {
            setPrescriptions(prev => prev.map(rx => rx.id === id ? { ...rx, reminders } : rx));
            addToast('Reminders updated', 'success');
          }}
        />
      );
      case 'records': return <Records />;
      case 'vitals': return <Vitals />;
      case 'hospitals': return <NearbyHospitals />;
      case 'chat': return <Chat user={user} />;
      case 'settings': return <Settings {...props} />;
      default: return <Dashboard {...props} />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0A0F1E] flex flex-col items-center justify-center z-[9999]">
        <div className="loader-logo flex items-center gap-3 mb-8">
          <div className="loader-icon w-13 h-13 bg-primary rounded-xl flex items-center justify-center text-3xl">🏥</div>
          <div className="loader-name text-3xl font-extrabold text-white tracking-tight">Health<span className="text-[#64B5FF]">Vault</span></div>
        </div>
        <div className="loader-bar w-60 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="loader-fill h-full bg-gradient-to-r from-primary to-teal-custom animate-[loadFill_1.6s_ease_forwards]"></div>
        </div>
        <div className="loader-text text-white/40 text-xs mt-3 font-medium animate-pulse">Connecting to HealthVault...</div>
        <style>{`
          @keyframes loadFill { from { width: 0 } to { width: 100% } }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
          {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} onClose={() => removeToast(t.id)} />)}
        </div>
      </>
    );
  }

  return (
    <div className="app-screen min-h-screen bg-bg-custom">
      <Sidebar 
        navConfig={NAV_CONFIG[user.role]} 
        activePage={activePage} 
        onNavigate={setActivePage} 
        user={user} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
      />
      
      <div className={`main-area md:ml-[var(--sidebar-w)] flex flex-col min-h-screen transition-all duration-300`}>
        <Topbar 
          pageName={activePage.charAt(0).toUpperCase() + activePage.slice(1)} 
          user={user} 
          onNavigate={setActivePage}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
        />
        
        <main className="page-body flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="notif-panel absolute top-12 right-6 w-80 bg-white rounded-xl border border-border-custom shadow-2xl z-[200] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="notif-head p-4 border-b border-border-custom flex items-center justify-between">
            <h4 className="text-sm font-bold">Notifications</h4>
            <button className="text-primary text-xs font-semibold hover:underline" onClick={() => setShowNotifications(false)}>Mark all read</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {[
              { icon: '📅', title: 'New Appointment', text: 'Dr. Kim has a new booking for 2:00 PM', time: '5 min ago', unread: true },
              { icon: '🧪', title: 'Lab Results Ready', text: "John Anderson's blood test results are in", time: '1 hr ago', unread: true },
              { icon: '💊', title: 'Prescription Renewed', text: 'Metformin refill approved for Patient #1042', time: '3 hrs ago', unread: false }
            ].map((n, idx) => (
              <div key={idx} className={`notif-item flex gap-3 p-4 border-b border-border-custom cursor-pointer hover:bg-bg-custom transition-colors ${n.unread ? 'bg-primary-bg/30' : ''}`}>
                <div className="notif-ava w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">{n.icon}</div>
                <div className="notif-text text-xs text-text-2 flex-1 leading-relaxed">
                  <strong className="text-text-custom">{n.title}</strong><br />{n.text}
                  <div className="notif-time text-[10px] text-text-3 mt-1">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal 
        id="modal-appointment" 
        isOpen={activeModal === 'modal-appointment'} 
        onClose={() => setActiveModal(null)} 
        title="📅 Schedule Appointment"
        footer={
          <>
            <button className="btn btn-secondary bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => setActiveModal(null)}>Cancel</button>
            <button 
              className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold" 
              onClick={() => { 
                if (!newApptData.patient || !newApptData.date || !newApptData.time) {
                  addToast('Please fill in all fields', 'error');
                  return;
                }
                const newAppt: Appointment = {
                  id: `a${Date.now()}`,
                  patient: newApptData.patient,
                  doctor: newApptData.doctor,
                  date: newApptData.date,
                  time: newApptData.time,
                  type: 'Consultation',
                  status: 'Upcoming',
                  notes: ''
                };
                setAppointments(prev => [newAppt, ...prev]);
                addToast('Appointment scheduled!', 'success'); 
                setActiveModal(null); 
                setNewApptData({ patient: '', doctor: 'Dr. Sarah Kim', date: '', time: '' });
              }}
            >
              📅 Schedule
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="block text-xs font-bold text-text-custom mb-1.5 uppercase">Patient Name</label>
            <input 
              className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" 
              placeholder="Full name" 
              value={newApptData.patient}
              onChange={(e) => setNewApptData({...newApptData, patient: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-text-custom mb-1.5 uppercase">Doctor</label>
            <select 
              className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom"
              value={newApptData.doctor}
              onChange={(e) => setNewApptData({...newApptData, doctor: e.target.value})}
            >
              <option>Dr. Sarah Kim</option>
              <option>Dr. James Chen</option>
              <option>Dr. Priya Nair</option>
              <option>Dr. Michael Ross</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="block text-xs font-bold text-text-custom mb-1.5 uppercase">Date</label>
            <input 
              type="date" 
              className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" 
              value={newApptData.date}
              onChange={(e) => setNewApptData({...newApptData, date: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-text-custom mb-1.5 uppercase">Time</label>
            <input 
              type="time" 
              className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" 
              value={newApptData.time}
              onChange={(e) => setNewApptData({...newApptData, time: e.target.value})}
            />
          </div>
        </div>
      </Modal>

      <Modal 
        id="modal-patient" 
        isOpen={activeModal === 'modal-patient'} 
        onClose={() => setActiveModal(null)} 
        title="👤 Add New Patient"
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => { addToast('Patient added!', 'success'); setActiveModal(null); }}>👤 Add Patient</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" placeholder="First Name" />
          <input className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" placeholder="Last Name" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" placeholder="Email" />
          <input className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" placeholder="Phone" />
        </div>
      </Modal>

      <Modal 
        id="modal-doctor" 
        isOpen={activeModal === 'modal-doctor'} 
        onClose={() => setActiveModal(null)} 
        title="🩺 Add New Doctor"
        footer={
          <>
            <button className="btn btn-secondary bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => { addToast('Doctor added!', 'success'); setActiveModal(null); }}>🩺 Add Doctor</button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" placeholder="Doctor Name" />
          <input className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" placeholder="Specialization" />
        </div>
      </Modal>

      <Modal 
        id="modal-upload" 
        isOpen={activeModal === 'modal-upload'} 
        onClose={() => { setActiveModal(null); setSelectedFile(null); }} 
        title="📤 Upload File"
        footer={
          <>
            <button className="btn btn-secondary bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => { setActiveModal(null); setSelectedFile(null); }}>Cancel</button>
            <button 
              className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold" 
              onClick={() => { 
                if (!selectedFile) {
                  addToast('Please select a file first', 'warning');
                  return;
                }
                const newFile: HealthFile = {
                  id: `f${Date.now()}`,
                  name: selectedFile.name,
                  category: 'Other',
                  size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
                  type: selectedFile.type.includes('pdf') ? 'pdf' : selectedFile.type.includes('image') ? 'img' : 'doc',
                  uploaded: new Date().toISOString().split('T')[0],
                  patient: user?.name || 'Unknown',
                  desc: 'Uploaded via HealthVault'
                };
                setFiles(prev => [newFile, ...prev]);
                addToast('File uploaded successfully!', 'success'); 
                setActiveModal(null); 
                setSelectedFile(null);
              }}
            >
              📤 Upload
            </button>
          </>
        }
      >
        <div 
          className="border-2 border-dashed border-border-custom rounded-xl p-9 text-center cursor-pointer transition-all bg-bg-custom hover:border-primary relative"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input 
            id="file-input"
            type="file" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          <div className="text-4xl mb-3">📁</div>
          <div className="text-sm font-bold">
            {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
          </div>
          {selectedFile && <div className="text-xs text-text-3 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</div>}
        </div>
      </Modal>

      <Modal
        id="modal-doctor-profile"
        isOpen={activeModal === 'modal-doctor-profile'}
        onClose={() => setActiveModal(null)}
        title="🩺 Doctor Profile"
        size="lg"
      >
        {selectedDoctor && (
          <div className="doc-profile">
            <div className="flex items-center gap-6 mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-lg ${selectedDoctor.color}`}>
                {selectedDoctor.initials}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-text-custom">{selectedDoctor.name}</h2>
                <p className="text-primary font-bold">{selectedDoctor.spec}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-amber-custom">★★★★★</span>
                  <span className="text-sm text-text-3">({selectedDoctor.rating} Rating)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-bg-custom p-4 rounded-xl text-center">
                <div className="text-xl mb-1">👥</div>
                <div className="text-lg font-bold text-text-custom">{selectedDoctor.patients}+</div>
                <div className="text-[10px] text-text-3 uppercase font-bold tracking-wider">Patients</div>
              </div>
              <div className="bg-bg-custom p-4 rounded-xl text-center">
                <div className="text-xl mb-1">🎓</div>
                <div className="text-lg font-bold text-text-custom">{selectedDoctor.experience}</div>
                <div className="text-[10px] text-text-3 uppercase font-bold tracking-wider">Experience</div>
              </div>
              <div className="bg-bg-custom p-4 rounded-xl text-center">
                <div className="text-xl mb-1">🏆</div>
                <div className="text-lg font-bold text-text-custom">Expert</div>
                <div className="text-[10px] text-text-3 uppercase font-bold tracking-wider">Level</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text-custom mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  About Doctor
                </h3>
                <p className="text-sm text-text-2 leading-relaxed bg-bg-custom p-4 rounded-xl border border-border-custom">
                  {selectedDoctor.about || "No biography available."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-text-custom mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Education
                  </h3>
                  <p className="text-sm text-text-2 bg-bg-custom p-4 rounded-xl border border-border-custom">
                    {selectedDoctor.education || "Information not provided."}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-custom mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.spec.split(',').map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-primary-bg text-primary text-[11px] font-bold rounded-full">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-custom flex gap-3">
              <button 
                className="btn btn-primary flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                onClick={() => { setActiveModal('modal-appointment'); setNewApptData(prev => ({ ...prev, doctor: selectedDoctor.name })); }}
              >
                Book Appointment
              </button>
              <button 
                className="btn btn-secondary px-6 py-3 rounded-xl font-bold border border-border-custom hover:bg-bg-custom transition-all"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        id="modal-prescription" 
        isOpen={activeModal === 'modal-prescription'} 
        onClose={() => setActiveModal(null)} 
        title="💊 New Prescription"
        footer={
          <>
            <button className="btn btn-secondary bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => setActiveModal(null)}>Cancel</button>
            <button 
              className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold" 
              onClick={() => { 
                if (!newRxData.medication || !newRxData.dosage) {
                  addToast('Please fill in medication and dosage', 'error');
                  return;
                }
                const newRx: Prescription = {
                  id: `rx${Date.now()}`,
                  patient: user?.name || 'Unknown',
                  medication: newRxData.medication,
                  generic: '',
                  dosage: newRxData.dosage,
                  frequency: 'As prescribed',
                  start: new Date().toISOString().split('T')[0],
                  end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  doctor: 'Dr. Sarah Kim',
                  instructions: newRxData.instructions,
                  progress: 0,
                  reminders: newRxData.reminders ? newRxData.reminders.split(',').map(t => t.trim()) : []
                };
                setPrescriptions(prev => [newRx, ...prev]);
                addToast('Prescription created!', 'success'); 
                setActiveModal(null); 
                setNewRxData({ medication: '', dosage: '', instructions: '', reminders: '' });
              }}
            >
              💊 Create
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="form-group">
            <label className="block text-xs font-bold text-text-custom mb-1.5 uppercase">Medication Name</label>
            <input 
              className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" 
              placeholder="e.g. Amlodipine" 
              value={newRxData.medication}
              onChange={(e) => setNewRxData({...newRxData, medication: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-text-custom mb-1.5 uppercase">Dosage</label>
            <input 
              className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" 
              placeholder="e.g. 5mg" 
              value={newRxData.dosage}
              onChange={(e) => setNewRxData({...newRxData, dosage: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-text-custom mb-1.5 uppercase">Reminders (HH:MM, comma separated)</label>
            <input 
              className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom" 
              placeholder="e.g. 08:00, 20:00" 
              value={newRxData.reminders}
              onChange={(e) => setNewRxData({...newRxData, reminders: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-text-custom mb-1.5 uppercase">Instructions</label>
            <textarea 
              className="w-full px-3.5 py-2 border border-border-custom rounded-lg text-sm outline-none focus:border-primary bg-white dark:bg-slate-800 text-text-custom h-24" 
              placeholder="e.g. Take with food" 
              value={newRxData.instructions}
              onChange={(e) => setNewRxData({...newRxData, instructions: e.target.value})}
            ></textarea>
          </div>
        </div>
      </Modal>

      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} onClose={() => removeToast(t.id)} />)}
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[199] md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
}
