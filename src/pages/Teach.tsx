import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Keyboard, Mic, Image as ImageIcon } from 'lucide-react';
import { PetAvatar } from '../components/PetAvatar';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { ImageUploader } from '../components/ImageUploader';
import { FollowUpQuestion } from '../components/FollowUpQuestion';
import { usePetStats } from '../hooks/usePetStats';
import { useStore } from '../hooks/useStore';
import { supabase } from '../lib/supabase';
import { extractTopics, generateFollowUpQuestion } from '../lib/openai';
import { t, getCurrentLocale } from '../lib/lingo';
import { toast } from 'sonner';

type InputMode = 'text' | 'voice' | 'image';

export function Teach() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [extractedTopicsList, setExtractedTopicsList] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState('');
  const { profile, addIntelligence, addHealth, updateStreak } = usePetStats();
  const { isDemoMode } = useStore();
  const navigate = useNavigate();
  const locale = getCurrentLocale();

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!input.trim() || !profile) return;

    setIsProcessing(true);

    try {
      await updateStreak();

      const topics = await extractTopics(input);
      setExtractedTopicsList(topics);

      let recentHistory: string[] = [];

      if (!isDemoMode) {
        const { data: recentSessions } = await supabase
          .from('teaching_sessions')
          .select('raw_input, extracted_topics')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        recentHistory = recentSessions?.map(s =>
          `${s.extracted_topics.join(', ')}: ${s.raw_input.substring(0, 100)}...`
        ) || [];
      }

      const question = await generateFollowUpQuestion(input, topics, recentHistory);
      setFollowUpQuestion(question);

      const newSessionId = `session-${Date.now()}`;
      setSessionId(newSessionId);

      if (!isDemoMode) {
        const { error } = await supabase.from('teaching_sessions').insert([
          {
            user_id: profile.id,
            session_id: newSessionId,
            input_type: inputMode,
            raw_input: input,
            extracted_topics: topics,
            follow_up_question: question,
          },
        ]);

        if (error) throw error;
      }

      if (!isDemoMode) {
        for (const topicName of topics) {
          const { data: existing } = await supabase
            .from('topics')
            .select('*')
            .eq('user_id', profile.id)
            .eq('topic_name', topicName)
            .maybeSingle();

          if (existing) {
            await supabase
              .from('topics')
              .update({
                depth: existing.depth + 1,
                last_reviewed: new Date().toISOString(),
              })
              .eq('id', existing.id);
          } else {
            const { data: newTopic } = await supabase
              .from('topics')
              .insert([
                {
                  user_id: profile.id,
                  topic_name: topicName,
                  depth: 1,
                },
              ])
              .select()
              .single();

            if (newTopic) {
              const scheduledDate = new Date();
              scheduledDate.setMinutes(scheduledDate.getMinutes() + 10);

              await supabase.from('reviews').insert([
                {
                  user_id: profile.id,
                  topic_id: newTopic.id,
                  scheduled_date: scheduledDate.toISOString(),
                  interval_days: 0,
                },
              ]);
            }
          }
        }
      }

      const intelligenceGain = Math.min(20, 5 + topics.length * 2);
      await addIntelligence(intelligenceGain);
      await addHealth(1);

      toast.success(`+${intelligenceGain} Intelligence! 🧠`);
    } catch (error) {
      console.error('Error processing teaching:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleAnswerSubmit(answer: string, qualityScore: number) {
    if (!profile || !sessionId) return;

    try {
      if (!isDemoMode) {
        await supabase
          .from('teaching_sessions')
          .update({
            user_answer: answer,
            quality_score: qualityScore,
            intelligence_gain: Math.floor(qualityScore / 10),
            health_change: qualityScore > 70 ? 3 : 1,
          })
          .eq('session_id', sessionId);
      }

      const intelligenceGain = Math.floor(qualityScore / 10);
      await addIntelligence(intelligenceGain);

      if (qualityScore > 70) {
        await addHealth(3);
      }

      toast.success(`Amazing! +${intelligenceGain} Intelligence! 🎉`);

      setTimeout(() => {
        navigate('/summary');
      }, 2000);
    } catch (error) {
      console.error('Error saving answer:', error);
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
      </div>
    </div>
  );
}
