import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    // Simulate Google OAuth popup/connection
    onLogin();
  };

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
        <div className="flex flex-col items-center mb-10">
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-neonBlue via-neonPurple to-neonRed rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-8 py-4 bg-black rounded-2xl border border-white/10 flex items-center justify-center">
              <span className="text-4xl font-black tracking-tighter flex">
                <span className="text-neonBlue">N</span>
                <span className="text-neonBlue/80">E</span>
                <span className="text-neonPurple/90">O</span>
                <span className="text-neonPurple">N</span>
                <span className="mx-2 text-white/20 font-light">|</span>
                <span className="text-neonRed/90">A</span>
                <span className="text-neonRed">I</span>
              </span>
            </div>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-[4px] font-medium">Neural Interface v4.0</p>
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
            Login
          </motion.button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-4 text-white/30 tracking-[3px]">Secure Bridge</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full py-4 rounded-xl border border-white/10 text-white font-medium flex items-center justify-center gap-3 transition-all hover:border-white/30"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
            />
            <path
              fill="#34A853"
              d="M16.04 18.013c-1.09.593-2.325.92-3.64.92a7.09 7.09 0 0 1-7.134-4.887L1.24 17.16c1.958 3.952 6.03 6.65 10.76 6.65 2.952 0 5.735-1.01 7.898-2.796l-3.858-3.001Z"
            />
            <path
              fill="#4285F4"
              d="M19.898 21.014c2.618-2.164 4.102-5.353 4.102-9.014 0-.818-.109-1.609-.284-2.364H12v4.636h6.818c-.313 1.587-1.195 2.923-2.527 3.791l3.607 2.951Z"
            />
            <path
              fill="#FBBC05"
              d="M5.232 14.045A7.102 7.102 0 0 1 4.909 12c0-.708.105-1.39.297-2.032l-4.026-3.115C.432 8.16.091 10.012.091 12c0 1.988.341 3.84 1.148 5.423l3.993-3.378Z"
            />
          </svg>
          Continue with Google
        </motion.button>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 uppercase tracking-[2px]">
          <span>System v4.0.2</span>
          <span>Encrypted: AES-256</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
