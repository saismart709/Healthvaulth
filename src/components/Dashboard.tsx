import React from 'react';
import { StatCard } from './StatCard';
import { BarChart, LineChart, DonutChart } from './Charts';
import { StatusTag } from './StatusTag';
import { DEMO_PATIENTS, DEMO_APPOINTMENTS, DEMO_PRESCRIPTIONS } from '../constants';
import { Role, User, Appointment } from '../types';

interface DashboardProps {
  role: Role;
  user: User;
  onNavigate: (page: string) => void;
  onOpenModal: (id: string) => void;
  appointments: Appointment[];
}

const AdminDashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenModal, appointments }) => (
  <>
    <div className="page-head flex items-start justify-between mb-6">
      <div>
        <div className="page-title text-[22px] font-extrabold tracking-tight">Admin Dashboard</div>
        <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Monday, March 24, 2025 · All systems operational</div>
      </div>
      <div className="page-actions flex gap-2">
        <button className="btn btn-secondary bg-white text-text-custom border-1.5 border-border-custom px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 hover:border-primary hover:text-primary hover:bg-primary-bg transition-all" onClick={() => onNavigate('analytics')}>📈 Analytics</button>
        <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all" onClick={() => onOpenModal('modal-appointment')}>+ New Appointment</button>
      </div>
    </div>
    
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard icon="👥" value="1,482" label="Total Patients" badge="12%" badgeType="up" colorClass="blue" />
      <StatCard icon="🩺" value="48" label="Active Doctors" badge="4%" badgeType="up" colorClass="teal" />
      <StatCard icon="📅" value="324" label="Appointments Today" badge="8%" badgeType="up" colorClass="amber" />
      <StatCard icon="🏥" value="12" label="New Cases" badge="5%" badgeType="up" colorClass="purple" />
    </div>
    
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div>
            <div className="card-title text-sm font-bold">📊 Patient Admissions</div>
            <div className="card-sub text-xs text-text-3 mt-0.5">Monthly overview</div>
          </div>
        </div>
        <div className="card-inner p-5">
          <BarChart data={[120, 145, 132, 178, 190, 165, 210, 195]} color="#0066FF" />
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div className="card-title text-sm font-bold">👥 Recent Patients</div>
          <button className="card-action text-xs text-primary font-semibold hover:underline flex items-center gap-1" onClick={() => onNavigate('patients')}>View all →</button>
        </div>
        <div className="card-inner p-5">
          {DEMO_PATIENTS.slice(0, 5).map(p => (
            <div key={p.id} className="p-row flex items-center gap-3 py-3 border-b border-border-custom last:border-none">
              <div className={`t-avatar w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 bg-primary`}>
                {p.name.split(' ').map(w => w[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{p.name}</div>
                <div className="text-[11px] text-text-3">{p.condition} · {p.doctor}</div>
              </div>
              <StatusTag status={p.status} />
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div className="card-title text-sm font-bold">🏥 Disease Distribution</div>
        </div>
        <div className="card-inner p-5 flex items-center gap-5">
          <DonutChart />
          <div className="donut-legend flex flex-col gap-2">
            {[
              { l: 'Cardiac', c: '#0066FF', v: '35%' },
              { l: 'Respiratory', c: '#FF8B00', v: '25%' },
              { l: 'Orthopedic', c: '#00B37E', v: '20%' },
              { l: 'Other', c: '#FF3B3B', v: '20%' }
            ].map((item, idx) => (
              <div key={idx} className="legend-row flex items-center gap-2 text-xs text-text-2">
                <div className="legend-dot w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.c }}></div>
                {item.l}
                <div className="legend-val ml-auto font-bold text-text-custom">{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

const DoctorDashboard: React.FC<DashboardProps> = ({ user, onNavigate, onOpenModal, appointments }) => (
  <>
    <div className="page-head flex items-start justify-between mb-6">
      <div>
        <div className="page-title text-[22px] font-extrabold tracking-tight">Doctor Dashboard</div>
        <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Good morning, {user.name}! You have 5 appointments today.</div>
      </div>
      <div className="page-actions flex gap-2">
        <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all" onClick={() => onOpenModal('modal-appointment')}>+ Schedule</button>
      </div>
    </div>
    
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard icon="👥" value="124" label="My Patients" badge="12%" badgeType="up" colorClass="blue" />
      <StatCard icon="📅" value="5" label="Today's Appts" badge="2" badgeType="up" colorClass="amber" />
      <StatCard icon="✅" value="230" label="Completed" badge="8%" badgeType="up" colorClass="green" />
      <StatCard icon="⭐" value="4.9" label="Patient Rating" badge="0.2" badgeType="up" colorClass="purple" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div className="card-title text-sm font-bold">📅 Today's Appointments</div>
          <button className="card-action text-xs text-primary font-semibold hover:underline flex items-center gap-1" onClick={() => onNavigate('appointments')}>View all →</button>
        </div>
        <div className="card-inner p-5">
          {appointments.slice(0, 4).map(a => (
            <div key={a.id} className="appt-item flex items-center gap-3 p-3 rounded-lg border border-border-custom mb-2 last:mb-0 hover:border-primary hover:bg-primary-bg transition-all">
              <div className={`appt-avatar w-9.5 h-9.5 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 bg-primary`}>
                {a.patient.split(' ').map(w => w[0]).join('')}
              </div>
              <div className="appt-info flex-1">
                <div className="appt-name text-[13px] font-semibold">{a.patient}</div>
                <div className="appt-time text-[11px] text-text-3">{a.time} · {a.type}</div>
              </div>
              <StatusTag status={a.status} />
              <div className="appt-actions flex gap-1.5">
                <button className="btn btn-sm btn-secondary bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary-bg transition-all">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div className="card-title text-sm font-bold">🏥 Disease Breakdown</div>
        </div>
        <div className="card-inner p-5 flex items-center gap-5">
          <DonutChart />
          <div className="donut-legend flex flex-col gap-2">
            {[
              { l: 'Cardiac', c: '#0066FF', v: '35%' },
              { l: 'Respiratory', c: '#FF8B00', v: '25%' },
              { l: 'Orthopedic', c: '#00B37E', v: '20%' },
              { l: 'Other', c: '#FF3B3B', v: '20%' }
            ].map((item, idx) => (
              <div key={idx} className="legend-row flex items-center gap-2 text-xs text-text-2">
                <div className="legend-dot w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.c }}></div>
                {item.l}
                <div className="legend-val ml-auto font-bold text-text-custom">{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
    <div className="card">
      <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
        <div className="card-title text-sm font-bold">🧑 Recent Patients</div>
        <button className="card-action text-xs text-primary font-semibold hover:underline flex items-center gap-1" onClick={() => onNavigate('patients')}>View all →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Patient</th>
              <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Condition</th>
              <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Last Visit</th>
              <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Status</th>
              <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_PATIENTS.slice(0, 4).map(p => (
              <tr key={p.id} className="hover:bg-bg-custom transition-colors">
                <td className="px-4 py-3.5 border-b border-border-custom align-middle">
                  <div className="td-avatar flex items-center gap-2.5">
                    <div className={`t-avatar w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 bg-primary`}>
                      {p.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div className="t-name text-[13px] font-semibold">{p.name}</div>
                      <div className="t-sub text-[11px] text-text-3">{p.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 border-b border-border-custom align-middle text-[13px]">{p.condition}</td>
                <td className="px-4 py-3.5 border-b border-border-custom align-middle text-[13px]">{appointments.find(a => a.patient === p.name)?.date || p.dob}</td>
                <td className="px-4 py-3.5 border-b border-border-custom align-middle"><StatusTag status={p.status} /></td>
                <td className="px-4 py-3.5 border-b border-border-custom align-middle">
                  <div className="td-actions flex gap-1">
                    <button className="btn btn-sm btn-secondary bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary-bg transition-all">📋 Records</button>
                    <button className="btn btn-sm btn-primary bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all">📅 Book</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

const PatientDashboard: React.FC<DashboardProps> = ({ user, onNavigate, onOpenModal, appointments }) => (
  <>
    <div className="page-head flex items-start justify-between mb-6">
      <div>
        <div className="page-title text-[22px] font-extrabold tracking-tight">My Dashboard</div>
        <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Hi {user.name.split(' ')[0]}! Stay on top of your health today.</div>
      </div>
      <div className="page-actions flex gap-2">
        <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all" onClick={() => onOpenModal('modal-appointment')}>+ Book Appointment</button>
      </div>
    </div>
    
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard icon="📅" value="3" label="Upcoming Appts" colorClass="blue" />
      <StatCard icon="💊" value="2" label="Active Meds" colorClass="amber" />
      <StatCard icon="📋" value="4" label="Health Records" colorClass="green" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div className="card-title text-sm font-bold">📅 Upcoming Appointments</div>
          <button className="card-action text-xs text-primary font-semibold hover:underline flex items-center gap-1" onClick={() => onNavigate('appointments')}>View all →</button>
        </div>
        <div className="card-inner p-5">
          {appointments.filter(a => a.status === 'Upcoming').slice(0, 3).map(a => (
            <div key={a.id} className="appt-item flex items-center gap-3 p-3 rounded-lg border border-border-custom mb-2 last:mb-0 hover:border-primary hover:bg-primary-bg transition-all">
              <div className={`appt-avatar w-9.5 h-9.5 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 bg-primary`}>
                {a.doctor.split(' ').pop()?.[0]}
              </div>
              <div className="appt-info flex-1">
                <div className="appt-name text-[13px] font-semibold">{a.doctor}</div>
                <div className="appt-time text-[11px] text-text-3">{a.date} at {a.time} · {a.type}</div>
              </div>
              <StatusTag status={a.status} />
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div className="card-title text-sm font-bold">🤖 AI Health Insight</div>
        </div>
        <div className="card-inner p-5">
          <div className="bg-gradient-to-br from-primary-bg to-teal-bg rounded-lg p-3.5 mb-3">
            <div className="text-[13px] font-bold mb-1.5 text-primary">⚠️ Blood Pressure Alert</div>
            <div className="text-[12px] text-text-2 mb-2">Your last reading was 142/88 — slightly elevated. Continue monitoring.</div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-3 w-15">BP Level</span>
              <div className="pbar flex-1 h-1.5 bg-bg-custom rounded-full overflow-hidden">
                <div className="pbar-fill h-full bg-gradient-to-r from-amber-custom to-red-custom" style={{ width: '72%' }}></div>
              </div>
              <span className="text-[11px] font-bold text-amber-custom">72%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-secondary flex-1 bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary-bg transition-all" onClick={() => onNavigate('chat')}>🤖 Ask AI</button>
            <button className="btn btn-sm btn-primary flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all" onClick={() => onOpenModal('modal-appointment')}>📅 Book Checkup</button>
          </div>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 gap-4">
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div className="card-title text-sm font-bold">💊 Active Prescriptions</div>
          <button className="card-action text-xs text-primary font-semibold hover:underline flex items-center gap-1" onClick={() => onNavigate('prescriptions')}>View all →</button>
        </div>
        <div className="card-inner p-5">
          {DEMO_PRESCRIPTIONS.slice(0, 2).map(rx => (
            <div key={rx.id} className="py-2.5 border-b border-border-custom last:border-none">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="rx-icon text-lg">💊</div>
                <div>
                  <div className="text-[13px] font-bold">{rx.medication}</div>
                  <div className="text-[11px] text-text-3">{rx.dosage} · {rx.frequency}</div>
                </div>
                <span className="tag tag-green bg-green-bg text-green-custom ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold">Active</span>
              </div>
              <div className="pbar h-1.5 bg-bg-custom rounded-full overflow-hidden">
                <div className="pbar-fill h-full bg-primary" style={{ width: `${rx.progress}%` }}></div>
              </div>
              <div className="text-[10px] text-text-3 mt-1">Progress: {rx.progress}% complete</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export const Dashboard: React.FC<DashboardProps> = (props) => {
  if (props.role === 'doctor') return <DoctorDashboard {...props} />;
  if (props.role === 'patient') return <PatientDashboard {...props} />;
  return <AdminDashboard {...props} />;
};
