import { useState } from 'react';
import { MessageCircle, Send, Search } from 'lucide-react';
import { usePetStats } from '../hooks/usePetStats';

interface Conversation {
  id: string;
  name: string;
  type: 'student' | 'parent' | 'teacher' | 'group';
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  badge?: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Biology Study Group',
    type: 'group',
    lastMessage: 'See you Saturday! 📚',
    timestamp: '5 mins ago',
    unread: 3,
    avatar: '🐶',
  },
  {
    id: '2',
    name: 'Mochi (Alex, 14)',
    type: 'student',
    lastMessage: 'Thanks for the notes!',
    timestamp: '2 hours ago',
    unread: 0,
    avatar: '🐶',
  },
  {
    id: '3',
    name: 'Mama Ruan',
    type: 'parent',
    lastMessage: 'How was school today?',
    timestamp: 'Yesterday',
    unread: 0,
    avatar: '🐶',
  },
  {
    id: '4',
    name: 'Ms. Johnson ✅',
    type: 'teacher',
    lastMessage: 'Great progress!',
    timestamp: '3 days ago',
    unread: 0,
    avatar: '🎓',
  },
];

const CHAT_HISTORIES: Record<string, Message[]> = {
  '1': [
    { id: '1', sender: 'Mochi (Alex)', content: 'Hey everyone! Ready for Saturday\'s study session?', timestamp: '2:15 PM', isMe: false },
    { id: '2', sender: 'You', content: 'Yes! I made flashcards for cell structure 🎴', timestamp: '2:16 PM', isMe: true },
    { id: '3', sender: 'Buddy (Emma)', content: 'Awesome! Can someone explain the light reactions to me? I\'m so confused 😅', timestamp: '2:17 PM', isMe: false },
    { id: '4', sender: 'You', content: 'I got you! Let me screen share my diagram on Saturday. It finally clicked for me yesterday! 💡', timestamp: '2:18 PM', isMe: true },
    { id: '5', sender: 'Mochi (Alex)', content: 'Perfect! I\'ll bring practice questions from the textbook', timestamp: '2:20 PM', isMe: false },
    { id: '6', sender: 'Buddy (Emma)', content: 'You guys are the best! 💚 This is way better than studying alone', timestamp: '2:22 PM', isMe: false },
    { id: '7', sender: 'Mochi (Alex)', content: 'That\'s what AOMIGO is for! Together we got this! 🐶', timestamp: '2:25 PM', isMe: false },
  ],
  '2': [
    { id: '1', sender: 'You', content: 'Hey! Thanks for responding to my post about photosynthesis! Want to study together?', timestamp: 'Yesterday', isMe: true },
    { id: '2', sender: 'Mochi (Alex)', content: 'For sure! I\'m free Saturday afternoon. Video call?', timestamp: 'Yesterday', isMe: false },
    { id: '3', sender: 'You', content: 'Perfect! 2pm work for you?', timestamp: 'Yesterday', isMe: true },
    { id: '4', sender: 'Mochi (Alex)', content: 'Yes! I\'ll send you my zoom link. Should we invite Emma too? She commented on your post', timestamp: 'Yesterday', isMe: false },
    { id: '5', sender: 'You', content: 'Good idea! I\'ll ask her 👍', timestamp: 'Yesterday', isMe: true },
    { id: '6', sender: 'Mochi (Alex)', content: 'Just finished teaching my pet about cellular respiration. It\'s all starting to connect! 🧬', timestamp: '10:30 AM', isMe: false },
    { id: '7', sender: 'You', content: 'Nice! We should quiz each other on Saturday on both topics', timestamp: '10:45 AM', isMe: true },
    { id: '8', sender: 'Mochi (Alex)', content: 'Deal! See you then! 🎉', timestamp: '10:50 AM', isMe: false },
  ],
  '4': [
    { id: '1', sender: 'You', content: 'Hi Ms. Johnson! I saw your post about the Feynman Technique. I tried it and found gaps in my algebra understanding. Could you help?', timestamp: '2 days ago', isMe: true, badge: '🔒 Monitored - Parent can view' },
    { id: '2', sender: 'Ms. Johnson', content: 'Of course! What specific concept are you struggling with?', timestamp: '2 days ago', isMe: false },
    { id: '3', sender: 'You', content: 'Factoring quadratics. I can do the easy ones but get stuck on complex ones', timestamp: '2 days ago', isMe: true },
    { id: '4', sender: 'Ms. Johnson', content: 'Great question! Here\'s a tip: Look for the pattern. For x² + 7x + 12, ask "what two numbers multiply to 12 and add to 7?" Practice with your AOMIGO pet - teach it how to find those numbers!', timestamp: '2 days ago', isMe: false },
    { id: '5', sender: 'You', content: 'That helps! I practiced teaching my pet and it clicked! Thank you! 🙏', timestamp: '1 day ago', isMe: true },
    { id: '6', sender: 'Ms. Johnson', content: 'Wonderful! That\'s exactly how learning works. Keep it up! Feel free to ask anytime! 💪', timestamp: '1 day ago', isMe: false },
  ],
};

export function Messages() {
  const { profile } = usePetStats();
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const currentChat = CHAT_HISTORIES[selectedConversation] || [];
  const currentConversation = CONVERSATIONS.find(c => c.id === selectedConversation);

  function handleSend() {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-bold text-brown-700 flex items-center gap-3 mb-6">
          <MessageCircle className="w-10 h-10 text-orange-600" />
          Messages
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg shadow-orange-100 overflow-hidden">
            <div className="p-4 border-b border-orange-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              {CONVERSATIONS.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 border-b border-orange-100 hover:bg-orange-50 transition-colors text-left ${
                    selectedConversation === conv.id ? 'bg-orange-100' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{conv.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-brown-700 truncate">{conv.name}</h3>
                        {conv.unread > 0 && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-brown-600 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">{conv.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg shadow-orange-100 flex flex-col">
            {currentConversation && (
              <>
                <div className="p-4 border-b border-orange-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentConversation.avatar}</span>
                    <div>
                      <h2 className="font-bold text-brown-700">{currentConversation.name}</h2>
                      {currentConversation.type === 'group' && (
                        <p className="text-sm text-brown-600">Sarah (Luna), Alex (Mochi), Emma (Buddy)</p>
                      )}
                      {currentConversation.type === 'teacher' && (
                        <p className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full inline-block mt-1">
                          🔒 Monitored - Parent can view
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 380px)' }}>
                  {currentChat.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${msg.isMe ? 'order-2' : 'order-1'}`}>
                        {!msg.isMe && (
                          <p className="text-sm font-semibold text-brown-700 mb-1 px-4">
                            {msg.sender}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            msg.isMe
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-brown-700'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-4">{msg.timestamp}</p>
                        {msg.badge && (
                          <p className="text-xs text-orange-600 mt-1 px-4">{msg.badge}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-orange-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageInput.trim()}
                      className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xl font-bold text-orange-600">Together We Got This 🐶</p>
        </div>
      </div>
    </div>
  );
}
