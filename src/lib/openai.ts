const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

interface FollowUpResponse {
  question: string;
  evaluation?: string;
  qualityScore?: number;
}

export async function generateFollowUpQuestion(
  input: string,
  topics: string[],
  recentHistory?: string[]
): Promise<string> {
  if (!OPENAI_API_KEY) {
    return getMockFollowUpQuestion(topics);
  }

  try {
    const historyContext = recentHistory && recentHistory.length > 0
      ? `\n\nRecent learning history:\n${recentHistory.map((h, i) => `${i + 1}. ${h}`).join('\n')}`
      : '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert learning assistant. Based on what the user just shared, generate ONE insightful follow-up question that:\n1. Tests their understanding of the concepts they explained\n2. Encourages deeper thinking or application\n3. Relates to their actual learning content (NOT about you or the learning app)\n4. Is specific to what they taught\n5. Can connect to their previous learning if relevant\n\nKeep the question concise, clear, and engaging. Focus entirely on the subject matter they are learning.',
          },
          {
            role: 'user',
            content: `The user is learning about: ${topics.join(', ')}.\n\nWhat they just explained:\n"${input}"${historyContext}\n\nGenerate ONE follow-up question about the concepts they explained (NOT about the learning process or app).`,
          },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || getMockFollowUpQuestion(topics);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return getMockFollowUpQuestion(topics);
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string
): Promise<{ evaluation: string; qualityScore: number }> {
  if (!OPENAI_API_KEY) {
    return getMockEvaluation();
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert learning evaluator. Evaluate the user\'s answer objectively and provide constructive, encouraging feedback. Return ONLY a JSON object with:\n- "evaluation": 2-3 sentences of friendly, specific feedback about their answer\n- "qualityScore": number from 0-100 based on accuracy, depth, and understanding\n\nBe encouraging but honest. Highlight what they did well and gently suggest improvements if needed.',
          },
          {
            role: 'user',
            content: `Question: ${question}\nAnswer: ${answer}\n\nEvaluate this answer and return JSON only.`,
          },
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';

    try {
      const parsed = JSON.parse(content);
      return {
        evaluation: parsed.evaluation || 'Great effort!',
        qualityScore: parsed.qualityScore || 75,
      };
    } catch {
      return getMockEvaluation();
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return getMockEvaluation();
  }
}

function getMockFollowUpQuestion(topics: string[]): string {
  const questions = [
    `Can you explain how ${topics[0]} works in practice?`,
    `What's the main benefit of using ${topics[0]}?`,
    `How does ${topics[0]} relate to what you learned yesterday?`,
    `Can you give me an example of when you'd use ${topics[0]}?`,
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

function getMockEvaluation(): { evaluation: string; qualityScore: number } {
  return {
    evaluation: 'Great job! You\'re showing good understanding. Keep it up! 🐶',
    qualityScore: Math.floor(Math.random() * 20) + 70,
  };
}

export async function extractTopics(input: string): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    return extractTopicsMock(input);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Extract 2-5 key topics or concepts from the user\'s learning content. Return ONLY a JSON array of strings with the main topics/concepts they are explaining. Be specific and concise.',
          },
          {
            role: 'user',
            content: input,
          },
        ],
        max_tokens: 150,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    try {
      const topics = JSON.parse(content);
      return Array.isArray(topics) ? topics : extractTopicsMock(input);
    } catch {
      return extractTopicsMock(input);
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return extractTopicsMock(input);
  }
}

function extractTopicsMock(input: string): string[] {
  const words = input.toLowerCase().split(/\s+/);
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'learned', 'today', 'yesterday']);
  const topics = words.filter(word => word.length > 4 && !commonWords.has(word));
  return topics.slice(0, 3);
}
