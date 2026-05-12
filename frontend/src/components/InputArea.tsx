import { useState, useRef, useEffect, type FC, type FormEvent } from 'react';
import { Send, Settings, Mic, Paperclip, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsModal from './SettingsModal';

interface InputAreaProps {
  onSendMessage: (text: string, file?: File) => void;
  isLoading: boolean;
}

const InputArea: FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start speech recognition", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedFile) && !isLoading) {
      onSendMessage(input.trim(), selectedFile || undefined);
      setInput('');
      removeFile();
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {selectedFile && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-4 p-3 glass rounded-2xl flex items-center gap-4 border-neonBlue/30 border max-w-sm"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="text-neonBlue w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-tighter">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={removeFile}
                className="p-1.5 hover:bg-white/10 rounded-full text-white/50 hover:text-neonRed transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-neonPurple hover:border-neonPurple/50 transition-all duration-300 shrink-0"
          >
            <Settings size={20} />
          </button>
          
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
          />
          
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx"
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder={selectedFile ? "Add a message about this file..." : "Type your message..."}
              className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-neonBlue/50 focus:ring-1 focus:ring-neonBlue/20 transition-all duration-300 backdrop-blur-md"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 transition-colors ${selectedFile ? 'text-neonBlue' : 'text-white/30 hover:text-neonBlue'}`}
              >
                <Paperclip size={20} />
              </button>
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 transition-all duration-300 ${
                  isListening 
                    ? 'text-neonRed scale-125 animate-pulse drop-shadow-[0_0_8px_rgba(255,7,58,0.5)]' 
                    : 'text-white/30 hover:text-neonRed'
                }`}
              >
                <Mic size={20} />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={(!input.trim() && !selectedFile) || isLoading}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  (input.trim() || selectedFile) && !isLoading
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
    </div>
  );
};

export default InputArea;
