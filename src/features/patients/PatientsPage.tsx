import { useCallback } from 'react';
import {
  LayoutGrid, List, Search, SlidersHorizontal, Download, RefreshCw,
  Phone, Mail, Building2, CalendarDays, User2, Activity,
  Heart, AlertTriangle, CheckCircle, Clock,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectFilteredPatients, selectViewMode, selectFilters, selectSelectedPatient,
  setViewMode, setFilter, setSelectedPatientId, resetFilters,
} from '@/store/slices/patientSlice';
import { PatientDetailModal } from './PatientDetailModal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PatientCardSkeleton } from '@/components/ui/Skeleton';
import { statusColor, statusDot, formatDate, exportToCSV } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import type { Patient, PatientStatus, Department } from '@/types';

const STATUS_OPTIONS: (PatientStatus | 'All')[] = ['All', 'Active', 'Critical', 'Under Observation', 'Discharged'];
const DEPT_OPTIONS: (Department | 'All')[]       = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'General Medicine', 'Emergency', 'ICU'];

const STATUS_ICONS: Record<PatientStatus, React.ElementType> = {
  Active:              CheckCircle,
  Critical:            AlertTriangle,
  Discharged:          CheckCircle,
  'Under Observation': Clock,
};

/* ── Grid card ─────────────────────────────────────── */
function PatientCard({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  const StatusIcon = STATUS_ICONS[patient.status];
  return (
    <button
      onClick={onClick}
      className="glass rounded-xl p-5 text-left w-full hover-lift group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar initials={patient.avatar} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate group-hover:text-violet-300 transition-colors">
              {patient.name}
            </p>
            <p className="text-xs text-slate-500">{patient.id}</p>
          </div>
        </div>
        <Badge className={statusColor(patient.status)} dot>
          {patient.status}
        </Badge>
      </div>

      <p className="text-xs text-slate-400 mb-3 leading-relaxed line-clamp-2">{patient.condition}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1.5 truncate">
          <Building2 className="w-3 h-3 shrink-0 text-slate-600" />{patient.department}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <User2 className="w-3 h-3 shrink-0 text-slate-600" />{patient.doctor.replace('Dr. ', '')}
        </span>
        <span className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 shrink-0 text-slate-600" />{patient.vitals.heartRate} bpm
        </span>
        <span className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 shrink-0 text-slate-600" />{patient.vitals.oxygenSaturation}% SpO₂
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <StatusIcon className="w-3 h-3" />
          <span>Room {patient.room}</span>
        </div>
        <span className="text-xs text-slate-600">{formatDate(patient.lastVisit)}</span>
      </div>
    </button>
  );
}

/* ── List row ───────────────────────────────────────── */
function PatientRow({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-white/4 transition-colors border-b border-white/5 last:border-0 group text-left"
    >
      <Avatar initials={patient.avatar} size="sm" />

      {/* Name + condition */}
      <div className="w-44 min-w-0 hidden sm:block">
        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-violet-300 transition-colors">
          {patient.name}
        </p>
        <p className="text-xs text-slate-600">{patient.id}</p>
      </div>

      {/* Condition */}
      <div className="flex-1 min-w-0 hidden md:block">
        <p className="text-xs text-slate-400 truncate">{patient.condition}</p>
        <p className="text-xs text-slate-600">{patient.department}</p>
      </div>

      {/* Mobile: name + condition combined */}
      <div className="flex-1 min-w-0 sm:hidden">
        <p className="text-sm font-medium text-slate-200 truncate">{patient.name}</p>
        <p className="text-xs text-slate-500 truncate">{patient.condition}</p>
      </div>

      {/* Doctor */}
      <div className="w-32 shrink-0 hidden lg:block">
        <p className="text-xs text-slate-400 truncate">{patient.doctor}</p>
        <p className="text-xs text-slate-600">Room {patient.room}</p>
      </div>

      {/* Vitals */}
      <div className="w-24 shrink-0 hidden xl:flex flex-col gap-0.5">
        <p className="text-xs text-slate-400">{patient.vitals.heartRate} bpm</p>
        <p className="text-xs text-slate-600">{patient.vitals.oxygenSaturation}% SpO₂</p>
      </div>

      {/* Last visit */}
      <div className="w-24 shrink-0 hidden lg:block text-right">
        <p className="text-xs text-slate-500">{formatDate(patient.lastVisit)}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge className={statusColor(patient.status)} dot>{patient.status}</Badge>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${patient.phone}`; }}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/8 transition-all"
          title="Call patient"
        >
          <Phone className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${patient.email}`; }}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/8 transition-all"
          title="Email patient"
        >
          <Mail className="w-3 h-3" />
        </button>
      </div>
    </button>
  );
}

