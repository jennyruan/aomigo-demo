const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

interface FollowUpResponse {
  question: string;
  evaluation?: string;
  qualityScore?: number;
}

export async function generateFollowUpQuestion(
  input: string,
  topics: string[]
): Promise<string> {
  if (!OPENAI_API_KEY) {
    return getMockFollowUpQuestion(topics);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are Aomigo, a friendly AI pet learning companion. Ask ONE insightful follow-up question to test understanding. Keep it concise, friendly, and encouraging.',
          },
          {
            role: 'user',
            content: `The user just taught me about: ${topics.join(', ')}. Here's what they said: "${input}". Ask me ONE follow-up question to test their understanding.`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are Aomigo. Evaluate the user\'s answer and provide encouraging feedback. Return a JSON object with "evaluation" (friendly feedback) and "qualityScore" (0-100).',
          },
          {
            role: 'user',
            content: `Question: ${question}\nAnswer: ${answer}\n\nEvaluate this answer.`,
          },
        ],
        max_tokens: 200,
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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Extract 2-5 key topics or concepts from the user\'s input. Return as a JSON array of strings.',
          },
          {
            role: 'user',
            content: input,
          },
        ],
        max_tokens: 100,
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
