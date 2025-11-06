import { useState, useRef, useEffect } from 'react';
import { Loader2, Keyboard, Mic, Image as ImageIcon } from 'lucide-react';
import { PetAvatar } from '../components/PetAvatar';
import { ForgettingCurve } from '../components/ForgettingCurve';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { ImageUploader } from '../components/ImageUploader';
import { FollowUpQuestion } from '../components/FollowUpQuestion';
import { usePetStats } from '../hooks/usePetStats';
import { useStore } from '../hooks/useStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { extractTopics, generateFollowUpQuestion } from '../lib/openai';
import { t, getCurrentLocale } from '../lib/lingo';
import { toast } from 'sonner';
import {
  fetchRecentTeachingHistory,
  recordTeachingSession,
  upsertTopicWithInitialReview,
  updateTeachingSessionAnswer,
} from '../lib/database/teachingSessions';

type InputMode = 'text' | 'voice' | 'image';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  topics?: string[];
  timestamp: number;
}

export function Teach() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [extractedTopicsList, setExtractedTopicsList] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { profile, addIntelligence, addHealth, updateStreak } = usePetStats();
  const { isDemoMode } = useStore();
  const locale = getCurrentLocale();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!input.trim() || !profile) return;

    setIsProcessing(true);

    try {
      await updateStreak();

      const topics = await extractTopics(input);
      setExtractedTopicsList(topics);

      let recentHistory: string[] = [];

      if (!isDemoMode && isSupabaseConfigured) {
        const recentSessions = await fetchRecentTeachingHistory(profile.id, 5);
        recentHistory = recentSessions.map((session) =>
          `${session.extracted_topics.join(', ')}: ${session.raw_input.substring(0, 100)}...`
        );
      }

      const question = await generateFollowUpQuestion(input, topics, recentHistory);
      setFollowUpQuestion(question);

      const newSessionId = `session-${Date.now()}`;
      setSessionId(newSessionId);

      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: input, topics, timestamp: Date.now() },
        { role: 'assistant', content: question, timestamp: Date.now() + 1 }
      ]);

      if (!isDemoMode && isSupabaseConfigured) {
        await recordTeachingSession({
          userId: profile.id,
          sessionId: newSessionId,
          inputType: inputMode,
          rawInput: input,
          extractedTopics: topics,
          followUpQuestion: question,
        });
      }

      if (!isDemoMode && isSupabaseConfigured) {
        for (const topicName of topics) {
          await upsertTopicWithInitialReview({
            userId: profile.id,
            topicName,
          });
        }
      }

      const intelligenceGain = Math.min(20, 5 + topics.length * 2);
      await addIntelligence(intelligenceGain);
      await addHealth(1);

      toast.success(`+${intelligenceGain} Intelligence! 🧠`);
    } catch (error) {
      console.error('[Teach] Failed to process teaching session', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleAnswerSubmit(answer: string, qualityScore: number) {
    if (!profile || !sessionId) return;

    try {
      if (!isDemoMode && isSupabaseConfigured) {
        await updateTeachingSessionAnswer({
          sessionId,
          answer,
          qualityScore,
        });
      }

      const intelligenceGain = Math.floor(qualityScore / 10);
      await addIntelligence(intelligenceGain);

      if (qualityScore > 70) {
        await addHealth(3);
      }

      toast.success(`Amazing! +${intelligenceGain} Intelligence! 🎉`);

      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: answer, timestamp: Date.now() }
      ]);

      setTimeout(() => {
        setFollowUpQuestion('');
        setInput('');
        setExtractedTopicsList([]);
        setSessionId('');
      }, 2000);
    } catch (error) {
      console.error('[Teach] Failed to submit answer', error);
    }
  }

  function handleVoiceTranscript(text: string) {
    setInput(text);
  }

  function handleImageText(text: string) {
    setInput(text);
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brown-700">
              {t('teach.title', locale)}
            </h1>
            <p className="text-brown-600 mt-1">Share what you learned today</p>
          </div>
          <PetAvatar size="small" />
        </div>

        {chatHistory.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg shadow-orange-100 p-6 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-lg text-brown-700 mb-4 flex items-center gap-2">
              <span className="text-xl">💬</span>
              Conversation History
            </h3>
            <div className="space-y-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-brown-700'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="font-semibold text-sm mb-1 flex items-center gap-1">
                        <span>🐶</span> Aomigo
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.topics && message.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {!followUpQuestion ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  inputMode === 'text'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-100 text-brown-700 hover:bg-orange-200'
                }`}
              >
                <Keyboard className="w-5 h-5" />
                Text
              </button>
              <button
                onClick={() => setInputMode('voice')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  inputMode === 'voice'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-100 text-brown-700 hover:bg-orange-200'
                }`}
              >
                <Mic className="w-5 h-5" />
                Voice
              </button>
              <button
                onClick={() => setInputMode('image')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  inputMode === 'image'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-100 text-brown-700 hover:bg-orange-200'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                Image
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {inputMode === 'text' && (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('teach.placeholder', locale)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[200px] text-brown-700"
                  disabled={isProcessing}
                />
              )}

              {inputMode === 'voice' && (
                <VoiceRecorder onTranscript={handleVoiceTranscript} />
              )}

              {inputMode === 'image' && (
                <ImageUploader onTextExtracted={handleImageText} />
              )}

              {input && inputMode !== 'voice' && (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {t('teach.submit', locale)} 🐶
                    </>
                  )}
                </button>
              )}

              {input && inputMode === 'voice' && (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {t('teach.submit', locale)} 🐶
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6">
              <h3 className="font-bold text-lg text-brown-700 mb-3">
                Topics Identified:
              </h3>
              <div className="flex flex-wrap gap-2">
                {extractedTopicsList.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <FollowUpQuestion
              question={followUpQuestion}
              onAnswerSubmit={handleAnswerSubmit}
            />
          </div>
        )}

        <div className="mt-8">
          <ForgettingCurve />
        </div>
      </div>
    </div>
  );
}
