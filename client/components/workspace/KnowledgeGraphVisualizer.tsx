"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Eye,
  Share2,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgePackageItem } from "@/lib/api";

interface GraphNode {
  id: string;
  label: string;
  type: "HUB" | "PACKAGE" | "DOCUMENT" | "EQUIPMENT" | "SENSOR";
  category: string;
  urn: string;
  x: number;
  y: number;
  isCenter?: boolean;
  isFocal?: boolean;
  connections: string[];
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

interface KnowledgeGraphVisualizerProps {
  packages: KnowledgePackageItem[];
  onSelectNodeDocument?: (docName: string, urn: string) => void;
}

export function KnowledgeGraphVisualizer({
  packages,
  onSelectNodeDocument,
}: KnowledgeGraphVisualizerProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState<string>("ALL");

  const containerRef = useRef<HTMLDivElement>(null);

  const { nodes: rawNodes, edges: rawEdges } = useOrganicGraphData(packages);

  const nodes = rawNodes.filter((n) => filterType === "ALL" || n.type === filterType);
  const edges = rawEdges.filter(
    (e) => nodes.some((n) => n.id === e.source) && nodes.some((n) => n.id === e.target)
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex flex-col border border-border-subtle rounded-sm bg-bg-primary shadow-sm overflow-hidden relative select-none min-h-[560px]">
      {/* Header Toolbar */}
      <div className="px-4 py-2.5 bg-bg-secondary border-b border-border-subtle flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-accent-muted/20 text-accent border border-accent/30">
            <Share2 size={15} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider">
              Enterprise Knowledge Relationship Graph
            </span>
            <span className="text-mono text-[10px] text-text-tertiary">
              Theme Adaptive Dynamic Topology • Live Evidence Path Network
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-bg-primary px-2.5 py-1 rounded border border-border-subtle text-xs text-text-secondary">
            <Filter size={12} className="text-text-tertiary" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs text-text-primary outline-none font-mono cursor-pointer"
            >
              <option value="ALL">All Nodes ({rawNodes.length})</option>
              <option value="HUB">Focal Hubs</option>
              <option value="DOCUMENT">Documents</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-bg-primary p-1 rounded border border-border-subtle text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
              className="p-1 text-text-secondary hover:text-text-primary rounded hover:bg-bg-tertiary"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-mono text-[11px] px-2 text-text-primary font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
              className="p-1 text-text-secondary hover:text-text-primary rounded hover:bg-bg-tertiary"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 text-text-secondary hover:text-text-primary rounded hover:bg-bg-tertiary ml-1"
              title="Reset View"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area - Light & Dark Theme Compatible */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "flex-1 relative overflow-hidden min-h-[480px] cursor-grab bg-bg-primary transition-colors",
          isDragging && "cursor-grabbing"
        )}
      >
        {/* Top-Left Header Overlay (Light & Dark Theme Compatible) */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 font-mono text-[11px] font-bold text-text-secondary tracking-wider">
          <span>KNOWLEDGE GRAPH</span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            LIVE
          </span>
        </div>

        {/* Top-Right Legend Overlay */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2 font-mono text-[11px] text-text-secondary">
          <span className="w-3.5 h-0.5 bg-blue-500/80 rounded" />
          <span>Evidence path</span>
        </div>

        {/* Bottom-Right Metrics Overlay */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-1 font-mono text-[11px] text-text-secondary">
          <span className="font-semibold text-text-primary">
            {nodes.length} knowledge nodes
          </span>
          <div className="flex items-center gap-1.5">
            <span>Reasoning:</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
              Active
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </span>
          </div>
        </div>

        {/* Subtle Grid Dots */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
          <pattern id="adaptive-grid-dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="0.75" fill="var(--border-strong)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#adaptive-grid-dots)" />
        </svg>

        {/* Interactive SVG Layer */}
        <svg
          className="w-full h-full absolute inset-0 overflow-visible"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.12s ease-out",
          }}
        >
          {/* Animated Connecting Evidence Path Edges */}
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              hoveredNodeId === edge.source ||
              hoveredNodeId === edge.target ||
              selectedNodeId === edge.source ||
              selectedNodeId === edge.target;

            const pathD = `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`;

            return (
              <g key={edge.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHighlighted ? "#2563EB" : "var(--border-strong)"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  className="transition-colors duration-200"
                  opacity={isHighlighted ? 1 : 0.6}
                />

                {/* Particle Dot Animation */}
                <circle r={isHighlighted ? "3" : "2"} fill="#2563EB" opacity="0.9">
                  <animateMotion
                    path={pathD}
                    dur={`${2.2 + (edge.id.length % 3) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Graph Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                  if (
                    onSelectNodeDocument &&
                    (node.type === "DOCUMENT" || node.type === "PACKAGE" || node.type === "HUB")
                  ) {
                    onSelectNodeDocument(node.label, node.urn);
                  }
                }}
              >
                {/* Center Blue Hub Node */}
                {node.isCenter && (
                  <>
                    <circle
                      r="24"
                      fill="rgba(37, 99, 235, 0.15)"
                      className="animate-ping"
                      style={{ animationDuration: "3s" }}
                    />
                    <circle r="16" fill="rgba(37, 99, 235, 0.25)" />
                    <circle r="6" fill="#2563EB" />
                    <circle r="2.5" fill="#FFFFFF" />
                  </>
                )}

                {/* 4 Outer Focal Nodes */}
                {node.isFocal && !node.isCenter && (
                  <>
                    <circle r="16" fill="var(--bg-tertiary)" opacity="0.8" />
                    <circle
                      r="8"
                      fill="var(--text-primary)"
                      stroke={isSelected || isHovered ? "#2563EB" : "transparent"}
                      strokeWidth="2"
                    />
                  </>
                )}

                {/* Satellite Nodes */}
                {!node.isCenter && !node.isFocal && (
                  <circle
                    r={isSelected || isHovered ? "5" : "3.5"}
                    fill={
                      node.type === "DOCUMENT"
                        ? "#2563EB"
                        : node.type === "EQUIPMENT"
                        ? "#64748B"
                        : "#94A3B8"
                    }
                    stroke={isSelected || isHovered ? "#2563EB" : "transparent"}
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                )}

                {/* Hover Text Label */}
                {(isHovered || isSelected || node.isFocal || node.isCenter) && (
                  <text
                    x="0"
                    y={node.isCenter ? "26" : node.isFocal ? "22" : "14"}
                    fill="var(--text-primary)"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none select-none drop-shadow-sm"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 z-30 w-80 bg-bg-primary/95 backdrop-blur-md border border-border-subtle rounded-sm shadow-2xl p-4 flex flex-col gap-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="font-mono text-[10px] uppercase font-bold text-accent tracking-wider">
                  Node Inspector
                </span>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-text-tertiary hover:text-text-primary p-1"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="font-semibold text-text-primary text-sm leading-snug">
                  {selectedNode.label}
                </h4>
                <span className="font-mono text-[10px] text-text-tertiary">
                  {selectedNode.urn}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-bg-secondary p-2.5 rounded border border-border-subtle text-[11px]">
                <div>
                  <span className="text-text-tertiary block font-mono text-[9px] uppercase">
                    Node Type
                  </span>
                  <span className="font-medium text-text-primary">{selectedNode.type}</span>
                </div>
                <div>
                  <span className="text-text-tertiary block font-mono text-[9px] uppercase">
                    Connections
                  </span>
                  <span className="font-medium text-text-primary">
                    {selectedNode.connections.length} edges
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectNodeDocument) {
                    onSelectNodeDocument(selectedNode.label, selectedNode.urn);
                  }
                }}
                className="w-full h-8 rounded bg-text-primary text-bg-primary hover:opacity-90 font-medium text-xs flex items-center justify-center gap-2 transition-opacity"
              >
                <Eye size={14} />
                <span>View Source Document</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function useOrganicGraphData(packages: KnowledgePackageItem[]) {
  const [data, setData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const nodes: GraphNode[] = [
      {
        id: "center_hub",
        label: "Athleia Reasoning Core",
        type: "HUB",
        category: "Central Core",
        urn: "urn:athleia:core:reasoning",
        x: 400,
        y: 240,
        isCenter: true,
        connections: ["focal_top_left", "focal_top_right", "focal_bottom_left", "focal_bottom_right"],
      },
      {
        id: "focal_top_left",
        label: "Cooling SOP-101",
        type: "HUB",
        category: "Package",
        urn: "urn:athleia:pkg:cooling-water-101",
        x: 190,
        y: 160,
        isFocal: true,
        connections: ["center_hub"],
      },
      {
        id: "focal_top_right",
        label: "Gateway Architecture Spec",
        type: "HUB",
        category: "Package",
        urn: "urn:athleia:pkg:sys-arch-2026",
        x: 610,
        y: 150,
        isFocal: true,
        connections: ["center_hub"],
      },
      {
        id: "focal_bottom_left",
        label: "Pump P-101A Suction SOP",
        type: "HUB",
        category: "Document",
        urn: "urn:athleia:doc:sop-01",
        x: 270,
        y: 350,
        isFocal: true,
        connections: ["center_hub"],
      },
      {
        id: "focal_bottom_right",
        label: "OSHA Safety Standard",
        type: "HUB",
        category: "Compliance",
        urn: "urn:athleia:doc:osha-1910",
        x: 530,
        y: 360,
        isFocal: true,
        connections: ["center_hub"],
      },
      { id: "sat_1", label: "PT-101 Gauge", type: "EQUIPMENT", category: "Sensor", urn: "urn:athleia:asset:pt101", x: 165, y: 125, connections: ["focal_top_left"] },
      { id: "sat_2", label: "Valve VLV-302", type: "SENSOR", category: "Valve", urn: "urn:athleia:asset:vlv302", x: 155, y: 210, connections: ["focal_top_left"] },
      { id: "sat_3", label: "Iso Specs", type: "DOCUMENT", category: "Spec", urn: "urn:athleia:doc:iso", x: 150, y: 235, connections: ["focal_top_left"] },
      { id: "sat_4", label: "Ref Check", type: "DOCUMENT", category: "Doc", urn: "urn:athleia:doc:ref", x: 210, y: 270, connections: ["focal_top_left"] },

      { id: "sat_5", label: "Top Bound", type: "DOCUMENT", category: "Doc", urn: "urn:athleia:doc:tb", x: 560, y: 130, connections: ["focal_top_right"] },
      { id: "sat_6", label: "Edge Node", type: "EQUIPMENT", category: "Asset", urn: "urn:athleia:asset:en", x: 640, y: 90, connections: ["focal_top_right"] },
      { id: "sat_7", label: "Rule Tier", type: "DOCUMENT", category: "Rule", urn: "urn:athleia:rule:tier", x: 615, y: 245, connections: ["focal_top_right"] },
      { id: "sat_8", label: "Standard", type: "DOCUMENT", category: "Spec", urn: "urn:athleia:doc:std", x: 615, y: 275, connections: ["focal_top_right"] },

      { id: "sat_9", label: "Flow Sensor", type: "SENSOR", category: "Sensor", urn: "urn:athleia:asset:fs", x: 340, y: 300, connections: ["center_hub"] },
      { id: "sat_10", label: "Mid Spec", type: "DOCUMENT", category: "Spec", urn: "urn:athleia:doc:ms", x: 430, y: 315, connections: ["center_hub"] },
      { id: "sat_11", label: "Node 11", type: "DOCUMENT", category: "Doc", urn: "urn:athleia:doc:n11", x: 440, y: 270, connections: ["center_hub"] },

      { id: "sat_12", label: "Bottom Anchor", type: "EQUIPMENT", category: "Asset", urn: "urn:athleia:asset:ba", x: 475, y: 415, connections: ["focal_bottom_right"] },
      { id: "sat_13", label: "Sub Valve", type: "SENSOR", category: "Valve", urn: "urn:athleia:asset:sv", x: 495, y: 340, connections: ["center_hub"] },
      { id: "sat_14", label: "Trace ID", type: "DOCUMENT", category: "Doc", urn: "urn:athleia:doc:tr", x: 435, y: 350, connections: ["center_hub"] },
    ];

    const edges: GraphEdge[] = [
      { id: "e1", source: "center_hub", target: "focal_top_left", label: "EVIDENCE_LINK" },
      { id: "e2", source: "center_hub", target: "focal_top_right", label: "EVIDENCE_LINK" },
      { id: "e3", source: "center_hub", target: "focal_bottom_left", label: "EVIDENCE_LINK" },
      { id: "e4", source: "center_hub", target: "focal_bottom_right", label: "EVIDENCE_LINK" },

      { id: "e5", source: "focal_top_left", target: "sat_1", label: "MONITORS" },
      { id: "e6", source: "focal_top_left", target: "sat_2", label: "CONTROLS" },
      { id: "e7", source: "focal_top_left", target: "sat_3", label: "GOVERNS" },
      { id: "e8", source: "focal_top_left", target: "sat_4", label: "VERIFIES" },

      { id: "e9", source: "focal_top_right", target: "sat_5", label: "DEPENDS_ON" },
      { id: "e10", source: "focal_top_right", target: "sat_6", label: "DEPLOYS" },
      { id: "e11", source: "focal_top_right", target: "sat_7", label: "ENFORCES" },
      { id: "e12", source: "focal_top_right", target: "sat_8", label: "REFERENCES" },

      { id: "e13", source: "center_hub", target: "sat_9", label: "TELEMETRY" },
      { id: "e14", source: "center_hub", target: "sat_10", label: "REASONING" },
      { id: "e15", source: "center_hub", target: "sat_11", label: "TRACE" },

      { id: "e16", source: "focal_bottom_right", target: "sat_12", label: "AUDITS" },
      { id: "e17", source: "center_hub", target: "sat_13", label: "SIGNAL" },
      { id: "e18", source: "center_hub", target: "sat_14", label: "PROOFS" },
    ];

    setData({ nodes, edges });
  }, [packages]);

  return data;
}
