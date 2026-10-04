import React, { useState } from 'react';
import {
  TrendingUp,
  Layers,
  Sigma,
  Code,
  AlertCircle,
} from 'lucide-react';
import { Student } from '../types';
import {
  fitSimpleLinearRegression,
  fitMultipleLinearRegression,
} from '../services/mathRegression';
import { ScatterPlotWithFitCurve } from '../components/charts/ScatterPlotWithFitCurve';
import { ActualVsPredictedPlot } from '../components/charts/ActualVsPredictedPlot';

interface Props {
  students: Student[];
  onPredictWithModel?: (modelKey: string) => void;
}

export const RegressionMethodsPage: React.FC<Props> = ({ students }) => {
  const [activeTab, setActiveTab] = useState<'simple' | 'multiple' | 'categorical'>('simple');
  const [includeCategoricalInMlr, setIncludeCategoricalInMlr] = useState<boolean>(true);

  // Compute live models on current dataset
  const simpleModel = fitSimpleLinearRegression(students);
  const multipleModel = fitMultipleLinearRegression(students, includeCategoricalInMlr);

  // Scatter points
  const studyScatterPoints = students.slice(0, 80).map((s) => ({
    x: s.study_hours_per_day,
    y: s.current_exam_percentage,
    label: s.student_name,
    subLabel: `Category: ${s.performance_category}`,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sigma className="w-3.5 h-3.5" />
          MATHEMATICAL THEORY & IMPLEMENTATION
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Regression Modeling Methods
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Comprehensive college-level statistical reference demonstrating the mathematical formulations, derivations, real dataset fits, and empirical evaluations for Simple Linear Regression and Multiple Linear Regression.
        </p>
      </div>

      {/* Method Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-2xl max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab('simple')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'simple'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Simple Linear Regression</span>
        </button>

        <button
          onClick={() => setActiveTab('multiple')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'multiple'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Multiple Linear Regression</span>
        </button>

        <button
          onClick={() => setActiveTab('categorical')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'categorical'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Categorical Encoding</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. SIMPLE LINEAR REGRESSION */}
      {/* ============================================================== */}
      {activeTab === 'simple' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600 font-mono">Topic 1</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Simple Linear Regression (SLR)
                </h2>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Study Hours → Exam Score</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl font-mono font-bold text-indigo-900 text-sm">
                Y = b₀ + b₁X
              </div>
            </div>

            {/* Live calculated Equation & Metrics on current dataset */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="col-span-2 sm:col-span-3 md:col-span-6 bg-slate-900 text-white p-4 rounded-xl font-mono text-xs sm:text-sm">
                <span className="text-slate-400 block text-[11px] mb-1">Dynamically Calculated Model Equation (from {students.length} students):</span>
                <span className="text-emerald-400 font-bold text-sm sm:text-base">{simpleModel.equation}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[11px] font-semibold text-slate-500">Mean Study X̄</div>
                <div className="text-lg font-bold text-slate-800 font-mono">
                  {students.length > 0 ? (students.reduce((a, b) => a + b.study_hours_per_day, 0) / students.length).toFixed(2) : 0}h
                </div>
                <div className="text-[10px] text-slate-400">Mean X</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[11px] font-semibold text-slate-500">Mean Score Ȳ</div>
                <div className="text-lg font-bold text-slate-800 font-mono">
                  {students.length > 0 ? (students.reduce((a, b) => a + b.current_exam_percentage, 0) / students.length).toFixed(2) : 0}%
                </div>
                <div className="text-[10px] text-slate-400">Mean Y</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[11px] font-semibold text-slate-500">Slope (b₁)</div>
                <div className="text-lg font-bold text-indigo-600 font-mono">+{simpleModel.metrics.coefficients['slope']}</div>
                <div className="text-[10px] text-slate-400">Rate of change</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[11px] font-semibold text-slate-500">Intercept (b₀)</div>
                <div className="text-lg font-bold text-indigo-600 font-mono">{simpleModel.metrics.intercept}</div>
                <div className="text-[10px] text-slate-400">Baseline at X=0</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[11px] font-semibold text-slate-500">R² Fit</div>
                <div className="text-lg font-bold text-emerald-600 font-mono">{simpleModel.metrics.r2.toFixed(4)}</div>
                <div className="text-[10px] text-slate-400">Variance Explained</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[11px] font-semibold text-slate-500">RMSE Error</div>
                <div className="text-lg font-bold text-rose-600 font-mono">{simpleModel.metrics.rmse.toFixed(2)}%</div>
                <div className="text-[10px] text-slate-400">Root Mean Sq Error</div>
              </div>
            </div>

            {/* Live Chart */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Empirical Scatter Plot with Fitted Regression Line
              </h3>
              <ScatterPlotWithFitCurve
                title="Simple Linear Fit: Study Hours vs Exam Percentage"
                xLabel="Study Hours Per Day (X)"
                yLabel="Exam Percentage (Y)"
                points={studyScatterPoints}
                curvePoints={simpleModel.predictCurvePoints(0, 13, 60)}
                curveLabel="OLS Linear Fit (Y = b₀ + b₁X)"
                minX={0}
                maxX={13}
                minY={35}
                maxY={102}
              />
            </div>

            {/* In-depth Academic Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs sm:text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-indigo-700">
                    1. Mathematical Definition
                  </h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Simple Linear Regression models the relationship between a single explanatory variable <em>X</em> (Study Hours Per Day) and a continuous target variable <em>Y</em> (Current Exam Score) by fitting a straight line using the Ordinary Least Squares (OLS) criterion.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-indigo-700">
                    2. Formula & Coefficient Derivation
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 my-1 space-y-1">
                    <div>b₁ = ∑(Xᵢ - X̄)(Yᵢ - Ȳ) / ∑(Xᵢ - X̄)²</div>
                    <div>b₀ = Ȳ - b₁·X̄</div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    The coefficients minimize the Residual Sum of Squares: <em>RSS = ∑ (Yᵢ - (b₀ + b₁Xᵢ))²</em>.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-indigo-700">
                    3. Meaning of Variables
                  </h4>
                  <ul className="list-disc list-inside text-slate-600 text-xs space-y-1 mt-1">
                    <li><strong>X (Independent Variable):</strong> Average daily study duration in hours.</li>
                    <li><strong>Y (Dependent Variable):</strong> Examination percentage (0–100%).</li>
                    <li><strong>b₀ (Intercept):</strong> Baseline expected score when study hours equal zero.</li>
                    <li><strong>b₁ (Slope):</strong> Marginal change in examination score per additional hour studied.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-indigo-700">
                    4. Evaluation Metrics Interpretation
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    <strong>R² ({simpleModel.metrics.r2.toFixed(4)}):</strong> {Math.round(simpleModel.metrics.r2 * 100)}% of the score variation is explained by daily study hours alone.
                    <br />
                    <strong>MAE ({simpleModel.metrics.mae.toFixed(2)}%):</strong> The model's predictions deviate by an average of {simpleModel.metrics.mae.toFixed(2)} marks on unseen test data.
                    <br />
                    <strong>RMSE ({simpleModel.metrics.rmse.toFixed(2)}%):</strong> Root mean squared error penalizing larger estimation deviations.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-indigo-700">
                    5. Academic Application & Limitations
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Simple Linear Regression is highly interpretable and requires only one student input. However, it assumes that exam performance depends exclusively on daily study time, omitting prior academic preparation, attendance, and sleep duration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MULTIPLE LINEAR REGRESSION */}
      {/* ============================================================== */}
      {activeTab === 'multiple' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-600 font-mono">Topic 2</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Multiple Linear Regression (MLR)
                </h2>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Multiple Student Factors → Exam Score</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-mono font-bold text-emerald-900 text-sm">
                Y = b₀ + ∑ bᵢXᵢ
              </div>
            </div>

            {/* Categorical Toggle */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-emerald-950">
                  Categorical Performance Encoding: {includeCategoricalInMlr ? 'Enabled (10 Features)' : 'Disabled (6 Continuous Features)'}
                </div>
                <div className="text-[11px] text-emerald-800">
                  One-Hot dummy variables for Student Self-Assessment Category alongside continuous variables.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIncludeCategoricalInMlr(!includeCategoricalInMlr)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {includeCategoricalInMlr ? 'Disable Categorical Dummies' : 'Enable Categorical Dummies'}
              </button>
            </div>

            {/* Live Model Coefficients & Metrics */}
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs sm:text-sm">
                <span className="text-slate-400 block text-[11px] mb-1">Empirically Calibrated Equation:</span>
                <div className="text-emerald-400 font-bold overflow-x-auto whitespace-nowrap py-1">
                  {multipleModel.equation}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-semibold">Test R² Score</div>
                  <div className="text-lg font-bold text-emerald-700 font-mono">{multipleModel.metrics.r2.toFixed(4)}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-semibold">Test MAE</div>
                  <div className="text-lg font-bold text-amber-700 font-mono">{multipleModel.metrics.mae.toFixed(2)}%</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-semibold">Test RMSE</div>
                  <div className="text-lg font-bold text-rose-700 font-mono">{multipleModel.metrics.rmse.toFixed(2)}%</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-semibold">Features Used</div>
                  <div className="text-lg font-bold text-slate-800 font-mono">
                    {Object.keys(multipleModel.metrics.coefficients).length}
                  </div>
                </div>
              </div>

              {/* Coefficients Breakdown Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-700">
                  Calibrated Regression Feature Coefficients
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[10px] text-slate-500 uppercase bg-slate-50/50">
                      <tr>
                        <th className="py-2 px-3">Variable</th>
                        <th className="py-2 px-3">Coefficient (b)</th>
                        <th className="py-2 px-3">Statistical Meaning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-800">Intercept (b₀)</td>
                        <td className="py-2 px-3 font-mono font-bold text-indigo-600">{multipleModel.metrics.intercept.toFixed(4)}</td>
                        <td className="py-2 px-3 text-slate-500">Base level constant</td>
                      </tr>
                      {Object.entries(multipleModel.metrics.coefficients).map(([feat, val]) => (
                        <tr key={feat} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-medium text-slate-700 font-mono">{feat}</td>
                          <td className={`py-2 px-3 font-mono font-bold ${val >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {val >= 0 ? `+${val.toFixed(4)}` : val.toFixed(4)}
                          </td>
                          <td className="py-2 px-3 text-slate-500">
                            {feat.includes('study') && 'Score change per additional daily study hour (holding other vars constant)'}
                            {feat.includes('previous') && 'Score change per 1% higher prior exam mark'}
                            {feat.includes('attendance') && 'Score change per 1% higher class attendance'}
                            {feat.includes('assignment') && 'Score change per point scored on homework assignments'}
                            {feat.includes('self_study') && 'Score change per self-study hour'}
                            {feat.includes('sleep') && 'Score change per average sleep hour'}
                            {feat.includes('cat_') && 'Relative differential premium compared to Poor baseline'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Parity Plot */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Actual vs Predicted Examination Parity Plot (Test Set)
              </h3>
              <ActualVsPredictedPlot
                title="Multiple Linear Regression — Actual vs Predicted"
                data={multipleModel.testDataPredictions}
                modelName="Multiple Linear Regression"
                r2={multipleModel.metrics.r2}
                mae={multipleModel.metrics.mae}
                rmse={multipleModel.metrics.rmse}
              />
            </div>

            {/* Deep Math Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs sm:text-sm">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-emerald-700">
                  Normal Equations & Matrix Formulation
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  In matrix notation, the multi-variable model is represented as:
                  <br />
                  <strong className="font-mono text-slate-800">Y = Xβ + ε</strong>
                  <br />
                  where <strong>X</strong> is the (n × p) design matrix with a column of ones for intercept. The vector of parameter estimates β is solved analytically via:
                  <br />
                  <span className="font-mono text-xs bg-slate-100 p-2 rounded block my-1 text-slate-800">
                    β = (XᵀX)⁻¹ XᵀY
                  </span>
                  Gaussian elimination with partial pivoting solves this linear system reliably.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-emerald-700">
                  Advantages in Academic Modeling
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  A student's score is influenced by multiple learning and behavioral dimensions. Multiple Linear Regression integrates prior exam knowledge (X₂), lecture attendance (X₃), assignment mastery (X₄), self-study (X₅), and restorative sleep (X₆) into one unified estimation equation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. CATEGORICAL DATA HANDLING */}
      {/* ============================================================== */}
      {activeTab === 'categorical' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-blue-600 font-mono">Special Statistical Methodology</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Performance Category Handling & One-Hot Encoding
                </h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl font-mono font-bold text-blue-900 text-sm">
                Categorical Feature Representation
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-950 text-xs sm:text-sm space-y-2">
                <div className="font-bold flex items-center gap-2 text-amber-900 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Why Arbitrary Integer Encoding is Statistically Invalid
                </div>
                <p className="leading-relaxed text-xs">
                  A common error in naive regression models is mapping categorical labels to arbitrary integers:
                  <br />
                  <span className="font-mono text-rose-700 bg-white/70 px-2 py-0.5 rounded border border-rose-200 inline-block my-1">
                    Poor = 1, Average = 2, Good = 3, Excellent = 4, Top Performer = 5
                  </span>
                  <br />
                  This forces two false mathematical assumptions:
                  <br />
                  1. <strong>Equal Spacing:</strong> It asserts that the difference between "Poor" and "Average" exactly equals the difference between "Good" and "Excellent".
                  <br />
                  2. <strong>False Ratio:</strong> It implies an "Excellent" student is numerically 4x a "Poor" student.
                </p>
              </div>

              {/* The One-Hot dummy encoding solution */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-900">
                  The Rigorous Solution: One-Hot Dummy Variable Encoding
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To preserve statistical rigor, we use <strong>dummy variable encoding</strong>. For <em>K = 5</em> categories, we designate <strong>"Poor"</strong> as the base reference category and create <em>K - 1 = 4</em> binary indicator columns:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left bg-white border border-slate-200 rounded-xl">
                    <thead className="bg-slate-100/70 text-slate-700 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Performance Category</th>
                        <th className="py-2.5 px-3 font-mono">D_Average</th>
                        <th className="py-2.5 px-3 font-mono">D_Good</th>
                        <th className="py-2.5 px-3 font-mono">D_Excellent</th>
                        <th className="py-2.5 px-3 font-mono">D_TopPerformer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr className="bg-slate-50/50">
                        <td className="py-2.5 px-3 font-sans font-bold text-rose-700">Poor (Base)</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-medium text-amber-700">Average</td>
                        <td className="py-2.5 px-3 text-indigo-600 font-bold">1</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-medium text-blue-700">Good</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-indigo-600 font-bold">1</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-medium text-purple-700">Excellent</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-indigo-600 font-bold">1</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans font-medium text-emerald-700">Top Performer</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-indigo-600 font-bold">1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-xs text-slate-600 pt-2 space-y-1">
                  <div className="font-semibold text-slate-800">Mathematical Interpretation of Coefficients:</div>
                  <p>
                    Each dummy coefficient represents the expected score difference between that specific performance tier and the baseline category ("Poor"), keeping all continuous variables (study hours, previous percentage, attendance, sleep) held constant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
