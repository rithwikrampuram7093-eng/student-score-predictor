import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
  Download,
  Database,
  Users,
} from 'lucide-react';
import { Student, PerformanceCategory } from '../types';
import { ScatterPlotWithFitCurve } from '../components/charts/ScatterPlotWithFitCurve';
import { ScoreDistributionHistogram } from '../components/charts/ScoreDistributionHistogram';
import { CategoryDistributionChart } from '../components/charts/CategoryDistributionChart';

interface Props {
  students: Student[];
}

export const DataAnalysisPage: React.FC<Props> = ({ students }) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');

  // Sorting
  const [sortField, setSortField] = useState<keyof Student>('current_exam_percentage');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Calculate Summary Statistics dynamically
  const summaryStats = useMemo(() => {
    const total = students.length;
    if (total === 0) {
      return {
        total: 0,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        avgStudyHours: 0,
        avgAttendance: 0,
        avgAssignment: 0,
        avgPrevious: 0,
      };
    }

    const scores = students.map((s) => s.current_exam_percentage);
    const studyHours = students.map((s) => s.study_hours_per_day);
    const attendances = students.map((s) => s.attendance_percentage);
    const assignments = students.map((s) => s.assignment_score);
    const prevScores = students.map((s) => s.previous_exam_percentage);

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

    return {
      total,
      avgScore: Number((sum(scores) / total).toFixed(1)),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      avgStudyHours: Number((sum(studyHours) / total).toFixed(1)),
      avgAttendance: Number((sum(attendances) / total).toFixed(1)),
      avgAssignment: Number((sum(assignments) / total).toFixed(1)),
      avgPrevious: Number((sum(prevScores) / total).toFixed(1)),
    };
  }, [students]);

  // Filtered & Sorted Student List
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.current_exam_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategoryFilter === 'all' || s.performance_category === selectedCategoryFilter;

        const matchesExam =
          selectedExamFilter === 'all' || s.current_exam_name === selectedExamFilter;

        return matchesSearch && matchesCategory && matchesExam;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (valA === undefined && valB === undefined) return 0;
        if (valA === undefined) return sortAsc ? 1 : -1;
        if (valB === undefined) return sortAsc ? -1 : 1;

        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [students, searchTerm, selectedCategoryFilter, selectedExamFilter, sortField, sortAsc]);

  // Paginated records
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Performance category breakdown data
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

  // Distinct exam list for filter dropdown
  const uniqueExams = Array.from(new Set(students.map((s) => s.current_exam_name)));

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'Student ID',
      'Name',
      'Study Hours',
      'Current Exam',
      'Current Score',
      'Max Marks',
      'Percentage',
      'Previous Exam',
      'Previous Score',
      'Previous Max',
      'Previous Pct',
      'Performance Category',
      'Attendance %',
      'Assignment Score',
      'Self Study Hours',
      'Sleep Hours',
    ];

    const rows = filteredStudents.map((s) => [
      s.student_id,
      `"${s.student_name}"`,
      s.study_hours_per_day,
      `"${s.current_exam_name}"`,
      s.current_exam_score,
      s.current_exam_max_marks,
      s.current_exam_percentage,
      `"${s.previous_exam_name}"`,
      s.previous_exam_score,
      s.previous_exam_max_marks,
      s.previous_exam_percentage,
      s.performance_category,
      s.attendance_percentage,
      s.assignment_score,
      s.self_study_hours,
      s.sleep_hours,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            SYNTHETIC DEMONSTRATION DATASET
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Dataset & Statistical Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Exploratory data analysis (EDA) of academic features, distributions, correlations, and records.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Dataset (CSV)</span>
        </button>
      </div>

      {/* SUMMARY STATISTICS CARDS (Section 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] text-slate-500 font-medium truncate">Total Students</div>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-1">{summaryStats.total}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] text-slate-500 font-medium truncate">Avg Exam Score</div>
          <div className="text-lg font-extrabold text-indigo-600 font-mono mt-1">{summaryStats.avgScore}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] text-slate-500 font-medium truncate">Highest Score</div>
          <div className="text-lg font-extrabold text-emerald-600 font-mono mt-1">{summaryStats.highestScore}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] text-slate-500 font-medium truncate">Lowest Score</div>
          <div className="text-lg font-extrabold text-rose-600 font-mono mt-1">{summaryStats.lowestScore}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] text-slate-500 font-medium truncate">Avg Study Hours</div>
          <div className="text-lg font-extrabold text-sky-600 font-mono mt-1">{summaryStats.avgStudyHours}h</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] text-slate-500 font-medium truncate">Avg Attendance</div>
          <div className="text-lg font-extrabold text-purple-600 font-mono mt-1">{summaryStats.avgAttendance}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] text-slate-500 font-medium truncate">Avg Assignment</div>
          <div className="text-lg font-extrabold text-amber-600 font-mono mt-1">{summaryStats.avgAssignment}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] text-slate-500 font-medium truncate">Avg Previous Score</div>
          <div className="text-lg font-extrabold text-indigo-900 font-mono mt-1">{summaryStats.avgPrevious}%</div>
        </div>
      </div>

      {/* SIX INTERACTIVE CHARTS (Section 11) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          The 6 Visual Exploratory Analytics Charts
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Study Hours vs Exam Score */}
          <ScatterPlotWithFitCurve
            title="1. Study Hours Per Day vs Current Exam Score"
            xLabel="Study Hours Per Day"
            yLabel="Exam Percentage (%)"
            points={students.map((s) => ({
              x: s.study_hours_per_day,
              y: s.current_exam_percentage,
              label: s.student_name,
              subLabel: `Category: ${s.performance_category}`,
            }))}
            minX={0}
            maxX={13}
            minY={35}
            maxY={102}
          />

          {/* Chart 2: Previous Score vs Current Score */}
          <ScatterPlotWithFitCurve
            title="2. Previous Exam Score vs Current Exam Score"
            xLabel="Previous Exam Percentage (%)"
            yLabel="Current Exam Score (%)"
            points={students.map((s) => ({
              x: s.previous_exam_percentage,
              y: s.current_exam_percentage,
              label: s.student_name,
              subLabel: `Prev Exam: ${s.previous_exam_name}`,
            }))}
            minX={40}
            maxX={100}
            minY={35}
            maxY={102}
          />

          {/* Chart 3: Attendance vs Exam Score */}
          <ScatterPlotWithFitCurve
            title="3. Attendance Percentage vs Current Exam Score"
            xLabel="Attendance Percentage (%)"
            yLabel="Current Exam Score (%)"
            points={students.map((s) => ({
              x: s.attendance_percentage,
              y: s.current_exam_percentage,
              label: s.student_name,
              subLabel: `Attendance: ${s.attendance_percentage}%`,
            }))}
            minX={50}
            maxX={100}
            minY={35}
            maxY={102}
          />

          {/* Chart 4: Assignment Score vs Exam Score */}
          <ScatterPlotWithFitCurve
            title="4. Assignment Score vs Current Exam Score"
            xLabel="Assignment Score (0-100)"
            yLabel="Current Exam Score (%)"
            points={students.map((s) => ({
              x: s.assignment_score,
              y: s.current_exam_percentage,
              label: s.student_name,
              subLabel: `Assignment: ${s.assignment_score}/100`,
            }))}
            minX={45}
            maxX={100}
            minY={35}
            maxY={102}
          />

          {/* Chart 5: Performance Category Distribution */}
          <CategoryDistributionChart
            data={categoryChartData}
            total={summaryStats.total}
          />

          {/* Chart 6: Score Distribution Histogram */}
          <ScoreDistributionHistogram
            scores={students.map((s) => s.current_exam_percentage)}
            title="6. Overall Examination Score Distribution Histogram"
            binSize={10}
          />
        </div>
      </div>

      {/* STUDENT DATASET TABLE WITH SEARCH, SORT, FILTER, PAGINATION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Student Records Database
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredStudents.length} matching students
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search name, ID, exam..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-48 sm:w-56"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => {
                setSelectedCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="Poor">Poor</option>
              <option value="Average">Average</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
              <option value="Top Performer">Top Performer</option>
            </select>

            {/* Exam Filter */}
            <select
              value={selectedExamFilter}
              onChange={(e) => {
                setSelectedExamFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Exams</option>
              {uniqueExams.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th
                  onClick={() => handleSort('student_id')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Student ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('student_name')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('study_hours_per_day')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Study Hours/Day</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Current Exam</th>
                <th
                  onClick={() => handleSort('current_exam_score')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Current Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('current_exam_percentage')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Current %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Previous Exam</th>
                <th
                  onClick={() => handleSort('previous_exam_score')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Prev Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('previous_exam_percentage')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Prev %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Performance Category</th>
                <th
                  onClick={() => handleSort('attendance_percentage')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Attendance %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('assignment_score')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Assignment</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('self_study_hours')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Self-Study (h)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sleep_hours')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sleep (h)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-indigo-600">{s.student_id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{s.student_name}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-700 text-right">
                    {s.study_hours_per_day}h
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[130px]">
                    {s.current_exam_name}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800 text-right">
                    {s.current_exam_score} / {s.current_exam_max_marks || 100}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        s.current_exam_percentage >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : s.current_exam_percentage >= 65
                          ? 'bg-blue-50 text-blue-700'
                          : s.current_exam_percentage >= 50
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {s.current_exam_percentage}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-[120px]">
                    {s.previous_exam_name}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800 text-right">
                    {s.previous_exam_score} / {s.previous_exam_max_marks || 100}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-right">
                    {s.previous_exam_percentage}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        s.performance_category === 'Top Performer'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.performance_category === 'Excellent'
                          ? 'bg-purple-100 text-purple-800'
                          : s.performance_category === 'Good'
                          ? 'bg-blue-100 text-blue-800'
                          : s.performance_category === 'Average'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.performance_category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-right">
                    {s.attendance_percentage}%
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-right">
                    {s.assignment_score}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-right">
                    {s.self_study_hours}h
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-right">
                    {s.sleep_hours}h
                  </td>
                </tr>
              ))}
              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={14} className="py-8 text-center text-slate-400">
                    No students found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="py-1 px-2 border border-slate-200 rounded bg-slate-50 text-slate-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-mono font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
