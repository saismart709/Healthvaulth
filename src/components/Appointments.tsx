import React, { useState } from 'react';
import { Appointment } from '../types';
import { StatusTag } from './StatusTag';
import { avatarColors, formatDate } from '../utils';

interface AppointmentsProps {
  onOpenModal: (id: string) => void;
  appointments: Appointment[];
  onDeleteAppt: (id: string) => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({ onOpenModal, appointments, onDeleteAppt }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const filteredAppts = selectedDate 
    ? appointments.filter(a => a.date === selectedDate)
    : appointments;

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = currentDate.getDate();

  const events = appointments
    .filter(a => a.status === 'Upcoming' && new Date(a.date).getMonth() === month && new Date(a.date).getFullYear() === year)
    .map(a => new Date(a.date).getDate());

  const redDays = appointments
    .filter(a => (a.status === 'Cancelled' || a.status === 'Completed' || a.status === 'Pending') && new Date(a.date).getMonth() === month && new Date(a.date).getFullYear() === year)
    .map(a => new Date(a.date).getDate());

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Patient,Doctor,Date,Time,Type,Status\n"
      + appointments.map(a => `${a.patient},${a.doctor},${a.date},${a.time},${a.type},${a.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="page-head flex items-start justify-between mb-6">
        <div>
          <div className="page-title text-[22px] font-extrabold tracking-tight">Appointments</div>
          <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Manage and schedule appointments</div>
        </div>
        <div className="page-actions flex gap-2">
          <button 
            className="btn btn-secondary bg-white text-text-custom border-1.5 border-border-custom px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 hover:border-primary hover:text-primary hover:bg-primary-bg transition-all"
            onClick={handleExport}
          >
            ⬇ Export
          </button>
          <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all" onClick={() => onOpenModal('modal-appointment')}>+ New Appointment</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
            <div className="card-title text-sm font-bold">📅 {monthName} {year}</div>
          </div>
          <div className="card-inner p-5">
            <div className="cal-header-grid grid grid-cols-7 gap-0.5 mb-1">
              {days.map(d => <div key={d} className="cal-day-hdr text-[10px] font-bold text-center text-text-3 uppercase py-1.5">{d}</div>)}
            </div>
            <div className="cal-grid grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="cal-cell empty text-transparent pointer-events-none text-xs text-center p-2">-</div>)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = day === today;
                const hasEvent = events.includes(day);
                const isRed = redDays.includes(day) && !hasEvent;
                const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;

                return (
                  <div
                    key={day}
                    className={`cal-cell text-xs text-center p-2 rounded-lg cursor-pointer transition-all leading-none flex items-center justify-center h-9 ${isToday ? 'today bg-primary text-white font-extrabold' : hasEvent ? 'has-ev text-primary font-bold' : isRed ? 'has-ev-r text-red-custom font-bold' : 'hover:bg-primary-bg hover:text-primary'} ${isSelected ? 'border-2 border-primary' : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-head flex items-center justify-between p-4.5 border-b border-border-custom">
            <div className="card-title text-sm font-bold">📋 Appointment List</div>
            <span className="card-action text-[11px] text-text-3">{filteredAppts.length} total</span>
          </div>
          <div className="card-inner p-5 max-h-[400px] overflow-y-auto">
            {filteredAppts.length === 0 ? (
              <div className="p-5 text-center text-text-3">No appointments found for this date.</div>
            ) : (
              filteredAppts.map(a => (
                <div key={a.id} className="appt-item flex items-center gap-3 p-3 rounded-lg border border-border-custom mb-2 last:mb-0 hover:border-primary hover:bg-primary-bg transition-all">
                  <div className={`appt-avatar w-9.5 h-9.5 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${avatarColors(a.patient)}`}>
                    {a.patient.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="appt-info flex-1">
                    <div className="appt-name text-[13px] font-semibold">{a.patient}</div>
                    <div className="appt-time text-[11px] text-text-3">{a.doctor} · {formatDate(a.date)} {a.time}</div>
                  </div>
                  <StatusTag status={a.status} />
                  <div className="appt-actions flex gap-1.5">
                    <button className="btn btn-ghost btn-sm p-2 rounded-lg hover:bg-gray-100 text-sm" title="Reschedule" onClick={() => onOpenModal('modal-appointment')}>✏️</button>
                    <button className="btn btn-ghost btn-sm p-2 rounded-lg hover:bg-red-50 text-red-500 text-sm" title="Cancel" onClick={() => onDeleteAppt(a.id)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
