import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AppLayout } from '@/components/layout/AppLayout';

const LoginPage         = lazy(() => import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage     = lazy(() => import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const AnalyticsPage     = lazy(() => import('@/features/analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const PatientsPage      = lazy(() => import('@/features/patients/PatientsPage').then((m) => ({ default: m.PatientsPage })));
const NotificationsPage = lazy(() => import('@/features/notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <span className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<AppLayout />}>
              <Route path="/dashboard"     element={<DashboardPage />} />
              <Route path="/analytics"     element={<AnalyticsPage />} />
              <Route path="/patients"      element={<PatientsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}
