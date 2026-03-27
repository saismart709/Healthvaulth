import { User, Patient, Appointment, Prescription, HealthFile, HealthRecord, Doctor } from './types';

export const DEMO_USERS: User[] = [
  { id: 'u1', email: 'admin@healthvault.com', password: 'demo1234', role: 'admin', name: 'Alexandra Morgan', avatar: 'AM' },
  { id: 'u2', email: 'doctor@healthvault.com', password: 'demo1234', role: 'doctor', name: 'Dr. Sarah Kim', avatar: 'SK', specialty: 'Cardiology' },
  { id: 'u3', email: 'patient@healthvault.com', password: 'demo1234', role: 'patient', name: 'John Anderson', avatar: 'JA', blood: 'O+', age: 34 },
];

export const DEMO_PATIENTS: Patient[] = [
  { id: 'p1', name: 'John Anderson', email: 'john@example.com', phone: '+1-555-0101', dob: '1990-03-15', blood: 'O+', gender: 'Male', condition: 'Hypertension', status: 'Active', doctor: 'Dr. Sarah Kim' },
  { id: 'p2', name: 'Emily Clark', email: 'emily@example.com', phone: '+1-555-0102', dob: '1985-07-22', blood: 'A+', gender: 'Female', condition: 'Diabetes Type 2', status: 'Active', doctor: 'Dr. James Chen' },
  { id: 'p3', name: 'Michael Torres', email: 'michael@example.com', phone: '+1-555-0103', dob: '1978-11-08', blood: 'B+', gender: 'Male', condition: 'Asthma', status: 'Inactive', doctor: 'Dr. Priya Nair' },
  { id: 'p4', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0104', dob: '1995-01-30', blood: 'AB-', gender: 'Female', condition: 'Migraine', status: 'Active', doctor: 'Dr. Michael Ross' },
  { id: 'p5', name: 'Robert Kim', email: 'robert@example.com', phone: '+1-555-0105', dob: '1970-06-14', blood: 'A-', gender: 'Male', condition: 'Cardiac Arrhythmia', status: 'Critical', doctor: 'Dr. Sarah Kim' },
  { id: 'p6', name: 'Lisa Patel', email: 'lisa@example.com', phone: '+1-555-0106', dob: '2001-09-12', blood: 'O-', gender: 'Female', condition: 'Anxiety Disorder', status: 'Active', doctor: 'Dr. James Chen' },
];

export const DEMO_APPOINTMENTS: Appointment[] = [
  { id: 'a1', patient: 'John Anderson', doctor: 'Dr. Sarah Kim', date: '2026-03-24', time: '09:00', type: 'Consultation', status: 'Upcoming', notes: 'Follow-up on BP meds' },
  { id: 'a2', patient: 'Emily Clark', doctor: 'Dr. James Chen', date: '2026-03-24', time: '10:30', type: 'Follow-up', status: 'Completed', notes: 'Diabetes monitoring' },
  { id: 'a3', patient: 'Michael Torres', doctor: 'Dr. Priya Nair', date: '2026-03-24', time: '14:00', type: 'General Checkup', status: 'Upcoming', notes: 'Annual checkup' },
  { id: 'a4', patient: 'Sarah Johnson', doctor: 'Dr. Michael Ross', date: '2026-03-25', time: '11:00', type: 'Lab Review', status: 'Upcoming', notes: 'MRI results review' },
  { id: 'a5', patient: 'Robert Kim', doctor: 'Dr. Sarah Kim', date: '2026-03-26', time: '08:30', type: 'Emergency', status: 'Upcoming', notes: 'Cardiac follow-up' },
  { id: 'a6', patient: 'Lisa Patel', doctor: 'Dr. James Chen', date: '2026-03-23', time: '15:30', type: 'Consultation', status: 'Completed', notes: 'Anxiety therapy check' },
];

export const DEMO_PRESCRIPTIONS: Prescription[] = [
  { id: 'rx1', patient: 'John Anderson', medication: 'Amlodipine', generic: 'Norvasc', dosage: '5mg', frequency: 'Once daily', start: '2025-01-15', end: '2025-04-15', doctor: 'Dr. Sarah Kim', instructions: 'Take at same time each day', progress: 75, reminders: ['08:00'] },
  { id: 'rx2', patient: 'John Anderson', medication: 'Metformin', generic: 'Glucophage', dosage: '500mg', frequency: 'Twice daily', start: '2025-02-01', end: '2025-05-01', doctor: 'Dr. James Chen', instructions: 'Take with meals', progress: 50, reminders: ['08:00', '20:00'] },
  { id: 'rx3', patient: 'Emily Clark', medication: 'Lisinopril', generic: 'Prinivil', dosage: '10mg', frequency: 'Once daily', start: '2025-03-01', end: '2025-06-01', doctor: 'Dr. James Chen', instructions: 'Monitor BP weekly', progress: 25, reminders: ['09:00'] },
  { id: 'rx4', patient: 'Robert Kim', medication: 'Warfarin', generic: 'Coumadin', dosage: '2.5mg', frequency: 'Once daily', start: '2025-01-20', end: '2025-07-20', doctor: 'Dr. Sarah Kim', instructions: 'Regular INR checks required', progress: 60, reminders: ['18:00'] },
];

export const DEMO_FILES: HealthFile[] = [
  { id: 'f1', name: 'Blood_Test_Results_March2025.pdf', category: 'Lab Report', size: '2.4 MB', type: 'pdf', uploaded: '2025-03-20', patient: 'John Anderson', desc: 'Complete blood count and metabolic panel' },
  { id: 'f2', name: 'Chest_Xray_Feb2025.jpg', category: 'Imaging', size: '4.8 MB', type: 'img', uploaded: '2025-02-15', patient: 'Robert Kim', desc: 'Chest X-ray, no abnormalities' },
  { id: 'f3', name: 'Prescription_Amlodipine.pdf', category: 'Prescription', size: '0.8 MB', type: 'pdf', uploaded: '2025-01-15', patient: 'John Anderson', desc: 'Amlodipine 5mg prescription' },
  { id: 'f4', name: 'Insurance_Card_2025.pdf', category: 'Insurance', size: '1.2 MB', type: 'pdf', uploaded: '2025-01-01', patient: 'Emily Clark', desc: 'Blue Cross insurance card' },
  { id: 'f5', name: 'MRI_Brain_Scan.jpg', category: 'Imaging', size: '8.1 MB', type: 'img', uploaded: '2025-03-18', patient: 'Sarah Johnson', desc: 'Brain MRI — pending review' },
  { id: 'f6', name: 'Echocardiogram_Report.pdf', category: 'Lab Report', size: '3.3 MB', type: 'pdf', uploaded: '2025-03-10', patient: 'Robert Kim', desc: 'Echo — ejection fraction 55%' },
];

export const DEMO_RECORDS: HealthRecord[] = [
  { id: 'r1', title: 'Hypertension Diagnosis', doctor: 'Dr. Sarah Kim', date: '2024-09-10', type: 'Diagnosis', notes: 'Stage 2 hypertension. Started on Amlodipine 5mg. Lifestyle modifications advised.', icon: '🔴', color: '#FFECEC' },
  { id: 'r2', title: 'Annual Physical Exam', doctor: 'Dr. James Chen', date: '2024-11-15', type: 'Exam', notes: 'All vitals within normal range. BMI 24.3. Recommended follow-up in 6 months.', icon: '✅', color: '#E6F9F3' },
  { id: 'r3', title: 'Blood Work — Full Panel', doctor: 'Dr. Sarah Kim', date: '2025-01-20', type: 'Lab', notes: 'Cholesterol slightly elevated at 210mg/dL. LDL 130. Dietary changes recommended.', icon: '🧪', color: '#EEF4FF' },
  { id: 'r4', title: 'ECG Monitoring', doctor: 'Dr. Sarah Kim', date: '2025-03-01', type: 'Procedure', notes: 'Normal sinus rhythm. PR interval 160ms. QRS 90ms. No abnormalities.', icon: '💗', color: '#F0EBFF' },
];

export const DEMO_DOCTORS: Doctor[] = [
  { 
    id: 'd1', 
    name: 'Dr. Sarah Kim', 
    spec: 'Cardiology', 
    rating: 4.9, 
    patients: 124, 
    initials: 'SK', 
    color: 'bg-blue-600', 
    about: 'Dr. Sarah Kim is a renowned cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She is dedicated to providing personalized care and improving heart health.', 
    education: 'MD from Harvard Medical School', 
    experience: '15+ Years' 
  },
  { 
    id: 'd2', 
    name: 'Dr. James Chen', 
    spec: 'Endocrinology', 
    rating: 4.7, 
    patients: 98, 
    initials: 'JC', 
    color: 'bg-teal-600', 
    about: 'Dr. James Chen specializes in the treatment of diabetes and metabolic disorders. He believes in a holistic approach to patient wellness and lifestyle management.', 
    education: 'MD from Stanford University', 
    experience: '12 Years' 
  },
  { 
    id: 'd3', 
    name: 'Dr. Priya Nair', 
    spec: 'Pulmonology', 
    rating: 4.8, 
    patients: 87, 
    initials: 'PN', 
    color: 'bg-purple-600', 
    about: 'Dr. Priya Nair is an expert in respiratory health, treating conditions like asthma and COPD. She has led numerous clinical trials for advanced respiratory therapies.', 
    education: 'MD from Johns Hopkins University', 
    experience: '10 Years' 
  },
  { 
    id: 'd4', 
    name: 'Dr. Michael Ross', 
    spec: 'Neurology', 
    rating: 4.6, 
    patients: 112, 
    initials: 'MR', 
    color: 'bg-amber-600', 
    about: 'Dr. Michael Ross focuses on neurological disorders including stroke, epilepsy, and migraines. He is known for his compassionate care and evidence-based treatment plans.', 
    education: 'MD from University of Pennsylvania', 
    experience: '14 Years' 
  },
  { 
    id: 'd5', 
    name: 'Dr. Anna Patel', 
    spec: 'Pediatrics', 
    rating: 4.9, 
    patients: 203, 
    initials: 'AP', 
    color: 'bg-green-600', 
    about: 'Dr. Anna Patel is a compassionate pediatrician who provides comprehensive care for infants, children, and adolescents. She emphasizes preventive medicine and family education.', 
    education: 'MD from Duke University', 
    experience: '8 Years' 
  },
  { 
    id: 'd6', 
    name: 'Dr. Luis Garcia', 
    spec: 'Orthopedics', 
    rating: 4.5, 
    patients: 76, 
    initials: 'LG', 
    color: 'bg-red-600', 
    about: 'Dr. Luis Garcia specializes in sports injuries, joint replacements, and musculoskeletal trauma. He helps patients regain mobility and live pain-free active lives.', 
    education: 'MD from Yale School of Medicine', 
    experience: '18 Years' 
  },
  { 
    id: 'd7', 
    name: 'Dr. Emily Watson', 
    spec: 'Dermatology', 
    rating: 4.8, 
    patients: 156, 
    initials: 'EW', 
    color: 'bg-pink-600', 
    about: 'Dr. Emily Watson is an expert in clinical and cosmetic dermatology. She specializes in skin cancer screening, acne treatment, and advanced laser therapies.', 
    education: 'MD from Columbia University', 
    experience: '11 Years' 
  },
  { 
    id: 'd8', 
    name: 'Dr. Robert Wilson', 
    spec: 'Psychiatry', 
    rating: 4.7, 
    patients: 92, 
    initials: 'RW', 
    color: 'bg-indigo-600', 
    about: 'Dr. Robert Wilson provides comprehensive mental health services, specializing in mood disorders, anxiety, and ADHD. He uses a combination of psychotherapy and medication management.', 
    education: 'MD from University of Chicago', 
    experience: '16 Years' 
  }
];
