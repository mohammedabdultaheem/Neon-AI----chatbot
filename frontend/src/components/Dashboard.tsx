import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, MessageSquare, FileText, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/chat?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/chat');
    }
  };
  const stats = [
    { label: 'Neural Accuracy', value: '99.8%', color: 'text-neonBlue' },
    { label: 'Latency', value: '12ms', color: 'text-neonPurple' },
    { label: 'Uptime', value: '99.99%', color: 'text-neonRed' },
  ];

  const features = [
    { icon: <MessageSquare />, title: 'Neural Chat', desc: 'Context-aware intelligence' },
    { icon: <ImageIcon />, title: 'Visual Core', desc: 'Multi-modal image analysis' },
    { icon: <FileText />, title: 'Data Stream', desc: 'Secure document processing' },
  ];

  return (
    <div className="relative h-screen w-full flex items-center justify-center p-6 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-6xl space-y-12 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neonBlue via-neonPurple to-neonRed rounded-full blur opacity-40"></div>
            <div className="relative px-12 py-6 bg-black rounded-3xl border border-white/10">
              <span className="text-6xl font-black tracking-tighter flex items-center">
                <span className="text-neonBlue">N</span>
                <span className="text-neonBlue/80">E</span>
                <span className="text-neonPurple/90">O</span>
                <span className="text-neonPurple">N</span>
                <span className="mx-4 text-white/10 font-light">|</span>
                <span className="text-neonRed/90">A</span>
                <span className="text-neonRed">I</span>
              </span>
            </div>
          </div>
          <p className="text-white/40 uppercase tracking-[0.5em] text-xs font-bold">Neural Command Dashboard</p>
        </motion.div>

        {/* Search Access Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <form 
            onSubmit={handleSearch}
            className="glass p-2 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 group hover:border-neonBlue/50 transition-all duration-500"
          >
            <div className="flex-1 flex items-center gap-4 px-6">
              <Search className="text-white/20 group-hover:text-neonBlue transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Neon AI anything..."
                className="bg-transparent border-none outline-none text-white w-full py-4 placeholder:text-white/20"
              />
            </div>
            <button 
              type="submit"
              className="bg-neon-gradient px-8 py-4 rounded-xl text-white font-bold flex items-center gap-2 shadow-neon-purple hover:scale-105 active:scale-95 transition-all"
            >
              INITIALIZE <Zap size={18} />
            </button>
          </form>
        </motion.div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate('/chat')}
              className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-neonBlue group-hover:bg-neonBlue/10 transition-all mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-12 pt-8"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-3xl font-black ${s.color} tracking-tighter`}>{s.value}</p>
              <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1 font-bold">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
