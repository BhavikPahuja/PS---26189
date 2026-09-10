import React, { useState } from 'react';
import { 
  FileText, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Truck, 
  DollarSign, 
  User, 
  RefreshCw 
} from 'lucide-react';
import { extractEntitiesFromText, extractRelationshipsFromText } from '../utils/nlpEngine';
import { SAMPLE_DOCUMENTS } from '../data/mockData';

export default function DataIngestion({ onIngestNewGraphData }) {
  const [selectedDocId, setSelectedDocId] = useState('doc1');
  const [rawText, setRawText] = useState(SAMPLE_DOCUMENTS[0].content);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [extractedResult, setExtractedResult] = useState(null);

  const handleSelectSample = (doc) => {
    setSelectedDocId(doc.id);
    setRawText(doc.content);
    setExtractedResult(null);
  };

  const handleProcessNLP = () => {
    setIsProcessing(true);
    setProcessingStep(1);
    setExtractedResult(null);

    // Simulate multi-stage AI pipeline
    setTimeout(() => {
      setProcessingStep(2); // NER
    }, 600);

    setTimeout(() => {
      setProcessingStep(3); // Relationship Extraction
    }, 1200);

    setTimeout(() => {
      const entities = extractEntitiesFromText(rawText);
      const relationships = extractRelationshipsFromText(rawText, entities);
      setExtractedResult({ entities, relationships });
      setIsProcessing(false);
      setProcessingStep(4); // Complete
    }, 1800);
  };

  const handleInjectToGraph = () => {
    if (!extractedResult) return;
    onIngestNewGraphData(extractedResult);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-slate-100 font-outfit">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono text-[11px] border border-sky-500/30">
              MODULE 2: MULTI-SOURCE INGESTION & NLP
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">AI Entity & Relationship Extraction Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ingest unstructured FIR narratives, CDR call logs, and surveillance reports to automatically discover entities and graph relationships.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">AI NER MODEL</span>
            <span className="font-semibold text-emerald-400 font-mono">Drishti-NLP-v3 Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sample Documents & Text Area */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" /> Select Intelligence Source Document
              </label>
            </div>

            {/* Sample Selector Buttons */}
            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_DOCUMENTS.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => handleSelectSample(doc)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all ${
                    selectedDocId === doc.id
                      ? 'bg-sky-500/15 border-sky-500/50 text-sky-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-100">{doc.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{doc.date}</span>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono block">{doc.type}</span>
                </button>
              ))}
            </div>

            {/* Raw Text Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Raw Unstructured Crime Report Text
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste FIR narrative, police report, or surveillance notes here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-sky-500 focus:outline-none font-mono leading-relaxed"
              />
            </div>

            {/* Action Process Button */}
            <button
              onClick={handleProcessNLP}
              disabled={isProcessing || !rawText.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-200" />
                  <span>Processing AI Extraction Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run Drishti AI Entity & Relationship Extractor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Extraction Pipeline & Extracted Entities */}
        <div className="lg:col-span-6 space-y-4">
          {/* Pipeline Execution Tracker */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> Real-time Extraction Pipeline
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className={`p-2.5 rounded-xl border ${processingStep >= 1 ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                <span>1. Tokenize</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${processingStep >= 2 ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                <span>2. NER Extract</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${processingStep >= 3 ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                <span>3. Rel Mapper</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${processingStep >= 4 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                <span>4. Complete</span>
              </div>
            </div>

            {/* Extracted Output Container */}
            {extractedResult ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    Extracted Entities (NER)
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                        <User className="w-3 h-3 text-rose-400" /> Persons:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {extractedResult.entities.persons.map(p => (
                          <span key={p} className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded font-mono text-[11px]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                        <Phone className="w-3 h-3 text-sky-400" /> Phones:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {extractedResult.entities.phones.map(ph => (
                          <span key={ph} className="px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded font-mono text-[11px]">
                            {ph}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                        <Truck className="w-3 h-3 text-emerald-400" /> Vehicles:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {extractedResult.entities.vehicles.map(v => (
                          <span key={v} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[11px]">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-amber-400" /> Locations:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {extractedResult.entities.locations.map(l => (
                          <span key={l} className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono text-[11px]">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extracted Relationships */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    Discovered Graph Relationships ({extractedResult.relationships.length})
                  </span>
                  <div className="space-y-1.5">
                    {extractedResult.relationships.map((rel, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{rel.from}</span>
                          <ArrowRight className="w-3 h-3 text-sky-400" />
                          <span className="font-semibold text-slate-200">{rel.to}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono text-[10px]">
                          {rel.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inject into Graph Button */}
                <button
                  onClick={handleInjectToGraph}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                >
                  <Database className="w-4 h-4" />
                  <span>Inject Extracted Intelligence into Main Knowledge Graph</span>
                </button>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs">Click "Run Drishti AI Extractor" to analyze raw narrative text.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
