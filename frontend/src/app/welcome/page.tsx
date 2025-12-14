'use client';

import { useRouter } from 'next/navigation';
import { Gauge, ArrowRight, BarChart3, Shield, Activity, Zap, Globe, Layers } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-indigo-200">Enterprise IoT Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Connect Every{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                Thing
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed">
              Stream, analyze, and visualize data from millions of IoT devices in real-time with enterprise-grade infrastructure.
            </p>
            <p className="text-slate-400">
              Powered by low-latency edge computing and AI-driven analytics.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <FeatureCard
              icon={Activity}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/20"
              title="Real-time Monitoring"
              description="Sub-millisecond latency for mission-critical data streams and instant alerts."
            />
            <FeatureCard
              icon={Shield}
              iconColor="text-indigo-400"
              iconBg="bg-indigo-500/20"
              title="Bank-Grade Security"
              description="End-to-end encryption, rotating keys, and role-based access control."
            />
            <FeatureCard
              icon={BarChart3}
              iconColor="text-violet-400"
              iconBg="bg-violet-500/20"
              title="AI Analytics"
              description="Predictive maintenance models running at the edge for proactive insights."
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button
              onClick={() => router.push('/channels')}
              className="group px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Layers className="w-5 h-5" /> 
              My Channels 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3"
            >
              <Globe className="w-5 h-5" /> Explore Public Channels
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Stat value="1M+" label="Devices Connected" icon={Zap} />
            <Stat value="99.99%" label="Uptime SLA" icon={Shield} />
            <Stat value="<50ms" label="Avg Latency" icon={Activity} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  iconColor, 
  iconBg, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  iconColor: string; 
  iconBg: string;
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all group">
      <div className={`${iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-indigo-400" />
        <span className="text-3xl md:text-4xl font-bold text-white">{value}</span>
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}
