import React, { useState } from 'react';

interface Props {
  title: string;
  data: { actual: number; predicted: number; id?: string; label?: string }[];
  modelName: string;
  r2?: number;
  mae?: number;
  rmse?: number;
}

export const ActualVsPredictedPlot: React.FC<Props> = ({
  title,
  data,
  modelName,
  r2,
  mae,
  rmse,
}) => {
  const [hovered, setHovered] = useState<{ actual: number; predicted: number; label?: string } | null>(null);

  const width = 560;
  const height = 360;
  const padding = { top: 40, right: 30, bottom: 50, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const minVal = 35;
  const maxVal = 105;

  const scale = (val: number) => padding.left + ((val - minVal) / (maxVal - minVal)) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;

  const ticks = [40, 50, 60, 70, 80, 90, 100];

  return (
    <div className="relative bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            {title}
          </h4>
          <p className="text-xs text-slate-500">Points closer to the 45° dashed line represent higher prediction accuracy</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {r2 !== undefined && (
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono rounded border border-indigo-100 font-medium">
              R² = {r2.toFixed(4)}
            </span>
          )}
          {rmse !== undefined && (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-mono rounded border border-amber-100 font-medium">
              RMSE = {rmse.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[360px] select-none font-sans">
          {/* Grid & Ticks */}
          {ticks.map((val) => {
            const pos = scale(val);
            const posY = scaleY(val);
            return (
              <g key={`grid-${val}`}>
                {/* Horizontal grid */}
                <line x1={padding.left} y1={posY} x2={width - padding.right} y2={posY} stroke="#f1f5f9" />
                <text x={padding.left - 8} y={posY + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                  {val}
                </text>
                {/* Vertical grid */}
                <line x1={pos} y1={padding.top} x2={pos} y2={height - padding.bottom} stroke="#f1f5f9" />
                <text x={pos} y={height - padding.bottom + 16} textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Axes */}
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

          {/* 45 Degree Identity / Parity Line (y = x) */}
          <line
            x1={scale(minVal)}
            y1={scaleY(minVal)}
            x2={scale(maxVal)}
            y2={scaleY(maxVal)}
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text
            x={scale(maxVal) - 10}
            y={scaleY(maxVal) + 18}
            className="text-[10px] fill-emerald-600 font-semibold"
            textAnchor="end"
          >
            Perfect Match (y = x)
          </text>

          {/* Residual lines and scatter dots */}
          {data.map((d, i) => {
            const cx = scale(d.actual);
            const cy = scaleY(d.predicted);
            const parityY = scaleY(d.actual);
            return (
              <g key={`pair-${i}`}>
                {/* residual line to parity line */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx}
                  y2={parityY}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  className="fill-indigo-600/80 stroke-white stroke-1 hover:fill-indigo-800 hover:r-6 transition-all cursor-pointer"
                  onMouseEnter={() => setHovered(d)}
                  onMouseLeave={() => setHovered(null)}
                />
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 12}
            textAnchor="middle"
            className="text-[11px] font-semibold fill-slate-700"
          >
            Actual Exam Score (%)
          </text>
          <text
            x={-padding.top - plotHeight / 2}
            y={18}
            textAnchor="middle"
            transform="rotate(-90)"
            className="text-[11px] font-semibold fill-slate-700"
          >
            Model Predicted Score (%)
          </text>
        </svg>
      </div>

      {hovered && (
        <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-md shadow-lg pointer-events-none z-10 border border-slate-700">
          <div className="font-semibold text-slate-200">{hovered.label || modelName}</div>
          <div>Actual Score: <span className="font-mono text-emerald-300">{hovered.actual}%</span></div>
          <div>Estimated Score: <span className="font-mono text-indigo-300">{hovered.predicted.toFixed(1)}%</span></div>
          <div>Residual (Error): <span className="font-mono text-amber-300">{(hovered.actual - hovered.predicted).toFixed(2)}</span></div>
        </div>
      )}
    </div>
  );
};
