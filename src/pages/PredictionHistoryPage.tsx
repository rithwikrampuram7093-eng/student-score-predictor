import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  X,
  Calculator,
  Target,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { PredictionRecord } from '../types';

interface Props {
  predictions: PredictionRecord[];
  onDeletePrediction: (id: string) => void;
  onClearAll: () => void;
  onNavigateToPredict: () => void;
  onUpdateActualScore?: (id: string, actualScore: number, maxMarks?: number) => void;
}

export const PredictionHistoryPage: React.FC<Props> = ({
  predictions,
  onDeletePrediction,
  onClearAll,
  onNavigateToPredict,
  onUpdateActualScore,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<PredictionRecord | null>(null);

  // Modal to enter actual score post-exam
  const [recordingScoreFor, setRecordingScoreFor] = useState<PredictionRecord | null>(null);
  const [actualScoreValue, setActualScoreValue] = useState<string>('');

  // Filtered and sorted predictions
  const filteredPredictions = predictions
    .filter((p) => {
      const matchesSearch =
        p.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.input_values.target_exam_name && p.input_values.target_exam_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesModel =
        selectedModelFilter === 'all' || p.model_name.includes(selectedModelFilter);

      return matchesSearch && matchesModel;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const handleOpenScoreModal = (record: PredictionRecord) => {
    setRecordingScoreFor(record);
    setActualScoreValue(record.actual_score !== null && record.actual_score !== undefined ? String(record.actual_score) : '');
  };

  const handleSaveActualScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingScoreFor) return;

    const val = parseFloat(actualScoreValue);
    const maxMarks = recordingScoreFor.input_values.target_max_marks || recordingScoreFor.input_values.target_exam_max_marks || recordingScoreFor.input_values.current_exam_max_marks || 100;
    if (isNaN(val) || val < 0 || val > maxMarks) {
      alert(`Please enter a valid actual score between 0 and ${maxMarks}.`);
      return;
    }

    if (onUpdateActualScore) {
      onUpdateActualScore(recordingScoreFor.id, val, maxMarks);
    }
    setRecordingScoreFor(null);
  };

  const exportHistoryCSV = () => {
    const headers = [
      'Prediction ID',
      'Student Registration No',
      'Student Name',
      'Target Exam',
      'Model Used',
      'Predicted Target Score',
      'Actual Target Score',
      'Prediction Error (marks)',
      'Model R2',
      'Model MAE',
      'Model RMSE',
      'Past Study Hours',
      'Previous Exam %',
      'Previous Attendance %',
      'Date Time',
    ];

    const rows = filteredPredictions.map((p) => {
      const maxMarks = p.input_values.target_max_marks || p.input_values.target_exam_max_marks || 100;
      const error = p.actual_score !== undefined && p.actual_score !== null
        ? Math.abs(p.actual_score - p.predicted_score).toFixed(1)
        : 'Pending';

      return [
        p.id,
        p.student_id,
        `"${p.student_name}"`,
        `"${p.input_values.target_exam_name || p.input_values.current_exam_name || 'Target Exam'}"`,
        `"${p.model_name}"`,
        `${p.predicted_score} / ${maxMarks}`,
        p.actual_score !== null && p.actual_score !== undefined ? `${p.actual_score} / ${maxMarks}` : 'Pending',
        error,
        p.r2,
        p.mae,
        p.rmse,
        p.input_values.study_hours_per_day,
        p.input_values.previous_exam_percentage,
        p.input_values.attendance_percentage,
        `"${p.created_at}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `prediction_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            PREDICTION AUDIT LOG & POST-EXAM EVALUATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Prediction History & Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit trail of generated examination forecasts. Compare predicted scores against actual scores entered after the exam.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {predictions.length > 0 && (
            <>
              <button
                onClick={exportHistoryCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}

          <button
            onClick={onNavigateToPredict}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>New Prediction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student, registration no, exam..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-full"
            />
          </div>

          <select
            value={selectedModelFilter}
            onChange={(e) => setSelectedModelFilter(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Models</option>
            <option value="Simple Linear">Simple Linear</option>
            <option value="Multiple Linear">Multiple Linear</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Total Predictions: <strong>{filteredPredictions.length}</strong>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Prediction ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Registration No</th>
                <th className="py-3 px-4">Target Exam</th>
                <th className="py-3 px-4">Model Used</th>
                <th className="py-3 px-4 text-right">Predicted Score</th>
                <th className="py-3 px-4 text-right">Actual Score (Post-Exam)</th>
                <th className="py-3 px-4 text-center">Prediction Error</th>
                <th className="py-3 px-4 font-mono text-center">R²</th>
                <th className="py-3 px-4 font-mono text-center">MAE</th>
                <th className="py-3 px-4 font-mono text-center">RMSE</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPredictions.map((p) => {
                const targetMax = p.input_values.target_max_marks || p.input_values.target_exam_max_marks || p.input_values.current_exam_max_marks || 100;
                const hasActual = p.actual_score !== null && p.actual_score !== undefined;
                const errorVal = hasActual ? Math.abs(p.actual_score! - p.predicted_score) : null;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {p.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {p.student_name}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-indigo-600 font-bold">
                      {p.student_id}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {p.input_values.target_exam_name || p.input_values.current_exam_name || 'Target Exam'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium">
                        {p.model_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-extrabold font-mono text-indigo-600">
                        {p.predicted_score.toFixed(1)} / {targetMax}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        ({p.predicted_percentage}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {hasActual ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-sm font-extrabold text-emerald-600">
                            {p.actual_score} / {targetMax}
                          </span>
                          <button
                            onClick={() => handleOpenScoreModal(p)}
                            className="text-[10px] text-slate-400 hover:text-indigo-600 underline cursor-pointer"
                            title="Edit actual score"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenScoreModal(p)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          + Enter Score
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {hasActual ? (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            errorVal! <= 3
                              ? 'bg-emerald-100 text-emerald-800'
                              : errorVal! <= 6
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {errorVal!.toFixed(1)} marks
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Pending Exam</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-center text-slate-700 font-medium">
                      {p.r2.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 font-mono text-center text-amber-700 font-medium">
                      {p.mae?.toFixed(2) ?? '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-center text-rose-700 font-medium">
                      {p.rmse.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(p.created_at).toLocaleDateString()} {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRecord(p)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Full Prediction Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePrediction(p.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPredictions.length === 0 && (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-400 space-y-2">
                    <Clock className="w-8 h-8 mx-auto text-slate-300" />
                    <div>No prediction records found matching your filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ENTER ACTUAL TARGET EXAM SCORE (POST-EXAM EVALUATION) */}
      {recordingScoreFor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900">Enter Actual Target Exam Score</h3>
              </div>
              <button
                onClick={() => setRecordingScoreFor(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-slate-500">Student:</span>{' '}
                <strong className="text-slate-800">{recordingScoreFor.student_name}</strong> ({recordingScoreFor.student_id})
              </div>
              <div>
                <span className="text-slate-500">Target Exam:</span>{' '}
                <strong className="text-indigo-700">{recordingScoreFor.input_values.target_exam_name || 'Target Examination'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Original Predicted Score:</span>{' '}
                <strong className="font-mono text-indigo-600 text-sm">
                  {recordingScoreFor.predicted_score.toFixed(1)} / {recordingScoreFor.input_values.target_max_marks || recordingScoreFor.input_values.target_exam_max_marks || 100}
                </strong>
              </div>
            </div>

            <form onSubmit={handleSaveActualScore} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Actual Score Achieved (out of {recordingScoreFor.input_values.target_max_marks || recordingScoreFor.input_values.target_exam_max_marks || 100})
                </label>
                <input
                  type="number"
                  min="0"
                  max={recordingScoreFor.input_values.target_max_marks || recordingScoreFor.input_values.target_exam_max_marks || 100}
                  step="0.5"
                  value={actualScoreValue}
                  onChange={(e) => setActualScoreValue(e.target.value)}
                  placeholder="e.g. 82.5"
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-slate-400">
                  This actual score will be compared against the predicted score to determine empirical prediction error.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordingScoreFor(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save & Compare
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-mono text-indigo-600 font-semibold">
                  {selectedRecord.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Prediction Details & Audit
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Comparison Display */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-center">
                <div className="text-[11px] text-slate-500 font-semibold">Estimated Target Score</div>
                <div className="text-2xl font-extrabold text-indigo-700 font-mono mt-1">
                  {selectedRecord.predicted_score.toFixed(1)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {selectedRecord.predicted_percentage}%
                </div>
              </div>

              <div className="text-center border-l border-slate-200 pl-3">
                <div className="text-[11px] text-slate-500 font-semibold">Actual Score (Post-Exam)</div>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
                  {selectedRecord.actual_score !== null && selectedRecord.actual_score !== undefined
                    ? selectedRecord.actual_score
                    : 'Pending'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {selectedRecord.actual_score !== null && selectedRecord.actual_score !== undefined
                    ? `Error: ${Math.abs(selectedRecord.actual_score - selectedRecord.predicted_score).toFixed(1)} marks`
                    : 'Not yet recorded'}
                </div>
              </div>
            </div>

            {/* Candidate & Historical Inputs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Candidate Information & Prior Independent Variables
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                <div>
                  <span className="text-slate-400 font-sans">Student:</span>{' '}
                  <span className="font-semibold text-slate-800 font-sans">{selectedRecord.student_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Reg No:</span>{' '}
                  <span className="font-bold text-indigo-600">{selectedRecord.student_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Target Exam:</span>{' '}
                  <span className="font-semibold text-slate-800 font-sans">
                    {selectedRecord.input_values.target_exam_name || 'Target Examination'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Study Hours:</span>{' '}
                  <span className="font-semibold text-slate-800">{selectedRecord.input_values.study_hours_per_day}h/day</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Attendance:</span>{' '}
                  <span className="font-semibold text-slate-800">{selectedRecord.input_values.attendance_percentage}%</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Sleep:</span>{' '}
                  <span className="font-semibold text-slate-800">{selectedRecord.input_values.sleep_hours}h/day</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Prev Score:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {selectedRecord.input_values.previous_exam_score} ({selectedRecord.input_values.previous_exam_percentage}%)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Assignment:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {selectedRecord.input_values.assignment_included
                      ? `${selectedRecord.input_values.assignment_score} (Included)`
                      : 'Not Provided (Excluded)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Performance:</span>{' '}
                  <span className="font-semibold text-indigo-700">
                    {selectedRecord.input_values.performance_category}
                  </span>
                </div>
              </div>
            </div>

            {/* Model Equation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Regression Formula & Metrics
              </h4>
              <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                {selectedRecord.equation}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">R²</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedRecord.r2.toFixed(4)}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">MAE</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedRecord.mae.toFixed(2)}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">RMSE</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedRecord.rmse.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <span className="text-[11px] text-slate-400">
                Created: {new Date(selectedRecord.created_at).toLocaleString()}
              </span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
