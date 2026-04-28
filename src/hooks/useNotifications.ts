import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { addNotification, pushToast } from '@/store/slices/notificationSlice';
import { registerServiceWorker, requestNotificationPermission, triggerCriticalAlert } from '@/services/notifications';

export function useNotifications() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    registerServiceWorker();

    const timer = setTimeout(async () => {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        dispatch(pushToast({
          title: 'Notifications Enabled',
          message: 'You will receive critical patient alerts in real time.',
          type: 'success',
        }));
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Simulate a live critical alert after 8 s (demo showcase)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(addNotification({
        title: 'Real-time Alert',
        message: 'Deepak Malhotra (ICU-07) — Oxygen saturation dropped to 89%.',
        type: 'critical',
        patientId: 'P-011',
      }));
      dispatch(pushToast({
        title: '⚠️ Critical Alert',
        message: 'Deepak Malhotra — O₂ sat: 89%',
        type: 'critical',
      }));
      triggerCriticalAlert('Deepak Malhotra', 'Oxygen saturation dropped to 89%.');
    }, 8000);

    return () => clearTimeout(timer);
  }, [dispatch]);
}
