import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GraphExplorer from './components/GraphExplorer';
import DataIngestion from './components/DataIngestion';
import EntityResolution from './components/EntityResolution';
import NetworkAnalytics from './components/NetworkAnalytics';
import AnomalyDetection from './components/AnomalyDetection';
import TimelineReplay from './components/TimelineReplay';
import AICopilot from './components/AICopilot';

import { INITIAL_NODES, INITIAL_EDGES, ANOMALIES_LIST } from './data/mockData';
import { enrichGraphData } from './utils/graphEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('graph');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [aiTargetQuery, setAiTargetQuery] = useState(null);

  // Initial calculation of graph centrality & risk metrics
  useEffect(() => {
    const enriched = enrichGraphData(INITIAL_NODES, INITIAL_EDGES);
    setNodes(enriched);
  }, []);

  // Handler: Ingest new entities/relationships extracted by AI NLP Engine
  const handleIngestNewGraphData = ({ entities, relationships }) => {
    const newNodesList = [...nodes];
    const newEdgesList = [...edges];

    // Add extracted persons
    entities.persons.forEach(pName => {
      if (!newNodesList.some(n => n.label.toLowerCase() === pName.toLowerCase())) {
        newNodesList.push({
          id: `p_new_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          label: pName,
          type: 'PERSON',
          role: 'Extracted Suspect',
          riskScore: 75,
          status: 'Under Investigation',
          details: 'Extracted from raw FIR narrative via Drishti NLP.'
        });
      }
    });

    // Add new edges
    relationships.forEach(rel => {
      const sourceNode = newNodesList.find(n => n.label.toLowerCase() === rel.from.toLowerCase());
      const targetNode = newNodesList.find(n => n.label.toLowerCase() === rel.to.toLowerCase());

      if (sourceNode && targetNode) {
        newEdgesList.push({
          id: `e_new_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          from: sourceNode.id,
          to: targetNode.id,
          label: rel.label,
          weight: 8,
          source: 'Live NLP Ingestion'
        });
      }
    });

    const reEnriched = enrichGraphData(newNodesList, newEdgesList);
    setNodes(reEnriched);
    setEdges(newEdgesList);
    setActiveTab('graph');
  };

  // Handler: Merge candidate entities from Entity Resolution module
  const handleMergeEntities = (candidatePair) => {
    const { primary, secondary } = candidatePair;
    
    // Update edges targeting secondary to point to primary
    const updatedEdges = edges.map(e => ({
      ...e,
      from: e.from === secondary.id ? primary.id : e.from,
      to: e.to === secondary.id ? primary.id : e.to
    }));

    // Filter out secondary duplicate node
    const updatedNodes = nodes.filter(n => n.id !== secondary.id);

    const reEnriched = enrichGraphData(updatedNodes, updatedEdges);
    setNodes(reEnriched);
    setEdges(updatedEdges);
  };

  // Handler: Ask AI Copilot about specific node
  const handleSelectTargetForAI = (node) => {
    setAiTargetQuery(node);
    setActiveTab('copilot');
  };

  // Handler: Highlight flagged entities in Graph view
  const handleHighlightInGraph = (entityNames) => {
    setActiveTab('graph');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-outfit antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Command Center Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        nodeCount={nodes.length}
        edgeCount={edges.length}
        anomalyCount={ANOMALIES_LIST.length}
      />

      {/* Main Module Content */}
      <main className="flex-1">
        {activeTab === 'graph' && (
          <GraphExplorer 
            nodes={nodes}
            edges={edges}
            onSelectTargetForAI={handleSelectTargetForAI}
          />
        )}

        {activeTab === 'ingestion' && (
          <DataIngestion 
            onIngestNewGraphData={handleIngestNewGraphData}
          />
        )}

        {activeTab === 'resolution' && (
          <EntityResolution 
            onMergeEntities={handleMergeEntities}
          />
        )}

        {activeTab === 'analytics' && (
          <NetworkAnalytics 
            nodes={nodes}
            edges={edges}
          />
        )}

        {activeTab === 'anomalies' && (
          <AnomalyDetection 
            onHighlightInGraph={handleHighlightInGraph}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineReplay />
        )}

        {activeTab === 'copilot' && (
          <AICopilot 
            nodes={nodes}
            edges={edges}
            targetQuery={aiTargetQuery}
            onHighlightPathInGraph={handleHighlightInGraph}
          />
        )}
      </main>
    </div>
  );
}
