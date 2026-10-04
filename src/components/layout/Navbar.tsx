import React, { useState } from 'react';
import {
  GraduationCap,
  Calculator,
  BookOpen,
  BarChart3,
  GitCompare,
  Users,
  History,
  Info,
  Menu,
  X,
  Sigma,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'predict'
  | 'methods'
  | 'data-analysis'
  | 'model-comparison'
  | 'students'
  | 'history'
  | 'about';

interface Props {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  predictionCount: number;
  studentCount: number;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  predictionCount,
  studentCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'predict', label: 'Predict Score', icon: <Calculator className="w-4 h-4" /> },
    { id: 'methods', label: 'Regression Methods', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'data-analysis', label: 'Data Analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'model-comparison', label: 'Model Comparison', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" />, badge: studentCount },
    { id: 'history', label: 'Prediction History', icon: <History className="w-4 h-4" />, badge: predictionCount },
    { id: 'about', label: 'About Project', icon: <Info className="w-4 h-4" /> },
  ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Academic Sub-header bar */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-1 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-[11px] text-indigo-400">
            <Sigma className="w-3.5 h-3.5" />
            MATH & STATS PROJECT
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            Interactive Regression-Based Mathematical Modeling Application
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden md:inline bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
            Dataset: <strong className="text-emerald-400 font-mono">{studentCount}</strong> Records
          </span>
          <span className="bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded text-indigo-300 font-medium">
            College Level Modeling
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <button
            onClick={() => handleSelect('home')}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sigma className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                STUDENT SCORE PREDICTION
              </div>
              <div className="text-[11px] text-slate-400 font-medium tracking-wide">
                Regression Modeling & Analysis
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelect('predict')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
            >
              <Calculator className="w-3.5 h-3.5" />
              Predict Score
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
