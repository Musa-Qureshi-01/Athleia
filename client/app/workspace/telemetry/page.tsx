"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Gauge,
  Thermometer,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Bot,
  Layers,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlantAsset {
  id: string;
  tag: string;
  name: string;
  category: string;
  status: "Nominal" | "Monitoring" | "Calibrating";
  healthScore: number;
  metrics: {
    primaryLabel: string;
    primaryVal: string;
    secondaryLabel: string;
    secondaryVal: string;
    vibration: string;
    temperature: string;
  };
  pndRef: string;
  sopRef: string;
  copilotPrompt: string;
}

const PLANT_ASSETS: PlantAsset[] = [
  {
    id: "p-101a",
    tag: "P-101A",
    name: "Boiler Feedwater Centrifugal Pump",
    category: "Pumping System",
    status: "Nominal",
    healthScore: 99.4,
    metrics: {
      primaryLabel: "Discharge Pressure",
      primaryVal: "142.4 PSI",
      secondaryLabel: "Impeller Velocity",
      secondaryVal: "3,450 RPM",
      vibration: "1.8 mm/s RMS (Healthy)",
      temperature: "68.2°C bearing",
    },
    pndRef: "PND-4012 (Rev C)",
    sopRef: "SOP-8842 (Isolation)",
    copilotPrompt: "Analyze vibration harmonics and isolation sequence for pump P-101A",
  },
  {
    id: "c-302",
    tag: "C-302",
    name: "Synthesis Gas Compressor (Multi-Stage)",
    category: "Compression Loop",
    status: "Nominal",
    healthScore: 98.8,
    metrics: {
      primaryLabel: "Discharge Pressure",
      primaryVal: "48.6 bar",
      secondaryLabel: "Stage 2 Temp",
      secondaryVal: "92.4°C",
      vibration: "2.1 mm/s RMS (Healthy)",
      temperature: "92.4°C exhaust",
    },
    pndRef: "PND-1048 (Rev B)",
    sopRef: "SOP-2201 (Overhaul)",
    copilotPrompt: "Review compressor C-302 second stage discharge telemetry and trip limits",
  },
  {
    id: "e-204",
    tag: "E-204",
    name: "Shell & Tube Process Heat Exchanger",
    category: "Thermal Transfer",
    status: "Monitoring",
    healthScore: 96.2,
    metrics: {
      primaryLabel: "Thermal Differential (ΔT)",
      primaryVal: "34.2°C",
      secondaryLabel: "Process Flow",
      secondaryVal: "840 GPM",
      vibration: "0.4 mm/s RMS",
      temperature: "144.1°C tube inlet",
    },
    pndRef: "PND-2041 (Rev A)",
    sopRef: "SOP-3104 (Descaling)",
    copilotPrompt: "Verify chemical descaling interval and heat transfer efficiency for E-204",
  },
  {
    id: "pt-101",
    tag: "PT-101",
    name: "Differential Pressure Transmitter",
    category: "Instrumentation & Safety Loop",
    status: "Nominal",
    healthScore: 99.9,
    metrics: {
      primaryLabel: "Loop Signal",
      primaryVal: "14.2 mA",
      secondaryLabel: "Calibrated Range",
      secondaryVal: "0 - 200 mbar",
      vibration: "Nominal",
      temperature: "24.5°C ambient",
    },
    pndRef: "PND-4012 (Rev C)",
    sopRef: "ISA-TR84 Safety Loop",
    copilotPrompt: "Check PT-101 loop calibration certificate and SIL rating compliance",
  },
];

