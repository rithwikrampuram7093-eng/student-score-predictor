import React from 'react';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  Compass,
  BookOpen,
  Sigma,
  GitBranch,
  Target,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
} from 'lucide-react';

interface Props {
  onNavigateToMethods: () => void;
  onNavigateToPredict: () => void;
}

export const AboutProjectPage: React.FC<Props> = ({
  onNavigateToMethods,
  onNavigateToPredict,
}) => {
  const objectives = [
    'Collect student academic information.',
    'Analyze student performance.',
    'Apply Simple Linear Regression.',
    'Apply Multiple Linear Regression.',
    'Estimate examination scores.',
    'Evaluate models using R², MAE and RMSE.',
    'Visualize relationships between academic variables.',
    'Compare regression models.',
  ];

  const methodologySteps = [
    { title: '1. Data Collection', desc: 'Acquisition of student academic factors (study hours, previous exam marks, attendance %, assignment score, self-study hours, sleep hours) for the 47 master students.' },
    { title: '2. Data Preprocessing', desc: 'Validation of bounds (0–24 hours, 0–100 percentages), data cleaning, sanity verification, and categorical dummy encoding.' },
    { title: '3. Descriptive Statistics', desc: 'Exploratory data analysis (EDA), means, ranges, variances, and correlation matrix evaluation across features.' },
    { title: '4. Simple Linear Regression', desc: 'Formulation and OLS calibration of single-variable linear relationship: Study Hours → Exam Score (Y = b₀ + b₁X).' },
    { title: '5. Multiple Linear Regression', desc: 'Parameter fitting via matrix normal equations (XᵀX)β = XᵀY solved with Gaussian elimination across 6 independent variables.' },
    { title: '6. Prediction', desc: 'Application of fitted coefficients to estimate examination scores for individual student candidate inputs.' },
    { title: '7. Model Evaluation', desc: 'Empirical calculation of R² (fit), MAE (average absolute error), and RMSE (penalized quadratic error) on hold-out testing data.' },
    { title: '8. Visualization', desc: 'Interactive dynamic SVG scatter plots, fitted regression lines, parity plots, histograms, and comparative bar charts.' },
  ];

  const limitations = [
    'Predictions depend on the quality of the dataset.',
    'Regression does not guarantee actual examination results.',
    'Synthetic/demo data may not represent real student behavior.',
    'Other factors can influence student performance.',
  ];

  const futureScope = [
    'Larger dataset with multi-institutional student records.',
    'Real academic records with appropriate authorization and privacy controls.',
    'Additional academic variables (syllabus complexity, LMS participation, practical lab marks).',
    'More advanced statistical models (regularized Ridge, Lasso, and ElasticNet regressions).',
    'Model retraining workflows with live continuous learning updates.',
    'Improved visualization featuring interactive 3D response surface plots.',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero / Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          MATHEMATICS & APPLIED STATISTICS PROJECT
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Student Score Prediction Using Regression Analysis
        </h1>
        <p className="text-base sm:text-lg text-indigo-600 font-medium">
          An Interactive Regression-Based Mathematical Modeling Application
        </p>
      </div>

      {/* Problem Statement Card (Section 29) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
          <Target className="w-4 h-4 text-indigo-600" />
          Problem Statement
        </div>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif italic bg-slate-50 p-4 rounded-xl border border-slate-200">
          "Students' academic performance can be influenced by several factors such as study hours, previous examination performance, attendance, assignments, self-study and sleep. This project uses regression analysis to study relationships between these variables and estimate student examination scores."
        </p>
        <p className="text-xs text-slate-500 leading-relaxed pt-1">
          In college-level educational measurement, understanding how these variables combine to influence outcomes is a central question of statistics. This project implements rigorous, transparent mathematical modeling without black-box abstractions or hard-coded shortcuts.
        </p>
      </div>

      {/* Project Objectives (8) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            Core Academic Objectives (8)
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            Section 29
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-start gap-3 text-xs text-slate-700"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                {i + 1}
              </div>
              <span className="leading-relaxed font-medium">{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Methodology Workflow */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            Mathematical Methodology Workflow
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            8 Sequential Stages
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {methodologySteps.map((step, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors"
            >
              <div className="text-xs font-bold text-indigo-700 font-mono">
                {step.title}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations & Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limitations */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Project Limitations
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {limitations.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Future Scope */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Compass className="w-4 h-4 text-emerald-600" />
            Future Scope
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {futureScope.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-indigo-900 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold">Ready to test student score estimation?</h3>
          <p className="text-xs text-indigo-200">
            Complete the 8-step guided questionnaire with candidate academic parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToPredict}
            className="px-6 py-3 bg-white text-indigo-950 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Predict Exam Score</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
