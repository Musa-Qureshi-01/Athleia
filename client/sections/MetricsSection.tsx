"use client";

import { motion } from "framer-motion";

interface StatItem {
  id: string;
  metric: string;
  label: string;
  source: string;
}

const STATS: StatItem[] = [
  {
    id: "stat-1",
    metric: "19%",
    label: "Of the workweek is spent searching for internal information.",
    source: "McKinsey Global Institute — The Social Economy",
  },
  {
    id: "stat-2",
    metric: "62%",
    label: "Of employees struggle with spending too much time searching for information.",
    source: "Microsoft — Work Trend Index",
  },
  {
    id: "stat-3",
    metric: "2.8 hrs/wk",
    label: "Spent looking for or requesting information employees need.",
    source: "APQC — Productivity Drains & Knowledge Management",
  },
  {
    id: "stat-4",
    metric: "40%",
    label: "Of employee time can be spent searching for required information.",
    source: "Deloitte + ServiceNow — Disconnected Work Ecosystems",
  },
  {
    id: "stat-5",
    metric: "8–10 hrs/wk",
    label: "Potential employee time that AI could free for corporate workers.",
    source: "EY — The AIdea of Enterprise Intelligence",
  },
  {
    id: "stat-6",
    metric: "35%",
    label: "Potential reduction in time spent searching through searchable organizational knowledge.",
    source: "McKinsey Global Institute — The Social Economy",
  },
];

export function MetricsSection() {
  const topRow = STATS.slice(0, 3);
  const bottomRow = STATS.slice(3, 6);

  return (
    <section id="statistics" className="bg-white border-t border-neutral-200 font-sans overflow-hidden scroll-mt-10">
      <div className="max-w-[1280px] mx-auto border-x border-neutral-200 px-6 sm:px-12 lg:px-16 xl:pl-20 py-12 sm:py-16 lg:py-20">
        
        {/* Section Headline with Calibrated Proportionate Size */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <h2 className="text-[24px] sm:text-[32px] lg:text-[36px] font-bold tracking-[-0.03em] text-neutral-900 leading-[1.18] font-sans">
            Enterprise AI people actually use. Flexible across models, trusted across the enterprise.
          </h2>
          <p className="mt-3 text-[14px] sm:text-[15px] text-neutral-600 leading-relaxed font-sans max-w-2xl">
            Axios solves the invisible knowledge tax that drains employee productivity. Grounded enterprise context turns fragmented institutional knowledge into immediate, verified execution.
          </p>
        </div>

        {/* 6 Boxed Cards with Calibrated Compact Ergonomics & Clean Boxy Corners */}
        <div className="rounded-lg border border-neutral-200/90 bg-white overflow-hidden shadow-xs">
          
          {/* Top Row (3 boxes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            {topRow.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[160px] bg-white hover:bg-[#FAFBFD] transition-colors"
              >
                <div>
                  <div className="text-[34px] sm:text-[40px] lg:text-[44px] font-light tracking-[-0.035em] text-neutral-900 leading-none mb-2.5 font-sans">
                    {item.metric}
                  </div>
                  <p className="text-[12px] sm:text-[13px] font-mono text-neutral-600 leading-snug uppercase tracking-tight">
                    {item.label}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-neutral-100 text-[10.5px] font-mono text-neutral-400">
                  {item.source}
                </div>
              </div>
            ))}
          </div>

          {/* Dividing Hairline */}
          <div className="border-t border-neutral-200" />

          {/* Bottom Row (3 boxes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            {bottomRow.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[160px] bg-white hover:bg-[#FAFBFD] transition-colors"
              >
                <div>
                  <div className="text-[34px] sm:text-[40px] lg:text-[44px] font-light tracking-[-0.035em] text-neutral-900 leading-none mb-2.5 font-sans">
                    {item.metric}
                  </div>
                  <p className="text-[12px] sm:text-[13px] font-mono text-neutral-600 leading-snug uppercase tracking-tight">
                    {item.label}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-neutral-100 text-[10.5px] font-mono text-neutral-400">
                  {item.source}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
