import { type FC } from 'react';
import { Plus, MessageSquare, History, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatSidebarProps {
  sessions: any[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

const ChatSidebar: FC<ChatSidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectSession }) => {
  // Helper to format time relative to now
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="w-80 h-full glass border-r border-white/10 flex flex-col z-20 overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-6">
        <button
          onClick={onNewChat}
          className="w-full h-12 rounded-xl bg-neonBlue/10 border border-neonBlue/50 text-neonBlue flex items-center justify-center gap-2 font-bold shadow-neon-blue hover:bg-neonBlue/20 transition-all duration-300"
        >
          <Plus size={20} />
          <span>New Session</span>
        </button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="flex items-center gap-2 px-2 mb-4 text-white/40 uppercase tracking-widest text-[10px] font-bold">
          <History size={14} />
          <span>Recent History</span>
        </div>

        <div className="space-y-2">
          {sessions.map((session) => (
            <motion.button
              key={session.id}
              whileHover={{ x: 5 }}
              onClick={() => onSelectSession(session.id)}
              className={`w-full p-4 rounded-xl transition-all group border ${
                activeSessionId === session.id 
                  ? 'bg-neonBlue/10 border-neonBlue/30 shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]' 
                  : 'hover:bg-white/5 border-transparent hover:border-white/10'
              } text-left`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className={`w-4 h-4 shrink-0 mt-1 transition-colors ${
                  activeSessionId === session.id ? 'text-neonBlue' : 'text-white/30 group-hover:text-neonBlue'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate transition-colors ${
                    activeSessionId === session.id ? 'text-white font-medium' : 'text-white/70 group-hover:text-white'
                  }`}>
                    {session.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-white/20 group-hover:text-white/40">
                    <Clock size={10} />
                    <span>{formatTime(session.timestamp)}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neonBlue to-neonPurple p-[2px]">
            <div className="w-full h-full rounded-[9px] bg-black flex items-center justify-center">
              <span className="text-xs font-bold text-white">UA</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">User Account</p>
            <p className="text-[10px] text-white/30 uppercase tracking-tighter">Premium Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
