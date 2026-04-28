import { Phone, Mail, Droplets, Building2, User2, CalendarDays, FileText, Heart, Thermometer, Wind, Activity } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { statusColor, formatDate } from '@/utils/helpers';
import type { Patient } from '@/types';

interface Props {
  patient: Patient | null;
  onClose: () => void;
}

function VitalChip({ icon: Icon, label, value, alert }: { icon: React.ElementType; label: string; value: string; alert?: boolean }) {
  return (
    <div className={`p-3 rounded-lg border text-xs ${alert ? 'bg-red-500/8 border-red-500/20' : 'bg-white/3 border-white/8'}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3 h-3 ${alert ? 'text-red-400' : 'text-slate-500'}`} />
        <span className="text-slate-500">{label}</span>
      </div>
      <p className={`font-semibold text-sm ${alert ? 'text-red-300' : 'text-slate-200'}`}>{value}</p>
    </div>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />}
      <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
      <span className="text-xs text-slate-300 flex-1">{value}</span>
    </div>
  );
}

export function PatientDetailModal({ patient, onClose }: Props) {
  if (!patient) return null;

  const isVitalAlert = patient.status === 'Critical';

  return (
    <Modal open={!!patient} onClose={onClose} size="lg">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar initials={patient.avatar} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">{patient.name}</h2>
                <p className="text-sm text-slate-400">{patient.condition}</p>
              </div>
              <Badge className={statusColor(patient.status)} dot>{patient.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded">{patient.id}</span>
              <span className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded">{patient.department}</span>
              <span className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded">Room {patient.room}</span>
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Latest Vitals</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <VitalChip icon={Heart}       label="Heart Rate"  value={`${patient.vitals.heartRate} bpm`}      alert={isVitalAlert && patient.vitals.heartRate > 90} />
            <VitalChip icon={Activity}    label="Blood Press" value={patient.vitals.bloodPressure}           alert={isVitalAlert} />
            <VitalChip icon={Thermometer} label="Temp"        value={`${patient.vitals.temperature} °C`}     alert={patient.vitals.temperature > 38} />
            <VitalChip icon={Wind}        label="SpO₂"        value={`${patient.vitals.oxygenSaturation}%`}  alert={patient.vitals.oxygenSaturation < 95} />
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Personal</p>
            <Row label="Age"               value={`${patient.age} years`}           icon={User2} />
            <Row label="Gender"            value={patient.gender}                    icon={User2} />
            <Row label="Blood Group"       value={patient.bloodGroup}               icon={Droplets} />
            <Row label="Phone"             value={patient.phone}                    icon={Phone} />
            <Row label="Email"             value={patient.email}                    icon={Mail} />
            <Row label="Emergency"         value={patient.emergencyContact}         icon={Phone} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Clinical</p>
            <Row label="Doctor"            value={patient.doctor}                   icon={User2} />
            <Row label="Department"        value={patient.department}               icon={Building2} />
            <Row label="Admitted"          value={formatDate(patient.admissionDate)} icon={CalendarDays} />
            <Row label="Last Visit"        value={formatDate(patient.lastVisit)}     icon={CalendarDays} />
            <Row label="Insurance ID"      value={patient.insuranceId}              icon={FileText} />
          </div>
        </div>

        {/* Notes */}
        {patient.notes && (
          <div className="bg-white/3 border border-white/8 rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Clinical Notes</p>
            <p className="text-xs text-slate-400 leading-relaxed">{patient.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
