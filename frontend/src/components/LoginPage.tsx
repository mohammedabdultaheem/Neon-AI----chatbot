import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Cpu } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login for demo - any input works
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md glass p-8 rounded-2xl border border-white/20 shadow-2xl z-20"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-full bg-neonPurple/20 border border-neonPurple mb-4 shadow-neon-purple">
            <Cpu className="w-10 h-10 text-neonPurple" />
          </div>
          <h1 className="text-3xl font-bold bg-neon-gradient bg-clip-text text-transparent">
            NEON ACCESS
          </h1>
          <p className="text-white/50 text-sm mt-2">Initialize secure neural connection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neonBlue uppercase tracking-wider">Identity</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:border-neonBlue focus:ring-1 focus:ring-neonBlue outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neonPurple uppercase tracking-wider">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:border-neonPurple focus:ring-1 focus:ring-neonPurple outline-none transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(157, 0, 255, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-neon-gradient py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 group transition-all"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            INITIALIZE SESSION
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 uppercase tracking-[2px]">
          <span>System v4.0.2</span>
          <span>Encrypted: AES-256</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
