export type Role = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: Role;
  name: string;
  avatar: string;
  specialty?: string;
  blood?: string;
  age?: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  blood: string;
  gender: string;
  condition: string;
  status: string;
  doctor: string;
}

export interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string;
}

export interface Prescription {
  id: string;
  patient: string;
  medication: string;
  generic: string;
  dosage: string;
  frequency: string;
  start: string;
  end: string;
  doctor: string;
  instructions: string;
  progress: number;
  reminders?: string[]; // Array of times like ["08:00", "20:00"]
}

export interface HealthFile {
  id: string;
  name: string;
  category: string;
  size: string;
  type: 'pdf' | 'img' | 'doc' | 'other';
  uploaded: string;
  patient: string;
  desc: string;
}

export interface HealthRecord {
  id: string;
  title: string;
  doctor: string;
  date: string;
  type: string;
  notes: string;
  icon: string;
  color: string;
}

export interface Doctor {
  id: string;
  name: string;
  spec: string;
  rating: number;
  patients: number;
  initials: string;
  color: string;
  about?: string;
  education?: string;
  experience?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string }[];
}
