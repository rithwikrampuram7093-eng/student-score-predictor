import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Award,
  RotateCcw,
  Save,
  TrendingUp,
  Layers,
  AlertTriangle,
  Calculator,
  Target,
  CheckCircle2,
  Clock,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  Student,
  PerformanceCategory,
  ExamType,
  RegressionModelKey,
  PredictionInput,
  PredictionRecord,
} from '../types';
import {
  fitSimpleLinearRegression,
  fitMultipleLinearRegression,
} from '../services/mathRegression';
import { ScatterPlotWithFitCurve } from '../components/charts/ScatterPlotWithFitCurve';
import { ActualVsPredictedPlot } from '../components/charts/ActualVsPredictedPlot';

interface Props {
  students: Student[];
  onSavePrediction: (record: Omit<PredictionRecord, 'id' | 'created_at'>) => void;
  onNavigateToHistory: () => void;
  onNavigateToComparison: () => void;
}

const STEP_NAMES = [
  'Student Details',
  'Present Academic Information',
  'Previous Exam Details',
  'Previous Performance',
  'Past Academic Info',
  'Review & Choose Model',
];

export const PredictScorePage: React.FC<Props> = ({
  students,
  onSavePrediction,
  onNavigateToHistory,
  onNavigateToComparison,
}) => {
  // Current questionnaire step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Student details (Manually entered by the student, starts blank)
  const [studentName, setStudentName] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');

  // Step 2: Present Academic Information
  // 1. Present Study Hours (0-24, allows decimals)
  const [studyHours, setStudyHours] = useState<number>(5.0);
  const [studyHoursInput, setStudyHoursInput] = useState<string>('5.0');

  // 2. Present Attendance Percentage (0-100%)
  const [attendance, setAttendance] = useState<number>(85);
  const [attendanceInput, setAttendanceInput] = useState<string>('85');

  // 3. Present Sleep Hours (0-24, allows decimals)
  const [sleepHours, setSleepHours] = useState<number>(7.0);
  const [sleepHoursInput, setSleepHoursInput] = useState<string>('7.0');

  // 4. Target Marks (Maximum marks for target exam to predict out of, e.g. 50, 75, 100, 150)
  const [targetMaxMarks, setTargetMaxMarks] = useState<number>(100);
  const [targetMaxMarksInput, setTargetMaxMarksInput] = useState<string>('100');
  const [targetExamName, setTargetExamName] = useState<ExamType>('Final Examination');
  const [customTargetExamName, setCustomTargetExamName] = useState<string>('');

  // Step 3: Previous Exam Details (Historical input)
  const [previousExamName, setPreviousExamName] = useState<string>('Mid-Term Examination');
  const [previousScore, setPreviousScore] = useState<number>(75);
  const [previousMaxMarks, setPreviousMaxMarks] = useState<number>(100);

  // Step 4: Previous Performance category (self-selected by student)
  const [performanceCategory, setPerformanceCategory] = useState<PerformanceCategory>('Good');

  // Step 5: Past Academic Information
  // Previous Assignment Score (OPTIONAL: If empty or 0, excluded from prediction)
  const [assignmentScoreInput, setAssignmentScoreInput] = useState<string>('85');
  const [selfStudyHours, setSelfStudyHours] = useState<number>(4.0);

  // Step 6: Model selection (ONLY Simple Linear or Multiple Linear)
  const [selectedModel, setSelectedModel] = useState<RegressionModelKey>('multiple_linear');
  const [includeCategoricalInMlr, setIncludeCategoricalInMlr] = useState<boolean>(false);

  // Post-exam actual score entry (optional evaluation)
  const [actualScoreInput, setActualScoreInput] = useState<string>('');
  const [actualScoreEntered, setActualScoreEntered] = useState<number | null>(null);

  // Prediction outcome state
  const [predictionResult, setPredictionResult] = useState<{
    estimatedScore: number;
    estimatedPercentage: number;
    modelName: string;
    modelKey: RegressionModelKey;
    equation: string;
    coefficients?: Record<string, number>;
    intercept?: number;
    r2: number;
    mae: number;
    rmse: number;
    assignmentIncluded: boolean;
    curvePoints: { x: number; y: number }[];
    testPredictions: { actual: number; predicted: number; id: string }[];
  } | null>(null);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Derived assignment score & inclusion logic
  const parsedAssignment = parseFloat(assignmentScoreInput);
  const isAssignmentIncluded = !isNaN(parsedAssignment) && parsedAssignment > 0;
  const effectiveAssignmentScore = isAssignmentIncluded ? Math.min(100, Math.max(0, parsedAssignment)) : 0;

  // Percentage calculations
  const previousExamPercentage =
    previousMaxMarks > 0 ? Number(((previousScore / previousMaxMarks) * 100).toFixed(1)) : 0;
  const activeTargetExam =
    targetExamName === 'Other' ? customTargetExamName.trim() || 'Target Examination' : targetExamName;

  // Validation functions per step
  const validateStep = (step: number): boolean => {
    setValidationError(null);

    if (step === 1) {
      if (!studentName.trim()) {
        setValidationError('Please enter your student name.');
        return false;
      }
      if (!studentId.trim()) {
        setValidationError('Please enter your registration number.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      const sh = parseFloat(studyHoursInput);
      if (isNaN(sh) || sh < 0 || sh > 24) {
        setValidationError('Present daily study hours must be between 0 and 24 hours.');
        return false;
      }
      setStudyHours(sh);

      const att = parseFloat(attendanceInput);
      if (isNaN(att) || att < 0 || att > 100) {
        setValidationError('Present attendance percentage must be between 0% and 100%.');
        return false;
      }
      setAttendance(att);

      const slp = parseFloat(sleepHoursInput);
      if (isNaN(slp) || slp < 0 || slp > 24) {
        setValidationError('Present daily sleep hours must be between 0 and 24 hours.');
        return false;
      }
      setSleepHours(slp);

      const maxM = parseFloat(targetMaxMarksInput);
      if (isNaN(maxM) || maxM <= 0) {
        setValidationError('Target maximum marks must be greater than zero (e.g. 50, 75, 100, 150).');
        return false;
      }
      setTargetMaxMarks(maxM);

      if (targetExamName === 'Other' && !customTargetExamName.trim()) {
        setValidationError('Please specify your custom target examination name.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!previousExamName.trim()) {
        setValidationError('Please enter your previous exam name.');
        return false;
      }
      if (previousMaxMarks <= 0) {
        setValidationError('Previous maximum marks must be greater than zero.');
        return false;
      }
      if (previousScore < 0) {
        setValidationError('Previous score cannot be negative.');
        return false;
      }
      if (previousScore > previousMaxMarks) {
        setValidationError(
          `Previous score (${previousScore}) cannot exceed previous maximum marks (${previousMaxMarks}).`
        );
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!performanceCategory) {
        setValidationError('Please select your academic performance category.');
        return false;
      }
      return true;
    }

    if (step === 5) {
      if (assignmentScoreInput.trim() !== '') {
        const val = parseFloat(assignmentScoreInput);
        if (isNaN(val) || val < 0 || val > 100) {
          setValidationError('Assignment score must be between 0 and 100, or left blank if not provided.');
          return false;
        }
      }
      if (selfStudyHours < 0 || selfStudyHours > 24) {
        setValidationError('Self-study hours must be between 0 and 24 hours.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        runPrediction();
      }
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (stepNumber: number) => {
    setValidationError(null);
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Run dynamic prediction on dataset using Present Information & Past Performance
  const runPrediction = () => {
    setSavedSuccess(false);
    setActualScoreEntered(null);
    setActualScoreInput('');

    let estimatedPct = 70;
    let modelTitle = '';
    let eq = '';
    let r2Val = 0;
    let maeVal = 0;
    let rmseVal = 0;
    let coeffMap: Record<string, number> | undefined;
    let interceptVal: number | undefined;
    let curve: { x: number; y: number }[] = [];
    let testData: { actual: number; predicted: number; id: string }[] = [];

    if (selectedModel === 'simple_linear') {
      const model = fitSimpleLinearRegression(students);
      estimatedPct = model.predict({ study_hours: studyHours });
      modelTitle = 'Simple Linear Regression';
      eq = model.equation;
      r2Val = model.metrics.r2;
      maeVal = model.metrics.mae;
      rmseVal = model.metrics.rmse;
      coeffMap = model.metrics.coefficients;
      interceptVal = model.metrics.intercept;
      curve = model.predictCurvePoints(0, 14, 60);
      testData = model.testDataPredictions;
    } else {
      // Dynamic MLR: Include assignment variable ONLY if entered and > 0!
      const model = fitMultipleLinearRegression(students, {
        includeAssignment: isAssignmentIncluded,
        includeCategorical: includeCategoricalInMlr,
      });

      estimatedPct = model.predict({
        study_hours: studyHours,
        attendance: attendance,
        sleep: sleepHours,
        previous_pct: previousExamPercentage,
        assignment: isAssignmentIncluded ? effectiveAssignmentScore : undefined,
        self_study: selfStudyHours,
        category: performanceCategory,
      });

      modelTitle = model.name;
      eq = model.equation;
      r2Val = model.metrics.r2;
      maeVal = model.metrics.mae;
      rmseVal = model.metrics.rmse;
      coeffMap = model.metrics.coefficients;
      interceptVal = model.metrics.intercept;
      curve = model.predictCurvePoints(0, 14, 60);
      testData = model.testDataPredictions;
    }

    // Mathematical scaling: Final predicted score = (estimated percentage / 100) * target_max_marks
    const rawScaled = (estimatedPct / 100) * targetMaxMarks;
    const finalScaledScore = Math.max(0, Math.min(targetMaxMarks, Number(rawScaled.toFixed(1))));

    setPredictionResult({
      estimatedScore: finalScaledScore,
      estimatedPercentage: Number(estimatedPct.toFixed(1)),
      modelName: modelTitle,
      modelKey: selectedModel,
      equation: eq,
      coefficients: coeffMap,
      intercept: interceptVal,
      r2: r2Val,
      mae: maeVal,
      rmse: rmseVal,
      assignmentIncluded: isAssignmentIncluded,
      curvePoints: curve,
      testPredictions: testData,
    });
  };

  const handleApplyActualScore = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(actualScoreInput);
    if (isNaN(val) || val < 0 || val > targetMaxMarks) {
      alert(`Please enter a valid actual score between 0 and ${targetMaxMarks}.`);
      return;
    }
    setActualScoreEntered(val);
  };

  const handleSavePrediction = () => {
    if (!predictionResult) return;

    const inputData: PredictionInput = {
      study_hours_per_day: studyHours,
      attendance_percentage: attendance,
      sleep_hours: sleepHours,
      target_max_marks: targetMaxMarks,
      target_exam_name: activeTargetExam,
      previous_exam_name: previousExamName,
      previous_exam_score: previousScore,
      previous_exam_max_marks: previousMaxMarks,
      previous_exam_percentage: previousExamPercentage,
      performance_category: performanceCategory,
      assignment_score: isAssignmentIncluded ? effectiveAssignmentScore : null,
      assignment_included: isAssignmentIncluded,
      self_study_hours: selfStudyHours,
    };

    const error =
      actualScoreEntered !== null
        ? Number(Math.abs(actualScoreEntered - predictionResult.estimatedScore).toFixed(1))
        : null;

    onSavePrediction({
      student_id: studentId,
      student_name: studentName,
      model_name: predictionResult.modelName,
      model_key: predictionResult.modelKey,
      predicted_score: predictionResult.estimatedScore,
      predicted_percentage: predictionResult.estimatedPercentage,
      actual_score: actualScoreEntered,
      actual_percentage:
        actualScoreEntered !== null && targetMaxMarks > 0
          ? Number(((actualScoreEntered / targetMaxMarks) * 100).toFixed(1))
          : null,
      prediction_error: error,
      r2: predictionResult.r2,
      mae: predictionResult.mae,
      rmse: predictionResult.rmse,
      equation: predictionResult.equation,
      input_values: inputData,
      actual_score_entered_at: actualScoreEntered !== null ? new Date().toISOString() : undefined,
    });

    setSavedSuccess(true);
  };

  const handleResetForm = () => {
    setStudentName('');
    setStudentId('');
    setStudyHours(5.0);
    setStudyHoursInput('5.0');
    setAttendance(85);
    setAttendanceInput('85');
    setSleepHours(7.0);
    setSleepHoursInput('7.0');
    setTargetMaxMarks(100);
    setTargetMaxMarksInput('100');
    setTargetExamName('Final Examination');
    setCustomTargetExamName('');
    setPreviousExamName('Mid-Term Examination');
    setPreviousScore(75);
    setPreviousMaxMarks(100);
    setPerformanceCategory('Good');
    setAssignmentScoreInput('85');
    setSelfStudyHours(4.0);
    setPredictionResult(null);
    setActualScoreEntered(null);
    setActualScoreInput('');
    setSavedSuccess(false);
    setValidationError(null);
    setCurrentStep(1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Calculator className="w-3.5 h-3.5" />
          REGRESSION ANALYSIS PREDICTOR
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Predict Exam Score
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Estimate your upcoming exam score using mathematically validated regression analysis. Combines your <strong>Present Student Information</strong> with <strong>Past Academic Performance</strong>.
        </p>
      </div>

      {/* Prominent Educational Notice */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4.5 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
        <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-extrabold text-emerald-900 text-sm">
            Core Statistical Concept: Present Data + Past Performance → Regression Model → Predicted Score
          </div>
          <p className="text-emerald-800 leading-relaxed">
            The target exam score is <strong>never entered as an input</strong>. You enter how many marks you want to predict out of (Target Maximum Marks), and the regression model estimates your expected score. Actual scores can optionally be recorded after the exam for error analysis.
          </p>
        </div>
      </div>

      {/* Progress Indicator (6 Guided Steps) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500">
          <span>Step {currentStep} of 6</span>
          <span className="text-indigo-600 font-bold">{STEP_NAMES[currentStep - 1]}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>

        {/* Step circles */}
        <div className="grid grid-cols-6 gap-1 pt-4 text-center">
          {STEP_NAMES.map((name, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  if (stepNum <= currentStep) handleJumpToStep(stepNum);
                }}
                disabled={stepNum > currentStep}
                className={`flex flex-col items-center gap-1 group cursor-pointer ${
                  stepNum > currentStep ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span
                  className={`text-[10px] hidden md:block truncate max-w-[100px] ${
                    isCurrent ? 'font-bold text-indigo-700' : 'text-slate-500'
                  }`}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Questionnaire Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {validationError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: Enter Your Details (Manual Entry) */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 1 of 6 — Student Details
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Enter Your Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your student name and registration number manually to begin your score estimation.
              </p>
            </div>

            <div className="max-w-xl space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Registration Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="Enter registration number"
                  className="w-full px-4 py-3 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 uppercase"
                />
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                Any student can enter their details. If your registration number matches an existing student, it will be associated with that registration record in prediction history.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Present Academic Information */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 2 of 6 — Present Academic Information
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Present Student Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your present academic habits, attendance, and exam target scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Present Study Hours */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    1. Study Hours
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    How many hours do you study in a day?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter your average daily study hours.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="text-2xl font-extrabold text-indigo-600 font-mono">
                    {studyHours} <span className="text-xs font-normal text-slate-500">hrs/day</span>
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.25"
                      value={studyHoursInput}
                      onChange={(e) => {
                        setStudyHoursInput(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0 && val <= 24) {
                          setStudyHours(val);
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="16"
                  step="0.25"
                  value={studyHours}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setStudyHours(val);
                    setStudyHoursInput(String(val));
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[2.0, 3.5, 5.0, 6.5, 8.0].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setStudyHours(val);
                        setStudyHoursInput(String(val));
                      }}
                      className={`px-2.5 py-0.5 text-[11px] rounded-md border font-mono transition-colors cursor-pointer ${
                        studyHours === val
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val}h
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Present Attendance */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    2. Attendance Percentage
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    What is your present attendance percentage for this exam?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter your current attendance percentage relevant to the target examination.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="text-2xl font-extrabold text-indigo-600 font-mono">
                    {attendance}%
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={attendanceInput}
                      onChange={(e) => {
                        setAttendanceInput(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0 && val <= 100) {
                          setAttendance(val);
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attendance}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setAttendance(val);
                    setAttendanceInput(String(val));
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* 3. Present Sleep Hours */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    3. Sleep Duration
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    How many hours do you sleep per day?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter your average daily sleep duration in hours.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="text-2xl font-extrabold text-indigo-600 font-mono">
                    {sleepHours} <span className="text-xs font-normal text-slate-500">hrs/day</span>
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={sleepHoursInput}
                      onChange={(e) => {
                        setSleepHoursInput(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0 && val <= 24) {
                          setSleepHours(val);
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSleepHours(val);
                    setSleepHoursInput(String(val));
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* 4. Target Marks (Scale) */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-200 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    4. Target Examination Scale
                  </div>
                  <h3 className="text-sm font-bold text-indigo-950">
                    How many marks do you want to predict out of?
                  </h3>
                  <p className="text-xs text-indigo-800">
                    Enter the maximum marks for the target examination (e.g. 50, 75, 100, 150).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Target Max Marks</label>
                    <input
                      type="number"
                      min="1"
                      value={targetMaxMarksInput}
                      onChange={(e) => {
                        setTargetMaxMarksInput(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          setTargetMaxMarks(val);
                        }
                      }}
                      placeholder="e.g. 100"
                      className="w-full px-3 py-2 text-sm font-mono font-bold bg-white border border-indigo-300 rounded-xl text-indigo-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Target Exam</label>
                    <select
                      value={targetExamName}
                      onChange={(e) => setTargetExamName(e.target.value as ExamType)}
                      className="w-full px-3 py-2 text-xs bg-white border border-indigo-300 rounded-xl"
                    >
                      <option value="Final Examination">Final Examination</option>
                      <option value="Pre-Final Examination">Pre-Final</option>
                      <option value="Mid-Term Examination">Mid-Term</option>
                      <option value="Unit Test 2">Unit Test 2</option>
                      <option value="Unit Test 1">Unit Test 1</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {targetExamName === 'Other' && (
                  <input
                    type="text"
                    value={customTargetExamName}
                    onChange={(e) => setCustomTargetExamName(e.target.value)}
                    placeholder="Enter custom target exam name"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-300 rounded-xl"
                  />
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[50, 75, 100, 150].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setTargetMaxMarks(val);
                        setTargetMaxMarksInput(String(val));
                      }}
                      className={`px-2.5 py-0.5 text-[11px] rounded-md border font-mono transition-colors cursor-pointer ${
                        targetMaxMarks === val
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {val} Marks
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Previous Exam Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 3 of 6 — Previous Exam Details
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Enter your previous exam details.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Historical examination results provide an empirical predictor for Multiple Linear Regression.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Previous Exam Name</label>
                <input
                  type="text"
                  value={previousExamName}
                  onChange={(e) => setPreviousExamName(e.target.value)}
                  placeholder="e.g. Unit Test 2, Mid-Term Examination, or Pre-Final"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Previous Exam Score Obtained</label>
                  <input
                    type="number"
                    min="0"
                    max={previousMaxMarks}
                    value={previousScore}
                    onChange={(e) => setPreviousScore(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Previous Maximum Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={previousMaxMarks}
                    onChange={(e) => setPreviousMaxMarks(parseFloat(e.target.value) || 100)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <span className="text-indigo-900 font-medium">Calculated Previous Exam Percentage:</span>
                <span className="font-mono font-bold text-indigo-950 text-sm">{previousExamPercentage}%</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Previous Performance Category */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 4 of 6 — Previous Performance
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                How would you describe your previous academic performance?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose the category that best reflects your past academic performance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                {
                  key: 'Poor' as PerformanceCategory,
                  title: 'Poor',
                  desc: 'Struggled with prior coursework concepts',
                  color: 'border-rose-400 bg-rose-50 text-rose-950',
                },
                {
                  key: 'Average' as PerformanceCategory,
                  title: 'Average',
                  desc: 'Met core requirements satisfactorily',
                  color: 'border-amber-400 bg-amber-50 text-amber-950',
                },
                {
                  key: 'Good' as PerformanceCategory,
                  title: 'Good',
                  desc: 'Consistent exam performance and grasp of syllabus',
                  color: 'border-sky-400 bg-sky-50 text-sky-950',
                },
                {
                  key: 'Excellent' as PerformanceCategory,
                  title: 'Excellent',
                  desc: 'Consistently high marks across previous subjects',
                  color: 'border-indigo-400 bg-indigo-50 text-indigo-950',
                },
                {
                  key: 'Top Performer' as PerformanceCategory,
                  title: 'Top Performer',
                  desc: 'Among highest ranking students in cohort',
                  color: 'border-emerald-400 bg-emerald-50 text-emerald-950',
                },
              ].map((item) => {
                const isSelected = performanceCategory === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPerformanceCategory(item.key)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `ring-2 ring-indigo-500 ${item.color} shadow-sm font-semibold`
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-sm">{item.title}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                    <div className="mt-3 text-[11px] text-slate-400 font-mono">
                      Selected: "{item.key}"
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Past Academic Information & Optional Assignment Score */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 5 of 6 — Past Academic Information
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Past Academic Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Provide historical academic records. Assignment score is completely optional.
              </p>
            </div>

            {/* Optional Assignment Score Section */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    What was your previous assignment score? <span className="text-xs font-normal text-slate-500">(Optional)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter a score between 0–100, or leave blank/0 to exclude assignment data from prediction.
                  </p>
                </div>

                {/* Live Inclusion/Exclusion Status Badge */}
                {isAssignmentIncluded ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Assignment variable: Included in prediction
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    <XCircle className="w-3.5 h-3.5 text-amber-600" />
                    Assignment variable: Excluded from prediction
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Previous Assignment Score (0–100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignmentScoreInput}
                    onChange={(e) => setAssignmentScoreInput(e.target.value)}
                    placeholder="Leave blank or enter 0 to exclude"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="text-xs p-3 rounded-xl border bg-white space-y-1">
                  <div className="font-semibold text-slate-800">
                    Assignment Rule Status:
                  </div>
                  {isAssignmentIncluded ? (
                    <div className="text-emerald-700 font-medium">
                      Assignment Score: <strong>{effectiveAssignmentScore}</strong> (Included as predictor in Multiple Linear Regression)
                    </div>
                  ) : (
                    <div className="text-amber-800 font-medium">
                      Assignment Score: <strong>Not Provided</strong> (Excluding assignment from regression equation)
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAssignmentScoreInput('')}
                  className="px-3 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
                >
                  Clear / Do Not Provide
                </button>
                {[70, 80, 85, 90, 95].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAssignmentScoreInput(String(val))}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer font-mono"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Previous Self-Study Hours */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Previous Self-Study Hours (0–24 hrs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Average daily independent revision duration during prior semester.
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-indigo-600">{selfStudyHours} hrs</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={selfStudyHours}
                onChange={(e) => setSelfStudyHours(parseFloat(e.target.value) || 0)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Review & Choose Model */}
        {currentStep === 6 && (
          <div className="space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step 6 of 6 — Review & Choose Model
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Review & Choose Model
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Review your present and past inputs, select your regression model, and calculate your predicted score.
              </p>
            </div>

            {/* Review Parameters Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 divide-y divide-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Manually Entered Information Summary
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> No Data Leakage Guaranteed
                </span>
              </div>

              {/* Student Identity */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-xs font-medium text-slate-500">Student Identity</div>
                  <div className="text-base font-extrabold text-slate-800">{studentName || 'Not entered'}</div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">Registration Number: {studentId || 'Not entered'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(1)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Present Information Box */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Present Information
                  </div>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(2)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-[11px] text-slate-500">Present Study Hours</div>
                    <div className="text-sm font-bold text-slate-900 font-mono">{studyHours} hrs/day</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Present Attendance</div>
                    <div className="text-sm font-bold text-slate-900 font-mono">{attendance}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Present Sleep Hours</div>
                    <div className="text-sm font-bold text-slate-900 font-mono">{sleepHours} hrs/day</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Target Scale</div>
                    <div className="text-sm font-bold text-indigo-700 font-mono">{targetMaxMarks} Marks</div>
                  </div>
                </div>
              </div>

              {/* Previous Information Box */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Previous Academic Information
                  </div>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(3)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-[11px] text-slate-500">Previous Exam</div>
                    <div className="text-xs font-bold text-slate-900">{previousExamName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{previousScore}/{previousMaxMarks} ({previousExamPercentage}%)</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Previous Performance</div>
                    <div className="text-xs font-bold text-indigo-700">{performanceCategory}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Assignment Score</div>
                    <div className={`text-xs font-bold ${isAssignmentIncluded ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isAssignmentIncluded ? `${effectiveAssignmentScore} (Included)` : 'Not Provided (Excluded)'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Self-Study Revision</div>
                    <div className="text-sm font-bold text-slate-900 font-mono">{selfStudyHours} hrs/day</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Selection */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-900">
                Select Regression Model:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Option 1: Simple Linear Regression */}
                <button
                  type="button"
                  onClick={() => setSelectedModel('simple_linear')}
                  className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedModel === 'simple_linear'
                      ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-slate-900">Simple Linear Regression</h4>
                          <span className="text-[11px] font-semibold text-indigo-600">Present Study Hours → Target Exam Score</span>
                        </div>
                      </div>
                      {selectedModel === 'simple_linear' && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="font-mono text-xs text-indigo-800 bg-indigo-100/70 px-3 py-1.5 rounded-lg inline-block font-bold">
                      Y = b₀ + b₁X
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Predicts expected exam score using one independent variable: present study hours per day.
                    </p>

                    <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-800">Variables Used:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                        <li><strong>X:</strong> Present Study Hours ({studyHours} hrs/day)</li>
                        <li><strong>Y:</strong> Target Exam Score (scaled out of {targetMaxMarks})</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-indigo-700 font-semibold">
                    {selectedModel === 'simple_linear' ? '✓ Selected for Prediction' : 'Click to select this model'}
                  </div>
                </button>

                {/* Option 2: Multiple Linear Regression */}
                <button
                  type="button"
                  onClick={() => setSelectedModel('multiple_linear')}
                  className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedModel === 'multiple_linear'
                      ? 'border-emerald-600 ring-2 ring-emerald-200 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-slate-900">Multiple Linear Regression</h4>
                          <span className="text-[11px] font-semibold text-emerald-600">Present + Past Student Factors</span>
                        </div>
                      </div>
                      {selectedModel === 'multiple_linear' && (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Dynamic Formula Display reflecting Assignment inclusion/exclusion */}
                    <div className="font-mono text-[11px] text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-lg inline-block font-bold">
                      {isAssignmentIncluded
                        ? 'Y = b₀ + b₁(Study) + b₂(Attendance) + b₃(Sleep) + b₄(Prev%) + b₅(Assignment) + b₆(SelfStudy)'
                        : 'Y = b₀ + b₁(Study) + b₂(Attendance) + b₃(Sleep) + b₄(Prev%) + b₅(SelfStudy)'}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Predicts exam score combining present study hours, attendance, sleep, and historical scores.{' '}
                      {isAssignmentIncluded ? (
                        <span className="text-emerald-700 font-semibold">Includes assignment score ({effectiveAssignmentScore}).</span>
                      ) : (
                        <span className="text-amber-800 font-semibold">Assignment excluded (not provided).</span>
                      )}
                    </p>

                    <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-800">Dynamic Predictor Set:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                        <li>Study Hours ({studyHours}h), Attendance ({attendance}%), Sleep ({sleepHours}h)</li>
                        <li>Previous Exam ({previousExamPercentage}%)</li>
                        {isAssignmentIncluded ? (
                          <li className="text-emerald-700 font-semibold">Assignment ({effectiveAssignmentScore}) — Included</li>
                        ) : (
                          <li className="text-amber-700 font-semibold">Assignment — Excluded (0 or empty)</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-emerald-700 font-semibold">
                    {selectedModel === 'multiple_linear' ? '✓ Selected for Prediction' : 'Click to select this model'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-3">
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  runPrediction();
                  window.scrollTo({ top: 780, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer animate-pulse"
              >
                <Calculator className="w-4 h-4" />
                <span>Estimate Target Exam Score</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PREDICTION RESULT DISPLAY & POST-EXAM EVALUATION */}
      {/* ========================================================= */}
      {predictionResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-8 animate-fadeIn">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                REGRESSION ESTIMATION COMPLETED
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Estimated Target Exam Score: {predictionResult.estimatedScore} / {targetMaxMarks}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Model: <strong>{predictionResult.modelName}</strong> | Candidate: <strong>{studentName}</strong> ({studentId})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSavePrediction}
                disabled={savedSuccess}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  savedSuccess
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{savedSuccess ? 'Saved to History' : 'Save Prediction'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Make Another Prediction</span>
              </button>
            </div>
          </div>

          {/* Primary Result Display Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold tracking-wide">
                  Predicted Score for {activeTargetExam} (Scaled out of {targetMaxMarks})
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                    {predictionResult.estimatedScore}
                  </span>
                  <span className="text-xl sm:text-2xl text-indigo-200 font-medium">
                    / {targetMaxMarks} Marks
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-base font-bold font-mono">
                    {predictionResult.estimatedPercentage}%
                  </span>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="text-xs text-indigo-300 font-medium">Derived Mathematical Regression Formula:</div>
                  <div className="font-mono text-xs sm:text-sm text-amber-300 bg-white/5 border border-white/10 p-3 rounded-xl break-all">
                    {predictionResult.equation}
                  </div>
                </div>
              </div>

              {/* Statistical Fit Summary */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="text-xs font-bold text-indigo-200 tracking-wider uppercase">
                  Model Empirical Goodness
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">R² Coefficient:</span>
                    <span className="font-bold text-emerald-300">{predictionResult.r2}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">Mean Abs Error (MAE):</span>
                    <span className="font-bold text-white">{predictionResult.mae}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-300">Root Mean Sq Err (RMSE):</span>
                    <span className="font-bold text-white">{predictionResult.rmse}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 pt-1 leading-snug">
                  Fit metrics evaluated dynamically using Ordinary Least Squares on hold-out student partition.
                </p>
              </div>
            </div>
          </div>

          {/* Section 14: Variables Used in This Prediction (Transparent Checklist) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Variables Used in This Prediction
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Present Study Hours:</span>{' '}
                  <span className="text-slate-600 font-mono">{studyHours} hrs/day</span>
                </div>
              </div>

              {selectedModel === 'simple_linear' ? (
                <>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>Present Attendance — Not used in Simple Linear</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>Present Sleep Hours — Not used in Simple Linear</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>Previous Exam % — Not used in Simple Linear</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>Assignment Score — Not used in Simple Linear</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">Present Attendance:</span>{' '}
                      <span className="text-slate-600 font-mono">{attendance}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">Present Sleep Hours:</span>{' '}
                      <span className="text-slate-600 font-mono">{sleepHours} hrs/day</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">Previous Exam %:</span>{' '}
                      <span className="text-slate-600 font-mono">{previousExamPercentage}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">Self-Study Hours:</span>{' '}
                      <span className="text-slate-600 font-mono">{selfStudyHours} hrs/day</span>
                    </div>
                  </div>

                  {predictionResult.assignmentIncluded ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold">Assignment Score:</span>{' '}
                        <span className="font-mono">{effectiveAssignmentScore}</span> (Included in model)
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                      <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-semibold">Assignment Score:</span> Not Provided (Excluded from model)
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* POST-EXAM OPTIONAL EVALUATION: Enter Actual Exam Score */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  AFTER THE EXAM (OPTIONAL POST-EXAM EVALUATION)
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Enter Actual Exam Score & Calculate Prediction Error
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  Once you have finished the <strong>{activeTargetExam}</strong> and received your actual marks, enter your score below. The system will benchmark the regression model's estimation against reality.
                </p>
              </div>
            </div>

            <form onSubmit={handleApplyActualScore} className="flex flex-wrap items-center gap-3 pt-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max={targetMaxMarks}
                  step="0.5"
                  value={actualScoreInput}
                  onChange={(e) => setActualScoreInput(e.target.value)}
                  placeholder={`Enter marks (0 - ${targetMaxMarks})`}
                  className="px-4 py-2 text-xs font-mono bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 w-56 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                Compute Prediction Error
              </button>

              {actualScoreEntered !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setActualScoreEntered(null);
                    setActualScoreInput('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
                >
                  Clear Actual
                </button>
              )}
            </form>

            {/* Error Calculation Display */}
            {actualScoreEntered !== null && (
              <div className="bg-white border border-amber-300 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-3">
                <div className="p-2 border-r border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Estimated Score</div>
                  <div className="text-xl font-black text-indigo-700 font-mono">
                    {predictionResult.estimatedScore} / {targetMaxMarks}
                  </div>
                </div>

                <div className="p-2 border-r border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Actual Exam Score</div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {actualScoreEntered} / {targetMaxMarks}
                  </div>
                </div>

                <div className="p-2">
                  <div className="text-[11px] text-slate-500 font-medium">Absolute Prediction Error (|Actual - Pred|)</div>
                  <div className="text-xl font-black text-emerald-700 font-mono">
                    {Math.abs(actualScoreEntered - predictionResult.estimatedScore).toFixed(1)} marks
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Model Coefficients Breakdown Table */}
          {predictionResult.coefficients && Object.keys(predictionResult.coefficients).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Regression Model Coefficients Breakdown
                </h3>
                <span className="text-xs text-slate-500">
                  Ordinary Least Squares Fitted Weights
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Variable / Factor</th>
                      <th className="px-4 py-3">Notation</th>
                      <th className="px-4 py-3 text-right">Fitted Weight (bᵢ)</th>
                      <th className="px-4 py-3 text-right">Candidate Value (Xᵢ)</th>
                      <th className="px-4 py-3">Academic Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {predictionResult.intercept !== undefined && (
                      <tr className="bg-slate-50/40">
                        <td className="px-4 py-3 font-semibold text-slate-900">Baseline Intercept</td>
                        <td className="px-4 py-3 font-mono text-slate-500">b₀</td>
                        <td className="px-4 py-3 font-mono font-bold text-indigo-700 text-right">
                          {predictionResult.intercept}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400 text-right">1.0</td>
                        <td className="px-4 py-3 text-slate-600">
                          Baseline marks constant when all predictors are zero
                        </td>
                      </tr>
                    )}
                    {Object.entries(predictionResult.coefficients).map(([varName, weight]) => {
                      let displayName = varName;
                      let notation = 'Xᵢ';
                      let candVal = '-';
                      let interpretation = '';

                      if (varName === 'study_hours' || varName === 'slope') {
                        displayName = 'Present Study Hours';
                        notation = 'X₁';
                        candVal = `${studyHours} hrs/day`;
                        interpretation = `Each additional study hour changes score by ${weight > 0 ? '+' : ''}${weight} marks`;
                      } else if (varName === 'attendance') {
                        displayName = 'Present Attendance %';
                        notation = 'X₂';
                        candVal = `${attendance}%`;
                        interpretation = `Weight for classroom attendance engagement`;
                      } else if (varName === 'sleep') {
                        displayName = 'Present Sleep Hours';
                        notation = 'X₃';
                        candVal = `${sleepHours} hrs/day`;
                        interpretation = `Weight for rest and cognitive retention`;
                      } else if (varName === 'previous_pct') {
                        displayName = 'Previous Exam %';
                        notation = 'X₄';
                        candVal = `${previousExamPercentage}%`;
                        interpretation = `Historical academic baseline retention`;
                      } else if (varName === 'assignment') {
                        displayName = 'Previous Assignment Score';
                        notation = 'X₅';
                        candVal = `${effectiveAssignmentScore} / 100`;
                        interpretation = `Continuous assessment weight (Included)`;
                      } else if (varName === 'self_study') {
                        displayName = 'Previous Self-Study Hours';
                        notation = isAssignmentIncluded ? 'X₆' : 'X₅';
                        candVal = `${selfStudyHours} hrs/day`;
                        interpretation = `Autonomous revision contribution`;
                      } else {
                        displayName = `Categorical Dummy (${varName})`;
                        interpretation = `Performance contrast category adjustment`;
                      }

                      return (
                        <tr key={varName} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-800">{displayName}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{notation}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-900 text-right">
                            {weight > 0 ? `+${weight}` : weight}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-700 text-right">{candVal}</td>
                          <td className="px-4 py-3 text-slate-600">{interpretation}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Model Graphical Visualization */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Visual Regression Fit on Dataset
            </h3>

            {selectedModel === 'simple_linear' ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <ScatterPlotWithFitCurve
                  title="Simple Linear Regression Fit: Present Study Hours vs Exam Score"
                  xLabel="Present Study Hours Per Day"
                  yLabel="Target Exam Score %"
                  points={students.slice(0, 47).map((s) => ({
                    x: s.study_hours_per_day,
                    y: s.current_exam_percentage,
                    label: s.student_name,
                    subLabel: `${s.student_id}`,
                  }))}
                  curvePoints={predictionResult.curvePoints}
                  highlightPoint={{
                    x: studyHours,
                    y: predictionResult.estimatedPercentage,
                    label: studentName || 'Candidate Student',
                  }}
                />
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <ActualVsPredictedPlot
                  title="Multiple Linear Regression Parity Plot (Predicted vs Actual)"
                  data={predictionResult.testPredictions}
                  modelName={predictionResult.modelName}
                  r2={predictionResult.r2}
                  mae={predictionResult.mae}
                  rmse={predictionResult.rmse}
                />
              </div>
            )}
          </div>

          {/* Action buttons footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onNavigateToComparison}
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <span>Compare Simple Linear vs Multiple Linear Models</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onNavigateToHistory}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                View Prediction History
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
              >
                Start New Prediction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
