import { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import { TrendingUp, Users, Activity, Download } from 'lucide-react';
import { ANALYTICS_DATA, DEPARTMENT_DATA, AGE_DISTRIBUTION, RECOVERY_TREND } from '@/data/mockData';
import { useAppSelector } from '@/hooks/redux';
import { selectAllPatients } from '@/store/slices/patientSlice';
import { Button } from '@/components/ui/Button';
import { exportToCSV } from '@/utils/helpers';

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2.5 text-xs space-y-1 border border-violet-500/20">
      {label && <p className="text-slate-400 font-medium mb-1">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-semibold text-slate-200">{p.value}{p.name === 'rate' ? '%' : ''}</span>
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs border border-violet-500/20">
      <p style={{ color: d.payload.color }} className="font-semibold">{d.name}</p>
      <p className="text-slate-300">{d.value}% of patients</p>
    </div>
  );
}

export function AnalyticsPage() {
  const patients = useAppSelector(selectAllPatients);
  const [range, setRange] = useState<'3m' | '6m'>('6m');

  const chartData = range === '3m' ? ANALYTICS_DATA.slice(-3) : ANALYTICS_DATA;

  const kpis = [
    { label: 'Total Admissions',  value: chartData.reduce((s, d) => s + d.admissions, 0), icon: Users,       color: 'text-violet-400', bg: 'bg-violet-500/15' },
    { label: 'Total Discharges',  value: chartData.reduce((s, d) => s + d.discharges, 0), icon: Activity,    color: 'text-cyan-400',   bg: 'bg-cyan-500/15' },
    { label: 'Critical Cases',    value: chartData.reduce((s, d) => s + d.critical,   0), icon: TrendingUp,  color: 'text-red-400',    bg: 'bg-red-500/15' },
    { label: 'Avg Recovery Rate', value: `${(RECOVERY_TREND.slice(-Number(range[0])).reduce((s, d) => s + d.rate, 0) / Number(range[0])).toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Clinical Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">Aggregated insights across all departments</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs">
            {(['3m', '6m'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${range === r ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {r === '3m' ? 'Last 3 months' : 'Last 6 months'}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => exportToCSV(patients as unknown as Record<string, unknown>[], 'patients-export')}>
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-xl p-4 hover-lift">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Admissions bar */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Monthly Patient Flow</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ left: -20, right: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '8px' }} />
              <Bar dataKey="admissions" name="Admissions" fill="#7c3aed" radius={[4,4,0,0]} />
              <Bar dataKey="discharges"  name="Discharges"  fill="#06b6d4" radius={[4,4,0,0]} />
              <Bar dataKey="critical"    name="Critical"    fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department pie */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie data={DEPARTMENT_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {DEPARTMENT_DATA.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5 text-xs">
              {DEPARTMENT_DATA.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-400 truncate">{d.name}</span>
                  <span className="ml-auto font-semibold text-slate-200">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recovery trend */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Recovery Rate Trend</h3>
          <p className="text-xs text-slate-500 mb-4">Month-over-month patient recovery %</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={RECOVERY_TREND} margin={{ left: -20, right: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[85, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="rate" name="rate" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Age distribution */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Age Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Patient demographics by age group</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={AGE_DISTRIBUTION} layout="vertical" margin={{ left: 10, right: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Patients" fill="#7c3aed" radius={[0,4,4,0]}>
                {AGE_DISTRIBUTION.map((_, i) => (
                  <Cell key={i} fill={`hsl(${265 - i * 8}, 70%, ${55 - i * 2}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
