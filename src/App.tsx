/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { PredictScorePage } from './pages/PredictScorePage';
import { RegressionMethodsPage } from './pages/RegressionMethodsPage';
import { DataAnalysisPage } from './pages/DataAnalysisPage';
import { ModelComparisonPage } from './pages/ModelComparisonPage';
import { StudentsPage } from './pages/StudentsPage';
import { PredictionHistoryPage } from './pages/PredictionHistoryPage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { Student, PredictionRecord } from './types';
import { StorageService } from './services/storageService';
import { Sigma, GraduationCap, Github, BookOpen } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [students, setStudents] = useState<Student[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);

  // Load initial data from localStorage (or initialize with 100 synthetic students)
  useEffect(() => {
    const loadedStudents = StorageService.getStudents();
    const loadedPredictions = StorageService.getPredictions();
    setStudents(loadedStudents);
    setPredictions(loadedPredictions);
  }, []);

  // Student CRUD handlers
  const handleAddStudent = (data: Omit<Student, 'id' | 'created_at'>) => {
    const newStudent = StorageService.addStudent(data);
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updated: Student) => {
    StorageService.updateStudent(updated);
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteStudent = (id: string) => {
    StorageService.deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetDataset = () => {
    const resetList = StorageService.resetToSynthetic();
    setStudents([...resetList]);
  };

  // Prediction handlers
  const handleSavePrediction = (data: Omit<PredictionRecord, 'id' | 'created_at'>) => {
    const saved = StorageService.savePrediction(data);
    setPredictions((prev) => [saved, ...prev]);
  };

  const handleDeletePrediction = (id: string) => {
    StorageService.deletePrediction(id);
    setPredictions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAllPredictions = () => {
    StorageService.clearAllPredictions();
    setPredictions([]);
  };

  const handleNavigate = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        predictionCount={predictions.length}
        studentCount={students.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            students={students}
            predictions={predictions}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'predict' && (
          <PredictScorePage
            students={students}
            onSavePrediction={handleSavePrediction}
            onNavigateToHistory={() => handleNavigate('history')}
            onNavigateToComparison={() => handleNavigate('model-comparison')}
          />
        )}

        {currentTab === 'methods' && (
          <RegressionMethodsPage
            students={students}
            onPredictWithModel={(modelKey) => handleNavigate('predict')}
          />
        )}

        {currentTab === 'data-analysis' && (
          <DataAnalysisPage students={students} />
        )}

        {currentTab === 'model-comparison' && (
          <ModelComparisonPage students={students} />
        )}

        {currentTab === 'students' && (
          <StudentsPage
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onResetDataset={handleResetDataset}
          />
        )}

        {currentTab === 'history' && (
          <PredictionHistoryPage
            predictions={predictions}
            onDeletePrediction={handleDeletePrediction}
            onClearAll={handleClearAllPredictions}
            onNavigateToPredict={() => handleNavigate('predict')}
          />
        )}

        {currentTab === 'about' && (
          <AboutProjectPage
            onNavigateToMethods={() => handleNavigate('methods')}
            onNavigateToPredict={() => handleNavigate('predict')}
          />
        )}
      </main>

      {/* Academic Project Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Academic Statement */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-extrabold text-base tracking-tight">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Sigma className="w-4 h-4" />
                </div>
                <span>STUDENT SCORE PREDICTION SYSTEM</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                An interactive regression-based mathematical modeling application designed for college-level statistics and applied mathematics research. Demonstrating Simple Linear and Multiple Linear regression techniques.
              </p>
              <div className="text-[11px] text-slate-500 font-mono">
                Model: OLS & Matrix Normal Equations (XᵀX)β = XᵀY
              </div>
            </div>

            {/* Col 2: Two Topics */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Mathematical Topics
              </div>
              <ul className="space-y-1 text-slate-400">
                <li
                  onClick={() => handleNavigate('methods')}
                  className="hover:text-indigo-400 cursor-pointer"
                >
                  1. Simple Linear Regression
                </li>
                <li
                  onClick={() => handleNavigate('methods')}
                  className="hover:text-indigo-400 cursor-pointer"
                >
                  2. Multiple Linear Regression
                </li>
              </ul>
            </div>

            {/* Col 3: Navigation */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                System Sections
              </div>
              <ul className="space-y-1 text-slate-400">
                <li
                  onClick={() => handleNavigate('predict')}
                  className="hover:text-indigo-400 cursor-pointer"
                >
                  Predict Exam Score
                </li>
                <li
                  onClick={() => handleNavigate('data-analysis')}
                  className="hover:text-indigo-400 cursor-pointer"
                >
                  Dataset & Exploratory Analysis
                </li>
                <li
                  onClick={() => handleNavigate('model-comparison')}
                  className="hover:text-indigo-400 cursor-pointer"
                >
                  Model Comparison Matrix
                </li>
                <li
                  onClick={() => handleNavigate('about')}
                  className="hover:text-indigo-400 cursor-pointer"
                >
                  Project Documentation
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar & Disclaimer */}
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-4">
            <div>
              © 2024 College Mathematics & Statistics Research Project. All regression calculations computed dynamically.
            </div>
            <div className="text-amber-400/90 font-medium">
              Academic Disclaimer: Score estimates are statistical projections, not guaranteed outcomes.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
