import { StackClientApp } from '@stackframe/stack';

const publishableKey = import.meta.env.VITE_STACK_AUTH_PUBLISHABLE_KEY || '';

// Use `any` for stackApp to avoid strict upstream typing mismatches in the demo app.
let stackApp: any = null;

if (publishableKey) {
  try {
    // The Stack SDK types require additional options in some overloads; allow runtime construction and treat as any.
    // @ts-ignore - relaxed for demo wiring
    stackApp = new StackClientApp({ publishableClientKey: publishableKey } as any);
  // initialization successful (silenced)
  } catch (error) {
  // initialization skipped (silenced)
    stackApp = null;
  }
} else {
  // Stack Auth not configured (silenced)
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
  // demo mode simulation (silenced)
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
    // propagate without logging
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
  } catch (_error) {
    // ignore sign out errors silently
  }
}

export async function signUpWithPassword(email: string, password: string): Promise<StackUser> {
  if (!stackApp) {
  // demo mode simulation (silenced)
    const demoUser: StackUser = {
      id: 'demo-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      primaryEmail: email,
    };
    localStorage.setItem('aomigo_stack_demo_user', JSON.stringify(demoUser));
    return demoUser;
  }

  try {
    const result = await stackApp.signUpWithCredential({
      email,
      password,
    });

    return {
      id: result.id,
      email: result.primaryEmail || email,
      displayName: result.displayName || email.split('@')[0],
      primaryEmail: result.primaryEmail || email,
    };
    } catch (error: any) {
    throw error;
  }
}

export async function signInWithPassword(email: string, password: string): Promise<StackUser> {
  if (!stackApp) {
  // demo mode simulation (silenced)
    const demoUser: StackUser = {
      id: 'demo-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      primaryEmail: email,
    };
    localStorage.setItem('aomigo_stack_demo_user', JSON.stringify(demoUser));
    return demoUser;
  }

  try {
    const result = await stackApp.signInWithCredential({
      email,
      password,
    });

    return {
      id: result.id,
      email: result.primaryEmail || email,
      displayName: result.displayName || email.split('@')[0],
      primaryEmail: result.primaryEmail || email,
    };
    } catch (error: any) {
    throw error;
  }
}
