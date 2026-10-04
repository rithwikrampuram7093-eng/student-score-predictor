import React, { useState } from 'react';

interface ModelComparisonItem {
  name: string;
  shortName: string;
  r2: number;
  mae: number;
  rmse: number;
  color: string;
}

interface Props {
  models: ModelComparisonItem[];
}

export const ModelMetricsBarChart: React.FC<Props> = ({ models }) => {
  const [metricTab, setMetricTab] = useState<'all' | 'r2' | 'mae' | 'rmse'>('all');

  const width = 620;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Render comparative bars
  const groupWidth = plotWidth / models.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block"></span>
            Model Performance Comparison
          </h4>
          <p className="text-xs text-slate-500">Evaluated on test dataset partition</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setMetricTab('all')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              metricTab === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setMetricTab('r2')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              metricTab === 'r2' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            R² (Higher is Better)
          </button>
          <button
            onClick={() => setMetricTab('mae')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              metricTab === 'mae' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MAE (Lower is Better)
          </button>
          <button
            onClick={() => setMetricTab('rmse')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              metricTab === 'rmse' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RMSE (Lower is Better)
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px] select-none font-sans">
          {/* Base line */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Render by metric mode */}
          {metricTab === 'all' && (
            <>
              {/* Legend */}
              <g transform={`translate(${padding.left + 10}, 14)`}>
                <rect x="0" y="0" width="12" height="12" fill="#6366f1" rx="2" />
                <text x="16" y="10" className="text-[11px] fill-slate-700 font-medium">R² (Scaled x10)</text>
                <rect x="130" y="0" width="12" height="12" fill="#f59e0b" rx="2" />
                <text x="146" y="10" className="text-[11px] fill-slate-700 font-medium">MAE (Absolute Error)</text>
                <rect x="290" y="0" width="12" height="12" fill="#ef4444" rx="2" />
                <text x="306" y="10" className="text-[11px] fill-slate-700 font-medium">RMSE (Root Sq Error)</text>
              </g>

              {models.map((m, i) => {
                const groupX = padding.left + i * groupWidth;
                const barW = Math.min(26, (groupWidth - 24) / 3);

                // Max scale is 12
                const maxScale = 12;
                const r2Scaled = m.r2 * 10;
                const hR2 = (r2Scaled / maxScale) * plotHeight;
                const hMae = (Math.min(maxScale, m.mae) / maxScale) * plotHeight;
                const hRmse = (Math.min(maxScale, m.rmse) / maxScale) * plotHeight;

                const baseY = height - padding.bottom;

                return (
                  <g key={`grp-${i}`}>
                    {/* Model Label */}
                    <text
                      x={groupX + groupWidth / 2}
                      y={baseY + 18}
                      textAnchor="middle"
                      className="text-[11px] fill-slate-700 font-semibold"
                    >
                      {m.shortName}
                    </text>

                    {/* Bar 1: R2 */}
                    <rect
                      x={groupX + groupWidth / 2 - barW * 1.6}
                      y={baseY - hR2}
                      width={barW}
                      height={hR2}
                      fill="#6366f1"
                      rx="3"
                    />
                    <text
                      x={groupX + groupWidth / 2 - barW * 1.1}
                      y={baseY - hR2 - 4}
                      textAnchor="middle"
                      className="text-[10px] fill-indigo-700 font-mono font-medium"
                    >
                      {m.r2.toFixed(2)}
                    </text>

                    {/* Bar 2: MAE */}
                    <rect
                      x={groupX + groupWidth / 2 - barW * 0.5}
                      y={baseY - hMae}
                      width={barW}
                      height={hMae}
                      fill="#f59e0b"
                      rx="3"
                    />
                    <text
                      x={groupX + groupWidth / 2}
                      y={baseY - hMae - 4}
                      textAnchor="middle"
                      className="text-[10px] fill-amber-700 font-mono font-medium"
                    >
                      {m.mae.toFixed(1)}
                    </text>

                    {/* Bar 3: RMSE */}
                    <rect
                      x={groupX + groupWidth / 2 + barW * 0.6}
                      y={baseY - hRmse}
                      width={barW}
                      height={hRmse}
                      fill="#ef4444"
                      rx="3"
                    />
                    <text
                      x={groupX + groupWidth / 2 + barW * 1.1}
                      y={baseY - hRmse - 4}
                      textAnchor="middle"
                      className="text-[10px] fill-rose-700 font-mono font-medium"
                    >
                      {m.rmse.toFixed(1)}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {metricTab !== 'all' && (
            <>
              {models.map((m, i) => {
                const groupX = padding.left + i * groupWidth;
                const barW = Math.min(54, groupWidth - 36);

                let val = m.r2;
                let maxRef = 1.0;
                let barColor = '#6366f1';
                let formatted = m.r2.toFixed(4);

                if (metricTab === 'mae') {
                  val = m.mae;
                  maxRef = 8.0;
                  barColor = '#f59e0b';
                  formatted = m.mae.toFixed(2);
                } else if (metricTab === 'rmse') {
                  val = m.rmse;
                  maxRef = 10.0;
                  barColor = '#ef4444';
                  formatted = m.rmse.toFixed(2);
                }

                const barH = (Math.min(maxRef, val) / maxRef) * plotHeight;
                const baseY = height - padding.bottom;

                return (
                  <g key={`single-${i}`}>
                    <text
                      x={groupX + groupWidth / 2}
                      y={baseY + 18}
                      textAnchor="middle"
                      className="text-[11px] fill-slate-700 font-semibold"
                    >
                      {m.shortName}
                    </text>

                    <rect
                      x={groupX + groupWidth / 2 - barW / 2}
                      y={baseY - barH}
                      width={barW}
                      height={barH}
                      fill={barColor}
                      rx="4"
                    />

                    <text
                      x={groupX + groupWidth / 2}
                      y={baseY - barH - 6}
                      textAnchor="middle"
                      className="text-[11px] fill-slate-800 font-mono font-bold"
                    >
                      {formatted}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
