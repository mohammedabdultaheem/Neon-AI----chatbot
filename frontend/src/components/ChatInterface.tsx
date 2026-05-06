import { useState, useEffect, useRef, type FC } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import TypingIndicator from './TypingIndicator';
import { AnimatePresence } from 'framer-motion';
import { LogIn } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  id: string;
}

interface ChatInterfaceProps {
  onLogout: () => void;
}

const ChatInterface: FC<ChatInterfaceProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! I am your futuristic AI assistant. How can I help you today?', id: '1' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//localhost:8000/chat`;
    
    const connect = () => {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Connected to backend");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'content') {
          setIsTyping(false);
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'bot' && !data.is_new) {
              // Append to last bot message if it's not a new one
              // (This is a simplified logic for streaming)
              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + data.content
              };
              return updatedMessages;
            } else {
              return [...prev, { role: 'bot', content: data.content, id: Date.now().toString() }];
            }
          });
          
          if (data.is_final) {
            setIsLoading(false);
          }
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from backend, retrying in 3s...");
        setTimeout(connect, 3000);
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };

    connect();

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const handleSendMessage = (text: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }

    const newMessage: Message = { role: 'user', content: text, id: Date.now().toString() };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setIsTyping(true);

    // Add an empty bot message for streaming if needed
    setMessages(prev => [...prev, { role: 'bot', content: '', id: (Date.now() + 1).toString() }]);

    socketRef.current.send(JSON.stringify({ text }));
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full h-20 glass border-b border-white/10 flex items-center justify-between px-8 z-10">
        <h1 className="text-xl font-bold bg-neon-gradient bg-clip-text text-transparent">NEON AI</h1>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-white/50 hover:text-neonRed transition-colors group"
        >
          <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Disconnect</span>
          <LogIn className="w-5 h-5 rotate-180" />
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 pt-24 pb-32 max-w-4xl mx-auto w-full scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
        </AnimatePresence>
        
        {isTyping && <TypingIndicator />}
      </div>

      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
