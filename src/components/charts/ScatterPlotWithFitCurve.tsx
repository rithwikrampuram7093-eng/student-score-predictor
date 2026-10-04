import React, { useState } from 'react';

interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  subLabel?: string;
}

interface Props {
  title: string;
  xLabel: string;
  yLabel: string;
  points: ScatterPoint[];
  curvePoints?: { x: number; y: number }[];
  highlightPoint?: { x: number; y: number; label: string };
  curveLabel?: string;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

export const ScatterPlotWithFitCurve: React.FC<Props> = ({
  title,
  xLabel,
  yLabel,
  points,
  curvePoints = [],
  highlightPoint,
  curveLabel = 'Fitted Regression Curve',
  minX = 0,
  maxX = 14,
  minY = 30,
  maxY = 105,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const width = 640;
  const height = 380;
  const padding = { top: 40, right: 30, bottom: 55, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Scale functions
  const scaleX = (val: number) => padding.left + ((val - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - ((val - minY) / (maxY - minY)) * plotHeight;

  // Generate tick marks
  const xTicksCount = 7;
  const xTicks = Array.from({ length: xTicksCount }, (_, i) => minX + i * ((maxX - minX) / (xTicksCount - 1)));

  const yTicksCount = 6;
  const yTicks = Array.from({ length: yTicksCount }, (_, i) => minY + i * ((maxY - minY) / (yTicksCount - 1)));

  // Build SVG path for regression curve
  let curvePathD = '';
  if (curvePoints.length > 1) {
    const sortedCurve = [...curvePoints].sort((a, b) => a.x - b.x);
    curvePathD = sortedCurve.reduce((acc, pt, idx) => {
      const sx = scaleX(pt.x);
      const sy = scaleY(pt.y);
      return idx === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
    }, '');
  }

  return (
    <div className="relative bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
          {title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80 inline-block"></span>
            Dataset ({points.length} Students)
          </span>
          {curvePoints.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-amber-500 inline-block"></span>
              {curveLabel}
            </span>
          )}
          {highlightPoint && (
            <span className="flex items-center gap-1.5 font-medium text-emerald-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200 inline-block"></span>
              Your Estimation
            </span>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[380px] select-none font-sans"
        >
          {/* Grid lines */}
          {yTicks.map((tick, i) => {
            const y = scaleY(tick);
            return (
              <g key={`y-grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {Math.round(tick)}
                </text>
              </g>
            );
          })}

          {xTicks.map((tick, i) => {
            const x = scaleX(tick);
            return (
              <g key={`x-grid-${i}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Axes lines */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 12}
            textAnchor="middle"
            className="text-[12px] font-medium fill-slate-700"
          >
            {xLabel}
          </text>
          <text
            x={-padding.top - plotHeight / 2}
            y={18}
            textAnchor="middle"
            transform="rotate(-90)"
            className="text-[12px] font-medium fill-slate-700"
          >
            {yLabel}
          </text>

          {/* Fitted Regression Curve */}
          {curvePathD && (
            <path
              d={curvePathD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((pt, i) => {
            const cx = scaleX(pt.x);
            const cy = scaleY(pt.y);
            return (
              <circle
                key={`pt-${i}`}
                cx={cx}
                cy={cy}
                r="4"
                className="fill-indigo-600/75 hover:fill-indigo-700 hover:r-6 transition-all cursor-pointer stroke-white stroke-1"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredPoint(pt);
                  setTooltipPos({ x: rect.left, y: rect.top });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* Highlighted point for current student prediction */}
          {highlightPoint && (
            <g>
              {/* Pulsing ring */}
              <circle
                cx={scaleX(highlightPoint.x)}
                cy={scaleY(highlightPoint.y)}
                r="12"
                className="fill-emerald-400/30 stroke-emerald-500 stroke-2 animate-ping"
              />
              <circle
                cx={scaleX(highlightPoint.x)}
                cy={scaleY(highlightPoint.y)}
                r="7"
                className="fill-emerald-500 stroke-white stroke-2"
              />
              <text
                x={scaleX(highlightPoint.x)}
                y={scaleY(highlightPoint.y) - 14}
                textAnchor="middle"
                className="text-[11px] font-bold fill-emerald-800 bg-white"
              >
                {highlightPoint.label}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Floating tooltip */}
      {hoveredPoint && (
        <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-md shadow-lg pointer-events-none z-10 border border-slate-700">
          <div className="font-semibold">{hoveredPoint.label || 'Student'}</div>
          <div>{xLabel}: <span className="font-mono text-indigo-300">{hoveredPoint.x}</span></div>
          <div>{yLabel}: <span className="font-mono text-emerald-300">{hoveredPoint.y}</span></div>
          {hoveredPoint.subLabel && <div className="text-[10px] text-slate-300">{hoveredPoint.subLabel}</div>}
        </div>
      )}
    </div>
  );
};
