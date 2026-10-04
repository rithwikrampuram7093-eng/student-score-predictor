import React from 'react';
import { PerformanceCategory } from '../../types';

interface Props {
  data: { category: PerformanceCategory; count: number; color: string }[];
  total: number;
}

export const CategoryDistributionChart: React.FC<Props> = ({ data, total }) => {
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
          Performance Category Distribution
        </h4>
        <span className="text-xs text-slate-500 font-mono">Total: {total}</span>
      </div>

      <div className="space-y-3 pt-2">
        {data.map((item) => {
          const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
          const barWidthPct = total > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.category}
                </span>
                <span className="text-slate-500 font-mono">
                  <strong className="text-slate-800">{item.count}</strong> students ({pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidthPct}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
