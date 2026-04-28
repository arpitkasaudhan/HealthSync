export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return reg;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.permission === 'denied'
    ? 'denied'
    : await Notification.requestPermission();
}

export function showLocalNotification(title: string, body: string, icon = '/raga-icon.svg') {
  if (Notification.permission !== 'granted') return;
  new Notification(title, { body, icon, badge: icon });
}

export function triggerCriticalAlert(patientName: string, detail: string) {
  showLocalNotification(
    `⚠️ Critical Alert — ${patientName}`,
    detail,
  );
}
