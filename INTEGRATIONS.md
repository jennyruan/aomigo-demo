# API Integrations Guide

Aomigo now includes four powerful API integrations that enhance the learning experience. All integrations include **automatic fallbacks**, so the app works perfectly without any API keys!

## 🔐 Stack Auth - User Authentication

**Status:** Integrated with demo mode fallback
**Library:** `@stackframe/stack`

### What it does:
- Magic link authentication (passwordless sign-in)
- Secure user session management
- Demo mode for testing without setup

### Setup (Optional):
1. Visit [stack-auth.com](https://stack-auth.com)
2. Create an account and get your publishable key
3. Add to `.env`: `VITE_STACK_AUTH_PUBLISHABLE_KEY=your_key`

### Fallback:
Without a key, users automatically use demo mode with localStorage persistence.

---

## 📊 S2.dev - Event Streaming

**Status:** Integrated with localStorage fallback
**Location:** `/src/lib/s2.ts`, `/src/hooks/useEvents.ts`

### What it does:
- Logs teaching sessions and reviews as events
- Provides event history for analytics
- Real-time event streaming (when connected)

### Event Types:
```typescript
{
  type: 'teaching_session',
  userId: string,
  content: string,
  topics: string[],
  qualityScore: number,
  petStats: { intelligence, health }
}
```

### Setup (Optional):
1. Visit [s2.dev](https://s2.dev)
2. Get your API token
3. Add to `.env`: `VITE_S2_TOKEN=your_token`

### Fallback:
Events are stored in `localStorage` with the same structure, ensuring no data loss.

---

## 🌍 Lingo.dev - Multilingual UI

**Status:** Integrated with fallback dictionary
**Location:** `/src/lib/lingo.ts`

### What it does:
- Bilingual UI support (English/中文)
- Instant language switching
- Comprehensive translation coverage

### Usage:
```typescript
import { t, getCurrentLocale } from '../lib/lingo';

const locale = getCurrentLocale();
<h1>{t('home.welcome', locale)}</h1>
```

### Setup (Optional):
1. Visit [lingo.dev](https://lingo.dev)
2. Get your API key
3. Add to `.env`: `VITE_LINGO_API_KEY=your_key`

### Fallback:
Built-in dictionary with 60+ translated keys for all UI elements.

---

## 🧠 Cactus Compute - Local AI

**Status:** Integrated with simulation mode
**Location:** `/src/lib/cactus.ts`

### What it does:
- Privacy-first local AI processing
- Text summarization
- Quality analysis of learning content
- Quiz generation from topics
- Performance metrics (latency)

### Features:
```typescript
// Summarize learning content
const summary = await cactusClient.summarizeText(text);

// Analyze quality
const analysis = await cactusClient.analyzeQuality(text);

// Generate quiz questions
const quiz = await cactusClient.generateQuiz(['React', 'TypeScript']);

// Measure latency
const latency = await cactusClient.measureLatency();
```

### Setup (Optional):
1. Visit [cactuscompute.com](https://cactuscompute.com)
2. Get your API key
3. Add to `.env`: `VITE_CACTUS_API_KEY=your_key`

### Fallback:
Simulated responses with realistic data and "(simulated)" labels for transparency.

---

## 📱 Settings Dashboard

Visit `/settings` in the app to view:
- ✅ Connection status for each integration
- 🔄 Test connection buttons
- 📊 Latency metrics
- 📝 Setup instructions with links

---

## 🎯 Benefits of This Architecture

### 1. **Zero Setup Required**
Every integration has a fallback, so users can try all features immediately.

### 2. **Progressive Enhancement**
Add API keys only when needed for production or scale.

### 3. **Transparent Operation**
Console logs show which mode each service is using:
```
[Stack Auth] Using demo mode
[S2.dev] Using localStorage fallback
[Lingo.dev] Using fallback dictionary
[Cactus Compute] Simulated mode
```

### 4. **Production Ready**
Simply add API keys to `.env` for full production capabilities.

---

## 🚀 Quick Start

### Option 1: Demo Mode (No Setup)
1. Run `npm install`
2. Run `npm run dev`
3. Everything works with fallbacks!

### Option 2: Full Integration
1. Run `npm install`
2. Get API keys from the services you want
3. Add keys to `.env`
4. Run `npm run dev`
5. Services automatically detect keys and connect

---

## 📊 Monitoring

Check integration status:
1. Open browser console to see connection logs
2. Visit `/settings` page for visual dashboard
3. Click "Test Connection" for any service

---

## 🔒 Security Notes

- All API keys are environment variables (never committed)
- Stack Auth uses secure token-based authentication
- Cactus Compute processes data locally (privacy-first)
- localStorage fallbacks are scoped per user

---

## 🎓 Learning Resources

- [Stack Auth Docs](https://docs.stack-auth.com)
- [S2.dev Documentation](https://s2.dev/docs)
- [Lingo.dev API Guide](https://lingo.dev/docs)
- [Cactus Compute Guide](https://cactuscompute.com/docs)

---

Built with ❤️ for learners everywhere!
