import { useMemo } from 'react';
import {
  Users, Activity, CalendarCheck, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, Zap, ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { selectAllPatients } from '@/store/slices/patientSlice';
import { selectNotifications, markRead } from '@/store/slices/notificationSlice';
import { ANALYTICS_DATA } from '@/data/mockData';
import { cn, statusColor, formatRelativeTime } from '@/utils/helpers';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

function StatCard({
  label, value, sub, icon: Icon, trend, color,
}: {
  label: string; value: string | number; sub: string;
  icon: React.ElementType; trend: 'up' | 'down' | 'neutral'; color: string;
}) {
  return (
    <div className="glass rounded-xl p-5 hover-lift cursor-default">
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn('flex items-center gap-1 text-xs font-medium',
          trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500',
        )}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
          {sub}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white count-up">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-4 py-3 text-xs space-y-1.5 border border-violet-500/20">
      <p className="text-slate-400 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold text-slate-200">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const patients       = useAppSelector(selectAllPatients);
  const notifications  = useAppSelector(selectNotifications);
  const dispatch       = useAppDispatch();
  const navigate       = useNavigate();

  const stats = useMemo(() => ({
    total:       patients.length,
    active:      patients.filter((p) => p.status === 'Active').length,
    critical:    patients.filter((p) => p.status === 'Critical').length,
    observation: patients.filter((p) => p.status === 'Under Observation').length,
    discharged:  patients.filter((p) => p.status === 'Discharged').length,
  }), [patients]);

  const recentPatients   = patients.slice(0, 5);
  const recentAlerts     = notifications.filter((n) => !n.read).slice(0, 4);

  const aiInsights = [
    { label: '3 patients have elevated readmission risk', type: 'warning' },
    { label: 'ICU capacity at 85% — consider load balancing', type: 'warning' },
    { label: 'Recovery rate improved 0.8% this week', type: 'success' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* AI Insights banner */}
      <div className="gradient-border rounded-xl px-5 py-3.5 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-violet-300">RagaAI Insights — Updated just now</p>
          <p className="text-xs text-slate-500 truncate">{aiInsights[0].label}</p>
        </div>
        <Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => navigate('/analytics')}>
          View <ArrowRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Patients"    value={stats.total}       sub="+12 this week"   icon={Users}          trend="up"      color="bg-violet-500/15 text-violet-400" />
        <StatCard label="Active Cases"      value={stats.active}      sub="+4 today"        icon={Activity}       trend="up"      color="bg-cyan-500/15 text-cyan-400" />
        <StatCard label="Critical"          value={stats.critical}    sub="Needs attention" icon={AlertTriangle}  trend="neutral" color="bg-red-500/15 text-red-400" />
        <StatCard label="Recovery Rate"     value="94.2%"             sub="+0.8% this week" icon={TrendingUp}     trend="up"      color="bg-emerald-500/15 text-emerald-400" />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="xl:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Admissions & Discharges</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" />Admissions</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" />Discharges</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ANALYTICS_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="admissions" stroke="#7c3aed" strokeWidth={2} fill="url(#admGrad)" dot={false} activeDot={{ r: 4, fill: '#7c3aed' }} />
              <Area type="monotone" dataKey="discharges"  stroke="#06b6d4" strokeWidth={2} fill="url(#disGrad)" dot={false} activeDot={{ r: 4, fill: '#06b6d4' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="glass rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Live Alerts</h3>
            {recentAlerts.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 pulse-dot" />
            )}
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {recentAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-600 gap-2">
                <CheckCircle className="w-6 h-6 opacity-40" />
                <p className="text-xs">No active alerts</p>
              </div>
            ) : (
              recentAlerts.map((n) => (
                <button
                  key={n.id}
                  onClick={() => dispatch(markRead(n.id))}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border text-xs transition-all hover:opacity-80',
                    n.type === 'critical' ? 'bg-red-500/8 border-red-500/20' :
                    n.type === 'warning'  ? 'bg-amber-500/8 border-amber-500/20' :
                    n.type === 'success'  ? 'bg-emerald-500/8 border-emerald-500/20' :
                                           'bg-blue-500/8 border-blue-500/20',
                  )}
                >
                  <p className="font-semibold text-slate-200">{n.title}</p>
                  <p className="text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                  <p className="text-slate-600 mt-1">{formatRelativeTime(n.timestamp)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent patients + AI */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent patients */}
        <div className="xl:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Recent Patients</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
              View all <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentPatients.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/3 transition-colors cursor-pointer" onClick={() => navigate('/patients')}>
                <Avatar initials={p.avatar} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{p.name}</p>
                  <p className="text-xs text-slate-500 truncate">{p.condition}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1">
                  <Badge className={statusColor(p.status)} dot>{p.status}</Badge>
                  <p className="text-[10px] text-slate-600">{p.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI insights panel */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded bg-violet-500/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className={cn(
                'flex items-start gap-2.5 p-3 rounded-lg border text-xs',
                insight.type === 'warning'
                  ? 'bg-amber-500/8 border-amber-500/20'
                  : 'bg-emerald-500/8 border-emerald-500/20',
              )}>
                {insight.type === 'warning'
                  ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  : <CheckCircle   className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                }
                <p className="text-slate-300 leading-relaxed">{insight.label}</p>
              </div>
            ))}

            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>Model last updated: 2 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
