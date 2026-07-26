import React from 'react';
import { ArrowRight, Play, CheckCircle2, Star, Zap, Building2 } from 'lucide-react';

export function Aurora() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#060412] font-sans text-white selection:bg-teal-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aurora-1 {
          0%, 100% { transform: translateY(-50%) translateX(-10%) rotate(-10deg) scale(1); opacity: 0.5; }
          50% { transform: translateY(0%) translateX(10%) rotate(5deg) scale(1.2); opacity: 0.8; }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translateY(-10%) translateX(20%) rotate(10deg) scale(1.1); opacity: 0.4; }
          50% { transform: translateY(20%) translateX(-20%) rotate(-5deg) scale(0.9); opacity: 0.7; }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translateY(20%) translateX(-30%) rotate(-15deg) scale(0.9); opacity: 0.6; }
          50% { transform: translateY(-10%) translateX(10%) rotate(10deg) scale(1.3); opacity: 0.9; }
        }
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .aurora-band {
          position: absolute;
          width: 200%;
          height: 400px;
          border-radius: 100%;
          filter: blur(100px);
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .bg-noise {
          position: fixed;
          top: -50%; left: -50%; right: -50%; bottom: -50%;
          width: 200%; height: 200%;
          background: transparent url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E');
          animation: noise 8s steps(10) infinite;
          pointer-events: none;
          z-index: 10;
        }
      ` }} />

      {/* Aurora Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep Violet Band */}
        <div 
          className="aurora-band bg-gradient-to-r from-violet-900/0 via-violet-800/60 to-violet-900/0 top-[10%] left-[-50%]"
          style={{ animation: 'aurora-1 15s ease-in-out infinite alternate' }}
        />
        {/* Electric Teal Band */}
        <div 
          className="aurora-band bg-gradient-to-r from-teal-900/0 via-teal-500/40 to-teal-900/0 top-[30%] left-[-20%]"
          style={{ animation: 'aurora-2 18s ease-in-out infinite alternate-reverse' }}
        />
        {/* Indigo & Warm Violet Band */}
        <div 
          className="aurora-band bg-gradient-to-r from-indigo-900/0 via-purple-600/50 to-indigo-900/0 top-[50%] left-[-60%]"
          style={{ animation: 'aurora-3 20s ease-in-out infinite alternate' }}
        />
        
        {/* Corner Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Noise Overlay */}
      <div className="bg-noise" />

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-6 max-w-7xl pt-24 pb-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10">
          
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#060412]/50 border border-teal-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(13,148,136,0.2)]"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <span className="flex h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
            <span className="text-sm font-medium tracking-wide text-teal-200">Trusted Engineering Partner</span>
          </div>

          {/* Headlines */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 pb-2">
                Build. Scale. Innovate.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-violet-100/80 max-w-3xl mx-auto font-light leading-relaxed">
              We help startups, businesses, and enterprises design, develop, and deploy high-quality digital products — <span className="font-medium text-white">fast.</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-teal-500 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-full" />
              <span className="relative z-10 flex items-center gap-2">
                Start a Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#060412]/40 border border-violet-500/40 rounded-full text-white font-medium text-lg backdrop-blur-sm transition-all duration-300 hover:bg-violet-500/10 hover:border-violet-400/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <Play className="w-5 h-5 text-violet-300 group-hover:text-violet-200 transition-colors fill-current" />
              <span>View Our Work</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-16 mt-8 border-t border-white/5">
            <StatCard 
              icon={<CheckCircle2 className="w-5 h-5 text-teal-400" />}
              value="50+" 
              label="Projects Delivered" 
              delay="0s"
              color="teal"
            />
            <StatCard 
              icon={<Star className="w-5 h-5 text-yellow-400" />}
              value="98%" 
              label="Client Satisfaction" 
              delay="0.1s"
              color="yellow"
            />
            <StatCard 
              icon={<Building2 className="w-5 h-5 text-violet-400" />}
              value="12+" 
              label="Industries Served" 
              delay="0.2s"
              color="violet"
            />
            <StatCard 
              icon={<Zap className="w-5 h-5 text-indigo-400" />}
              value="5★" 
              label="Average Rating" 
              delay="0.3s"
              color="indigo"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, delay, color }: { icon: React.ReactNode, value: string, label: string, delay: string, color: string }) {
  const getBorderColor = () => {
    switch(color) {
      case 'teal': return 'border-l-teal-500';
      case 'yellow': return 'border-l-yellow-500';
      case 'violet': return 'border-l-violet-500';
      case 'indigo': return 'border-l-indigo-500';
      default: return 'border-l-white/20';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden flex flex-col items-start p-6 bg-white/[0.02] border border-white/5 border-l-2 ${getBorderColor()} rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-1`}
      style={{ animation: `float 6s ease-in-out infinite`, animationDelay: delay }}
    >
      {/* Subtle glow behind icon */}
      <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-white/5 blur-xl" />
      
      <div className="relative mb-3 bg-[#060412]/50 p-2 rounded-lg border border-white/10">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
      <div className="text-sm font-medium text-violet-200/60">{label}</div>
    </div>
  );
}
