const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

interface FollowUpResponse {
  question: string;
  evaluation?: string;
  qualityScore?: number;
}

const AOMIGO_PERSONALITY = `You are Aomigo, a friendly and encouraging AI learning companion in the form of a cute puppy. Your personality:
- Warm, supportive, and enthusiastic about learning
- Use simple, clear language
- Celebrate successes genuinely
- Provide constructive feedback kindly
- Make learning feel fun and rewarding
- Never mention yourself as an app or AI - you're their learning buddy`;

export async function generateFollowUpQuestion(
  input: string,
  topics: string[],
  recentHistory?: string[]
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required for Aomigo to communicate');
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `${AOMIGO_PERSONALITY}\n\nBased on what the user just shared, generate ONE insightful follow-up question that:\n1. Tests their understanding of the concepts they explained\n2. Encourages deeper thinking or application\n3. Relates to their actual learning content (NOT about you or the learning app)\n4. Is specific to what they taught\n5. Can connect to their previous learning if relevant\n\nSpeak as Aomigo, their friendly learning companion. Keep the question concise, clear, and engaging. Focus entirely on the subject matter they are learning.`,
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      return 'Tell me more about what you learned!';
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string
): Promise<{ evaluation: string; qualityScore: number }> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required for Aomigo to communicate');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `${AOMIGO_PERSONALITY}\n\nEvaluate the user's answer with warmth and encouragement. Return ONLY a JSON object with:\n- "evaluation": 2-3 sentences of friendly, specific feedback from Aomigo\n- "qualityScore": number from 0-100 based on accuracy, depth, and understanding\n\nBe encouraging but honest. Highlight what they did well and gently suggest improvements if needed.`,
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      return {
        evaluation: 'Great effort! You\'re learning so well!',
        qualityScore: 75,
      };
    }

    const content = data.choices[0].message.content;

    try {
      const parsed = JSON.parse(content);
      return {
        evaluation: parsed.evaluation || 'Great effort! You\'re learning so well!',
        qualityScore: parsed.qualityScore || 75,
      };
    } catch {
      return {
        evaluation: 'Great effort! You\'re learning so well!',
        qualityScore: 75,
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function extractTopics(input: string): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required for Aomigo to communicate');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      return ['learning'];
    }

    const content = data.choices[0].message.content;

    try {
      const topics = JSON.parse(content);
      return Array.isArray(topics) && topics.length > 0 ? topics : ['learning'];
    } catch {
      return ['learning'];
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function evaluateReview(
  topicName: string,
  answer: string
): Promise<{ feedback: string; result: 'good' | 'poor'; qualityScore: number }> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required for Aomigo to communicate');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `${AOMIGO_PERSONALITY}\n\nEvaluate the user's understanding of the topic "${topicName}". Return ONLY a JSON object with:\n- "feedback": 2-3 encouraging sentences from Aomigo about their understanding\n- "result": either "good" (shows clear understanding) or "poor" (needs more detail)\n- "qualityScore": number from 0-100\n\nBe warm and supportive in all feedback.`,
          },
          {
            role: 'user',
            content: `Topic: ${topicName}\n\nUser's explanation:\n${answer}\n\nEvaluate their understanding and return JSON only.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      return {
        feedback: 'Great effort! Keep learning!',
        result: 'good',
        qualityScore: 75,
      };
    }

    const content = data.choices[0].message.content;

    try {
      const parsed = JSON.parse(content);
      return {
        feedback: parsed.feedback || 'Great effort! Keep learning!',
        result: parsed.result === 'poor' ? 'poor' : 'good',
        qualityScore: parsed.qualityScore || 75,
      };
    } catch {
      return {
        feedback: 'Great effort! Keep learning!',
        result: 'good',
        qualityScore: 75,
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
