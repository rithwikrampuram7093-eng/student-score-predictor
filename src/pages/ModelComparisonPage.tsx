import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  TrendingUp,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { Student } from '../types';
import {
  fitSimpleLinearRegression,
  fitMultipleLinearRegression,
} from '../services/mathRegression';
import { ModelMetricsBarChart } from '../components/charts/ModelMetricsBarChart';
import { ActualVsPredictedPlot } from '../components/charts/ActualVsPredictedPlot';

interface Props {
  students: Student[];
}

export const ModelComparisonPage: React.FC<Props> = ({ students }) => {
  const [includeCategoricalInMlr, setIncludeCategoricalInMlr] = useState<boolean>(true);
  const [activeParityModel, setActiveParityModel] = useState<'simple' | 'multiple'>('multiple');

  // Compute both models on the exact same dataset partition
  const simpleModel = useMemo(() => fitSimpleLinearRegression(students), [students]);
  const multipleModel = useMemo(
    () => fitMultipleLinearRegression(students, includeCategoricalInMlr),
    [students, includeCategoricalInMlr]
  );

  const modelComparisonList = [
    {
      name: 'Simple Linear Regression',
      shortName: 'Simple Linear',
      key: 'simple',
      r2: simpleModel.metrics.r2,
      mae: simpleModel.metrics.mae,
      rmse: simpleModel.metrics.rmse,
      trainR2: simpleModel.metrics.trainR2 ?? 0,
      equation: simpleModel.equation,
      variablesCount: 1,
      color: '#6366f1',
      predictions: simpleModel.testDataPredictions,
    },
    {
      name: 'Multiple Linear Regression',
      shortName: 'Multiple Linear',
      key: 'multiple',
      r2: multipleModel.metrics.r2,
      mae: multipleModel.metrics.mae,
      rmse: multipleModel.metrics.rmse,
      trainR2: multipleModel.metrics.trainR2 ?? 0,
      equation: multipleModel.equation,
      variablesCount: Object.keys(multipleModel.metrics.coefficients).length,
      color: '#10b981',
      predictions: multipleModel.testDataPredictions,
    },
  ];

  const selectedParityModelData =
    modelComparisonList.find((m) => m.key === activeParityModel) || modelComparisonList[1];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold">
          <GitCompare className="w-3.5 h-3.5" />
          STATISTICAL MODEL BENCHMARKING
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Regression Model Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Side-by-side empirical performance evaluation comparing <strong>Simple Linear Regression</strong> and <strong>Multiple Linear Regression</strong> calculated on the hold-out test dataset partition (N = {simpleModel.metrics.nTest} test students).
        </p>
      </div>

      {/* Prominent Educational Notice (Section 18) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-950 text-xs sm:text-sm space-y-2">
        <div className="font-bold flex items-center gap-2 text-amber-900 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          Model Evaluation Principle
        </div>
        <p className="leading-relaxed text-xs sm:text-sm italic font-serif text-slate-800">
          "Model performance depends on the dataset and evaluation metric. The comparison shows how the two models perform on the current dataset."
        </p>
        <p className="leading-relaxed text-xs text-slate-600 pt-1">
          While Multiple Linear Regression typically achieves higher R² by synthesizing multiple covariates (attendance, prior exam %, sleep), Simple Linear Regression requires only study hours, offering maximum mathematical parsimony. Model suitability depends on available student information and the intended academic context.
        </p>
      </div>

      {/* Model Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="text-xs font-semibold text-slate-700">
          Comparing Two Methodologies: <span className="text-indigo-600 font-bold">Simple Linear (1 variable)</span> vs <span className="text-emerald-600 font-bold">Multiple Linear (6+ variables)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">MLR Categorical Dummies:</span>
          <button
            onClick={() => setIncludeCategoricalInMlr(!includeCategoricalInMlr)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              includeCategoricalInMlr
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {includeCategoricalInMlr ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* COMPARATIVE METRICS TABLE (Requirement 5) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              Comparative Evaluation Matrix (Calculated from Actual Dataset)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated on 20% hold-out test set (Train: {simpleModel.metrics.nTrain}, Test: {simpleModel.metrics.nTest})
            </p>
          </div>
          <span className="text-xs bg-slate-200/80 px-2.5 py-1 rounded font-mono text-slate-700 font-semibold">
            All Real Dynamic Numbers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/60 text-slate-600 text-[11px] font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Regression Model</th>
                <th className="py-3.5 px-4 font-mono text-center">Test R² (Fit)</th>
                <th className="py-3.5 px-4 font-mono text-center">Test MAE (%)</th>
                <th className="py-3.5 px-4 font-mono text-center">Test RMSE (%)</th>
                <th className="py-3.5 px-4 font-mono text-center">Train R²</th>
                <th className="py-3.5 px-4 text-center">Inputs</th>
                <th className="py-3.5 px-4">Calculated Model Equation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modelComparisonList.map((m) => (
                <tr key={m.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }}></span>
                    <span>{m.name}</span>
                  </td>
                  <td className="py-4 px-4 font-mono font-extrabold text-center text-indigo-700 text-base">
                    {m.r2.toFixed(4)}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-center text-amber-700">
                    {m.mae.toFixed(2)}%
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-center text-rose-700">
                    {m.rmse.toFixed(2)}%
                  </td>
                  <td className="py-4 px-4 font-mono text-center text-slate-500">
                    {m.trainR2.toFixed(4)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono">
                      {m.variablesCount} {m.variablesCount === 1 ? 'variable' : 'variables'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-600 truncate max-w-[280px]">
                    {m.equation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <ModelMetricsBarChart models={modelComparisonList} />

      {/* Actual vs Predicted Parity Inspection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-800">
              Inspect Model Parity: Actual vs Predicted Scores
            </h3>
            <p className="text-xs text-slate-500">
              Switch between Simple Linear and Multiple Linear to examine test set errors along the 45° line of perfection
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            {modelComparisonList.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveParityModel(m.key as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeParityModel === m.key
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.shortName}
              </button>
            ))}
          </div>
        </div>

        <ActualVsPredictedPlot
          title={`${selectedParityModelData.name} — Parity Plot`}
          data={selectedParityModelData.predictions}
          modelName={selectedParityModelData.name}
          r2={selectedParityModelData.r2}
          mae={selectedParityModelData.mae}
          rmse={selectedParityModelData.rmse}
        />
      </div>

      {/* Academic Synthesis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-700">
            1. Parsimony vs Information Detail
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Simple Linear Regression requires only one variable (Study Hours Per Day). It is fast, intuitive, and explains a major portion of score variance without demanding sensitive historical or lifestyle data.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-700">
            2. Multi-Factor Covariate Power
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multiple Linear Regression accounts for prior preparation, classroom engagement, homework performance, and restorative sleep. By controlling for confounding factors, it isolates each variable's partial contribution.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-700">
            3. Evaluating R², MAE & RMSE Together
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            R² describes proportional variance explained, whereas MAE and RMSE reflect physical grade point deviations (in percentage marks). Both models should be judged in unison using test dataset metrics.
          </p>
        </div>
      </div>
    </div>
  );
};
