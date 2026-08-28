'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface MetricDimension {
  key: string;
  label: string;
  beforeVal: number; // 0 to 100
  afterVal: number; // 0 to 100
  unit: string;
  beforeDisplay: string;
  afterDisplay: string;
}

interface RiskMetricRadarProps {
  isResolved?: boolean;
  borrowerName?: string;
}

export function RiskMetricRadar({
  isResolved = false,
  borrowerName = 'Apex Commodities Corp',
}: RiskMetricRadarProps) {
  const dimensions: MetricDimension[] = [
    {
      key: 'score',
      label: 'Credit Score',
      beforeVal: (620 / 850) * 100,
      afterVal: (810 / 850) * 100,
      unit: '/850',
      beforeDisplay: '620',
      afterDisplay: '810',
    },
    {
      key: 'health',
      label: 'Health Factor',
      beforeVal: 43.5, // 0.87 / 2.0 * 100
      afterVal: 92.0, // 1.84 / 2.0 * 100
      unit: 'HF',
      beforeDisplay: '0.87',
      afterDisplay: '1.84',
    },
    {
      key: 'liquidity',
      label: 'Liquidity Coverage',
      beforeVal: 48,
      afterVal: 89,
      unit: '%',
      beforeDisplay: '48%',
      afterDisplay: '89%',
    },
    {
      key: 'collateral',
      label: 'Collateral Quality',
      beforeVal: 52,
      afterVal: 94,
      unit: '%',
      beforeDisplay: '52%',
      afterDisplay: '94%',
    },
    {
      key: 'volatility',
      label: 'Volatility Defense',
      beforeVal: 45,
      afterVal: 91,
      unit: '%',
      beforeDisplay: '45%',
      afterDisplay: '91%',
    },
    {
      key: 'velocity',
      label: 'Settlement Velocity',
      beforeVal: 38,
      afterVal: 98,
      unit: '%',
      beforeDisplay: '38%',
      afterDisplay: '98%',
    },
  ];

  // SVG Geometry Constants
  const size = 320;
  const center = size / 2;
  const radius = 100;
  const totalAxes = dimensions.length;

  // Calculates coordinate for a given axis index and percentage value (0-100)
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Concentric polygon background grids (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [20, 40, 60, 80, 100];

  const createPolygonPoints = (values: number[]) => {
    return values
      .map((val, idx) => {
        const { x, y } = getCoordinates(idx, val);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const beforePoints = createPolygonPoints(dimensions.map((d) => d.beforeVal));
  const afterPoints = createPolygonPoints(dimensions.map((d) => d.afterVal));

  return (
    <div className="relative w-full rounded-3xl border border-slate-800 bg-slate-950/90 p-6 backdrop-blur-2xl shadow-2xl overflow-hidden">
      {/* Doppelrand Inset Highlight */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <Activity className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Bayesian Risk Metric Radar
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                6-Axis Matrix
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Multi-dimensional underwriter confidence profile for {borrowerName}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="text-slate-400">T-0 Distress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-slate-200">T+15s Prime</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radar SVG Canvas */}
        <div className="md:col-span-7 flex items-center justify-center relative">
          <svg width={size} height={size} className="overflow-visible">
            {/* Ambient radar glow */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              className="fill-cyan-500/5 filter blur-xl pointer-events-none"
            />

            {/* Concentric grid rings */}
            {gridLevels.map((lvl) => {
              const gridPoints = dimensions
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, lvl);
                  return `${x},${y}`;
                })
                .join(' ');

              return (
                <polygon
                  key={lvl}
                  points={gridPoints}
                  fill="none"
                  stroke="rgba(51, 65, 85, 0.4)"
                  strokeWidth="1"
                  strokeDasharray={lvl < 100 ? '2 2' : 'none'}
                />
              );
            })}

            {/* Axis Spokes */}
            {dimensions.map((_, idx) => {
              const { x, y } = getCoordinates(idx, 100);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(51, 65, 85, 0.5)"
                  strokeWidth="1"
                />
              );
            })}

            {/* BEFORE Polygon (🔴 Distress) */}
            <polygon
              points={beforePoints}
              fill="rgba(239, 68, 68, 0.18)"
              stroke="rgba(239, 68, 68, 0.8)"
              strokeWidth="2"
              className="transition-all duration-700"
            />

            {/* BEFORE Vertex Dots */}
            {dimensions.map((d, idx) => {
              const { x, y } = getCoordinates(idx, d.beforeVal);
              return (
                <circle
                  key={`b-${idx}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  className="fill-red-400 stroke-slate-950 stroke-2"
                />
              );
            })}

            {/* AFTER Polygon (🟢 Prime) with animation */}
            <motion.polygon
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isResolved ? 1 : 0.35,
                scale: 1,
              }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              points={afterPoints}
              fill={isResolved ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.08)'}
              stroke={isResolved ? 'rgba(52, 211, 153, 0.95)' : 'rgba(52, 211, 153, 0.4)'}
              strokeWidth="2.5"
            />

            {/* AFTER Vertex Dots */}
            {dimensions.map((d, idx) => {
              const { x, y } = getCoordinates(idx, d.afterVal);
              return (
                <circle
                  key={`a-${idx}`}
                  cx={x}
                  cy={y}
                  r={isResolved ? 4.5 : 3}
                  className={`transition-all duration-500 ${
                    isResolved
                      ? 'fill-emerald-400 stroke-slate-950 stroke-2 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                      : 'fill-emerald-600 stroke-slate-950 stroke-1 opacity-40'
                  }`}
                />
              );
            })}

            {/* Axis Labels positioned around polygon */}
            {dimensions.map((d, idx) => {
              const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
              const labelRadius = radius + 26;
              const lx = center + labelRadius * Math.cos(angle);
              const ly = center + labelRadius * Math.sin(angle);

              return (
                <text
                  key={`l-${idx}`}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-400 text-[10px] font-mono select-none"
                >
                  {d.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Breakdown Metric Cards */}
        <div className="md:col-span-5 flex flex-col gap-2.5">
          {dimensions.map((dim) => {
            return (
              <div
                key={dim.key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
              >
                <span className="text-slate-300 font-medium">{dim.label}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-red-400">{dim.beforeDisplay}</span>
                  <span className="text-slate-600">→</span>
                  <span
                    className={`font-semibold ${
                      isResolved ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {isResolved ? dim.afterDisplay : '---'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
