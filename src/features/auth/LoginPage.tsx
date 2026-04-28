import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Activity, Zap, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ToastContainer } from '@/components/ui/Toast';

const FEATURES = [
  { icon: Zap,       label: 'AI-Powered Insights',      desc: 'Predictive analytics for patient outcomes' },
  { icon: Shield,    label: 'HIPAA Compliant',           desc: 'Enterprise-grade security & audit trails' },
  { icon: BarChart3, label: 'Real-time Analytics',       desc: 'Live dashboards across all departments' },
];

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const user = useAppSelector((s) => s.auth.user);

  const [email,    setEmail]    = useState('admin@healthsync.ai');
  const [password, setPassword] = useState('Demo@1234');
  const [showPass, setShowPass] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await login(email.trim(), password);
  }

  return (
    <div className="min-h-screen flex bg-[#0b0b1a]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-violet-900/10 to-transparent rounded-full" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-900/50">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">HealthSync</span>
            <span className="text-xs text-violet-400 block -mt-0.5">by RagaAI</span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full pulse-dot" />
              Trusted by 500+ Hospitals Across India
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              AI-Powered
              <br />
              <span className="gradient-text">Healthcare Platform</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Streamline patient workflows, reduce clinical overhead, and deliver better outcomes
              with intelligent automation and real-time insights.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-slate-600">
          © 2024 RagaAI Inc. · Healthcare AI Platform
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">HealthSync</span>
        </div>

        <div className="w-full max-w-sm space-y-7">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-1">Sign in to your clinical dashboard</p>
          </div>

          {/* Demo hint */}
          <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl px-4 py-3 text-xs text-violet-300 space-y-0.5">
            <p className="font-semibold text-violet-200">Demo credentials pre-filled</p>
            <p className="text-violet-400 opacity-80">Email: admin@healthsync.ai · Password: Demo@1234</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hospital.com"
              icon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-xs text-center text-slate-600">
            By continuing, you agree to our{' '}
            <span className="text-violet-400 cursor-pointer hover:underline">Terms of Service</span>{' '}
            and{' '}
            <span className="text-violet-400 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
