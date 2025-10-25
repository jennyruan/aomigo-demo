import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { evaluateAnswer } from '../lib/openai';

interface FollowUpQuestionProps {
  question: string;
  onAnswerSubmit: (answer: string, qualityScore: number) => void;
}

export function FollowUpQuestion({ question, onAnswerSubmit }: FollowUpQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState('');

  async function handleSubmit() {
    if (!answer.trim()) return;

    setIsEvaluating(true);

    try {
      const result = await evaluateAnswer(question, answer);
      setEvaluation(result.evaluation);
      onAnswerSubmit(answer, result.qualityScore);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      setEvaluation('Great effort! Keep learning and teaching me more!');
      onAnswerSubmit(answer, 75);
    } finally {
      setIsEvaluating(false);
    }
  }

  if (evaluation) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg animate-in">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎉</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Great Job!</h3>
            <p className="text-green-100">{evaluation}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">🤔</span>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Follow-up Question</h3>
          <p className="text-purple-100">{question}</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 rounded-xl text-brown-700 focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[100px]"
          disabled={isEvaluating}
        />

        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || isEvaluating}
          className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Evaluating...
            </>
          ) : (
            'Submit Answer'
          )}
        </button>
      </div>
    </div>
  );
}
