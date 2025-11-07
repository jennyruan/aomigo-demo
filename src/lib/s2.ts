const S2_TOKEN = import.meta.env.VITE_S2_TOKEN || '';

export interface TeachingEvent {
  type: 'teaching_session';
  userId: string;
  sessionId: string;
  inputType: 'text' | 'voice' | 'image';
  content: string;
  topics: string[];
  timestamp: number;
  qualityScore: number;
  petStats: {
    intelligence: number;
    health: number;
  };
}

export interface ReviewEvent {
  type: 'review_completed';
  userId: string;
  topicId: string;
  result: 'good' | 'poor' | 'skipped';
  timestamp: number;
}

export type AppEvent = TeachingEvent | ReviewEvent;

class S2Client {
  private token: string;
  private useLocalStorage: boolean;

  constructor(token?: string) {
    this.token = token || S2_TOKEN;
    this.useLocalStorage = !this.token;

    if (this.useLocalStorage) {
      console.log('[S2.dev] No token provided, using localStorage fallback');
    } else {
      console.log('[S2.dev] Initialized with API token');
    }
  }

  private getLocalStorageKey(userId: string): string {
    return `s2_events_${userId}`;
  }

  private getEventsFromLocalStorage(userId: string): AppEvent[] {
    try {
      const stored = localStorage.getItem(this.getLocalStorageKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('[S2] LocalStorage read error:', error);
      return [];
    }
  }

  private saveEventsToLocalStorage(userId: string, events: AppEvent[]): void {
    try {
      localStorage.setItem(this.getLocalStorageKey(userId), JSON.stringify(events));
    } catch (error) {
      console.error('[S2] LocalStorage write error:', error);
    }
  }

  async logEvent(event: AppEvent): Promise<void> {
    if (this.useLocalStorage) {
      const events = this.getEventsFromLocalStorage(event.userId);
      events.push(event);
      this.saveEventsToLocalStorage(event.userId, events);
      console.log('[S2] Event logged to localStorage:', event.type);
      return;
    }

    try {
      const response = await fetch('https://api.s2.dev/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`S2 API error: ${response.status}`);
      }

      console.log('[S2] Event logged to S2.dev:', event.type);
    } catch (error) {
      console.error('[S2] API error, falling back to localStorage:', error);
      const events = this.getEventsFromLocalStorage(event.userId);
      events.push(event);
      this.saveEventsToLocalStorage(event.userId, events);
    }
  }

  async getEvents(userId: string, limit?: number): Promise<AppEvent[]> {
    if (this.useLocalStorage) {
      const events = this.getEventsFromLocalStorage(userId);
      return limit ? events.slice(-limit) : events;
    }

    try {
      const url = new URL('https://api.s2.dev/v1/events');
      url.searchParams.set('userId', userId);
      if (limit) url.searchParams.set('limit', limit.toString());

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`S2 API error: ${response.status}`);
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('[S2] API error, falling back to localStorage:', error);
      const events = this.getEventsFromLocalStorage(userId);
      return limit ? events.slice(-limit) : events;
    }
  }

  subscribeToEvents(
    userId: string,
    callback: (event: AppEvent) => void
  ): () => void {
    if (this.useLocalStorage) {
      console.log('[S2] LocalStorage mode: subscriptions not available');
      return () => {};
    }

    console.log('[S2] Real-time subscriptions not implemented yet');
    return () => {};
  }
}

export const s2Client = new S2Client();
