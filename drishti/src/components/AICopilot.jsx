import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Network, 
  Share2,
  RefreshCw,
  User
} from 'lucide-react';
import { findShortestPath } from '../utils/graphEngine';

export default function AICopilot({ nodes, edges, targetQuery, onHighlightPathInGraph }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Greetings Officer. I am Drishti AI Copilot, your automated criminal intelligence assistant. Ask me anything regarding network relationships, key intermediaries, suspicious wire transfers, or FIR evidence.",
      chips: [
        "How are Rahul Saxena and Global Apex Trading connected?",
        "Who acts as the main bridge between Finance Cell and Leadership?",
        "Show suspicious financial activity involving Vikas Verma.",
        "Which suspects were present at Safehouse B-42?"
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState(targetQuery ? `Tell me about ${targetQuery.label}` : '');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // AI Intelligence Query Engine Response Synthesis
    setTimeout(() => {
      let botResponseText = "";
      let foundPath = null;

      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes("rahul") && (lowerQuery.includes("global apex") || lowerQuery.includes("apex") || lowerQuery.includes("trading"))) {
        foundPath = findShortestPath("p1", "o1", nodes, edges);
        botResponseText = "Analysis reveals a 3-hop intelligence path connecting Rahul Saxena (Syndicate Mastermind) to Global Apex Trading Ltd via Vikas Verma. Vikas Verma acts as director of Global Apex while receiving indirect offshore transfers from Rahul Saxena's BVI shell company.";
      } else if (lowerQuery.includes("bridge") || lowerQuery.includes("intermediary")) {
        foundPath = findShortestPath("p2", "p4", nodes, edges);
        botResponseText = "Rohit Sharma exhibits the highest Betweenness Centrality (0.84) in the network. He acts as the primary operational bridge connecting Rahul Saxena (Leadership) to Sandeep Kumar (Logistics) and Vikas Verma (Finance).";
      } else if (lowerQuery.includes("vikas") || lowerQuery.includes("financial")) {
        botResponseText = "Vikas Verma is named in FIR-2026/104 for money laundering. He controls Swiss Account ACC-99812 and authorized an anomalous ₹9,500,000 wire transfer to Global Apex Trading, which was subsequently layered to Hawala pool ACC-77631.";
      } else if (lowerQuery.includes("safehouse") || lowerQuery.includes("manali") || lowerQuery.includes("b-42")) {
        botResponseText = "Surveillance intercepts confirm Rohit Sharma (Black SUV PB10AB1234) and Sandeep Kumar (Truck DL3CC8899) were co-located at Safehouse B-42 (Manali) on 10 August at 01:30 AM.";
      } else {
        botResponseText = `Analysis of intelligence database for "${query}": Subject is indexed under Operation Blackhawk with connections to 4 active entities across CDR logs and bank audits.`;
      }

      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botResponseText,
        path: foundPath
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 text-slate-100 font-outfit">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Drishti AI Investigation Copilot</h1>
            <p className="text-xs text-slate-400">
              Natural language intelligence inquiry, graph pathfinding, and automated evidence synthesis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>LLM Graph Agent Ready</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="glass-panel p-5 rounded-2xl h-[500px] flex flex-col justify-between space-y-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-sky-400" />
                </div>
              )}

              <div className={`max-w-2xl p-4 rounded-2xl space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none shadow-lg shadow-sky-600/20'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                <p className="leading-relaxed font-sans">{msg.text}</p>

                {/* Evidence Path trace if present */}
                {msg.path && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold block">
                      Discovered Evidence Path ({msg.path.length} Nodes)
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {msg.path.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <span className="px-2.5 py-1 bg-slate-950 text-slate-200 rounded font-mono text-[11px] border border-slate-800 font-bold">
                            {step.node.label}
                          </span>
                          {idx < msg.path.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-sky-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <button
                      onClick={() => onHighlightPathInGraph(msg.path.map(s => s.node.id))}
                      className="mt-2 text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
                    >
                      <Network className="w-3.5 h-3.5" /> Highlight Path in Knowledge Graph
                    </button>
                  </div>
                )}

                {/* Suggested Chips */}
                {msg.chips && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {msg.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 transition"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-sky-400 animate-bounce" />
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 flex items-center gap-2 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>Traversing knowledge graph & synthesizing evidence...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Drishti AI (e.g., 'How are Rahul and Vikas connected?')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-sky-500 focus:outline-none font-outfit"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim()}
            className="p-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-sky-600/25 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
