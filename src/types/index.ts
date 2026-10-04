export type PerformanceCategory = 'Poor' | 'Average' | 'Good' | 'Excellent' | 'Top Performer';

export type ExamType = 'Unit Test 1' | 'Unit Test 2' | 'Mid-Term Examination' | 'Pre-Final Examination' | 'Final Examination' | 'Other';

export interface Student {
  id: string;
  student_id: string;
  student_name: string;
  // Historical / Input variables known before target exam
  study_hours_per_day: number;
  previous_exam_name: string;
  previous_exam_score: number;
  previous_exam_max_marks: number;
  previous_exam_percentage: number;
  performance_category: PerformanceCategory;
  attendance_percentage: number;
  previous_attendance_percentage?: number;
  assignment_score: number;
  previous_assignment_score?: number;
  self_study_hours: number;
  previous_self_study_hours?: number;
  sleep_hours: number;
  previous_sleep_hours?: number;

  // Target / Actual exam outcome variables (known after target exam)
  target_exam_name: string;
  actual_target_exam_score: number;
  actual_target_exam_max_marks: number;
  actual_target_exam_percentage: number;

  // Aliases for compatibility
  current_exam_name: string;
  current_exam_score: number;
  current_exam_max_marks: number;
  current_exam_percentage: number;

  created_at: string;
}

export type RegressionModelKey = 'simple_linear' | 'multiple_linear';

export interface ModelMetrics {
  r2: number;
  mae: number;
  rmse: number;
  trainR2?: number;
  trainMae?: number;
  trainRmse?: number;
  nTrain: number;
  nTest: number;
  equation: string;
  coefficients: Record<string, number>;
  intercept: number;
}

export interface PredictionInput {
  // Present student inputs
  study_hours_per_day: number;
  attendance_percentage: number;
  sleep_hours: number;
  target_max_marks?: number;
  target_exam_name: string;

  // Previous academic inputs
  previous_exam_name: string;
  previous_exam_score: number;
  previous_exam_max_marks: number;
  previous_exam_percentage: number;
  performance_category: PerformanceCategory;
  assignment_score?: number | null;
  assignment_included?: boolean;
  self_study_hours?: number;

  // Optional compatibility fields
  target_exam_max_marks?: number;
  current_exam_name?: string;
  current_exam_max_marks?: number;
}

export interface PredictionRecord {
  id: string;
  student_id: string;
  student_name: string;
  model_name: string;
  model_key: RegressionModelKey;
  predicted_score: number;
  predicted_percentage: number;
  actual_score?: number | null; // Entered AFTER the examination
  actual_percentage?: number | null;
  prediction_error?: number | null; // Difference between actual and predicted
  r2: number;
  mae: number;
  rmse: number;
  equation: string;
  input_values: PredictionInput;
  created_at: string;
  actual_score_entered_at?: string;
}

export interface RegressionFittedModel {
  name: string;
  key: RegressionModelKey;
  equation: string;
  metrics: ModelMetrics;
  predict: (input: {
    study_hours: number;
    previous_pct?: number;
    attendance?: number;
    assignment?: number;
    self_study?: number;
    sleep?: number;
    category?: PerformanceCategory;
  }) => number;
  predictCurvePoints: (minX: number, maxX: number, pointsCount?: number) => { x: number; y: number }[];
  testDataPredictions: { actual: number; predicted: number; id: string }[];
}
