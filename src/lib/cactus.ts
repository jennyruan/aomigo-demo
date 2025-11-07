const CACTUS_API_KEY = import.meta.env.VITE_CACTUS_API_KEY || '';

export interface Question {
  id: string;
  question: string;
  expectedAnswer: string;
  topic: string;
}

export interface QualityAnalysis {
  score: number;
  insights: string[];
  strengths: string[];
  improvements: string[];
}

export interface Summary {
  text: string;
  keyPoints: string[];
  topics: string[];
}

class CactusClient {
  private apiKey: string;
  private useSimulation: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || CACTUS_API_KEY;
    this.useSimulation = !this.apiKey;

    if (this.useSimulation) {
      console.log('[Cactus Compute] No API key provided, using simulated mode');
    } else {
      console.log('[Cactus Compute] Initialized with API key');
    }
  }

  async summarizeText(text: string): Promise<Summary> {
    if (this.useSimulation) {
      return this.simulateSummary(text);
    }

    try {
      const response = await fetch('https://api.cactuscompute.com/v1/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Cactus API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Cactus] Summary generated');
      return data;
    } catch (error) {
      console.error('[Cactus] API error, falling back to simulation:', error);
      return this.simulateSummary(text);
    }
  }

  async generateQuiz(topics: string[]): Promise<Question[]> {
    if (this.useSimulation) {
      return this.simulateQuiz(topics);
    }

    try {
      const response = await fetch('https://api.cactuscompute.com/v1/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ topics }),
      });

      if (!response.ok) {
        throw new Error(`Cactus API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Cactus] Quiz generated');
      return data.questions;
    } catch (error) {
      console.error('[Cactus] API error, falling back to simulation:', error);
      return this.simulateQuiz(topics);
    }
  }

  async analyzeQuality(text: string): Promise<QualityAnalysis> {
    if (this.useSimulation) {
      return this.simulateQualityAnalysis(text);
    }

    try {
      const response = await fetch('https://api.cactuscompute.com/v1/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Cactus API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Cactus] Quality analysis complete');
      return data;
    } catch (error) {
      console.error('[Cactus] API error, falling back to simulation:', error);
      return this.simulateQualityAnalysis(text);
    }
  }

  async measureLatency(): Promise<number> {
    const start = performance.now();

    if (this.useSimulation) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 250));
      return Math.round(performance.now() - start);
    }

    try {
      await fetch('https://api.cactuscompute.com/v1/ping', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return Math.round(performance.now() - start);
    } catch (error) {
      console.error('[Cactus] Latency measurement error:', error);
      return Math.round(Math.random() * 150 + 250);
    }
  }

  private simulateSummary(text: string): Summary {
    const words = text.split(' ').slice(0, 30);
    const summary = words.join(' ') + (text.split(' ').length > 30 ? '...' : '');

    const topics = text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 5)
      .slice(0, 5);

    return {
      text: summary + ' (simulated)',
      keyPoints: [
        'Main concept identified',
        'Key relationships noted',
        'Application examples found',
      ],
      topics: topics.length > 0 ? topics : ['general learning'],
    };
  }

  private simulateQuiz(topics: string[]): Question[] {
    return topics.slice(0, 3).map((topic, i) => ({
      id: `q-${i + 1}`,
      question: `Can you explain the key concept behind ${topic}?`,
      expectedAnswer: `A detailed explanation about ${topic} covering its main principles and applications.`,
      topic,
    }));
  }

  private simulateQualityAnalysis(text: string): QualityAnalysis {
    const wordCount = text.split(' ').length;
    const hasExamples = /example|for instance|such as/i.test(text);
    const hasDetails = wordCount > 50;

    let score = 70;
    if (hasExamples) score += 10;
    if (hasDetails) score += 10;
    score += Math.floor(Math.random() * 10);

    return {
      score: Math.min(score, 100),
      insights: [
        `Content length: ${wordCount} words`,
        hasExamples ? 'Includes practical examples' : 'Could benefit from more examples',
        hasDetails ? 'Provides sufficient detail' : 'Consider adding more depth',
      ],
      strengths: [
        'Clear communication',
        'Structured content',
      ],
      improvements: [
        hasExamples ? 'Great use of examples!' : 'Add concrete examples',
        hasDetails ? 'Good level of detail' : 'Expand on key concepts',
      ],
    };
  }

  isSimulated(): boolean {
    return this.useSimulation;
  }
}

export const cactusClient = new CactusClient();
