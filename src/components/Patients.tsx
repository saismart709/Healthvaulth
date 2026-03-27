import React, { useState } from 'react';
import { DEMO_PATIENTS, DEMO_APPOINTMENTS } from '../constants';
import { StatusTag } from './StatusTag';
import { avatarColors } from '../utils';

interface PatientsProps {
  onOpenModal: (id: string) => void;
}

export const Patients: React.FC<PatientsProps> = ({ onOpenModal }) => {
  const [filter, setFilter] = useState('All');

  const filteredPatients = filter === 'All' 
    ? DEMO_PATIENTS 
    : DEMO_PATIENTS.filter(p => p.status === filter);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,DOB,Gender,Blood,Email,Phone,Condition,Doctor,Status\n"
      + DEMO_PATIENTS.map(p => `${p.name},${p.dob},${p.gender},${p.blood},${p.email},${p.phone},${p.condition},${p.doctor},${p.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `patients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="page-head flex items-start justify-between mb-6">
        <div>
          <div className="page-title text-[22px] font-extrabold tracking-tight">Patients</div>
          <div className="page-subtitle text-[13px] text-text-2 mt-0.5">{DEMO_PATIENTS.length} patients registered</div>
        </div>
        <div className="page-actions flex gap-2">
          <button 
            className="btn btn-secondary bg-white text-text-custom border-1.5 border-border-custom px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 hover:border-primary hover:text-primary hover:bg-primary-bg transition-all"
            onClick={handleExport}
          >
            ⬇ Export
          </button>
          <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all" onClick={() => onOpenModal('modal-patient')}>+ Add Patient</button>
        </div>
      </div>
      
      <div className="card">
        <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
          <div className="card-title text-sm font-bold">All Patients</div>
          <div className="flex gap-2">
            {['All', 'Active', 'Inactive', 'Critical'].map(f => (
              <button
                key={f}
                className={`filter-btn px-3.5 py-1.5 rounded-lg border-1.5 border-border-custom text-xs font-semibold transition-all ${filter === f ? 'active border-primary text-primary bg-primary-bg' : 'bg-white text-text-2 hover:border-primary hover:text-primary'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Patient</th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Blood</th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Contact</th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Condition</th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Doctor</th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Status</th>
                <th className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-4 py-2.5 text-left border-b-2 border-border-custom whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(p => (
                <tr key={p.id} className="hover:bg-bg-custom transition-colors">
                  <td className="px-4 py-3.5 border-b border-border-custom align-middle">
                    <div className="td-avatar flex items-center gap-2.5">
                      <div className={`t-avatar w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarColors(p.name)}`}>
                        {p.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <div className="t-name text-[13px] font-semibold">{p.name}</div>
                        <div className="t-sub text-[11px] text-text-3">{p.dob} · {p.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-custom align-middle">
                    <span className="tag tag-red bg-red-bg text-red-custom px-2 py-0.5 rounded-full text-[11px] font-bold">{p.blood}</span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-custom align-middle">
                    <div className="text-[12px]">{p.email}</div>
                    <div className="text-[11px] text-text-3">{p.phone}</div>
                  </td>
                  <td className="px-4 py-3.5 border-b border-border-custom align-middle text-[13px]">{p.condition}</td>
                  <td className="px-4 py-3.5 border-b border-border-custom align-middle text-[12px] text-text-2">{p.doctor}</td>
                  <td className="px-4 py-3.5 border-b border-border-custom align-middle"><StatusTag status={p.status} /></td>
                  <td className="px-4 py-3.5 border-b border-border-custom align-middle">
                    <div className="td-actions flex gap-1">
                      <button className="btn btn-sm btn-secondary bg-white border border-border-custom px-2 py-1.5 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary-bg transition-all">📋</button>
                      <button className="btn btn-sm btn-primary bg-primary text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark transition-all" onClick={() => onOpenModal('modal-appointment')}>📅</button>
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
};
