import React from 'react';
import { StatCard } from './StatCard';
import { BarChart, LineChart, DonutChart } from './Charts';
import { StatusTag } from './StatusTag';
import { DEMO_DOCTORS, DEMO_PRESCRIPTIONS, DEMO_RECORDS, DEMO_FILES } from '../constants';
import { formatDate } from '../utils';

import { Doctor, Prescription } from '../types';

export const Analytics: React.FC = () => (
  <>
    <div className="page-head flex items-start justify-between mb-6">
      <div>
        <div className="page-title text-[22px] font-extrabold tracking-tight">Analytics</div>
        <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Performance metrics and insights</div>
      </div>
    </div>
    <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard icon="👁️" value="28.4K" label="Total Visits" badge="14%" badgeType="up" colorClass="blue" />
      <StatCard icon="✅" value="94%" label="Satisfaction" badge="3%" badgeType="up" colorClass="teal" />
      <StatCard icon="⏱️" value="18min" label="Avg Wait Time" badge="4min" badgeType="down" colorClass="amber" />
      <StatCard icon="💰" value="$1.2M" label="YTD Revenue" badge="9%" badgeType="up" colorClass="green" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div className="card">
        <div className="card-head p-4.5 border-b border-border-custom"><div className="card-title text-sm font-bold">📊 Monthly Admissions</div></div>
        <div className="card-inner p-5"><BarChart data={[95, 112, 108, 140, 155, 132, 168, 152]} color="#0066FF" /></div>
      </div>
      <div className="card">
        <div className="card-head p-4.5 border-b border-border-custom"><div className="card-title text-sm font-bold">💰 Revenue Trend</div></div>
        <div className="card-inner p-5"><LineChart data={[82, 88, 94, 91, 102, 98, 110, 108]} color="#00C9A7" /></div>
      </div>
    </div>
  </>
);

export const Doctors: React.FC<{ onOpenModal: (id: string) => void; onViewProfile: (doc: Doctor) => void }> = ({ onOpenModal, onViewProfile }) => (
  <>
    <div className="page-head flex items-start justify-between mb-6">
      <div>
        <div className="page-title text-[22px] font-extrabold tracking-tight">Doctors</div>
        <div className="page-subtitle text-[13px] text-text-2 mt-0.5">{DEMO_DOCTORS.length} specialists on staff</div>
      </div>
      <div className="page-actions"><button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold" onClick={() => onOpenModal('modal-doctor')}> + Add Doctor</button></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {DEMO_DOCTORS.map(d => (
        <div key={d.id} className="doc-card bg-white rounded-xl border-1.5 border-border-custom p-4 text-center transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
          <div className={`doc-ava w-15 h-15 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3 border-3 border-border-custom ${d.color}`}>{d.initials}</div>
          <div className="doc-name text-sm font-bold mb-0.5">{d.name}</div>
          <div className="doc-spec text-[11px] text-text-3 mb-2">{d.spec}</div>
          <div className="doc-rating flex items-center justify-center gap-1 mb-3 text-xs font-semibold text-amber-custom">★★★★★ <span className="text-text-3">({d.rating})</span></div>
          <div className="text-[12px] text-text-3 mb-3">{d.patients} patients</div>
          <div className="flex gap-2">
            <button 
              className="btn btn-sm btn-secondary flex-1 bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary-bg transition-all"
              onClick={() => onViewProfile(d)}
            >
              Profile
            </button>
            <button className="btn btn-sm btn-primary flex-1 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all" onClick={() => onOpenModal('modal-appointment')}>Book</button>
          </div>
        </div>
      ))}
    </div>
  </>
);

interface PrescriptionsProps {
  onOpenModal: (id: string) => void;
  prescriptions: Prescription[];
  onDeleteRx: (id: string) => void;
  onUpdateReminders: (id: string, reminders: string[]) => void;
}

