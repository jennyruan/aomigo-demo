export const API_STATUS = {
  stackAuth: !!import.meta.env.VITE_STACK_AUTH_PUBLISHABLE_KEY,
  s2: !!import.meta.env.VITE_S2_TOKEN,
  lingo: !!import.meta.env.VITE_LINGO_API_KEY,
  cactus: !!import.meta.env.VITE_CACTUS_API_KEY,
  openai: !!import.meta.env.VITE_OPENAI_API_KEY,
};

export function logApiStatus() {
  console.log('=== Aomigo API Integration Status ===');
  console.log('[Stack Auth]', API_STATUS.stackAuth ? '✅ Connected' : '⚠️ Using demo mode');
  console.log('[S2.dev]', API_STATUS.s2 ? '✅ Connected' : '⚠️ Using localStorage fallback');
  console.log('[Lingo.dev]', API_STATUS.lingo ? '✅ Connected' : '⚠️ Using fallback dictionary');
  console.log('[Cactus Compute]', API_STATUS.cactus ? '✅ Connected' : '⚠️ Simulated mode');
  console.log('[OpenAI]', API_STATUS.openai ? '✅ Connected' : '⚠️ Using mock responses');
  console.log('====================================');
}

logApiStatus();
