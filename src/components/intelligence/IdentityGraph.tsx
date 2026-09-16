'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Activity, 
  Mic, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers,
  ChevronRight,
  Fingerprint,
  Building2,
  Stethoscope
} from 'lucide-react';

export interface GraphNode {
  id: string;
  label: string;
  subLabel: string;
  type: 'golden' | 'ehr' | 'lab' | 'voice' | 'pdf';
  x: number;
  y: number;
  confidence?: number;
  status: 'confirmed' | 'review' | 'source';
  systemName: string;
  mrn: string;
  dob: string;
  phone?: string;
  address?: string;
  matchRule?: string;
  details: Record<string, string>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  score: number;
  label: string;
  rule: string;
  status: 'confirmed' | 'review';
}

interface ClusterData {
  id: string;
  name: string;
  subtitle: string;
  goldenName: string;
  goldenId: string;
  overallScore: number;
  status: 'CONFIRMED' | 'MANUAL_REVIEW';
  nodes: GraphNode[];
  edges: GraphEdge[];
  metrics: {
    sourcesCount: number;
    conflictCount: number;
    blockingKey: string;
    decisionTime: string;
  };
}

const CLUSTERS: Record<string, ClusterData> = {
  'john-doe': {
    id: 'john-doe',
    name: 'John Doe',
    subtitle: 'Cluster MPI-1001 • 3 Source Feeds Unified',
    goldenName: 'John Doe',
    goldenId: 'MPI-1001-GOLDEN',
    overallScore: 98,
    status: 'CONFIRMED',
    metrics: {
      sourcesCount: 3,
      conflictCount: 0,
      blockingKey: 'J500_19900101',
      decisionTime: '12ms (Auto-Merged)'
    },
    nodes: [
      {
        id: 'golden',
        label: 'Golden Record',
        subLabel: 'Master Patient Index',
        type: 'golden',
        x: 400,
        y: 260,
        confidence: 98,
        status: 'confirmed',
        systemName: 'Lumiere Master Patient Index',
        mrn: 'MPI-1001-GOLDEN',
        dob: '1990-01-01',
        phone: '+1 (788) 293-8477',
        address: '123 Maple St, Apt 4B, Springfield, IL',
        details: {
          'FHIR Resource': 'Patient/MPI-1001',
          'Resolution Status': 'CONFIRMED (Auto-Match v2)',
          'SSN Verification': 'Exact SHA-256 Match',
          'Primary Clinician': 'Dr. Emily Chen, MD',
          'Active Care Plans': 'Type 2 Diabetes Management'
        }
      },
      {
        id: 'source-ehr',
        label: 'Epic EHR Record',
        subLabel: 'Inpatient Core',
        type: 'ehr',
        x: 160,
        y: 110,
        confidence: 99,
        status: 'source',
        systemName: 'Epic EHR (Springfield General)',
        mrn: 'EHR-1001',
        dob: '1990-01-01',
        phone: '788-293-8477',
        address: '123 Maple St, Springfield, IL',
        matchRule: 'Exact SSN + DOB + Phone (1.00)',
        details: {
          'External ID': 'EPIC-902188',
          'Ingestion Method': 'FHIR R4 Webhook Feed',
          'Name Jaro-Winkler': '1.00 (Exact John Doe)',
          'Soundex Code': 'J500 (Exact)',
          'Last Observation': 'BP 128/82 mmHg'
        }
      },
      {
        id: 'source-lab',
        label: 'LabCorp LIS Record',
        subLabel: 'Outpatient Diagnostics',
        type: 'lab',
        x: 640,
        y: 110,
        confidence: 96,
        status: 'source',
        systemName: 'LabCorp Diagnostic LIS',
        mrn: 'LAB-2004',
        dob: '1990-01-01',
        phone: '788-293-8477',
        address: '123 Maple Street',
        matchRule: 'Name Nickname ("Jon") + Phone Overlap',
        details: {
          'External ID': 'LC-884129',
          'Ingestion Method': 'HL7 v2.5.1 Feed',
          'Name Jaro-Winkler': '0.93 ("Jon Doe" vs "John Doe")',
          'Phonetic NYSIIS': 'JAN (Exact Phonetic Match)',
          'Last Lab Value': 'Fasting Glucose 140 mg/dL'
        }
      },
      {
        id: 'source-voice',
        label: 'Dictation Voice Intake',
        subLabel: 'Clinical Audio Note',
        type: 'voice',
        x: 400,
        y: 430,
        confidence: 91,
        status: 'source',
        systemName: 'Whisper Dictation Engine',
        mrn: 'VOICE-301',
        dob: '1990-04-01',
        phone: '788-293-8477',
        address: '123 Maple St',
        matchRule: 'DOB Day/Month Transposition Resolved',
        details: {
          'External ID': 'VOICE-INTAKE-44',
          'Ingestion Method': 'Audio Transcription AI',
          'DOB Analysis': 'Transposition 1990-01-04 vs 1990-04-01 (Score: 0.90)',
          'Address Similarity': '0.98 Match',
          'Extracted Note': 'Patient reports compliance with Metformin'
        }
      }
    ],
    edges: [
      {
        id: 'edge-ehr-golden',
        source: 'source-ehr',
        target: 'golden',
        score: 99,
        label: '99% Match',
        rule: 'Exact SSN & DOB',
        status: 'confirmed'
      },
      {
        id: 'edge-lab-golden',
        source: 'source-lab',
        target: 'golden',
        score: 96,
        label: '96% Match',
        rule: 'Soundex NYSIIS',
        status: 'confirmed'
      },
      {
        id: 'edge-voice-golden',
        source: 'source-voice',
        target: 'golden',
        score: 91,
        label: '91% Match',
        rule: 'Transposition Resolution',
        status: 'confirmed'
      }
    ]
  },
  'sarah-jenkins': {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    subtitle: 'Cluster MPI-1002 • Hyphenated Surname Discrepancy',
    goldenName: 'Sarah Jenkins',
    goldenId: 'MPI-1002-GOLDEN',
    overallScore: 94,
    status: 'MANUAL_REVIEW',
    metrics: {
      sourcesCount: 2,
      conflictCount: 1,
      blockingKey: 'S600_19751210',
      decisionTime: 'Awaiting Clinician Review'
    },
    nodes: [
      {
        id: 'golden',
        label: 'Golden Record',
        subLabel: 'Master Patient Index',
        type: 'golden',
        x: 400,
        y: 260,
        confidence: 94,
        status: 'review',
        systemName: 'Lumiere Master Patient Index',
        mrn: 'MPI-1002-GOLDEN',
        dob: '1975-12-10',
        phone: '+1 (617) 555-0987',
        address: '88 Summer St, Boston, MA',
        details: {
          'FHIR Resource': 'Patient/MPI-1002',
          'Resolution Status': 'MANUAL_REVIEW (Score 0.94)',
          'Conflict Flag': 'Family name discrepancy across feeds',
          'Audit Recommendation': 'Approve marriage hyphenation merge'
        }
      },
      {
        id: 'source-ehr',
        label: 'Epic EHR Core',
        subLabel: 'Registered 2021',
        type: 'ehr',
        x: 200,
        y: 130,
        confidence: 98,
        status: 'source',
        systemName: 'Epic EHR Boston',
        mrn: 'EHR-1002',
        dob: '1975-12-10',
        phone: '617-555-0987',
        address: '88 Summer St, Boston, MA',
        matchRule: 'Baseline Record',
        details: {
          'Name Recorded': 'Sarah Jenkins',
          'SSN Hash': '987-65-4321 Verified',
          'Active Rx': 'Lisinopril 10mg'
        }
      },
      {
        id: 'source-lab',
        label: 'LabCorp Outpatient',
        subLabel: 'Registered 2024',
        type: 'lab',
        x: 600,
        y: 130,
        confidence: 92,
        status: 'review',
        systemName: 'LabCorp Diagnostic LIS',
        mrn: 'LAB-2008',
        dob: '1975-12-10',
        phone: '617-555-0987',
        address: '88 Summer St, Suite 3, Boston',
        matchRule: 'Hyphenated Name Partial Match',
        details: {
          'Name Recorded': 'Sarah Jenkins-Smythe',
          'Name Jaro-Winkler': '0.88 (Hyphenated suffix penalty)',
          'DOB Match': 'Exact 1975-12-10',
          'SSN Match': 'Exact 987-65-4321'
        }
      }
    ],
    edges: [
      {
        id: 'edge-ehr-golden',
        source: 'source-ehr',
        target: 'golden',
        score: 98,
        label: '98% Match',
        rule: 'SSN & Address Match',
        status: 'confirmed'
      },
      {
        id: 'edge-lab-golden',
        source: 'source-lab',
        target: 'golden',
        score: 92,
        label: '92% Review',
        rule: 'Hyphenated Name',
        status: 'review'
      }
    ]
  },
  'robert-miller': {
    id: 'robert-miller',
    name: 'Robert Miller',
    subtitle: 'Cluster MPI-1003 • Informal Name Contraction',
    goldenName: 'Robert Miller',
    goldenId: 'MPI-1003-GOLDEN',
    overallScore: 91,
    status: 'CONFIRMED',
    metrics: {
      sourcesCount: 2,
      conflictCount: 0,
      blockingKey: 'R163_19820815',
      decisionTime: '15ms (Auto-Resolved)'
    },
    nodes: [
      {
        id: 'golden',
        label: 'Golden Record',
        subLabel: 'Master Patient Index',
        type: 'golden',
        x: 400,
        y: 260,
        confidence: 91,
        status: 'confirmed',
        systemName: 'Lumiere Master Patient Index',
        mrn: 'MPI-1003-GOLDEN',
        dob: '1982-08-15',
        phone: '+1 (415) 555-1212',
        address: '500 Market St, San Francisco, CA',
        details: {
          'FHIR Resource': 'Patient/MPI-1003',
          'Resolution Status': 'CONFIRMED',
          'Prescriber': 'Dr. Emily Chen, MD',
          'Active Rx': 'Atorvastatin 20mg'
        }
      },
      {
        id: 'source-ehr',
        label: 'Epic Hospital SF',
        subLabel: 'Primary EHR',
        type: 'ehr',
        x: 200,
        y: 130,
        confidence: 95,
        status: 'source',
        systemName: 'Epic Hospital SF',
        mrn: 'EHR-1003',
        dob: '1982-08-15',
        phone: '415-555-1212',
        address: '500 Market St',
        matchRule: 'Baseline Record',
        details: {
          'Name Recorded': 'Robert Miller',
          'Soundex': 'R163',
          'SSN Hash': '456-78-9012 Verified'
        }
      },
      {
        id: 'source-lab',
        label: 'SF Imaging & Lab',
        subLabel: 'MRI Order Record',
        type: 'lab',
        x: 600,
        y: 130,
        confidence: 91,
        status: 'source',
        systemName: 'Bay Diagnostic LIS',
        mrn: 'LAB-2009',
        dob: '1982-08-15',
        phone: '415-555-1212',
        address: '500 Market St, San Francisco',
        matchRule: 'Nickname "Rob" vs "Robert"',
        details: {
          'Name Recorded': 'Rob Miller',
          'Jaro-Winkler': '0.94 (Nickname mapping applied)',
          'Phone & DOB': '100% Identical'
        }
      }
    ],
    edges: [
      {
        id: 'edge-ehr-golden',
        source: 'source-ehr',
        target: 'golden',
        score: 95,
        label: '95% Match',
        rule: 'SSN & Address Match',
        status: 'confirmed'
      },
      {
        id: 'edge-lab-golden',
        source: 'source-lab',
        target: 'golden',
        score: 91,
        label: '91% Match',
        rule: 'Nickname + Phone',
        status: 'confirmed'
      }
    ]
  }
};

