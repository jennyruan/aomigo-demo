# 🐾 Aomigo - AI-Powered Learning Companion

An innovative learning platform where users teach their virtual pet daily to enhance memory, discover knowledge gaps, and build consistent learning habits through spaced repetition.

## 🎃 Halloween Theme

Aomigo features a delightful Halloween-inspired design with:
- Orange (#FF6B35), Cream (#FFF5E6), and Purple (#6A4C93) color palette
- Pumpkin-wearing pet avatars
- Warm autumn vibes throughout the interface
- Duolingo-inspired minimalist and playful UI

## ✨ Core Features

### 1. Multi-Modal Learning Input
- **Text Input**: Type your learning notes directly
- **Voice Input**: Use Web Speech API for hands-free learning (Chrome/Edge only)
- **Image Upload**: OCR-powered text extraction from photos using Tesseract.js

### 2. AI-Powered Follow-Up Questions
- Automatically extracts key topics from your input
- Generates insightful questions to test understanding
- Evaluates answers and provides encouraging feedback
- Powered by OpenAI GPT-4

### 3. Spaced Repetition System
- Based on the Ebbinghaus forgetting curve
- Review intervals: 10 min, 1 day, 3 days, 7 days, 14 days, 30 days, 60 days
- Adaptive scheduling based on answer quality
- Notifications for due reviews

### 4. Pet Development System
Two core metrics track your learning journey:

**Intelligence (0-1000)**
- Grows with quality teaching sessions
- Increases with correct follow-up answers
- Determines pet level (1-10)

**Health (0-100)**
- Reflects learning consistency
- Grows with daily streaks
- Decreases when reviews are skipped

### 5. Pet Moods
Your pet's mood reflects your learning habits:
- 😴 Sleepy (<20 HP) - Time to get back on track!
- 🙂 Happy (20-60 HP) - Steady progress
- 😺 Excited (60-85 HP) - Great momentum!
- 🐯 Energized (85+ HP) - You're on fire!

### 6. Knowledge Map
- Visual representation of your learning topics
- Node size indicates knowledge depth
- Color intensity shows recency
- Interactive exploration of topic connections

### 7. Community Feed
- Share daily learning cards
- See what others are learning
- Build accountability through social features
- Discover new topics to explore

### 8. Statistics & Progress Tracking
- Total topics learned
- Mastered topics count
- Review completion rate
- Average quality score
- Recent session history

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom Halloween theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with demo mode
- **Routing**: React Router v6
- **AI**: OpenAI GPT-4
- **OCR**: Tesseract.js
- **Notifications**: Sonner
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are pre-configured in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- Optional: `VITE_OPENAI_API_KEY` - For AI features

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📱 Demo Mode

No authentication required! Click "Continue as Demo User" to try all features with local storage.

Demo mode includes:
- Full feature access
- Local data persistence
- Pet development tracking
- All learning tools

## 🎮 How to Use

1. **Sign Up / Demo Mode**: Create an account or use demo mode
2. **Teach**: Share what you learned via text, voice, or image
3. **Answer**: Respond to AI-generated follow-up questions
4. **Review**: Complete spaced repetition reviews when due
5. **Track**: Monitor progress in your knowledge map
6. **Share**: Post daily learning cards to the community

## 🌍 Multilingual Support

Toggle between English and Chinese (中文) using the language switcher in the header.

## 📊 Database Schema

The application uses Supabase with the following tables:

- `users_profile` - Extended user profiles with pet stats
- `teaching_sessions` - Record of all teaching sessions
- `topics` - Knowledge graph topics
- `reviews` - Spaced repetition schedule
- `community_posts` - Social feed posts
- `achievements` - User achievements and badges

All tables have Row Level Security (RLS) enabled for data privacy.

## 🔐 Security Features

- Row Level Security on all database tables
- User data isolation
- Secure authentication with Supabase
- No sensitive data exposure in client code

## 🎯 Learning Algorithm

### Quality Score Calculation
- Input length and detail
- Answer accuracy on follow-ups
- Use of examples and explanations
- Consistency over time

### Intelligence Gain
- New topic: +5-20 points
- Correct follow-up: +5-15 points
- Timely review: +5 points
- Deep explanation: +10-25 points

### Health Changes
- Daily streak: +2 per day
- Timely review: +3 points
- Missed day: -5 points
- Overdue review: -3 points

## 🎨 Design Principles

- **Minimalist**: Clean, focused interface
- **Playful**: Fun animations and interactions
- **Accessible**: High contrast, keyboard navigation
- **Responsive**: Works on mobile, tablet, and desktop
- **Encouraging**: Positive reinforcement throughout

## 🔧 API Integrations

### Optional Enhancements

Add these environment variables for enhanced features:

```env
VITE_OPENAI_API_KEY=your_openai_key
```

**Without API keys**: The app provides graceful fallbacks using mock data and local processing.

## 📝 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

This is a demonstration project built with Claude Code. Feel free to fork and enhance!

## 🎉 Credits

- Built with ❤️ using Claude Code
- Inspired by Duolingo's gamification approach
- Halloween theme for seasonal fun
- Focus on effective learning through spaced repetition

---

**Start your learning journey with Aomigo today!** 🐾🎃
