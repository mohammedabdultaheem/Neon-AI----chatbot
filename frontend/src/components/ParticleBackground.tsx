import { type FC } from 'react';

const ParticleBackground: FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-darkBg"></div>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            background: i % 3 === 0 ? '#00FFFF' : i % 3 === 1 ? '#9D00FF' : '#FF073A',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            filter: 'blur(2px)',
            boxShadow: `0 0 10px ${i % 3 === 0 ? '#00FFFF' : i % 3 === 1 ? '#9D00FF' : '#FF073A'}`,
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `-${Math.random() * 20}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(20px); }
          50% { transform: translateY(-40px) translateX(0); }
          75% { transform: translateY(-20px) translateX(-20px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default ParticleBackground;
