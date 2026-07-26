import React, { useMemo } from 'react';
import { ArrowRight, Play, Star, CheckCircle, Briefcase, Globe } from 'lucide-react';

export function DeepSpace() {
  // Generate random particles once
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -30,
      opacity: Math.random() * 0.6 + 0.1,
      isViolet: Math.random() > 0.6,
      driftX: (Math.random() - 0.5) * 50,
    }));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] flex items-center justify-center font-sans text-white">
      <style>{`
        @keyframes drift-up {
          0% { 
            transform: translateY(10vh) translateX(0px); 
            opacity: 0;
          }
          10% {
            opacity: var(--max-opacity);
          }
          90% {
            opacity: var(--max-opacity);
          }
          100% { 
            transform: translateY(-110vh) translateX(var(--drift-x)); 
            opacity: 0;
          }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(124, 58, 237, 0.2); box-shadow: 0 0 10px rgba(124, 58, 237, 0); }
          50% { border-color: rgba(124, 58, 237, 0.6); box-shadow: 0 0 20px rgba(124, 58, 237, 0.2); }
        }
      `}</style>

      {/* Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_60%)] blur-[80px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_60%)] blur-[100px] animate-[pulse-glow_12s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-[30%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_60%)] blur-[60px] animate-[pulse-glow_10s_ease-in-out_infinite_2s]" />

      {/* Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className={`absolute rounded-full ${p.isViolet ? 'bg-violet-400' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'}`}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              '--max-opacity': p.opacity,
              '--drift-x': `${p.driftX}px`,
              animation: `drift-up ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-900/30 border border-violet-500/30 backdrop-blur-md mb-8 animate-[float_4s_ease-in-out_infinite]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
          </span>
          <span className="text-violet-200 text-sm font-medium tracking-wide uppercase letter-spacing-1">Trusted Engineering Partner</span>
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
          <span className="block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">Build. Scale.</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">Innovate.</span>
        </h1>
        
        <p className="max-w-3xl text-lg md:text-xl text-slate-300 mb-12 leading-relaxed font-light">
          We help startups, businesses, and enterprises design, develop, and deploy high-quality digital products — <span className="text-white font-medium">fast.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 mb-20 w-full sm:w-auto">
          <button className="group relative px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 flex items-center gap-2">
              Start a Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/60 hover:bg-white/5 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 backdrop-blur-sm">
            <Play className="w-5 h-5 fill-transparent group-hover:fill-white/20 transition-all" /> View Our Work
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
          {[
            { icon: Briefcase, text: "50+ Projects Delivered" },
            { icon: CheckCircle, text: "98% Client Satisfaction" },
            { icon: Globe, text: "12+ Industries Served" },
            { icon: Star, text: "5★ Average Rating" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] transition-colors duration-300 animate-[border-glow_4s_ease-in-out_infinite]"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <stat.icon className="w-6 h-6 text-violet-400 mb-3 opacity-80" />
              <span className="text-slate-200 font-medium text-sm md:text-base">{stat.text}</span>
            </div>
          ))}
        </div>
        
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#05070f] to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
