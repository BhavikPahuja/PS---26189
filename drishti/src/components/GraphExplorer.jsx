import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  Layers, 
  ShieldAlert, 
  User, 
  Building, 
  Phone, 
  Truck, 
  MapPin, 
  CreditCard, 
  FileText, 
  Zap, 
  Activity, 
  X, 
  ArrowRight,
  ExternalLink,
  Bot
} from 'lucide-react';

const NODE_COLORS = {
  PERSON: { background: '#f43f5e', border: '#fda4af', highlight: '#ff4d6d' },       // Rose
  ORGANIZATION: { background: '#a855f7', border: '#d8b4fe', highlight: '#c084fc' }, // Purple
  PHONE: { background: '#0284c7', border: '#38bdf8', highlight: '#0ea5e9' },        // Sky Blue
  VEHICLE: { background: '#059669', border: '#34d399', highlight: '#10b981' },      // Emerald
  LOCATION: { background: '#d97706', border: '#fcd34d', highlight: '#f59e0b' },     // Amber
  BANK_ACCOUNT: { background: '#e11d48', border: '#fb7185', highlight: '#f43f5e' }, // Deep Rose
  CASE: { background: '#64748b', border: '#94a3b8', highlight: '#cbd5e1' }          // Slate
};

export default function GraphExplorer({ nodes, edges, onSelectTargetForAI }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [minRisk, setMinRisk] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('force');

  // Filtered nodes and edges
  const filteredNodes = nodes.filter(n => {
    const matchesType = filterType === 'ALL' || n.type === filterType;
    const matchesRisk = (n.computedRisk || n.riskScore || 0) >= minRisk;
    const matchesSearch = !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase()) || (n.aliases && n.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesType && matchesRisk && matchesSearch;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(e => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to));

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert nodes for Vis-Network
    const visNodes = new DataSet(
      filteredNodes.map(n => {
        const colors = NODE_COLORS[n.type] || NODE_COLORS.PERSON;
        const risk = n.computedRisk || n.riskScore || 50;
        const size = Math.max(18, Math.min(38, 16 + (risk / 100) * 20));

        return {
          id: n.id,
          label: n.label,
          shape: n.type === 'PERSON' ? 'dot' : n.type === 'ORGANIZATION' ? 'diamond' : n.type === 'LOCATION' ? 'triangle' : 'box',
          size: size,
          font: { color: '#f8fafc', face: 'Inter', size: 12, strokeWidth: 2, strokeColor: '#0f172a' },
          color: {
            background: colors.background,
            border: colors.border,
            highlight: { background: colors.highlight, border: '#ffffff' }
          },
          borderWidth: risk > 85 ? 3 : 1,
          shadow: risk > 85 ? { enabled: true, color: colors.background, size: 15 } : false,
          title: `<strong>${n.label}</strong><br/>Type: ${n.type}<br/>Risk: ${risk}%`
        };
      })
    );

    const visEdges = new DataSet(
      filteredEdges.map(e => ({
        id: e.id,
        from: e.from,
        to: e.to,
        label: e.label,
        font: { color: '#94a3b8', face: 'JetBrains Mono', size: 10, strokeWidth: 2, strokeColor: '#07090e' },
        color: { color: e.type === 'financial' ? '#ef4444' : e.type === 'communication' ? '#38bdf8' : '#64748b', highlight: '#f59e0b' },
        width: Math.max(1, (e.weight || 5) / 3),
        arrows: { to: { enabled: true, scaleFactor: 0.7 } },
        smooth: { type: 'continuous' }
      }))
    );

    const options = {
      nodes: {
        shadow: true
      },
      edges: {
        smooth: true
      },
      physics: {
        enabled: layoutMode === 'force',
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.3,
          springLength: 120,
          springConstant: 0.04
        }
      },
      layout: {
        hierarchical: layoutMode === 'hierarchical' ? { direction: 'UD', sortMethod: 'directed' } : false
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true
      }
    };

    const network = new Network(containerRef.current, { nodes: visNodes, edges: visEdges }, options);
    networkRef.current = network;

    network.on('selectNode', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const targetNode = nodes.find(n => n.id === nodeId);
        setSelectedNode(targetNode || null);
      }
    });

    network.on('deselectNode', () => {
      setSelectedNode(null);
    });

    return () => {
      network.destroy();
    };
  }, [filterType, minRisk, searchQuery, layoutMode, nodes.length, edges.length]);

  const handleResetView = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
    }
  };

  const getConnectedEdges = (nodeId) => {
    return edges.filter(e => e.from === nodeId || e.to === nodeId);
  };

  return (
    <div className="relative w-full h-[calc(100vh-105px)] bg-slate-950 flex overflow-hidden">
      {/* Main Canvas Area */}
      <div className="relative flex-1 h-full flex flex-col">
        {/* Top Control Overlay Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl">
          {/* Node Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-slate-400 text-xs font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-sky-400" /> Filter:
            </span>
            {['ALL', 'PERSON', 'ORGANIZATION', 'PHONE', 'VEHICLE', 'LOCATION', 'BANK_ACCOUNT', 'CASE'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  filterType === type 
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search suspect or entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none w-48 font-outfit"
              />
            </div>

            {/* Minimum Risk Slider */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <span>Min Risk:</span>
              <input
                type="range"
                min="0"
                max="90"
                value={minRisk}
                onChange={(e) => setMinRisk(Number(e.target.value))}
                className="w-20 accent-sky-500"
              />
              <span className="font-mono text-sky-400 font-bold text-[11px]">{minRisk}%</span>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setLayoutMode('force')}
                className={`px-2 py-1 rounded ${layoutMode === 'force' ? 'bg-sky-500/20 text-sky-300 font-medium' : 'text-slate-400'}`}
              >
                Physics
              </button>
              <button
                onClick={() => setLayoutMode('hierarchical')}
                className={`px-2 py-1 rounded ${layoutMode === 'hierarchical' ? 'bg-sky-500/20 text-sky-300 font-medium' : 'text-slate-400'}`}
              >
                Tree
              </button>
            </div>

            {/* Reset View Button */}
            <button
              onClick={handleResetView}
              title="Reset View"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vis Network Container */}
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Bottom Legend Bar */}
        <div className="absolute bottom-4 left-4 z-10 hidden md:flex items-center gap-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-[11px]">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Entity Types:</span>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-slate-300">Person</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span><span className="text-slate-300">Organization</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span><span className="text-slate-300">Phone</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-slate-300">Vehicle</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-slate-300">Location</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span><span className="text-slate-300">Bank Account</span></div>
        </div>
      </div>

      {/* Slide-Over Target Node Inspector Panel */}
      {selectedNode && (
        <aside className="w-96 h-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl p-5 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 z-20">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {selectedNode.type}
                </span>
                {selectedNode.cell && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {selectedNode.cell}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-100 font-outfit">{selectedNode.label}</h2>
              {selectedNode.role && <p className="text-xs text-slate-400">{selectedNode.role}</p>}
            </div>

            <button 
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Risk Score & Centrality Gauges */}
          <div className="py-4 border-b border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Risk Index</span>
              <p className={`text-base font-bold font-mono mt-0.5 ${
                (selectedNode.computedRisk || selectedNode.riskScore) > 85 ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {selectedNode.computedRisk || selectedNode.riskScore}%
              </p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono">PageRank</span>
              <p className="text-base font-bold font-mono text-sky-400 mt-0.5">
                {selectedNode.pageRank || 50}
              </p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Betweenness</span>
              <p className="text-base font-bold font-mono text-purple-400 mt-0.5">
                {selectedNode.betweenness || '0.12'}
              </p>
            </div>
          </div>

          {/* Target Description */}
          <div className="py-3 border-b border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Intelligence Summary</span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
              {selectedNode.details || "Subject flagged in intelligence reports with direct connections to syndicate leadership."}
            </p>
          </div>

          {/* Key Metadata List */}
          <div className="py-3 border-b border-slate-800 space-y-2 text-xs">
            {selectedNode.phone && (
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sky-400" /> Phone:</span>
                <span className="font-mono text-sky-300">{selectedNode.phone}</span>
              </div>
            )}
            {selectedNode.aliases && (
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Known Aliases:</span>
                <span className="font-mono text-slate-200">{selectedNode.aliases.join(', ')}</span>
              </div>
            )}
            {selectedNode.status && (
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Legal Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {selectedNode.status}
                </span>
              </div>
            )}
          </div>

          {/* Connected Relationships List */}
          <div className="py-3 flex-1 overflow-y-auto">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Direct Connections ({getConnectedEdges(selectedNode.id).length})
            </span>
            <div className="space-y-2">
              {getConnectedEdges(selectedNode.id).map(edge => {
                const neighborId = edge.from === selectedNode.id ? edge.to : edge.from;
                const neighbor = nodes.find(n => n.id === neighborId);
                return (
                  <div key={edge.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center justify-between gap-2">
                    <div>
                      <span className="text-slate-200 font-medium block">{neighbor?.label || neighborId}</span>
                      <span className="text-[10px] text-sky-400 font-mono">{edge.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{edge.source || 'FIR Evidence'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button: Ask AI Copilot */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => onSelectTargetForAI(selectedNode)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Query Drishti AI Copilot about {selectedNode.label.split(' ')[0]}</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
