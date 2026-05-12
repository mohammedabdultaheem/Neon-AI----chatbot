import { useState, useEffect, useRef, type FC } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import TypingIndicator from './TypingIndicator';
import ChatSidebar from './ChatSidebar';
import { AnimatePresence } from 'framer-motion';
import { LogIn } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  id: string;
  fileData?: string;
  fileType?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

interface ChatInterfaceProps {
  onLogout: () => void;
}

const ChatInterface: FC<ChatInterfaceProps> = ({ onLogout }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Load sessions on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('neon_ai_sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
        setMessages(parsed[0].messages);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save sessions whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('neon_ai_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Sync messages to active session
  useEffect(() => {
    if (activeSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, messages, timestamp: Date.now() } : s
      ));
    }
  }, [messages]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [{ role: 'bot', content: 'Hello! I am your futuristic AI assistant. How can I help you today?', id: '1' }],
      timestamp: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setMessages(newSession.messages);
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setActiveSessionId(id);
      setMessages(session.messages);
    }
  };

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
    // Initialize WebSocket - use env var if available, otherwise fallback to localhost
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendHost = import.meta.env.VITE_BACKEND_URL || 'localhost:8000';
    const wsUrl = backendHost.includes('://') 
      ? backendHost.replace(/^http/, 'ws') + '/chat'
      : `${protocol}//${backendHost}/chat`;
    
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSendMessage = async (text: string, file?: File) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }

    const newMessage: Message = { 
      role: 'user', 
      content: text, 
      id: Date.now().toString() 
    };

    const payload: any = { text };
    if (file) {
      try {
        const base64Data = await fileToBase64(file);
        newMessage.fileData = base64Data;
        newMessage.fileType = file.type;
        payload.file_data = base64Data;
        payload.file_type = file.type;
      } catch (err) {
        console.error("Error converting file to base64:", err);
      }
    }

    // Update title if it's the first user message
    if (messages.length <= 1 && text) {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, title: text.slice(0, 30) + (text.length > 30 ? '...' : '') } : s
      ));
    }

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setIsTyping(true);

    // Add an empty bot message for streaming
    setMessages(prev => [...prev, { role: 'bot', content: '', id: (Date.now() + 1).toString() }]);

    socketRef.current.send(JSON.stringify(payload));
  };

  const handleNewChat = () => {
    createNewSession();
  };

  return (
    <div className="relative h-screen w-full flex overflow-hidden">
      {/* Left Sidebar */}
      <ChatSidebar 
        sessions={sessions} 
        activeSessionId={activeSessionId} 
        onNewChat={handleNewChat} 
        onSelectSession={handleSelectSession}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-black/40">
        {/* Header */}
        <div className="h-20 glass border-b border-white/10 flex items-center justify-between px-8 z-10 shrink-0">
          <h1 className="text-xl font-bold bg-neon-gradient bg-clip-text text-transparent">NEON AI</h1>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-white/50 hover:text-neonRed transition-colors group"
          >
            <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Disconnect</span>
            <LogIn className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full scroll-smooth"
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                role={msg.role} 
                content={msg.content} 
                fileData={msg.fileData}
                fileType={msg.fileType}
              />
            ))}
          </AnimatePresence>
          
          {isTyping && <TypingIndicator />}
        </div>

        {/* Input Area (Container for proper padding) */}
        <div className="p-6 pt-0 w-full max-w-4xl mx-auto shrink-0">
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
