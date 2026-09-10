import React from 'react';
import { 
  Network, 
  FileText, 
  UserCheck, 
  BarChart3, 
  AlertTriangle, 
  Clock, 
  Bot, 
  Search,
  Shield,
  Activity,
  Database,
  Cpu
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, nodeCount, edgeCount, anomalyCount }) {
  const navTabs = [
    { id: 'graph', label: 'Network Graph', icon: Network, badge: null },
    { id: 'ingestion', label: 'AI Ingestion', icon: FileText, badge: 'NLP' },
    { id: 'resolution', label: 'Entity Resolution', icon: UserCheck, badge: '3 Matches' },
    { id: 'analytics', label: 'HVT Analytics', icon: BarChart3, badge: 'Leaderboard' },
    { id: 'anomalies', label: 'Anomaly Matrix', icon: AlertTriangle, badge: `${anomalyCount} Flags`, highlight: true },
    { id: 'timeline', label: 'Event Timeline', icon: Clock, badge: null },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, badge: 'AI Live', special: true },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-900/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-sky-500/30">
            <Shield className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="font-outfit font-bold tracking-wider text-slate-200 uppercase">DRISHTI</span>
            <span className="bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded text-[10px] font-mono">v3.6 AI ENGINE</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>CASE #2026-BLK: <strong className="text-slate-200 font-medium">Operation Blackhawk (Narcotics & Hawala)</strong></span>
          </div>
        </div>

        {/* Live System Stats */}
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Nodes: <strong className="text-sky-300">{nodeCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Edges: <strong className="text-indigo-300">{edgeCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">AI GRAPH ENGINE ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2 overflow-x-auto py-2 scrollbar-none">
        <nav className="flex items-center gap-1.5">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? tab.special
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/50'
                      : 'bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (tab.special ? 'text-white' : 'text-sky-400') : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                    tab.highlight 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : tab.special 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
