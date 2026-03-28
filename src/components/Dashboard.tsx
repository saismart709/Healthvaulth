import React from 'react';
import { StatCard } from './StatCard';
import { BarChart, LineChart, DonutChart } from './Charts';
import { StatusTag } from './StatusTag';
import { DEMO_PATIENTS, DEMO_APPOINTMENTS, DEMO_PRESCRIPTIONS } from '../constants';
import { Role, User, Appointment } from '../types';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Plus, 
  LineChart as LineChartIcon, 
  TrendingUp, 
  AlertTriangle, 
  FlaskConical, 
  ShieldAlert,
  MessageSquare,
  Clock,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Activity,
  Droplets,
  Heart,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  role: Role;
  user: User;
  onNavigate: (page: string) => void;
  onOpenModal: (id: string) => void;
  appointments: Appointment[];
}

const AdminDashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenModal, appointments }) => (
  <div className="animate-fade-in px-2">
    <div className="page-head flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-custom">HealthVault Admin</h1>
        <p className="text-sm text-text-3 font-medium mt-1">System Overview & Healthcare Analytics</p>
      </div>
      <div className="flex gap-3">
        <button className="px-5 py-2.5 rounded-2xl bg-white dark:bg-card-custom border border-border-custom text-sm font-bold flex items-center gap-2 hover:bg-bg-custom transition-all shadow-sm" onClick={() => onNavigate('analytics')}>
          <LineChartIcon size={18} /> Analytics
        </button>
        <button className="px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all" onClick={() => onOpenModal('modal-appointment')}>
          <Plus size={18} /> New Appointment
        </button>
      </div>
    </div>
    
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard icon={<Users />} value="1,482" label="Total Patients" badge="12%" badgeType="up" colorClass="blue" trend="+140 this month" />
      <StatCard icon={<Stethoscope />} value="48" label="Active Doctors" badge="4%" badgeType="up" colorClass="teal" trend="+2 new applications" />
      <StatCard icon={<Calendar />} value="324" label="Appts Today" badge="8%" badgeType="up" colorClass="amber" trend="92% completion rate" />
      <StatCard icon={<FlaskConical />} value="12" label="Critical Cases" badge="5%" badgeType="down" colorClass="red" trend="-3 from yesterday" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 card overflow-hidden border-none shadow-xl bg-white dark:bg-card-custom">
        <div className="p-6 border-b border-border-custom flex items-center justify-between bg-bg-custom/30">
          <h3 className="text-sm font-bold flex items-center gap-2"><Activity size={18} className="text-primary" /> Patient Admissions Trend</h3>
          <select className="text-xs font-bold bg-white dark:bg-border-custom border border-border-custom rounded-lg px-2 py-1 outline-none">
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <div className="p-6 h-[300px]">
          <BarChart data={[120, 145, 132, 178, 190, 165, 210, 195]} color="#2563eb" />
        </div>
      </div>
      
      <div className="card overflow-hidden border-none shadow-xl bg-white dark:bg-card-custom">
        <div className="p-6 border-b border-border-custom bg-bg-custom/30">
          <h3 className="text-sm font-bold flex items-center gap-2"><Droplets size={18} className="text-teal-custom" /> Specialty Distribution</h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center h-full">
          <DonutChart />
          <div className="w-full mt-8 grid grid-cols-2 gap-3">
            {[
              { l: 'Cardiac', c: '#2563eb', v: '35%' },
              { l: 'Respiratory', c: '#f59e0b', v: '25%' },
              { l: 'Orthopedic', c: '#10b981', v: '20%' },
              { l: 'Other', c: '#ef4444', v: '20%' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-bg-custom/50 border border-border-custom/50">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.c }}></div>
                <div className="text-[10px] font-bold text-text-2 uppercase tracking-wide">{item.l}</div>
                <div className="ml-auto text-xs font-bold">{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DoctorDashboard: React.FC<DashboardProps> = ({ user, onNavigate, onOpenModal, appointments }) => (
  <div className="animate-fade-in px-2">
    <div className="page-head flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-custom">
          Welcome back, <span className="text-primary">{user.name.split(' ')[0]}</span>
        </h1>
        <p className="text-sm text-text-3 font-medium mt-1">You have {appointments.filter(a => a.status === 'Upcoming').length} appointments scheduled for today.</p>
      </div>
      <div className="flex gap-3">
        <button className="px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all" onClick={() => onOpenModal('modal-appointment')}>
          <Plus size={18} /> Schedule
        </button>
      </div>
    </div>
    
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard icon={<Users />} value="124" label="My Patients" badge="12%" badgeType="up" colorClass="blue" trend="+8 new this week" />
      <StatCard icon={<Calendar />} value="5" label="Today's Appts" badge="2" badgeType="up" colorClass="amber" trend="Next: 10:30 AM" />
      <StatCard icon={<CheckCircle2 size={24} />} value="230" label="Surgeries" badge="8%" badgeType="up" colorClass="teal" trend="98% Success Rate" />
      <StatCard icon={<Heart />} value="4.9" label="Rating" badge="0.2" badgeType="up" colorClass="purple" trend="Based on 86 reviews" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="card overflow-hidden border-none shadow-xl bg-white dark:bg-card-custom">
        <div className="p-6 border-b border-border-custom flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2"><Clock size={20} className="text-primary" /> Today's Schedule</h3>
          <button className="text-xs font-bold text-primary hover:underline" onClick={() => onNavigate('appointments')}>Full Calendar</button>
        </div>
        <div className="p-6 space-y-4">
          {appointments.slice(0, 4).map(a => (
            <div key={a.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-bg-custom border border-border-custom hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-border-custom shadow-sm flex items-center justify-center text-sm font-bold border border-border-custom">
                {a.patient.split(' ').map(w => w[0]).join('')}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-text-custom">{a.patient}</h4>
                <p className="text-[11px] text-text-3 font-medium">{a.time} · {a.type}</p>
              </div>
              <StatusTag status={a.status} />
              <button className="p-2 rounded-xl border border-border-custom text-text-3 group-hover:text-primary group-hover:border-primary transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card overflow-hidden border-none shadow-xl bg-white dark:bg-card-custom">
        <div className="p-6 border-b border-border-custom">
          <h3 className="text-base font-bold flex items-center gap-2"><Activity size={20} className="text-teal-custom" /> Patient Growth</h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
          <DonutChart />
          <div className="w-full mt-6 grid grid-cols-2 gap-3">
             {[
               { l: 'New', c: '#2563eb', v: '35%' },
               { l: 'Returning', c: '#10b981', v: '65%' }
             ].map((item, idx) => (
               <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-bg-custom/50">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.c }}></div>
                 <div className="text-[10px] font-bold text-text-2 uppercase tracking-wide">{item.l}</div>
                 <div className="ml-auto text-xs font-bold">{item.v}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
    
    <div className="card overflow-hidden border-none shadow-xl bg-white dark:bg-card-custom mb-6">
      <div className="p-6 border-b border-border-custom flex items-center justify-between">
        <h3 className="text-base font-bold flex items-center gap-2"><Users size={20} className="text-primary" /> Active Patients</h3>
        <button className="text-xs font-bold text-primary hover:underline hover:bg-primary-bg px-3 py-1.5 rounded-lg transition-colors" onClick={() => onNavigate('patients')}>Manage Patients</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-custom/50 text-left">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-3">Patient</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-3">Primary Concern</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-3">Last Visit</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-3">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom">
            {DEMO_PATIENTS.slice(0, 5).map(p => (
              <tr key={p.id} className="hover:bg-bg-custom/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-bg text-primary flex items-center justify-center text-xs font-bold">
                      {p.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-custom">{p.name}</div>
                      <div className="text-[11px] text-text-3">{p.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-text-2">{p.condition}</td>
                <td className="px-6 py-4 text-sm font-medium text-text-2">{appointments.find(a => a.patient === p.name)?.date || 'No recent visit'}</td>
                <td className="px-6 py-4">
                  <StatusTag status={p.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 rounded-xl border border-border-custom text-text-3 hover:text-primary hover:border-primary transition-all">
                      <ClipboardList size={16} />
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all">
                      View Profile
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PatientDashboard: React.FC<DashboardProps> = ({ user, onNavigate, onOpenModal, appointments }) => (
  <div className="animate-fade-in px-2">
    <div className="page-head flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-custom mb-1">
          Stay Healthy, <span className="text-primary">{user.name.split(' ')[0]}!</span>
        </h1>
        <p className="text-sm text-text-3 font-medium flex items-center gap-2">
          <Clock size={14} /> Sunday, March 28, 2026 · No critical alerts found
        </p>
      </div>
      <div className="flex gap-3">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-2xl bg-red-custom text-white text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-red-custom/20 hover:bg-red-600 transition-all border-none"
          onClick={() => alert("🚨 Emergency SOS Triggered! Nearby hospitals and your emergency contacts have been notified.")}
        >
          <ShieldAlert size={20} /> EMERGENCY SOS
        </motion.button>
        <button className="px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all" onClick={() => onOpenModal('modal-appointment')}>
          <Calendar size={18} /> Book Visit
        </button>
      </div>
    </div>
    
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard icon={<Heart />} value="72" label="Heart Rate" badge="Normal" badgeType="up" colorClass="red" trend="avg 68-75 BPM" />
      <StatCard icon={<Droplets />} value="120/80" label="Blood Pressure" badge="Stable" badgeType="up" colorClass="blue" trend="Last taken 2h ago" />
      <StatCard icon={<Activity />} value="98%" label="SpO2 Level" badge="Great" badgeType="up" colorClass="teal" trend="Resting saturation" />
      <StatCard icon={<FlaskConical />} value="5.6" label="Glucose" badge="Safe" badgeType="up" colorClass="amber" trend="mmol/L (Post-meal)" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="card overflow-hidden border-none shadow-xl bg-white dark:bg-card-custom">
          <div className="p-6 border-b border-border-custom flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2"><Calendar size={20} className="text-primary" /> Upcoming Appointments</h3>
            <button className="text-xs font-bold text-primary hover:underline hover:bg-primary-bg px-3 py-1.5 rounded-lg transition-colors" onClick={() => onNavigate('appointments')}>View Schedule</button>
          </div>
          <div className="p-6">
            {appointments.filter(a => a.status === 'Upcoming').length > 0 ? (
              <div className="space-y-4">
                {appointments.filter(a => a.status === 'Upcoming').slice(0, 2).map((a, i) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 rounded-[20px] bg-bg-custom border border-border-custom hover:border-primary/30 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-border-custom shadow-sm flex flex-col items-center justify-center text-center leading-none shrink-0 border border-border-custom">
                      <span className="text-[10px] uppercase font-bold text-text-3 mb-1">{a.date.split(' ')[0]}</span>
                      <span className="text-lg font-bold">{a.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-text-custom mb-0.5">{a.doctor}</h4>
                      <p className="text-xs text-text-3 font-medium">{a.type} · {a.time}</p>
                    </div>
                    <StatusTag status={a.status} />
                    <button className="p-2 ml-2 rounded-xl border border-border-custom text-text-3 group-hover:text-primary group-hover:border-primary transition-all">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-bg-custom rounded-full flex items-center justify-center mx-auto mb-4 text-text-3">
                  <Calendar size={24} />
                </div>
                <p className="text-text-2 font-bold mb-4">No upcoming appointments</p>
                <button 
                  className="px-5 py-2.5 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-all"
                  onClick={() => onOpenModal('modal-appointment')}
                >
                  Schedule Your First Visit
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="card overflow-hidden border-none shadow-xl bg-white dark:bg-card-custom relative">
          <div className="p-6 border-b border-border-custom flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2"><ClipboardList size={20} className="text-teal-custom" /> Active Prescriptions</h3>
            <button className="text-xs font-bold text-primary hover:underline" onClick={() => onNavigate('prescriptions')}>View All</button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEMO_PRESCRIPTIONS.slice(0, 2).map(rx => (
                <div key={rx.id} className="p-5 rounded-[24px] bg-bg-custom/50 border border-border-custom group hover:border-teal-custom/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-white dark:bg-border-custom rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-xl">💊</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${rx.progress > 80 ? 'bg-amber-bg text-amber-custom' : 'bg-green-bg text-green-custom'}`}>
                      {rx.progress > 80 ? 'Low Stock' : 'In Progress'}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-text-custom mb-1">{rx.medication}</h4>
                  <p className="text-[11px] text-text-3 font-medium mb-4">{rx.dosage} · {rx.frequency}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-border-custom rounded-full overflow-hidden">
                      <div className="h-full bg-teal-custom" style={{ width: `${rx.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-extrabold text-text-2">{rx.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="card overflow-hidden border-none shadow-xl bg-primary text-white p-8 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MessageSquare size={120} />
          </div>
          <h3 className="text-lg font-extrabold mb-2 relative z-10 flex items-center gap-2">
            <Zap size={20} className="text-amber-300" /> AI Health Insight
          </h3>
          <p className="text-sm text-white/80 mb-6 font-medium leading-relaxed relative z-10">
            Based on your heart rate trends this week, your cardio fitness is improving. Keep up the 30-min walking routine!
          </p>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6 relative z-10">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-white/70">Weekly Goal Progress</span>
               <span className="text-xs font-bold">82%</span>
             </div>
             <div className="h-2 bg-white/20 rounded-full overflow-hidden">
               <div className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]" style={{ width: '82%' }}></div>
             </div>
          </div>
          <button 
            className="w-full py-4 bg-white text-primary font-extrabold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 relative z-10"
            onClick={() => onNavigate('chat')}
          >
            Ask Health AI <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="card overflow-hidden border-none shadow-xl bg-white dark:bg-card-custom">
          <div className="p-6 border-b border-border-custom bg-bg-custom/30">
            <h3 className="text-sm font-bold flex items-center gap-2"><Droplets size={18} className="text-red-custom" /> Vitals History</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { label: 'Blood Glucose', value: '5.6', sub: 'mmol/L', color: 'bg-amber-custom' },
                { label: 'Cholesterol', value: '182', sub: 'mg/dL', color: 'bg-primary' },
                { label: 'Weight', value: '72.4', sub: 'kg', color: 'bg-teal-custom' }
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-1.5 h-8 rounded-full ${v.color}`}></div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-text-3 tracking-wider">{v.label}</div>
                    <div className="text-sm font-bold">{v.value} <span className="text-[11px] font-medium opacity-50">{v.sub}</span></div>
                  </div>
                  <div className="w-16 h-8 opacity-40">
                    <LineChart data={[10, 20, 15, 25, 20, 30]} height={30} showGrid={false} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-border-custom rounded-xl text-xs font-bold text-text-2 hover:bg-bg-custom transition-all">Download Yearly Report</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = (props) => {
  if (props.role === 'doctor') return <DoctorDashboard {...props} />;
  if (props.role === 'patient') return <PatientDashboard {...props} />;
  return <AdminDashboard {...props} />;
};