export const Prescriptions: React.FC<PrescriptionsProps> = ({ onOpenModal, prescriptions, onDeleteRx, onUpdateReminders }) => (
  <>
    <div className="page-head flex items-start justify-between mb-6">
      <div>
        <div className="page-title text-[22px] font-extrabold tracking-tight">Prescriptions</div>
        <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Active medications and treatment plans</div>
      </div>
      <div className="page-actions"><button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold" onClick={() => onOpenModal('modal-prescription')}>+ Add Prescription</button></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {prescriptions.map(rx => (
        <div key={rx.id} className="rx-card bg-white rounded-xl border-1.5 border-border-custom p-4 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-0.5">
          <div className="rx-header flex items-center gap-2.5 mb-3">
            <div className="rx-icon w-10 h-10 bg-purple-bg rounded-lg flex items-center justify-center text-xl">💊</div>
            <div>
              <div className="rx-name text-sm font-bold">{rx.medication}</div>
              <div className="rx-generic text-[11px] text-text-3">{rx.generic}</div>
            </div>
            <span className="tag tag-green bg-green-bg text-green-custom ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold">Active</span>
          </div>
          <div className="rx-detail flex items-center gap-1.5 text-[12px] text-text-2 mb-1.5">📏 {rx.dosage} · {rx.frequency}</div>
          <div className="rx-detail flex items-center gap-1.5 text-[12px] text-text-2 mb-1.5">👩‍⚕️ {rx.doctor}</div>
          <div className="rx-detail flex items-center gap-1.5 text-[12px] text-text-2 mb-2.5">📅 {formatDate(rx.start)} → {formatDate(rx.end)}</div>
          
          <div className="reminders-section mt-3 pt-3 border-t border-border-custom">
            <div className="text-[11px] font-bold text-text-custom mb-2 uppercase flex items-center gap-1.5">
              🔔 Reminders
            </div>
            <div className="flex flex-wrap gap-1.5">
              {rx.reminders && rx.reminders.length > 0 ? (
                rx.reminders.map((time, idx) => (
                  <div key={idx} className="bg-bg-custom px-2 py-1 rounded text-[11px] font-semibold text-text-2 border border-border-custom">
                    {time}
                  </div>
                ))
              ) : (
                <span className="text-[11px] text-text-3 italic">No reminders set</span>
              )}
            </div>
          </div>

          <div className="text-[12px] text-text-3 mt-3 p-2 bg-bg-custom rounded-lg italic">"{rx.instructions}"</div>
          <div className="mt-2 flex justify-between text-[11px] text-text-3 mb-1"><span>Treatment Progress</span><span className="font-bold text-primary">{rx.progress}%</span></div>
          <div className="rx-progress h-1 bg-bg-custom rounded-full overflow-hidden"><div className="rx-progress-fill h-full bg-gradient-to-r from-primary to-teal-custom" style={{ width: `${rx.progress}%` }}></div></div>
          <div className="flex gap-1.5 mt-3">
            <button className="btn btn-sm btn-secondary flex-1 bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary-bg transition-all">🔄 Refill</button>
            <button 
              className="btn btn-sm btn-ghost p-1.5 rounded-lg hover:bg-gray-100 text-sm"
              onClick={() => onDeleteRx(rx.id)}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
);

