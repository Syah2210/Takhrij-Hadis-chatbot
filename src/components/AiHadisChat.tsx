import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Send, Loader2, Bot, User, Trash2, X } from 'lucide-react';
import { chatWithAiHadis } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface AiHadisChatProps {
  onClose: () => void;
}

export default function AiHadisChat({ onClose }: AiHadisChatProps) {
  const initialMessage: Message = {
    id: '1',
    role: 'model',
    text: 'Assalamualaikum. Saya Takhrij Hadis.my, pembantu penyelidikan hadis berasaskan AI. Sila nyatakan hadis yang ingin anda semak, atau tanya apa-apa soalan berkaitan ilmu hadis.'
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    setMessages([initialMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMessage
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    const history = messages.slice(1).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseStream = await chatWithAiHadis(userMessage, history);
      
      const botMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMessageId, role: 'model', text: '' }]);

      let fullText = '';
      for await (const chunk of responseStream) {
        fullText += chunk.text;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: fullText } : msg
          )
        );
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          role: 'model', 
          text: 'Maaf, ralat telah berlaku: ' + (error.message || 'Sila cuba lagi.') 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-darkblue text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://i.postimg.cc/rMdkQQ6K/logo-syahmi.png" 
            alt="AI Avatar" 
            className="w-10 h-10 rounded-lg object-cover" 
          />
          <div>
            <h2 className="font-bold text-lg">Ai Hadis Chatbot</h2>
            <p className="text-xs text-slate-300">Pembantu Penyelidikan Hadis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleClearChat} className="p-2 hover:bg-slate-800 rounded-lg transition" title="Kosongkan Chat">
            <Trash2 className="w-5 h-5 text-slate-300 hover:text-white" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition" title="Tutup">
            <X className="w-6 h-6 text-slate-300 hover:text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'user' ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-turquoise text-white">
                  <User className="w-5 h-5" />
                </div>
              ) : (
                <img 
                  src="https://i.postimg.cc/rMdkQQ6K/logo-syahmi.png" 
                  alt="AI Avatar" 
                  className="flex-shrink-0 w-8 h-8 rounded-full object-cover shadow-sm" 
                />
              )}
              <div 
                className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-turquoise text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="markdown-body text-sm md:text-base">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%] flex-row">
              <img 
                src="https://i.postimg.cc/rMdkQQ6K/logo-syahmi.png" 
                alt="AI Avatar" 
                className="flex-shrink-0 w-8 h-8 rounded-full object-cover shadow-sm" 
              />
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-turquoise" />
                <span className="text-sm text-slate-500">Sedang menaip...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya soalan tentang hadis..."
            className="w-full pl-4 pr-14 py-4 bg-slate-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-turquoise focus:bg-white transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bg-darkblue hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-darkblue text-white p-3 rounded-full transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