export default function TelemetryPage() {
  const [selectedAsset, setSelectedAsset] = useState<PlantAsset>(PLANT_ASSETS[0]);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
            <Link href="/workspace" className="text-text-secondary hover:text-text-primary transition-colors">
              Workspace
            </Link>
            <span>/</span>
            <span className="text-text-primary font-semibold">Plant Asset Telemetry</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-border-strong hidden sm:inline-block" />
          <span className="px-2 py-0.5 rounded-full border border-border-subtle bg-bg-secondary text-[11px] font-mono text-text-secondary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>4 Monitored Loops Nominal</span>
          </span>
        </div>

        <Link
          href="/workspace/maintenance"
          className="h-8.5 px-3.5 rounded-md border border-border-subtle hover:border-border-strong bg-bg-primary hover:bg-bg-secondary text-text-secondary hover:text-text-primary text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Wrench size={13} className="text-text-tertiary" />
          <span>Full Maintenance Desk</span>
        </Link>
      </div>

      {/* Grid of Equipment Asset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANT_ASSETS.map((asset) => {
          const isSelected = selectedAsset.id === asset.id;
          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-2xs",
                isSelected
                  ? "border-[#1F45EC] bg-bg-primary ring-1 ring-[#1F45EC]/30"
                  : "border-border-subtle bg-bg-primary hover:border-border-strong hover:bg-bg-secondary"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-text-primary">
                    {asset.tag}
                  </span>
                  <h3 className="text-xs text-text-secondary font-medium line-clamp-1 mt-0.5">
                    {asset.name}
                  </h3>
                </div>
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border",
                    asset.status === "Nominal"
                      ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                      : "text-amber-600 bg-amber-500/10 border-amber-500/20"
                  )}
                >
                  {asset.status}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border-subtle text-xs">
                <div className="flex items-center justify-between text-text-tertiary font-mono text-[11px]">
                  <span>{asset.metrics.primaryLabel}</span>
                  <span className="text-text-primary font-bold">{asset.metrics.primaryVal}</span>
                </div>
                <div className="flex items-center justify-between text-text-tertiary font-mono text-[11px]">
                  <span>Vibration</span>
                  <span className="text-emerald-600 font-semibold">{asset.metrics.vibration.split(" ")[0]}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-[11px] font-mono text-text-tertiary">
                <span>Health: {asset.healthScore}%</span>
                <span className="text-accent flex items-center gap-0.5">
                  Inspect →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Asset Detailed Diagnostics Strip */}
      <div className="rounded-xl border border-border-subtle bg-bg-primary p-5 flex flex-col gap-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary font-mono">{selectedAsset.tag}</span>
              <span className="text-sm text-text-secondary">— {selectedAsset.name}</span>
            </div>
            <p className="text-xs text-text-tertiary font-mono mt-0.5">
              Category: {selectedAsset.category} · System Health: {selectedAsset.healthScore}% Nominal
            </p>
          </div>

          <Link
            href={`/workspace/assistant?prompt=${encodeURIComponent(selectedAsset.copilotPrompt)}`}
            className="h-8.5 px-3 rounded-lg bg-[#1F45EC] hover:bg-[#1839C5] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <Bot size={13} />
            <span>Ask Copilot to Reason on {selectedAsset.tag}</span>
          </Link>
        </div>

        {/* Detailed Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle flex flex-col gap-1">
            <span className="text-[11px] font-mono text-text-tertiary">{selectedAsset.metrics.primaryLabel}</span>
            <span className="text-base font-bold font-mono text-text-primary">{selectedAsset.metrics.primaryVal}</span>
            <span className="text-[10px] text-emerald-600 font-mono">Real-time transducer loop</span>
          </div>

          <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle flex flex-col gap-1">
            <span className="text-[11px] font-mono text-text-tertiary">{selectedAsset.metrics.secondaryLabel}</span>
            <span className="text-base font-bold font-mono text-text-primary">{selectedAsset.metrics.secondaryVal}</span>
            <span className="text-[10px] text-text-tertiary font-mono">Operating envelope</span>
          </div>

          <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle flex flex-col gap-1">
            <span className="text-[11px] font-mono text-text-tertiary">Tri-Axial Vibration</span>
            <span className="text-base font-bold font-mono text-text-primary">{selectedAsset.metrics.vibration}</span>
            <span className="text-[10px] text-emerald-600 font-mono">ISO 10816-3 Zone A</span>
          </div>

          <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle flex flex-col gap-1">
            <span className="text-[11px] font-mono text-text-tertiary">Thermal Telemetry</span>
            <span className="text-base font-bold font-mono text-text-primary">{selectedAsset.metrics.temperature}</span>
            <span className="text-[10px] text-emerald-600 font-mono">Within rated margin</span>
          </div>
        </div>

        {/* P&ID and SOP Grounding Cross-References */}
        <div className="p-3.5 rounded-lg bg-bg-secondary border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap font-mono text-[11px] text-text-secondary">
            <div>
              <span className="text-text-tertiary">P&ID Drawing: </span>
              <span className="font-semibold text-text-primary">{selectedAsset.pndRef}</span>
            </div>
            <div>
              <span className="text-text-tertiary">Governing SOP: </span>
              <span className="font-semibold text-text-primary">{selectedAsset.sopRef}</span>
            </div>
          </div>

          <Link
            href={`/workspace/search?q=${encodeURIComponent(selectedAsset.tag)}`}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Search All Indexed Citations for {selectedAsset.tag}</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
