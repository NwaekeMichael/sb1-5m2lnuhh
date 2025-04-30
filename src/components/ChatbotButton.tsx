import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useMetricsStore } from '../store/metricsStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { metrics } = useMetricsStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleBotResponse("Hello! I'm your AI wellness assistant. How are you feeling today?");
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBotResponse = (text: string) => {
    setIsTyping(true);
    // Simulate AI thinking time
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check stress levels from metrics
    const stressLevel = metrics?.stress_level || 0;

    if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) {
      if (stressLevel > 70) {
        return "I notice your stress levels are quite high. Would you like to try a quick breathing exercise to help calm down?";
      } else if (stressLevel > 40) {
        return "Your stress levels are moderate. How about we take a short mindfulness break?";
      } else {
        return "Your stress levels look good! Would you like to maintain this with a quick meditation session?";
      }
    }

    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return "You might need a break. Try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break. Want me to set a timer?";
    }

    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return "I hear you. Let's try grounding ourselves. Can you tell me 5 things you can see right now?";
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! Would you like to: \n1. Talk about what's bothering you\n2. Try a relaxation exercise\n3. Connect with a wellness advisor";
    }

    // Default responses for general check-ins
    const checkInResponses = [
      "How has your day been going so far?",
      "Would you like to try a quick wellness activity?",
      "I'm here to support you. What's on your mind?",
      "Remember, it's okay to take breaks when you need them."
    ];

    return checkInResponses[Math.floor(Math.random() * checkInResponses.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const botResponse = generateResponse(inputValue);
    handleBotResponse(botResponse);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute bottom-full right-0 mb-4 w-[350px] bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="font-semibold">AI Wellness Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[400px] p-4 bg-gray-50 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 ${
                    message.sender === 'user' ? 'flex justify-end' : ''
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white shadow-sm'
                    }`}
                  >
                    <p className={message.sender === 'user' ? 'text-white' : 'text-gray-600'}>
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Assistant is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        ref={buttonRef}
        data-chatbot-trigger
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};