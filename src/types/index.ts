export type PatientStatus = 'Active' | 'Critical' | 'Discharged' | 'Under Observation';
export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Department = 'Cardiology' | 'Neurology' | 'Orthopedics' | 'Pediatrics' | 'Oncology' | 'General Medicine' | 'Emergency' | 'ICU';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  condition: string;
  department: Department;
  status: PatientStatus;
  doctor: string;
  room: string;
  phone: string;
  email: string;
  admissionDate: string;
  lastVisit: string;
  avatar: string;
  insuranceId: string;
  emergencyContact: string;
  notes: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
  };
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
  patientId?: string;
}

export interface StatCard {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

export interface AnalyticsDataPoint {
  month: string;
  admissions: number;
  discharges: number;
  critical: number;
}

export interface DepartmentData {
  name: string;
  value: number;
  color: string;
}
