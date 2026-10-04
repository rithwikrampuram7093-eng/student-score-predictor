import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Award,
} from 'lucide-react';
import { Student, PerformanceCategory, ExamType } from '../types';

interface Props {
  students: Student[];
  onAddStudent: (data: Omit<Student, 'id' | 'created_at'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onResetDataset: () => void;
}

export const StudentsPage: React.FC<Props> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onResetDataset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    study_hours_per_day: 5.0,
    current_exam_name: 'Mid-Term Examination',
    current_exam_score: 75,
    current_exam_max_marks: 100,
    previous_exam_name: 'Unit Test 2',
    previous_exam_score: 70,
    previous_exam_max_marks: 100,
    performance_category: 'Good' as PerformanceCategory,
    attendance_percentage: 85,
    assignment_score: 80,
    self_study_hours: 3.0,
    sleep_hours: 7.0,
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || s.performance_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    const nextRegNumber = `252U1R${1167 + students.length}`;
    setFormData({
      student_id: nextRegNumber,
      student_name: '',
      study_hours_per_day: 5.0,
      current_exam_name: 'Mid-Term Examination',
      current_exam_score: 75,
      current_exam_max_marks: 100,
      previous_exam_name: 'Unit Test 2',
      previous_exam_score: 70,
      previous_exam_max_marks: 100,
      performance_category: 'Good',
      attendance_percentage: 85,
      assignment_score: 80,
      self_study_hours: 3.0,
      sleep_hours: 7.0,
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setActiveStudent(student);
    setFormData({
      student_id: student.student_id,
      student_name: student.student_name,
      study_hours_per_day: student.study_hours_per_day,
      current_exam_name: student.current_exam_name,
      current_exam_score: student.current_exam_score,
      current_exam_max_marks: student.current_exam_max_marks,
      previous_exam_name: student.previous_exam_name,
      previous_exam_score: student.previous_exam_score,
      previous_exam_max_marks: student.previous_exam_max_marks,
      performance_category: student.performance_category,
      attendance_percentage: student.attendance_percentage,
      assignment_score: student.assignment_score,
      self_study_hours: student.self_study_hours,
      sleep_hours: student.sleep_hours,
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleOpenView = (student: Student) => {
    setActiveStudent(student);
    setIsViewModalOpen(true);
  };

  const validateForm = () => {
    if (!formData.student_name.trim()) {
      setFormError('Student name is required.');
      return false;
    }
    if (formData.study_hours_per_day < 0 || formData.study_hours_per_day > 24) {
      setFormError('Study hours must be between 0 and 24.');
      return false;
    }
    if (formData.current_exam_max_marks <= 0) {
      setFormError('Current exam max marks must be greater than 0.');
      return false;
    }
    if (formData.current_exam_score < 0 || formData.current_exam_score > formData.current_exam_max_marks) {
      setFormError('Current score must be between 0 and max marks.');
      return false;
    }
    if (formData.previous_exam_max_marks <= 0) {
      setFormError('Previous exam max marks must be greater than 0.');
      return false;
    }
    if (formData.previous_exam_score < 0 || formData.previous_exam_score > formData.previous_exam_max_marks) {
      setFormError('Previous score must be between 0 and max marks.');
      return false;
    }
    if (formData.attendance_percentage < 0 || formData.attendance_percentage > 100) {
      setFormError('Attendance must be between 0 and 100%.');
      return false;
    }
    if (formData.assignment_score < 0 || formData.assignment_score > 100) {
      setFormError('Assignment score must be between 0 and 100.');
      return false;
    }
    return true;
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const currentPct = Number(((formData.current_exam_score / formData.current_exam_max_marks) * 100).toFixed(1));
    const prevPct = Number(((formData.previous_exam_score / formData.previous_exam_max_marks) * 100).toFixed(1));

    onAddStudent({
      student_id: formData.student_id,
      student_name: formData.student_name,
      study_hours_per_day: formData.study_hours_per_day,
      current_exam_name: formData.current_exam_name,
      current_exam_score: formData.current_exam_score,
      current_exam_max_marks: formData.current_exam_max_marks,
      current_exam_percentage: currentPct,
      target_exam_name: formData.current_exam_name,
      actual_target_exam_score: formData.current_exam_score,
      actual_target_exam_max_marks: formData.current_exam_max_marks,
      actual_target_exam_percentage: currentPct,
      previous_exam_name: formData.previous_exam_name,
      previous_exam_score: formData.previous_exam_score,
      previous_exam_max_marks: formData.previous_exam_max_marks,
      previous_exam_percentage: prevPct,
      performance_category: formData.performance_category,
      attendance_percentage: formData.attendance_percentage,
      previous_attendance_percentage: formData.attendance_percentage,
      assignment_score: formData.assignment_score,
      previous_assignment_score: formData.assignment_score,
      self_study_hours: formData.self_study_hours,
      previous_self_study_hours: formData.self_study_hours,
      sleep_hours: formData.sleep_hours,
      previous_sleep_hours: formData.sleep_hours,
    });

    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent || !validateForm()) return;

    const currentPct = Number(((formData.current_exam_score / formData.current_exam_max_marks) * 100).toFixed(1));
    const prevPct = Number(((formData.previous_exam_score / formData.previous_exam_max_marks) * 100).toFixed(1));

    onUpdateStudent({
      ...activeStudent,
      student_id: formData.student_id,
      student_name: formData.student_name,
      study_hours_per_day: formData.study_hours_per_day,
      current_exam_name: formData.current_exam_name,
      current_exam_score: formData.current_exam_score,
      current_exam_max_marks: formData.current_exam_max_marks,
      current_exam_percentage: currentPct,
      target_exam_name: formData.current_exam_name,
      actual_target_exam_score: formData.current_exam_score,
      actual_target_exam_max_marks: formData.current_exam_max_marks,
      actual_target_exam_percentage: currentPct,
      previous_exam_name: formData.previous_exam_name,
      previous_exam_score: formData.previous_exam_score,
      previous_exam_max_marks: formData.previous_exam_max_marks,
      previous_exam_percentage: prevPct,
      performance_category: formData.performance_category,
      attendance_percentage: formData.attendance_percentage,
      previous_attendance_percentage: formData.attendance_percentage,
      assignment_score: formData.assignment_score,
      previous_assignment_score: formData.assignment_score,
      self_study_hours: formData.self_study_hours,
      previous_self_study_hours: formData.self_study_hours,
      sleep_hours: formData.sleep_hours,
      previous_sleep_hours: formData.sleep_hours,
    });

    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            STUDENT MANAGEMENT
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Manage Student Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Add, edit, view, and manage records in the regression calibration database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDataset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Reset dataset back to standard 47 master student records"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset to 47 Master Students</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or ID..."
              className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-full"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Poor">Poor</option>
            <option value="Average">Average</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
            <option value="Top Performer">Top Performer</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredStudents.length}</strong> of {students.length} students
        </div>
      </div>

      {/* Students Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {s.student_id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">
                    {s.student_name}
                  </h3>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
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
              </div>

              {/* Quick academic stats */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Study Hours</span>
                  <span className="font-mono font-bold text-slate-800">{s.study_hours_per_day} hrs/day</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Exam Score</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {s.current_exam_score}/{s.current_exam_max_marks} ({s.current_exam_percentage}%)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Attendance</span>
                  <span className="font-mono font-bold text-slate-800">{s.attendance_percentage}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Previous Marks</span>
                  <span className="font-mono font-bold text-slate-800">{s.previous_exam_percentage}%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenView(s)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="View Student Details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenEdit(s)}
                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit Student"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete student "${s.student_name}"?`)) {
                    onDeleteStudent(s.id);
                  }
                }}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Delete Student"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {isAddModalOpen ? 'Add New Student Record' : 'Edit Student Record'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={isAddModalOpen ? handleSubmitAdd : handleSubmitEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Study Hours / Day (0-24)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    required
                    value={formData.study_hours_per_day}
                    onChange={(e) => setFormData({ ...formData, study_hours_per_day: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Exam</label>
                  <select
                    value={formData.current_exam_name}
                    onChange={(e) => setFormData({ ...formData, current_exam_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Unit Test 1">Unit Test 1</option>
                    <option value="Unit Test 2">Unit Test 2</option>
                    <option value="Mid-Term Examination">Mid-Term Examination</option>
                    <option value="Pre-Final Examination">Pre-Final Examination</option>
                    <option value="Final Examination">Final Examination</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Score & Max</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={formData.current_exam_score}
                      onChange={(e) => setFormData({ ...formData, current_exam_score: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg font-mono text-center"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      min="1"
                      value={formData.current_exam_max_marks}
                      onChange={(e) => setFormData({ ...formData, current_exam_max_marks: parseFloat(e.target.value) || 100 })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Previous Exam Name</label>
                  <input
                    type="text"
                    value={formData.previous_exam_name}
                    onChange={(e) => setFormData({ ...formData, previous_exam_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Previous Score & Max</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={formData.previous_exam_score}
                      onChange={(e) => setFormData({ ...formData, previous_exam_score: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg font-mono text-center"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      min="1"
                      value={formData.previous_exam_max_marks}
                      onChange={(e) => setFormData({ ...formData, previous_exam_max_marks: parseFloat(e.target.value) || 100 })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg font-mono text-center"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Performance Category</label>
                  <select
                    value={formData.performance_category}
                    onChange={(e) => setFormData({ ...formData, performance_category: e.target.value as PerformanceCategory })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Poor">Poor</option>
                    <option value="Average">Average</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Top Performer">Top Performer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attendance %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendance_percentage}
                    onChange={(e) => setFormData({ ...formData, attendance_percentage: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assignment (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.assignment_score}
                    onChange={(e) => setFormData({ ...formData, assignment_score: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Self Study (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={formData.self_study_hours}
                    onChange={(e) => setFormData({ ...formData, self_study_hours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sleep Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={formData.sleep_hours}
                    onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  {isAddModalOpen ? 'Create Student Record' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && activeStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="font-mono text-xs text-slate-400">{activeStudent.student_id}</span>
                <h3 className="text-lg font-bold text-slate-900">{activeStudent.student_name}</h3>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Performance Category:</span>
                  <span className="font-bold text-indigo-700">{activeStudent.performance_category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Study Hours:</span>
                  <span className="font-mono font-bold">{activeStudent.study_hours_per_day} hours/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Exam:</span>
                  <span className="font-bold">{activeStudent.current_exam_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Score:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {activeStudent.current_exam_score} / {activeStudent.current_exam_max_marks} ({activeStudent.current_exam_percentage}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Previous Exam:</span>
                  <span>{activeStudent.previous_exam_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Previous Score:</span>
                  <span className="font-mono font-bold">
                    {activeStudent.previous_exam_score} / {activeStudent.previous_exam_max_marks} ({activeStudent.previous_exam_percentage}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Attendance</div>
                  <div className="text-base font-bold font-mono text-slate-800">{activeStudent.attendance_percentage}%</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Assignment Score</div>
                  <div className="text-base font-bold font-mono text-slate-800">{activeStudent.assignment_score} / 100</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Self-Study Duration</div>
                  <div className="text-base font-bold font-mono text-slate-800">{activeStudent.self_study_hours} hrs</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Sleep Duration</div>
                  <div className="text-base font-bold font-mono text-slate-800">{activeStudent.sleep_hours} hrs</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
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
