import React from 'react';
import { ArrowRight, Play, Star, CheckCircle2, TrendingUp, Globe, Sparkles } from 'lucide-react';

export function Crystalline() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8faff] to-[#eef2ff] flex flex-col justify-center font-sans text-slate-900 selection:bg-indigo-200">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-30px) translateX(20px) rotate(15deg); }
          66% { transform: translateY(20px) translateX(-15px) rotate(-10deg); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float-1 { animation: float-slow 15s ease-in-out infinite; }
        .animate-float-2 { animation: float-slow 18s ease-in-out infinite reverse; }
        .animate-float-3 { animation: float-slow 22s ease-in-out infinite 2s; }
        .animate-float-4 { animation: float-slow 25s ease-in-out infinite reverse 1s; }
        .animate-blob { animation: blob 20s infinite alternate; }
        
        .glass-shape {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 32px 0 rgba(99, 102, 241, 0.05);
        }
        
        .animate-stagger-1 { animation: fade-in-up 0.8s ease-out forwards 0.1s; opacity: 0; }
        .animate-stagger-2 { animation: fade-in-up 0.8s ease-out forwards 0.2s; opacity: 0; }
        .animate-stagger-3 { animation: fade-in-up 0.8s ease-out forwards 0.3s; opacity: 0; }
        .animate-stagger-4 { animation: fade-in-up 0.8s ease-out forwards 0.4s; opacity: 0; }
        .animate-stagger-5 { animation: fade-in-up 0.8s ease-out forwards 0.5s; opacity: 0; }
        
        .bg-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
        }
      `}</style>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      {/* Background Blobs */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-violet-300/30 blur-3xl animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-blue-200/20 blur-3xl animate-blob pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Floating Glass Shapes */}
      <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full glass-shape animate-float-1 pointer-events-none z-0 shadow-lg shadow-indigo-500/10" />
      <div className="absolute top-[20%] right-[15%] w-48 h-48 rounded-3xl rotate-12 glass-shape animate-float-2 pointer-events-none z-0 shadow-lg shadow-violet-500/10" />
      <div className="absolute bottom-[25%] left-[15%] w-40 h-40 rounded-2xl -rotate-12 glass-shape animate-float-3 pointer-events-none z-0 shadow-lg shadow-blue-500/10" />
      <div className="absolute bottom-[15%] right-[20%] w-24 h-24 rounded-full glass-shape animate-float-4 pointer-events-none z-0 shadow-lg shadow-indigo-500/10" />

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        {/* Badge */}
        <div className="animate-stagger-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white shadow-sm mb-8 text-indigo-700 font-semibold text-sm tracking-wide">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span>Trusted Engineering Partner</span>
        </div>

        {/* Headline */}
        <h1 className="animate-stagger-2 text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-5xl leading-[1.1]">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient-x_8s_linear_infinite]">Build. Scale. Innovate.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-stagger-3 text-lg md:text-xl text-slate-600 mb-12 max-w-3xl leading-relaxed font-medium">
          We help startups, businesses, and enterprises design, develop, and deploy high-quality digital products — <span className="text-indigo-600 font-semibold">fast</span>.
        </p>

        {/* CTAs */}
        <div className="animate-stagger-4 flex flex-col sm:flex-row gap-5 mb-24 w-full sm:w-auto">
          <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold overflow-hidden transition-all hover:bg-indigo-700 hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)] hover:-translate-y-1">
            <span className="relative z-10">Start a Project</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/60 backdrop-blur-md border-2 border-indigo-100 text-slate-700 rounded-full font-bold transition-all hover:bg-white hover:border-indigo-300 hover:text-indigo-700 hover:-translate-y-1 shadow-sm hover:shadow-lg">
            <Play className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600" />
            <span>View Our Work</span>
          </button>
        </div>

        {/* Stats */}
        <div className="animate-stagger-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
          <div className="glass-shape bg-white/70 p-6 rounded-3xl flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2">50+</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Projects Delivered</div>
          </div>
          
          <div className="glass-shape bg-white/70 p-6 rounded-3xl flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)] group">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 mb-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2">98%</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Client Satisfaction</div>
          </div>

          <div className="glass-shape bg-white/70 p-6 rounded-3xl flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2">12+</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Industries Served</div>
          </div>

          <div className="glass-shape bg-white/70 p-6 rounded-3xl flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(245,158,11,0.15)] group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 mb-5 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" fill="currentColor" />
            </div>
            <div className="text-4xl font-extrabold text-slate-900 mb-2">5.0</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
