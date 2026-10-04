import React from 'react';
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  Layers,
  BookOpen,
  Users,
  Award,
  Clock,
  Sparkles,
  BarChart,
  Binary,
  GitCompare,
} from 'lucide-react';
import { Student, PredictionRecord, PerformanceCategory } from '../types';
import { ScatterPlotWithFitCurve } from '../components/charts/ScatterPlotWithFitCurve';
import { ScoreDistributionHistogram } from '../components/charts/ScoreDistributionHistogram';
import { CategoryDistributionChart } from '../components/charts/CategoryDistributionChart';

interface Props {
  students: Student[];
  predictions: PredictionRecord[];
  onNavigate: (tab: any) => void;
  onSelectModelForExplore?: (modelKey: string) => void;
}

export const HomePage: React.FC<Props> = ({
  students,
  predictions,
  onNavigate,
}) => {
  // Compute summary stats dynamically
  const totalStudents = students.length;
  const totalPredictions = predictions.length;
  const avgScore = totalStudents > 0
    ? (students.reduce((sum, s) => sum + s.current_exam_percentage, 0) / totalStudents).toFixed(1)
    : '0';
  const avgStudyHours = totalStudents > 0
    ? (students.reduce((sum, s) => sum + s.study_hours_per_day, 0) / totalStudents).toFixed(1)
    : '0';
  const avgAttendance = totalStudents > 0
    ? (students.reduce((sum, s) => sum + s.attendance_percentage, 0) / totalStudents).toFixed(1)
    : '0';

  // Count predictions per model
  const simpleLinearCount = predictions.filter(
    (p) => p.model_key === 'simple_linear' || p.model_name.includes('Simple')
  ).length;
  const multipleLinearCount = predictions.filter(
    (p) => p.model_key === 'multiple_linear' || p.model_name.includes('Multiple')
  ).length;

  // Category counts
  const categoryCounts: Record<PerformanceCategory, number> = {
    'Poor': 0,
    'Average': 0,
    'Good': 0,
    'Excellent': 0,
    'Top Performer': 0,
  };
  students.forEach((s) => {
    if (categoryCounts[s.performance_category] !== undefined) {
      categoryCounts[s.performance_category]++;
    }
  });

  const categoryChartData = [
    { category: 'Poor' as PerformanceCategory, count: categoryCounts['Poor'], color: '#ef4444' },
    { category: 'Average' as PerformanceCategory, count: categoryCounts['Average'], color: '#f59e0b' },
    { category: 'Good' as PerformanceCategory, count: categoryCounts['Good'], color: '#3b82f6' },
    { category: 'Excellent' as PerformanceCategory, count: categoryCounts['Excellent'], color: '#8b5cf6' },
    { category: 'Top Performer' as PerformanceCategory, count: categoryCounts['Top Performer'], color: '#10b981' },
  ];

  // Quick scatter data
  const scatterPoints = students.slice(0, 80).map((s) => ({
    x: s.study_hours_per_day,
    y: s.current_exam_percentage,
    label: s.student_name,
    subLabel: `Category: ${s.performance_category}`,
  }));

  const prevScorePoints = students.slice(0, 80).map((s) => ({
    x: s.previous_exam_percentage,
    y: s.current_exam_percentage,
    label: s.student_name,
    subLabel: `Prev Exam: ${s.previous_exam_name}`,
  }));

  return (
    <div className="space-y-12 pb-16">
      {/* Academic Disclaimer & Dataset Tag */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded font-mono text-[11px]">
            ACADEMIC ESTIMATION NOTICE
          </span>
          <span>
            Predictions generated are <strong>statistical estimates</strong> derived from regression analysis. Results are not guaranteed examination outcomes.
          </span>
        </div>
        <div className="flex items-center gap-2 text-amber-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span>Current Active Dataset: <strong>Demo / Synthetic Dataset ({totalStudents} records)</strong></span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-indigo-900/50 relative overflow-hidden">
          {/* Subtle mathematical grid backdrop */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              COLLEGE MATHEMATICS & APPLIED STATISTICS PROJECT
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Student Score Prediction System
              </h1>
              <p className="text-lg sm:text-xl text-indigo-200 font-medium">
                An Interactive Regression-Based Mathematical Modeling Application
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A regression-based mathematical application that analyzes student academic data and estimates exam scores using Simple Linear Regression and Multiple Linear Regression.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('predict')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer group"
              >
                <Calculator className="w-4 h-4 text-slate-950" />
                <span>Predict My Score</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('methods')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Explore Regression Methods</span>
              </button>

              <button
                onClick={() => onNavigate('data-analysis')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <BarChart className="w-4 h-4 text-sky-400" />
                <span>Dataset & Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Key Metrics (Requirement 8) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Students</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">{totalStudents}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Synthetic Records</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Predictions</span>
              <Binary className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">{totalPredictions}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Prediction History</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Average Score</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">{avgScore}%</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Exam Target Mean</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Avg Study</span>
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">{avgStudyHours}h</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Daily Study Mean</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Avg Attendance</span>
              <BarChart className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">{avgAttendance}%</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Class Attendance</p>
            </div>
          </div>

          <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-700 text-xs font-medium">
              <span>Simple Linear</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-indigo-950 font-mono">{simpleLinearCount}</div>
              <p className="text-[10px] text-indigo-600 mt-0.5">Predictions Run</p>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/90 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-medium">
              <span>Multiple Linear</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-emerald-950 font-mono">{multipleLinearCount}</div>
              <p className="text-[10px] text-emerald-600 mt-0.5">Predictions Run</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Application Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Mathematical Modeling Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Student Data → Data Analysis → Regression Model → Estimated Score → Performance Analysis
            </p>
          </div>

          {/* Workflow steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center flex flex-col items-center justify-center space-y-2 relative group hover:border-indigo-400 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="font-bold text-sm text-slate-800">Student Data</div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Study hours, past exam marks, attendance %, assignment score, self-study & sleep
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center flex flex-col items-center justify-center space-y-2 relative group hover:border-indigo-400 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="font-bold text-sm text-slate-800">Data Analysis</div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Train/Test splitting (80/20), feature normalization, and correlation analysis
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center flex flex-col items-center justify-center space-y-2 relative group hover:border-indigo-400 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="font-bold text-sm text-slate-800">Regression Model</div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Simple Linear OLS or Multiple Linear Regression normal equations (XᵀX)β = XᵀY
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center flex flex-col items-center justify-center space-y-2 relative group hover:border-indigo-400 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div className="font-bold text-sm text-slate-800">Estimated Score</div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Model calculates Ŷ with explicit mathematical formula and dynamic metrics
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center flex flex-col items-center justify-center space-y-2 relative group hover:border-indigo-400 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div className="font-bold text-sm text-slate-800">Performance Analysis</div>
              <p className="text-[11px] text-slate-500 leading-tight">
                R², MAE, RMSE metrics, parity plots, residual checks, and comparative evaluation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Regression Methods Section (Requirement 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              The Two Mathematical Regression Techniques
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Formulated, calibrated, and evaluated directly on our student examination dataset
            </p>
          </div>
          <button
            onClick={() => onNavigate('methods')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Read Complete Educational Reference</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Simple Linear Regression */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Simple Linear Regression
                </h3>
                <div className="text-xs text-indigo-600 font-semibold mt-0.5">
                  Study Hours → Exam Score
                </div>
                <div className="mt-2 font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded inline-block font-semibold">
                  Y = b₀ + b₁X
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Predicts exam score using one independent variable: study hours per day.
              </p>
              <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 space-y-1 border border-slate-100">
                <div className="font-semibold text-slate-800">Example Use:</div>
                <div>Estimating student performance based solely on daily preparation hours.</div>
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigate('methods')}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Explore Method</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Multiple Linear Regression */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Multiple Linear Regression
                </h3>
                <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                  Multiple Student Factors → Exam Score
                </div>
                <div className="mt-2 font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded inline-block font-semibold">
                  Y = b₀ + b₁X₁ + b₂X₂ + b₃X₃ + b₄X₄ + b₅X₅ + b₆X₆
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Predicts exam score using multiple academic and lifestyle variables.
              </p>
              <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 space-y-1 border border-slate-100">
                <div className="font-semibold text-slate-800">Example Use:</div>
                <div>Comprehensive prediction integrating academic history, attendance, homework, and lifestyle habits.</div>
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigate('methods')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Explore Method</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Visualizations Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Dataset Relationships & Distributions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Interactive plots generated directly from current student records
            </p>
          </div>
          <button
            onClick={() => onNavigate('data-analysis')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All 6 Analytics Charts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScatterPlotWithFitCurve
            title="Study Hours vs Current Exam Score"
            xLabel="Study Hours Per Day"
            yLabel="Current Exam Score (%)"
            points={scatterPoints}
            minX={0}
            maxX={13}
            minY={40}
            maxY={100}
          />

          <ScatterPlotWithFitCurve
            title="Previous Exam Percentage vs Current Exam Score"
            xLabel="Previous Exam Score (%)"
            yLabel="Current Exam Score (%)"
            points={prevScorePoints}
            minX={40}
            maxX={100}
            minY={40}
            maxY={100}
          />

          <ScoreDistributionHistogram
            scores={students.map((s) => s.current_exam_percentage)}
            title="Exam Score Frequency Histogram"
            binSize={10}
          />

          <CategoryDistributionChart
            data={categoryChartData}
            total={totalStudents}
          />
        </div>
      </section>

      {/* Recent Predictions Section */}
      {predictions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Recent Prediction Estimations
              </h3>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Full History ({predictions.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Model Used</th>
                    <th className="py-2.5 px-3">Study Hours</th>
                    <th className="py-2.5 px-3">Estimated Score</th>
                    <th className="py-2.5 px-3">Model R²</th>
                    <th className="py-2.5 px-3">Model RMSE</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {predictions.slice(0, 5).map((pred) => (
                    <tr key={pred.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {pred.student_name}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                          {pred.model_name}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {pred.input_values.study_hours_per_day} hrs
                      </td>
                      <td className="py-3 px-3 font-bold font-mono text-emerald-600 text-sm">
                        {pred.predicted_score.toFixed(1)} / 100
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {pred.r2.toFixed(4)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {pred.rmse.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(pred.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Prominent Footer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-8 max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            Ready to Estimate an Examination Score?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Take the guided step-by-step academic questionnaire, choose between Simple Linear and Multiple Linear Regression, and generate an interactive statistical estimation with full mathematical transparency.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('predict')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Launch Predict Score Questionnaire</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