export const Records: React.FC = () => (
  <>
    <div className="page-head flex items-start justify-between mb-6">
      <div>
        <div className="page-title text-[22px] font-extrabold tracking-tight">Health Records</div>
        <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Complete medical history timeline</div>
      </div>
      <div className="page-actions"><button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold">+ Add Record</button></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card">
        <div className="card-head p-4.5 border-b border-border-custom"><div className="card-title text-sm font-bold">📋 Medical Timeline</div></div>
        <div className="card-inner p-5">
          <div className="record-timeline flex flex-col">
            {DEMO_RECORDS.map((r, idx) => (
              <div key={r.id} className="rt-item flex gap-3.5 py-3.5 relative">
                {idx !== DEMO_RECORDS.length - 1 && <div className="absolute left-[18px] top-[46px] bottom-[-14px] w-px bg-border-custom"></div>}
                <div className="rt-dot w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 z-[1]" style={{ backgroundColor: r.color }}>{r.icon}</div>
                <div className="rt-content flex-1">
                  <div className="rt-title text-[13px] font-bold">{r.title}</div>
                  <div className="rt-doctor text-[11px] text-text-3 mt-0.5">👩‍⚕️ {r.doctor} · <StatusTag status={r.type} /></div>
                  <div className="rt-date text-[11px] text-text-3 mt-0.5">📅 {formatDate(r.date)}</div>
                  <div className="rt-notes text-[12px] text-text-2 mt-1.5 bg-bg-custom p-2 rounded-lg">{r.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="card">
          <div className="card-head p-4.5 border-b border-border-custom"><div className="card-title text-sm font-bold">📊 Health Overview</div></div>
          <div className="card-inner p-5">
            {[
              ['Blood Pressure', '142/88 mmHg', 'Elevated', 'text-amber-custom'],
              ['Heart Rate', '72 bpm', 'Normal', 'text-green-custom'],
              ['Blood Sugar', '108 mg/dL', 'Normal', 'text-green-custom'],
              ['Cholesterol', '210 mg/dL', 'High', 'text-red-custom']
            ].map(([l, v, s, c], idx) => (
              <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-border-custom last:border-none">
                <div className="flex-1"><div className="text-[13px] font-semibold">{l}</div><div className="text-[11px] text-text-3">{v}</div></div>
                <span className={`text-[11px] font-bold ${c}`}>● {s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
            <div className="card-title text-sm font-bold">📁 Related Files</div>
            <button className="card-action text-xs text-primary font-semibold hover:underline">View all →</button>
          </div>
          <div className="card-inner p-5">
            {DEMO_FILES.slice(0, 3).map(f => (
              <div key={f.id} className="flex items-center gap-3 py-3 border-b border-border-custom last:border-none">
                <div className="text-xl">{f.type === 'pdf' ? '📄' : '🖼️'}</div>
                <div className="flex-1"><div className="text-[12px] font-semibold">{f.name}</div><div className="text-[11px] text-text-3">{f.category} · {f.size}</div></div>
                <button className="btn btn-sm btn-ghost p-1.5 rounded-lg hover:bg-gray-100 text-sm">👁</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export const Vitals: React.FC = () => (
  <>
    <div className="page-head flex items-start justify-between mb-6">
      <div>
        <div className="page-title text-[22px] font-extrabold tracking-tight">My Vitals</div>
        <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Track your health metrics over time</div>
      </div>
      <div className="page-actions"><button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold">+ Log Reading</button></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {[
        ['❤️', 'Heart Rate', '72 bpm', 'Normal', 'bg-green-bg', 'text-green-custom'],
        ['🩸', 'Blood Pressure', '142/88', 'Elevated', 'bg-amber-bg', 'text-amber-custom'],
        ['🌡️', 'Temperature', '98.4°F', 'Normal', 'bg-teal-bg', 'text-teal-custom'],
        ['💉', 'Blood Sugar', '108 mg/dL', 'Normal', 'bg-primary-bg', 'text-primary'],
        ['⚖️', 'BMI', '24.3', 'Normal', 'bg-green-bg', 'text-green-custom'],
        ['🫁', 'SpO2', '98%', 'Normal', 'bg-purple-bg', 'text-purple-custom']
      ].map(([ico, lbl, val, status, bg, clr], idx) => (
        <div key={idx} className="vital-card bg-white rounded-xl border-1.5 border-border-custom p-4 flex items-center gap-3 transition-all hover:shadow-lg">
          <div className={`vital-icon w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${bg}`}>{ico}</div>
          <div className="flex-1"><div className="vital-val text-[22px] font-extrabold tracking-tight leading-none">{val}</div><div className="vital-lbl text-[12px] text-text-2 mt-0.5">{lbl}</div></div>
          <div className="ml-auto"><span className={`text-[11px] font-bold ${clr}`}>● {status}</span></div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card">
        <div className="card-head p-4.5 border-b border-border-custom"><div className="card-title text-sm font-bold">❤️ Heart Rate Trend</div></div>
        <div className="card-inner p-5"><LineChart data={[68, 72, 75, 71, 69, 73, 70, 72]} color="#FF3B3B" /></div>
      </div>
      <div className="card">
        <div className="card-head p-4.5 border-b border-border-custom"><div className="card-title text-sm font-bold">🩸 Blood Pressure Trend</div></div>
        <div className="card-inner p-5"><LineChart data={[135, 140, 138, 142, 145, 141, 139, 142]} color="#FF8B00" /></div>
      </div>
    </div>
  </>
);
