import { useState, useEffect, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Settings, Shield, Cpu, Code, Zap, Bell } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    dataSync: true,
    chatHistory: true,
    analytics: false,
    lowLatency: true,
    hdAnalysis: true,
    notifications: true,
    globalAccess: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('neon_ai_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('neon_ai_settings', JSON.stringify(newSettings));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
            className="fixed top-1/2 left-1/2 w-[95%] max-w-4xl max-h-[90vh] glass rounded-[32px] border border-white/10 shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-neonPurple/20 rounded-2xl border border-neonPurple/50 shadow-neon-purple">
                  <Settings className="text-neonPurple w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">System Configuration</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Neural Engine v4.0.2</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-all"
              >
                <X size={28} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column: Core Settings */}
                <div className="space-y-10">
                  <section>
                    <h3 className="flex items-center gap-2 text-xs font-bold text-neonBlue mb-6 uppercase tracking-[0.2em]">
                      <Shield size={14} /> Privacy & Security
                    </h3>
                    <div className="space-y-4">
                      <SettingToggle
                        label="Data Synchronization"
                        desc="Sync your neural profile across devices"
                        active={settings.dataSync}
                        onToggle={() => toggleSetting('dataSync')}
                      />
                      <SettingToggle
                        label="Chat History Persistence"
                        desc="Save encrypted logs in local storage"
                        active={settings.chatHistory}
                        onToggle={() => toggleSetting('chatHistory')}
                      />
                      <SettingToggle
                        label="Anonymous Neural Analytics"
                        desc="Help improve the Gemini core"
                        active={settings.analytics}
                        onToggle={() => toggleSetting('analytics')}
                      />
                    </div>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-2 text-xs font-bold text-neonPurple mb-6 uppercase tracking-[0.2em]">
                      <Cpu size={14} /> Performance Core
                    </h3>
                    <div className="space-y-4">
                      <SettingToggle
                        label="Low Latency Stream"
                        desc="Real-time token generation"
                        active={settings.lowLatency}
                        onToggle={() => toggleSetting('lowLatency')}
                      />
                      <SettingToggle
                        label="HD Vision Analysis"
                        desc="Enhanced multimodal processing"
                        active={settings.hdAnalysis}
                        onToggle={() => toggleSetting('hdAnalysis')}
                      />
                    </div>
                  </section>
                </div>

                {/* Right Column: About & Extra */}
                <div className="space-y-10">
                  <section>
                    <h3 className="flex items-center gap-2 text-xs font-bold text-neonRed mb-6 uppercase tracking-[0.2em]">
                      <Bell size={14} /> Interface
                    </h3>
                    <div className="space-y-4">
                      <SettingToggle
                        label="System Notifications"
                        desc="Alerts for critical AI updates"
                        active={settings.notifications}
                        onToggle={() => toggleSetting('notifications')}
                      />
                      <SettingToggle
                        label="Global Neural Access"
                        desc="Enable worldwide edge connectivity"
                        active={settings.globalAccess}
                        onToggle={() => toggleSetting('globalAccess')}
                      />
                    </div>
                  </section>

                  <section className="p-8 bg-white/5 border border-white/10 rounded-[24px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Zap size={80} className="text-neonBlue" />
                    </div>
                    <h3 className="flex items-center gap-2 text-xs font-bold text-white mb-6 uppercase tracking-[0.2em]">
                      <Info size={14} /> About Neon AI
                    </h3>
                    <div className="space-y-6">
                      <p className="text-xs text-white/50 leading-relaxed font-medium">
                        NEON AI is a state-of-the-art conversational assistant powered by Google's Gemini 2.0 Flash neural engine. Designed for high-speed analysis and multimodal interaction.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] text-white/60 font-mono">Build v2.4.0-stable</div>
                        <div className="px-3 py-1.5 bg-neonBlue/10 border border-neonBlue/30 rounded-lg text-[9px] text-neonBlue font-bold">GEMINI 2.0</div>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <a href="#" className="flex items-center gap-2 text-[10px] text-white/30 hover:text-white transition-all uppercase tracking-widest font-bold group/link">
                          <Code size={14} className="text-neonBlue group-hover/link:scale-110 transition-transform" /> Source Code
                        </a>
                        <div className="flex items-center gap-1 text-[10px] text-white/20 font-bold italic">
                          Powered by Antigravity
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 bg-black/40 flex justify-end gap-4 shrink-0">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl text-sm font-black bg-neon-gradient text-white shadow-neon-purple hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
              >
                Synchronize Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SettingToggle: FC<{ label: string; desc: string; active: boolean; onToggle: () => void }> = ({ label, desc, active, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between p-4 rounded-[20px] hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5"
    >
      <div className="space-y-1">
        <p className="text-sm font-bold text-white group-hover:text-neonBlue transition-colors">{label}</p>
        <p className="text-[10px] text-white/30 font-medium">{desc}</p>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner ${active ? 'bg-neonBlue' : 'bg-white/10'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-lg ${active ? 'left-7' : 'left-1'}`} />
      </div>
    </div>
  );
};

export default SettingsModal;
