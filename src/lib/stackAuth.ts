import { StackClientApp } from '@stackframe/stack';

const publishableKey = import.meta.env.VITE_STACK_AUTH_PUBLISHABLE_KEY || '';

let stackApp: StackClientApp<true> | null = null;

if (publishableKey) {
  try {
    stackApp = new StackClientApp({ publishableClientKey: publishableKey });
    console.log('[Stack Auth] Initialized with API key');
  } catch (error) {
    console.error('[Stack Auth] Initialization error:', error);
  }
} else {
  console.log('[Stack Auth] No API key provided, using demo mode');
}

export { stackApp };

export interface StackUser {
  id: string;
  email: string | null;
  displayName: string | null;
  primaryEmail?: string | null;
}

export function getDemoUser(): StackUser {
  const stored = localStorage.getItem('aomigo_stack_demo_user');
  if (stored) {
    return JSON.parse(stored);
  }

  const demoUser: StackUser = {
    id: 'demo-' + Date.now(),
    email: 'demo@aomigo.com',
    displayName: 'Demo User',
    primaryEmail: 'demo@aomigo.com',
  };

  localStorage.setItem('aomigo_stack_demo_user', JSON.stringify(demoUser));
  return demoUser;
}

export function clearDemoUser() {
  localStorage.removeItem('aomigo_stack_demo_user');
}

export async function signInWithMagicLink(email: string): Promise<void> {
  if (!stackApp) {
    console.log('[Stack Auth] Demo mode: simulating magic link sign in');
    const demoUser: StackUser = {
      id: 'demo-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      primaryEmail: email,
    };
    localStorage.setItem('aomigo_stack_demo_user', JSON.stringify(demoUser));
    return;
  }

  try {
    await stackApp.sendMagicLinkEmail(email);
  } catch (error) {
    console.error('[Stack Auth] Magic link error:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  if (!stackApp) {
    clearDemoUser();
    return;
  }

  try {
    await stackApp.signOut();
  } catch (error) {
    console.error('[Stack Auth] Sign out error:', error);
  }
}