/* ── Main page ──────────────────────────────────────── */
export function PatientsPage() {
  const dispatch         = useAppDispatch();
  const viewMode         = useAppSelector(selectViewMode);
  const filters          = useAppSelector(selectFilters);
  const filtered         = useAppSelector(selectFilteredPatients);
  const selectedPatient  = useAppSelector(selectSelectedPatient);

  const handleSelect = useCallback(
    (id: string) => dispatch(setSelectedPatientId(id)),
    [dispatch],
  );

  const statusCounts = {
    All:                filtered.length,
    Active:             filtered.filter((p) => p.status === 'Active').length,
    Critical:           filtered.filter((p) => p.status === 'Critical').length,
    'Under Observation':filtered.filter((p) => p.status === 'Under Observation').length,
    Discharged:         filtered.filter((p) => p.status === 'Discharged').length,
  };

  return (
    <div className="space-y-5 fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Patient Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} patients</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(resetFilters())}
            title="Reset filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(filtered as unknown as Record<string, unknown>[], 'patients')}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search by name, ID, doctor, condition…"
              value={filters.search}
              onChange={(e) => dispatch(setFilter({ key: 'search', value: e.target.value }))}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filters.department}
              onChange={(e) => dispatch(setFilter({ key: 'department', value: e.target.value as Department | 'All' }))}
              className="bg-white/5 border border-white/10 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500/50 cursor-pointer"
            >
              {DEPT_OPTIONS.map((d) => <option key={d} value={d} className="bg-[#0d0d22]">{d}</option>)}
            </select>
          </div>

          {/* View toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => dispatch(setViewMode('grid'))}
              className={cn('p-1.5 rounded-md transition-all', viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300')}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => dispatch(setViewMode('list'))}
              className={cn('p-1.5 rounded-md transition-all', viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300')}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => dispatch(setFilter({ key: 'status', value: s }))}
              className={cn(
                'text-xs px-3 py-1 rounded-full border transition-all font-medium',
                filters.status === s
                  ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                  : 'border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20',
              )}
            >
              {s}
              <span className={cn('ml-1.5', filters.status === s ? 'text-violet-400' : 'text-slate-600')}>
                {statusCounts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Patient list/grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
          <Search className="w-8 h-8 opacity-30" />
          <p className="text-sm">No patients match your filters.</p>
          <Button variant="ghost" size="sm" onClick={() => dispatch(resetFilters())}>Clear filters</Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PatientCard key={p.id} patient={p} onClick={() => handleSelect(p.id)} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          {/* List header */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-white/8 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
            <span className="w-7 shrink-0" />
            <span className="w-44 hidden sm:block">Patient</span>
            <span className="flex-1 hidden md:block">Condition / Dept</span>
            <span className="w-32 hidden lg:block">Doctor / Room</span>
            <span className="w-24 hidden xl:block">Vitals</span>
            <span className="w-24 hidden lg:block text-right">Last Visit</span>
            <span className="w-28">Status</span>
            <span className="w-16 hidden sm:block" />
          </div>
          {filtered.map((p) => (
            <PatientRow key={p.id} patient={p} onClick={() => handleSelect(p.id)} />
          ))}
        </div>
      )}

      {/* Skeleton placeholder shown briefly during "loading" */}
      {false && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <PatientCardSkeleton key={i} />)}
        </div>
      )}

      {/* Detail modal */}
      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => dispatch(setSelectedPatientId(null))}
      />
    </div>
  );
}
