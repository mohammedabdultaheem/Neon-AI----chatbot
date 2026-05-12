import { type FC } from 'react';
import { motion } from 'framer-motion';
import { User, Bot, FileText } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'bot';
  content: string;
  fileData?: string;
  fileType?: string;
}

const MessageBubble: FC<MessageBubbleProps> = ({ role, content, fileData, fileType }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center glass border ${isUser ? 'border-neonBlue shadow-neon-blue' : 'border-neonPurple shadow-neon-purple'}`}>
          {isUser ? <User size={20} className="text-neonBlue" /> : <Bot size={20} className="text-neonPurple" />}
        </div>
        
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: isUser ? '0 0 20px rgba(0, 255, 255, 0.4)' : '0 0 20px rgba(157, 0, 255, 0.4)' }}
          className={`p-4 rounded-2xl glass relative transition-all duration-300 ${
            isUser 
              ? 'rounded-tr-none border-neonBlue/30 text-white' 
              : 'rounded-tl-none border-neonPurple/30 text-white'
          }`}
          style={{
            borderWidth: '1px',
          }}
        >
          <div className="space-y-3">
            {fileData && (
              <div className="mb-2 max-w-sm overflow-hidden rounded-xl border border-white/10 shadow-lg">
                {fileType?.startsWith('image/') ? (
                  <img 
                    src={fileData} 
                    alt="Uploaded content" 
                    className="w-full h-auto block hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="p-4 bg-white/5 flex items-center gap-3">
                    <div className="p-2 bg-neonBlue/20 rounded-lg">
                      <FileText className="text-neonBlue w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/90 truncate">Document Attached</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-tighter">{fileType}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>}
          </div>
          
          {/* Subtle neon gradient accent on the corner */}
          <div className={`absolute top-0 ${isUser ? 'right-0' : 'left-0'} w-2 h-2 rounded-full blur-[2px] ${isUser ? 'bg-neonBlue' : 'bg-neonPurple'}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
