import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';

interface KnowledgeDomain {
  subject: string;
  emoji: string;
  lastTaught: string;
  reviewsCompleted: number;
  nextReview: string;
  strength: 'excellent' | 'strong' | 'medium' | 'weak' | 'critical';
  retentionPoints: { day: number; retention: number }[];
}

interface ForgettingCurveProps {
  domains?: KnowledgeDomain[];
}

const DEFAULT_DOMAINS: KnowledgeDomain[] = [
  {
    subject: 'Biology',
    emoji: '📚',
    lastTaught: '2 days ago',
    reviewsCompleted: 3,
    nextReview: 'Tomorrow',
    strength: 'strong',
    retentionPoints: [
      { day: 0, retention: 100 },
      { day: 1, retention: 90 },
      { day: 2, retention: 85 },
      { day: 3, retention: 83 },
    ],
  },
  {
    subject: 'Math',
    emoji: '🧮',
    lastTaught: '5 days ago',
    reviewsCompleted: 1,
    nextReview: 'OVERDUE',
    strength: 'weak',
    retentionPoints: [
      { day: 0, retention: 100 },
      { day: 1, retention: 75 },
      { day: 2, retention: 60 },
      { day: 5, retention: 40 },
    ],
  },
  {
    subject: 'History',
    emoji: '🌍',
    lastTaught: '1 day ago',
    reviewsCompleted: 2,
    nextReview: 'In 2 days',
    strength: 'excellent',
    retentionPoints: [
      { day: 0, retention: 100 },
      { day: 1, retention: 92 },
    ],
  },
];

const strengthColors = {
  excellent: { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' },
  strong: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
  medium: { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' },
  weak: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' },
  critical: { bg: 'bg-red-200', text: 'text-red-900', bar: 'bg-red-700' },
};

const strengthLabels = {
  excellent: 'Excellent',
  strong: 'Strong',
  medium: 'Medium',
  weak: 'Weak',
  critical: 'Critical',
};

export function ForgettingCurve({ domains = DEFAULT_DOMAINS }: ForgettingCurveProps) {
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  function toggleDomain(subject: string) {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subject)) {
        newSet.delete(subject);
      } else {
        newSet.add(subject);
      }
      return newSet;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-brown-700">
          📊 Your Memory Strength by Subject
        </h2>
      </div>

      {domains.map((domain) => {
        const isExpanded = expandedDomains.has(domain.subject);
  const colors = strengthColors[domain.strength];

        return (
          <div
            key={domain.subject}
            className="bg-white rounded-2xl shadow-lg shadow-orange-100 overflow-hidden"
          >
            <button
              onClick={() => toggleDomain(domain.subject)}
              className="w-full p-4 flex items-center justify-between hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{domain.emoji}</span>
                <div className="text-left">
                  <h3 className="font-bold text-brown-700 text-lg">
                    {domain.subject}
                  </h3>
                  <p className="text-sm text-brown-600">
                    Last taught: {domain.lastTaught}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${colors.bg} ${colors.text}`}>
                  {strengthLabels[domain.strength]}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-brown-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-brown-600" />
              )}
            </button>

            {isExpanded && (
              <div className="p-6 border-t border-orange-100 bg-gradient-to-br from-orange-50 to-purple-50">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-brown-700 mb-4">Memory Retention</h4>

                  <div className="relative h-48 bg-white rounded-xl p-4 border-2 border-orange-200">
                    <div className="absolute inset-4">
                      <div className="relative h-full">
                        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-brown-600 font-semibold">
                          <span>100%</span>
                          <span>75%</span>
                          <span>50%</span>
                          <span>25%</span>
                          <span>0%</span>
                        </div>

                        <svg className="absolute left-10 inset-y-0 right-0" viewBox="0 0 300 160" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id={`gradient-${domain.subject}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>

                          <polyline
                            points={domain.retentionPoints
                              .map((point, i) => `${(i / (domain.retentionPoints.length - 1)) * 280},${160 - (point.retention / 100) * 140}`)
                              .join(' ')}
                            fill="none"
                            stroke="#FF6B35"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <polyline
                            points={`${domain.retentionPoints
                              .map((point, i) => `${(i / (domain.retentionPoints.length - 1)) * 280},${160 - (point.retention / 100) * 140}`)
                              .join(' ')} ${280},160 0,160`}
                            fill={`url(#gradient-${domain.subject})`}
                          />

                          {domain.retentionPoints.map((point, i) => (
                            <circle
                              key={i}
                              cx={(i / (domain.retentionPoints.length - 1)) * 280}
                              cy={160 - (point.retention / 100) * 140}
                              r="4"
                              fill="#FF6B35"
                              stroke="white"
                              strokeWidth="2"
                            />
                          ))}

                          <polyline
                            points="0,120 70,140 140,150 210,155 280,158"
                            fill="none"
                            stroke="#CCCCCC"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                        </svg>

                        <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-brown-600 font-semibold mt-2">
                          <span>0d</span>
                          <span>1d</span>
                          <span>3d</span>
                          <span>7d</span>
                          <span>14d</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-orange-500"></div>
                      <span className="text-brown-600">With reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-gray-400" style={{ borderTop: '2px dashed #CCCCCC' }}></div>
                      <span className="text-brown-600">Without reviews</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${colors.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {domain.nextReview === 'OVERDUE' ? (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-red-600">Next review: OVERDUE!</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-700">Next review: {domain.nextReview}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-brown-600">
                      Keep your streak going!
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🔥</span>
                      <span className="font-bold text-purple-700">
                        Strength: {strengthLabels[domain.strength]}
                      </span>
                    </div>
                    <p className="text-sm text-brown-600">
                      {domain.reviewsCompleted} review{domain.reviewsCompleted !== 1 ? 's' : ''} completed
                    </p>
                  </div>
                </div>

                {domain.nextReview === 'OVERDUE' && (
                  <button className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                    Review Now! ⚠️
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
