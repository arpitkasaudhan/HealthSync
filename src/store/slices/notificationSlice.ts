import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '@/types';
import { MOCK_NOTIFICATIONS } from '@/data/mockData';
import type { RootState } from '@/store';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  exiting: boolean;
}

interface NotificationState {
  notifications: Notification[];
  toasts: ToastItem[];
  panelOpen: boolean;
}

const initialState: NotificationState = {
  notifications: MOCK_NOTIFICATIONS,
  toasts: [],
  panelOpen: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find((n) => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.notifications.forEach((n) => { n.read = true; });
    },
    addNotification(state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) {
      state.notifications.unshift({
        ...action.payload,
        id: `N-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    },
    setPanelOpen(state, action: PayloadAction<boolean>) {
      state.panelOpen = action.payload;
    },
    pushToast(state, action: PayloadAction<Omit<ToastItem, 'id' | 'exiting'>>) {
      state.toasts.push({ ...action.payload, id: `T-${Date.now()}`, exiting: false });
    },
    startDismissToast(state, action: PayloadAction<string>) {
      const t = state.toasts.find((t) => t.id === action.payload);
      if (t) t.exiting = true;
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  markRead,
  markAllRead,
  addNotification,
  setPanelOpen,
  pushToast,
  startDismissToast,
  removeToast,
} = notificationSlice.actions;

export default notificationSlice.reducer;

// Selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectToasts        = (state: RootState) => state.notifications.toasts;
export const selectPanelOpen     = (state: RootState) => state.notifications.panelOpen;

export const selectUnreadCount = createSelector(
  selectNotifications,
  (ns) => ns.filter((n) => !n.read).length,
);
