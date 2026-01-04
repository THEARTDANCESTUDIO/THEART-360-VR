
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { getDanceConsultantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to THEART. I am your dance consultant. How can I help you elevate your movement today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getDanceConsultantResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', text: response || '' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold"
        >
          <Sparkles className="w-5 h-5" />
          <span>ASK THEART</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-neutral-900 border border-neutral-800 w-[90vw] md:w-96 h-[500px] flex flex-col shadow-2xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-black p-4 border-b border-neutral-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="font-bold text-xs tracking-widest uppercase">Dance Consultant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 text-sm ${
                  m.role === 'user' ? 'bg-white text-black rounded-l-lg rounded-tr-lg' : 'bg-neutral-800 text-white rounded-r-lg rounded-tl-lg'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 p-3 rounded-lg text-neutral-500 animate-pulse text-xs uppercase font-bold tracking-widest">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about classes, instructors..."
              className="flex-1 bg-black border border-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-white text-black p-2 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
