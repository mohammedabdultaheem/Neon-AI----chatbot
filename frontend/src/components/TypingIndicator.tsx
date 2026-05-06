import { type FC } from 'react';

const TypingIndicator: FC = () => {
  return (
    <div className="flex items-center gap-1.5 p-4 rounded-2xl glass border border-white/10 w-fit ml-12 mb-6">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
};

export default TypingIndicator;
