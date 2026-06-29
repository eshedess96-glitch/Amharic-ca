import { useState, useCallback } from 'react';

export interface UserEvent {
  id: string;
  name: string;
  description: string;
  dateTime: string; // ISO string
  userEmail: string;
}

export interface AppState {
  isPremium: boolean;
  events: UserEvent[];
  userName: string;
  userEmail: string;
}

const STORAGE_KEY = 'ethio-life-state';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    isPremium: false,
    events: [],
    userName: '',
    userEmail: '',
  };
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);

  const update = useCallback((partial: Partial<AppState>) => {
    setState(prev => {
      const next = { ...prev, ...partial };
      saveState(next);
      return next;
    });
  }, []);

  const addEvent = useCallback((event: Omit<UserEvent, 'id'>) => {
    setState(prev => {
      const newEvent: UserEvent = { ...event, id: Date.now().toString() };
      const next = { ...prev, events: [...prev.events, newEvent] };
      saveState(next);
      return next;
    });
  }, []);

  const removeEvent = useCallback((id: string) => {
    setState(prev => {
      const next = { ...prev, events: prev.events.filter(e => e.id !== id) };
      saveState(next);
      return next;
    });
  }, []);

  const togglePremium = useCallback(() => {
    setState(prev => {
      const next = { ...prev, isPremium: !prev.isPremium };
      saveState(next);
      return next;
    });
  }, []);

  return { ...state, update, addEvent, removeEvent, togglePremium };
}
