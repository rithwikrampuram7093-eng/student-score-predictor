import React, { useState } from 'react';

interface Props {
  scores: number[];
  title?: string;
  binSize?: number;
}

export const ScoreDistributionHistogram: React.FC<Props> = ({
  scores,
  title = 'Student Exam Score Distribution',
  binSize = 10,
}) => {
  const [hoveredBin, setHoveredBin] = useState<{ binLabel: string; count: number; pct: number } | null>(null);

  const width = 560;
  const height = 280;
  const padding = { top: 30, right: 30, bottom: 45, left: 50 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Generate bins from 40 to 100
  const minScore = 40;
  const maxScore = 100;
  const binsCount = Math.ceil((maxScore - minScore) / binSize);
  const bins: { label: string; min: number; max: number; count: number }[] = [];

  for (let i = 0; i < binsCount; i++) {
    const bMin = minScore + i * binSize;
    const bMax = bMin + binSize;
    bins.push({
      label: `${bMin}-${bMax}%`,
      min: bMin,
      max: bMax,
      count: 0,
    });
  }

  // Populate counts
  scores.forEach((sc) => {
    for (const b of bins) {
      if (sc >= b.min && (sc < b.max || (b.max === maxScore && sc <= b.max))) {
        b.count++;
        break;
      }
    }
  });

  const maxCount = Math.max(1, ...bins.map((b) => b.count));
  const barWidth = plotWidth / bins.length;

  return (
    <div className="relative bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          {title}
        </h4>
        <span className="text-xs text-slate-500 font-mono">N = {scores.length}</span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[280px] select-none font-sans">
          {/* Baseline */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Grid lines */}
          {[0, Math.round(maxCount / 2), maxCount].map((cnt, idx) => {
            const y = height - padding.bottom - (cnt / maxCount) * plotHeight;
            return (
              <g key={`hist-grid-${idx}`}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f1f5f9" />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                  {cnt}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {bins.map((b, i) => {
            const barH = (b.count / maxCount) * plotHeight;
            const x = padding.left + i * barWidth;
            const y = height - padding.bottom - barH;
            const pct = scores.length > 0 ? Number(((b.count / scores.length) * 100).toFixed(1)) : 0;

            return (
              <g
                key={`bin-${i}`}
                onMouseEnter={() => setHoveredBin({ binLabel: b.label, count: b.count, pct })}
                onMouseLeave={() => setHoveredBin(null)}
                className="cursor-pointer group"
              >
                <rect
                  x={x + 4}
                  y={y}
                  width={barWidth - 8}
                  height={barH}
                  fill="#3b82f6"
                  className="group-hover:fill-blue-600 transition-colors"
                  rx="3"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-600 font-mono font-medium"
                >
                  {b.count > 0 ? b.count : ''}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-mono"
                >
                  {b.label}
                </text>
              </g>
            );
          })}

          {/* X Axis Label */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 8}
            textAnchor="middle"
            className="text-[11px] font-medium fill-slate-600"
          >
            Examination Score Range (%)
          </text>
        </svg>
      </div>

      {hoveredBin && (
        <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-md shadow-lg pointer-events-none z-10 border border-slate-700">
          <div className="font-semibold text-blue-300">Score Range: {hoveredBin.binLabel}</div>
          <div>Students: <span className="font-mono">{hoveredBin.count}</span> ({hoveredBin.pct}%)</div>
        </div>
      )}
    </div>
  );
};
