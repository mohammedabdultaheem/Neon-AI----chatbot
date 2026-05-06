import { useState, type FC, type FormEvent } from 'react';
import { Send, Settings, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const InputArea: FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent z-10">
      <div className="max-w-4xl mx-auto flex gap-4 items-center">
        <button className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-neonPurple hover:border-neonPurple/50 transition-all duration-300">
          <Settings size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your message..."
            className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-neonBlue/50 focus:ring-1 focus:ring-neonBlue/20 transition-all duration-300 backdrop-blur-md"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              type="button"
              className="p-2 text-white/30 hover:text-neonRed transition-colors"
            >
              <Mic size={20} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                input.trim() && !isLoading
                  ? 'bg-neonBlue/20 border border-neonBlue/50 text-neonBlue shadow-neon-blue'
                  : 'bg-white/5 border border-white/10 text-white/20'
              }`}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputArea;