export default function IdentityGraph() {
  const [selectedClusterKey, setSelectedClusterKey] = useState<string>('john-doe');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('golden');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'all' | 'high' | 'review'>('all');

  const currentCluster = CLUSTERS[selectedClusterKey] || CLUSTERS['john-doe'];
  const selectedNode = currentCluster.nodes.find(n => n.id === selectedNodeId) || currentCluster.nodes[0];
  const selectedEdge = selectedEdgeId ? currentCluster.edges.find(e => e.id === selectedEdgeId) : null;

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(1.4, Math.max(0.7, +(prev + delta).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setSelectedNodeId('golden');
    setSelectedEdgeId(null);
  };

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'golden': return { stroke: '#1e5df8', fill: '#1e293b', text: '#ffffff', badgeBg: 'bg-slate-900', badgeText: 'text-white' };
      case 'ehr': return { stroke: '#2563eb', fill: '#ffffff', text: '#1e3a8a', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700' };
      case 'lab': return { stroke: '#059669', fill: '#ffffff', text: '#065f46', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700' };
      case 'voice': return { stroke: '#7c3aed', fill: '#ffffff', text: '#5b21b6', badgeBg: 'bg-purple-50', badgeText: 'text-purple-700' };
      case 'pdf': return { stroke: '#d97706', fill: '#ffffff', text: '#92400e', badgeBg: 'bg-amber-50', badgeText: 'text-amber-700' };
    }
  };

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'golden': return <ShieldCheck className="text-blue-400" size={20} />;
      case 'ehr': return <Building2 className="text-blue-600" size={18} />;
      case 'lab': return <Activity className="text-emerald-600" size={18} />;
      case 'voice': return <Mic className="text-purple-600" size={18} />;
      case 'pdf': return <FileText className="text-amber-600" size={18} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Header & Cluster Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cluster:</span>
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
            {Object.values(CLUSTERS).map(cluster => (
              <button
                key={cluster.id}
                onClick={() => {
                  setSelectedClusterKey(cluster.id);
                  setSelectedNodeId('golden');
                  setSelectedEdgeId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedClusterKey === cluster.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {cluster.name}
              </button>
            ))}
          </div>
        </div>

        {/* View & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => handleZoom(0.1)}
              title="Zoom In"
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors"
            >
              <ZoomIn size={14} />
            </button>
            <span className="px-2 text-[11px] font-mono font-medium text-gray-600">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => handleZoom(-0.1)}
              title="Zoom Out"
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset View"
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-colors border-l border-gray-200 ml-1"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            currentCluster.status === 'CONFIRMED'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {currentCluster.status === 'CONFIRMED' ? (
              <CheckCircle2 size={12} />
            ) : (
              <AlertCircle size={12} />
            )}
            {currentCluster.overallScore}% Confirmed Match
          </span>
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div className="relative flex-1 min-h-[380px] bg-slate-900/5 rounded-2xl mt-4 border border-slate-200 overflow-hidden flex items-center justify-center select-none">
        
        {/* Subtle Engineering Grid Background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Informative Floating Legend */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-sm text-[11px] text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white"></span>
            <span className="font-semibold text-gray-800">Golden Identity</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"></span>
            <span>Epic EHR</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            <span>LabCorp LIS</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-white"></span>
            <span>Voice Intake</span>
          </div>
        </div>

        {/* Live SVG Graph Canvas */}
        <svg 
          viewBox="0 0 800 520" 
          className="w-full h-full max-h-[440px] transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Edge Gradients */}
            <linearGradient id="grad-ehr" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e5df8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="grad-lab" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e5df8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="grad-voice" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e5df8" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing Drop Shadows */}
            <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#1e5df8" floodOpacity="0.35" />
            </filter>
            <filter id="shadow-node" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Graph Edges */}
          {currentCluster.edges.map(edge => {
            const sourceNode = currentCluster.nodes.find(n => n.id === edge.source);
            const targetNode = currentCluster.nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isSelected = selectedEdgeId === edge.id;
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            // Curved cubic bezier path for organic topology
            const curvature = (sourceNode.x === targetNode.x) ? 0 : (sourceNode.x < targetNode.x ? -20 : 20);
            const pathD = `M ${sourceNode.x} ${sourceNode.y} Q ${midX + curvature} ${midY} ${targetNode.x} ${targetNode.y}`;

            const strokeColor = edge.status === 'confirmed' ? '#3b82f6' : '#f59e0b';

            return (
              <g 
                key={edge.id} 
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedEdgeId(edge.id);
                }}
              >
                {/* Wider invisible path for easier hover/click target */}
                <path d={pathD} fill="none" stroke="transparent" strokeWidth="24" />

                {/* Base Connection Arc */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? "4" : "2.5"}
                  strokeDasharray="6 6"
                  className="transition-all duration-300 opacity-70 group-hover:opacity-100"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="24"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Match Pill Badge */}
                <g transform={`translate(${midX + curvature / 2}, ${midY})`}>
                  <rect
                    x="-45"
                    y="-13"
                    width="90"
                    height="26"
                    rx="13"
                    fill="#ffffff"
                    stroke={isSelected ? strokeColor : "#cbd5e1"}
                    strokeWidth={isSelected ? "2" : "1"}
                    className="shadow-sm transition-transform duration-200 group-hover:scale-105"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-slate-800 pointer-events-none"
                  >
                    {edge.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Graph Nodes */}
          {currentCluster.nodes.map(node => {
            const isGolden = node.type === 'golden';
            const isSelected = selectedNodeId === node.id;
            const colors = getNodeColor(node.type);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-transform duration-300 group"
                onClick={() => {
                  setSelectedNodeId(node.id);
                  setSelectedEdgeId(null);
                }}
              >
                {/* Concentric Halo for Golden Record or Selected Node */}
                {isGolden && (
                  <>
                    <circle
                      r="62"
                      fill="none"
                      stroke="#1e5df8"
                      strokeWidth="1.5"
                      strokeOpacity="0.25"
                      className="animate-pulse"
                    />
                    <circle
                      r="74"
                      fill="none"
                      stroke="#1e5df8"
                      strokeWidth="1"
                      strokeOpacity="0.15"
                    />
                  </>
                )}

                {isSelected && !isGolden && (
                  <circle
                    r="44"
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    strokeDasharray="4 4"
                    className="animate-spin origin-center"
                    style={{ animationDuration: '8s' }}
                  />
                )}

                {/* Node Outer Body */}
                <circle
                  r={isGolden ? "48" : "34"}
                  fill={colors.fill}
                  stroke={isSelected ? "#1e5df8" : colors.stroke}
                  strokeWidth={isGolden ? "4" : (isSelected ? "3" : "2")}
                  filter={isGolden ? "url(#glow-gold)" : "url(#shadow-node)"}
                  className="transition-all duration-200 group-hover:scale-105"
                />

                {/* Center Content for Golden Record */}
                {isGolden ? (
                  <g className="pointer-events-none select-none">
                    <circle cx="0" cy="-12" r="14" fill="#3b82f6" fillOpacity="0.2" />
                    <text
                      x="0"
                      y="-7"
                      textAnchor="middle"
                      className="text-[12px] font-extrabold fill-blue-400"
                    >
                      MPI
                    </text>
                    <text
                      x="0"
                      y="14"
                      textAnchor="middle"
                      className="text-[11px] font-extrabold fill-white tracking-wide"
                    >
                      GOLDEN
                    </text>
                    <text
                      x="0"
                      y="26"
                      textAnchor="middle"
                      className="text-[9px] font-semibold fill-blue-300"
                    >
                      RECORD
                    </text>
                  </g>
                ) : (
                  /* Center Content for Upstream Source Nodes */
                  <g className="pointer-events-none select-none">
                    <text
                      x="0"
                      y="-4"
                      textAnchor="middle"
                      className="text-[10px] font-black uppercase tracking-wider"
                      fill={colors.stroke}
                    >
                      {node.type.toUpperCase()}
                    </text>
                    <text
                      x="0"
                      y="12"
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-700"
                    >
                      {node.mrn.split('-')[0]}
                    </text>
                  </g>
                )}

                {/* Node Label Below */}
                <g transform={`translate(0, ${isGolden ? 64 : 48})`} className="pointer-events-none select-none">
                  <rect
                    x="-75"
                    y="-10"
                    width="150"
                    height="28"
                    rx="6"
                    fill="#ffffff"
                    fillOpacity="0.9"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    className="shadow-sm"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-slate-900"
                  >
                    {node.label}
                  </text>
                  <text
                    x="0"
                    y="14"
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-slate-500"
                  >
                    {node.subLabel}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Bottom Bar Info Prompt */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 shadow-sm">
          <Sparkles size={13} className="text-blue-500" />
          <span>Click any node or connection to inspect entity resolution attributes</span>
        </div>
      </div>

      {/* Selected Element Inspection Panel */}
      <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        {selectedEdge ? (
          /* Edge Inspection View */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                {selectedEdge.score}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">Entity Match Link: {selectedEdge.rule}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    High Confidence
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Resolution between <strong>{selectedEdge.source}</strong> and <strong>{selectedEdge.target}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                Weight: {(selectedEdge.score / 100).toFixed(2)}
              </span>
              <button 
                onClick={() => setSelectedEdgeId(null)}
                className="text-xs text-gray-500 hover:text-gray-800 font-medium px-2 py-1"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Node Inspection View */
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{selectedNode.label}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {selectedNode.mrn}
                    </span>
                    {selectedNode.confidence && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {selectedNode.confidence}% Trust
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedNode.systemName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/patients`}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Open Registry</span>
                  <ChevronRight size={13} />
                </a>
              </div>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">DOB</span>
                <span className="text-xs font-medium text-gray-800">{selectedNode.dob || 'Unknown'}</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Phone</span>
                <span className="text-xs font-medium text-gray-800">{selectedNode.phone || 'None recorded'}</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 col-span-2">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Address</span>
                <span className="text-xs font-medium text-gray-800 truncate block">{selectedNode.address || 'Standard clinical feed'}</span>
              </div>
            </div>

            {/* Custom Node Attributes */}
            {selectedNode.details && (
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                {Object.entries(selectedNode.details).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="text-gray-400 text-[11px]">{key}:</span>
                    <span className="text-gray-800 font-medium text-[11px]">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
