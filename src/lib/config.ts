export const API_STATUS = {
  stackAuth: !!import.meta.env.VITE_STACK_AUTH_PUBLISHABLE_KEY,
  s2: !!import.meta.env.VITE_S2_TOKEN,
  lingo: !!import.meta.env.VITE_LINGO_API_KEY,
  cactus: !!import.meta.env.VITE_CACTUS_API_KEY,
  groq: !!import.meta.env.VITE_GROQ_API_KEY,
};
