import { useState, useEffect, useCallback } from 'react';
import { s2Client, type AppEvent } from '../lib/s2';

export function useEvents(userId: string | null) {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadEvents();
  }, [userId]);

  async function loadEvents() {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedEvents = await s2Client.getEvents(userId);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('[useEvents] Error loading events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  const addEvent = useCallback(
    async (event: Omit<AppEvent, 'timestamp'>) => {
      if (!userId) return;

      const fullEvent: AppEvent = {
        ...event,
        timestamp: Date.now(),
      } as AppEvent;

      try {
        await s2Client.logEvent(fullEvent);
        setEvents(prev => [...prev, fullEvent]);
      } catch (err) {
        console.error('[useEvents] Error adding event:', err);
        throw err;
      }
    },
    [userId]
  );

  return {
    events,
    loading,
    error,
    addEvent,
    reload: loadEvents,
  };
}
