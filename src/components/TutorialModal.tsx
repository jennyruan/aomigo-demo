import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUTORIAL_PAGES = [
  {
    title: "Welcome to AOMIGO! 🐶",
    emoji: "🐶",
    content: (
      <div className="space-y-4">
        <p className="text-lg leading-relaxed">
          Hi! I'm your AOMIGO pet! 🐶
        </p>
        <p className="text-lg leading-relaxed">
          I'm here to help you:
        </p>
        <ul className="text-left space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span>✨</span>
            <span>Remember what you learn</span>
          </li>
          <li className="flex items-start gap-2">
            <span>🤝</span>
            <span>Make new friends</span>
          </li>
          <li className="flex items-start gap-2">
            <span>❤️</span>
            <span>Feel less lonely</span>
          </li>
        </ul>
        <p className="text-lg leading-relaxed">
          Think of me like a Tamagotchi,<br />
          but I help you get smarter!
        </p>
      </div>
    ),
  },
  {
    title: "📚 Step 1: Teach Me!",
    emoji: "📚",
    content: (
      <div className="space-y-4">
        <p className="text-lg leading-relaxed">
          Every day, tell me what you learned:
        </p>
        <ul className="text-left space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span>⌨️</span>
            <span>Type it in words</span>
          </li>
          <li className="flex items-start gap-2">
            <span>🎤</span>
            <span>Say it out loud</span>
          </li>
          <li className="flex items-start gap-2">
            <span>📸</span>
            <span>Take a photo of your notes</span>
          </li>
        </ul>
        <div className="bg-orange-100 rounded-xl p-4 max-w-md mx-auto">
          <p className="font-semibold text-orange-800 mb-2">Example:</p>
          <p className="text-orange-700 italic">
            "Today I learned that plants need sunlight to grow!"
          </p>
        </div>
        <p className="text-lg leading-relaxed font-semibold">
          The more you teach me, the smarter I get! 🧠
        </p>
      </div>
    ),
  },
  {
    title: "🤔 Step 2: I'll Ask You Questions!",
    emoji: "🤔",
    content: (
      <div className="space-y-4">
        <p className="text-lg leading-relaxed">
          When you teach me, I get curious!<br />
          I'll ask things like:
        </p>
        <div className="space-y-3 max-w-md mx-auto">
          <div className="bg-gray-100 rounded-2xl p-4 text-left">
            <p className="text-brown-700">"Why do plants need sunlight?"</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 text-left">
            <p className="text-brown-700">"What happens if there's no sun?"</p>
          </div>
        </div>
        <p className="text-lg leading-relaxed">
          Don't worry if you don't know!<br />
          I'm here to help you think! 💭
        </p>
      </div>
    ),
  },
  {
    title: "👥 Step 3: Connect With Friends!",
    emoji: "👥",
    content: (
      <div className="space-y-4">
        <p className="text-lg leading-relaxed">
          I'll post what you learned:
        </p>
        <div className="bg-orange-500 text-white rounded-2xl p-4 max-w-md mx-auto">
          <p className="font-semibold">"Learned about plants today! 🌱"</p>
        </div>
        <p className="text-lg leading-relaxed">
          Other kids' pets will see it!<br />
          They might say:
        </p>
        <div className="bg-gray-100 rounded-2xl p-4 max-w-md mx-auto">
          <p className="text-brown-700">"Me too! Wanna study together?"</p>
        </div>
        <p className="text-lg leading-relaxed">
          You can make friends through me! 🤝
        </p>
        <p className="text-sm text-gray-600">
          (And it's safe—your parents can see everything!)
        </p>
      </div>
    ),
  },
  {
    title: "🎮 Step 4: Help Me Grow!",
    emoji: "🎮",
    content: (
      <div className="space-y-4">
        <p className="text-lg leading-relaxed">
          Take care of me every day:
        </p>
        <ul className="text-left space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span>🔥</span>
            <span>Keep your Daily Streak going</span>
          </li>
          <li className="flex items-start gap-2">
            <span>⭐</span>
            <span>Help me level up</span>
          </li>
          <li className="flex items-start gap-2">
            <span>💚</span>
            <span>Keep my Energy full</span>
          </li>
        </ul>
        <p className="text-lg leading-relaxed font-semibold">
          If you teach me every day,<br />
          I'll grow bigger and stronger!
        </p>
        <p className="text-lg leading-relaxed">
          Miss a day? I'll get sad 😢<br />
          <span className="text-sm">(But don't worry, I'll always forgive you!)</span>
        </p>
        <p className="text-2xl font-bold text-orange-600 mt-6">
          Together We Got This 🐶
        </p>
      </div>
    ),
  },
];

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  function handleNext() {
    if (currentPage < TUTORIAL_PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  }

  function handleBack() {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  }

  function handleComplete() {
    onClose();
    setCurrentPage(0);
  }

  function handleSkip() {
    onClose();
    setCurrentPage(0);
  }

  const currentPageData = TUTORIAL_PAGES[currentPage];
  const isLastPage = currentPage === TUTORIAL_PAGES.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 animate-fade-in">
      <div className="bg-gradient-to-br from-cream-50 to-orange-50 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up relative">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip Tutorial
          </button>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 sm:p-12 text-center overflow-y-auto max-h-[90vh]">
          <div className="text-8xl mb-6 animate-bounce">
            {currentPageData.emoji}
          </div>

          <h2 className="text-3xl font-bold text-brown-700 mb-6">
            {currentPageData.title}
          </h2>

          <div className="text-brown-700 mb-8">
            {currentPageData.content}
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {TUTORIAL_PAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage
                    ? 'bg-orange-500 w-8'
                    : 'bg-orange-200 hover:bg-orange-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            {currentPage > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border-2 border-orange-300 text-orange-700 rounded-xl font-semibold hover:bg-orange-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {isLastPage ? (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg ml-auto"
              >
                🎉 Start Using AOMIGO!
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform ml-auto"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
