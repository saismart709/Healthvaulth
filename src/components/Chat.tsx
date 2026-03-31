import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, User } from '../types';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Trash2, 
  Sparkles, 
  Zap, 
  Brain, 
  ExternalLink,
  ChevronDown,
  MessageSquare,
  Search,
  ShieldCheck
} from 'lucide-react';

interface ChatProps {
  user: User;
}

type GeminiModel = 'gemini-3-flash-preview' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite-preview';

export const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your HealthVault AI Assistant. I can help you understand symptoms, explain medical terms, review prescriptions, or guide you through the platform. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-3-flash-preview');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input;
    if (!messageToSend.trim()) return;
    
    const userMsg = messageToSend.trim();
    if (!overrideInput) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY') || process.env.GEMINI_API_KEY.includes('YOUR_API_KEY_HERE')) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "⚠️ **Configuration Required**\n\nAI features are disabled. Please add your `GEMINI_API_KEY` to the `.env` file at the root of the project and restart your server." 
        }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: [
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `You are a professional medical AI assistant for HealthVault, a comprehensive healthcare management platform. 
          Your goal is to provide accurate, empathetic, and helpful information to patients, doctors, and administrators.
          
          Guidelines:
          - Be concise but thorough.
          - Use clear, non-technical language when explaining medical terms to patients.
          - Always include a disclaimer that you are an AI and not a substitute for professional medical advice.
          - If the user mentions an emergency (chest pain, severe bleeding, etc.), advise them to call emergency services immediately.
          - Current user: ${user?.name} (${user?.role}).
          - Use Markdown for formatting (bolding, lists, etc.) to make information scannable.`,
        },
      });

      const text = response.text || "I'm sorry, I couldn't generate a response.";
      
      // Extract grounding sources
      const sources: { title: string; uri: string }[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach(chunk => {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title || 'Source',
              uri: chunk.web.uri || ''
            });
          }
        });
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: text,
        sources: sources.length > 0 ? sources : undefined
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error while processing your request. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const models = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', icon: <Zap size={14} />, desc: 'Fast & efficient for general tasks' },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', icon: <Brain size={14} />, desc: 'Complex reasoning & deep knowledge' },
    { id: 'gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Lite', icon: <Sparkles size={14} />, desc: 'Ultra-fast for simple queries' },
  ];

  return (
    <div className="chat-wrap max-w-[800px] mx-auto animate-fade-in">
      <div className="chat-card rounded-2xl overflow-hidden shadow-2xl border border-border-custom bg-white dark:bg-card-custom transition-all">
        {/* Chat Header */}
        <div className="chat-hdr bg-gradient-to-br from-[#0A0F1E] to-[#1a2b4e] p-5 md:p-6 flex items-center gap-4 relative z-20">
          <div className="chat-bot-ava w-12 h-12 bg-primary/20 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <Bot size={28} />
          </div>
          <div className="flex-1">
            <div className="chat-bot-name text-lg font-bold text-white flex items-center gap-2">
              HealthVault AI
              <span className="px-1.5 py-0.5 bg-teal-custom/20 text-teal-custom text-[10px] font-bold uppercase tracking-wider rounded border border-teal-custom/30">Assistant</span>
            </div>
            <div className="relative mt-1">
              <button 
                className="chat-bot-status text-xs text-white/60 flex items-center gap-1.5 hover:text-white transition-colors group"
                onClick={() => setShowModelMenu(!showModelMenu)}
              >
                <span className="w-1.5 h-1.5 bg-teal-custom rounded-full inline-block animate-pulse"></span>
                {models.find(m => m.id === selectedModel)?.name}
                <ChevronDown size={12} className={`transition-transform duration-200 ${showModelMenu ? 'rotate-180' : ''}`} />
              </button>

              {showModelMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowModelMenu(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-border-custom dark:border-white/10 overflow-hidden z-40 animate-fade-in">
                    <div className="p-2 border-b border-border-custom dark:border-white/5 bg-bg-custom dark:bg-white/5">
                      <div className="text-[10px] font-bold text-text-3 uppercase tracking-widest px-2 py-1">Select Model</div>
                    </div>
                    {models.map((m) => (
                      <button
                        key={m.id}
                        className={`w-full flex items-start gap-3 p-3 text-left hover:bg-bg-custom dark:hover:bg-white/5 transition-colors ${selectedModel === m.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                        onClick={() => {
                          setSelectedModel(m.id as GeminiModel);
                          setShowModelMenu(false);
                        }}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-lg ${selectedModel === m.id ? 'bg-primary text-white' : 'bg-bg-custom dark:bg-white/10 text-text-2'}`}>
                          {m.icon}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${selectedModel === m.id ? 'text-primary' : 'text-text-custom'}`}>{m.name}</div>
                          <div className="text-[10px] text-text-3 mt-0.5 leading-tight">{m.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all" 
              onClick={() => setMessages([messages[0]])}
              title="Clear Conversation"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Messages Area */}
        <div className="chat-msgs min-h-[400px] max-h-[500px] overflow-y-auto p-6 flex flex-col gap-5 bg-bg-custom dark:bg-slate-950/50 scrollbar-thin">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`msg-ava w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-primary border border-border-custom dark:border-white/10'}`}>
                {msg.role === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
              </div>
              <div className={`max-w-[85%] group relative ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 text-[13px] leading-relaxed shadow-sm transition-all ${
                  msg.role === 'user' 
                    ? 'user-bubble bg-primary text-white rounded-2xl rounded-tr-none' 
                    : 'bot-bubble bg-white dark:bg-card-custom rounded-2xl rounded-tl-none text-text-custom border border-border-custom dark:border-white/10'
                }`}>
                  <div className="markdown-body prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border-custom dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-3 uppercase tracking-wider mb-2">
                        <Search size={10} />
                        Sources
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, sIdx) => (
                          <a 
                            key={sIdx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] bg-bg-custom dark:bg-white/5 hover:bg-primary/10 hover:text-primary px-2.5 py-1.5 rounded-lg border border-border-custom dark:border-white/10 transition-all truncate max-w-[180px]"
                            title={source.title}
                          >
                            <span className="truncate">{source.title}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-[10px] text-text-3 mt-1.5 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 items-start">
              <div className="msg-ava w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-slate-800 text-primary border border-border-custom dark:border-white/10 shadow-sm">
                <Bot size={18} />
              </div>
              <div className="bot-bubble bg-white dark:bg-card-custom rounded-2xl rounded-tl-none p-4 border border-border-custom dark:border-white/10 shadow-sm">
                <div className="chat-typing flex gap-1.5 items-center py-1">
                  <div className="typing-dot bg-primary/40"></div>
                  <div className="typing-dot bg-primary/70"></div>
                  <div className="typing-dot bg-primary"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Actions */}
        <div className="chat-quick-btns flex gap-2 p-4 px-6 bg-white dark:bg-card-custom border-t border-border-custom dark:border-white/5 flex-wrap overflow-x-auto no-scrollbar">
          {[
            { label: 'Check Symptoms', icon: <Search size={12} /> },
            { label: 'Find Doctor', icon: <UserIcon size={12} /> },
            { label: 'Book Appt', icon: <MessageSquare size={12} /> },
            { label: 'My Meds', icon: <Zap size={12} /> },
            { label: 'Health Tips', icon: <Sparkles size={12} /> }
          ].map(btn => (
            <button 
              key={btn.label} 
              className="quick-btn flex items-center gap-2 px-4 py-2 rounded-xl border border-border-custom dark:border-white/10 bg-bg-custom dark:bg-white/5 text-xs font-semibold text-text-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all whitespace-nowrap"
              onClick={() => handleSend(btn.label)}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
        
        {/* Input Area */}
        <div className="chat-input-row flex items-center gap-3 p-4 px-6 bg-white dark:bg-card-custom border-t border-border-custom dark:border-white/5">
          <div className="flex-1 relative">
            <input 
              className="chat-input w-full pl-5 pr-12 py-3.5 border border-border-custom dark:border-white/10 rounded-2xl text-[13px] font-outfit outline-none bg-bg-custom dark:bg-white/5 transition-all focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/5 text-text-custom" 
              placeholder="Ask me anything about your health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3">
              <MessageSquare size={18} />
            </div>
          </div>
          <button 
            className={`chat-send w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg ${
              input.trim() ? 'bg-primary hover:bg-primary-dark hover:scale-105 shadow-primary/20' : 'bg-text-3 cursor-not-allowed opacity-50'
            }`} 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-[10px] text-text-3 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
          <ShieldCheck size={12} className="text-teal-custom" />
          Secure & Private AI Consultation
        </p>
      </div>
    </div>
  );
};
