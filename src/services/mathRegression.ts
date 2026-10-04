import { PerformanceCategory, Student, ModelMetrics, RegressionFittedModel } from '../types';

/**
 * Matrix operations and Gaussian elimination for regression solvers
 */
export class MatrixMath {
  // Transpose matrix A (m x n) -> (n x m)
  static transpose(A: number[][]): number[][] {
    const m = A.length;
    const n = A[0].length;
    const AT: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        AT[j][i] = A[i][j];
      }
    }
    return AT;
  }

  // Multiply matrix A (m x k) with matrix B (k x n) -> (m x n)
  static multiply(A: number[][], B: number[][]): number[][] {
    const m = A.length;
    const k = A[0].length;
    const n = B[0].length;
    const C: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let p = 0; p < k; p++) {
          sum += A[i][p] * B[p][j];
        }
        C[i][j] = sum;
      }
    }
    return C;
  }

  // Multiply matrix A (m x n) with vector x (n) -> vector y (m)
  static multiplyVector(A: number[][], x: number[]): number[] {
    const m = A.length;
    const n = A[0].length;
    const y: number[] = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += A[i][j] * x[j];
      }
      y[i] = sum;
    }
    return y;
  }

  // Solve linear system A * x = b using Gaussian elimination with partial pivoting
  static solveLinearSystem(A: number[][], b: number[]): number[] {
    const n = A.length;
    // Build augmented matrix [A | b]
    const M: number[][] = A.map((row, i) => [...row, b[i]]);

    for (let i = 0; i < n; i++) {
      // Find pivot row
      let maxRow = i;
      let maxVal = Math.abs(M[i][i]);
      for (let r = i + 1; r < n; r++) {
        if (Math.abs(M[r][i]) > maxVal) {
          maxVal = Math.abs(M[r][i]);
          maxRow = r;
        }
      }

      // Swap rows
      if (maxRow !== i) {
        const temp = M[i];
        M[i] = M[maxRow];
        M[maxRow] = temp;
      }

      // If singular or near singular, add small ridge regularization epsilon
      const pivot = M[i][i];
      if (Math.abs(pivot) < 1e-12) {
        M[i][i] = 1e-6;
      }

      // Eliminate below
      for (let r = i + 1; r < n; r++) {
        const factor = M[r][i] / M[i][i];
        for (let c = i; c <= n; c++) {
          M[r][c] -= factor * M[i][c];
        }
      }
    }

    // Back substitution
    const x: number[] = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = M[i][n];
      for (let j = i + 1; j < n; j++) {
        sum -= M[i][j] * x[j];
      }
      x[i] = sum / (Math.abs(M[i][i]) < 1e-12 ? 1e-6 : M[i][i]);
    }

    return x;
  }
}

/**
 * Calculates R2, MAE, and RMSE
 */
export function calculateMetrics(actuals: number[], predictions: number[]): { r2: number; mae: number; rmse: number } {
  const n = actuals.length;
  if (n === 0) return { r2: 0, mae: 0, rmse: 0 };

  const meanActual = actuals.reduce((sum, v) => sum + v, 0) / n;
  let ssTot = 0;
  let ssRes = 0;
  let absErrSum = 0;
  let sqErrSum = 0;

  for (let i = 0; i < n; i++) {
    const act = actuals[i];
    const pred = predictions[i];
    const err = act - pred;

    ssTot += Math.pow(act - meanActual, 2);
    ssRes += Math.pow(err, 2);
    absErrSum += Math.abs(err);
    sqErrSum += Math.pow(err, 2);
  }

  // In statistics, R² = 1 - (SS_res / SS_tot). If ssTot is close to zero, R2 is 1 if ssRes is 0, else 0.
  const rawR2 = ssTot > 1e-9 ? 1 - ssRes / ssTot : 1;
  const r2 = Math.max(0, Math.min(1, rawR2)); // standard clamped display for academic models
  const mae = absErrSum / n;
  const rmse = Math.sqrt(sqErrSum / n);

  return {
    r2: Number(r2.toFixed(4)),
    mae: Number(mae.toFixed(2)),
    rmse: Number(rmse.toFixed(2)),
  };
}

/**
 * Splits dataset into 80% train and 20% test deterministically
 */
export function splitDataset(students: Student[], trainRatio: number = 0.8): { train: Student[]; test: Student[] } {
  if (students.length <= 5) {
    return { train: students, test: students };
  }
  // Deterministic split: every 5th item goes to test set (80/20)
  const train: Student[] = [];
  const test: Student[] = [];

  students.forEach((student, index) => {
    if (index % 5 === 0) {
      test.push(student);
    } else {
      train.push(student);
    }
  });

  return { train, test };
}

/**
 * Categorical One-Hot Encoding helpers for performance_category
 * Baseline (reference category): 'Poor'
 * Indicators:
 * - is_average: 1 if Average, 0 otherwise
 * - is_good: 1 if Good, 0 otherwise
 * - is_excellent: 1 if Excellent, 0 otherwise
 * - is_top: 1 if Top Performer, 0 otherwise
 */
export function encodeCategory(category: PerformanceCategory): [number, number, number, number] {
  return [
    category === 'Average' ? 1 : 0,
    category === 'Good' ? 1 : 0,
    category === 'Excellent' ? 1 : 0,
    category === 'Top Performer' ? 1 : 0,
  ];
}

// -------------------------------------------------------------
// 1. SIMPLE LINEAR REGRESSION: Y = b0 + b1 * X
// X = Study Hours Per Day, Y = Current Exam Percentage (or score normalized)
// -------------------------------------------------------------
export function fitSimpleLinearRegression(
  students: Student[],
  trainRatio: number = 0.8
): RegressionFittedModel {
  const { train, test } = splitDataset(students, trainRatio);

  const n = train.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const s of train) {
    const x = s.study_hours_per_day;
    const y = s.current_exam_percentage;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  // Slope b1 = sum((x - meanX)*(y - meanY)) / sum((x - meanX)^2)
  const denominator = sumXX - (sumX * sumX) / n;
  const slope = denominator !== 0 ? (sumXY - (sumX * sumY) / n) / denominator : 0;
  const intercept = meanY - slope * meanX;

  const predictRaw = (x: number) => {
    const raw = intercept + slope * x;
    return Math.max(0, Math.min(100, raw));
  };

  // Evaluate on test data
  const testActuals = test.map((s) => s.current_exam_percentage);
  const testPredictions = test.map((s) => predictRaw(s.study_hours_per_day));
  const metrics = calculateMetrics(testActuals, testPredictions);

  // Evaluate on train data for comparison
  const trainActuals = train.map((s) => s.current_exam_percentage);
  const trainPredictions = train.map((s) => predictRaw(s.study_hours_per_day));
  const trainMetrics = calculateMetrics(trainActuals, trainPredictions);

  const equationStr = `Y = ${intercept >= 0 ? intercept.toFixed(2) : `(${intercept.toFixed(2)})`} + ${slope.toFixed(2)} · X`;

  const modelMetrics: ModelMetrics = {
    ...metrics,
    trainR2: trainMetrics.r2,
    trainMae: trainMetrics.mae,
    trainRmse: trainMetrics.rmse,
    nTrain: train.length,
    nTest: test.length,
    equation: equationStr,
    coefficients: {
      slope: Number(slope.toFixed(4)),
    },
    intercept: Number(intercept.toFixed(4)),
  };

  return {
    name: 'Simple Linear Regression',
    key: 'simple_linear',
    equation: equationStr,
    metrics: modelMetrics,
    predict: (input) => predictRaw(input.study_hours),
    predictCurvePoints: (minX: number, maxX: number, pointsCount = 60) => {
      const step = (maxX - minX) / (pointsCount - 1);
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < pointsCount; i++) {
        const xVal = minX + i * step;
        points.push({ x: Number(xVal.toFixed(2)), y: Number(predictRaw(xVal).toFixed(2)) });
      }
      return points;
    },
    testDataPredictions: test.map((s, idx) => ({
      id: s.id || `test-${idx}`,
      actual: s.current_exam_percentage,
      predicted: Number(testPredictions[idx].toFixed(2)),
    })),
  };
}

// -------------------------------------------------------------
// 2. MULTIPLE LINEAR REGRESSION
// Supports optional assignment predictor exclusion (when assignment score = 0 or empty)
// -------------------------------------------------------------
export interface MLROptions {
  includeAssignment?: boolean;
  includeCategorical?: boolean;
  trainRatio?: number;
}

export function fitMultipleLinearRegression(
  students: Student[],
  optionsOrCategorical: boolean | MLROptions = false,
  defaultTrainRatio: number = 0.8
): RegressionFittedModel {
  const includeCategorical = typeof optionsOrCategorical === 'boolean'
    ? optionsOrCategorical
    : !!optionsOrCategorical.includeCategorical;
  const includeAssignment = typeof optionsOrCategorical === 'boolean'
    ? true
    : optionsOrCategorical.includeAssignment !== false;
  const trainRatio = typeof optionsOrCategorical === 'object' && optionsOrCategorical.trainRatio !== undefined
    ? optionsOrCategorical.trainRatio
    : defaultTrainRatio;

  const { train, test } = splitDataset(students, trainRatio);

  // Build Design Matrix X and Target Vector Y for Training
  const buildFeatures = (s: Student): number[] => {
    const base = [
      1, // Intercept column
      s.study_hours_per_day, // Present Study Hours
      s.attendance_percentage, // Present Attendance %
      s.sleep_hours, // Present Sleep Hours
      s.previous_exam_percentage, // Previous Exam %
    ];

    if (includeAssignment) {
      base.push(s.assignment_score); // Previous Assignment Score (only if provided / > 0)
    }

    base.push(s.self_study_hours); // Self-Study Hours

    if (includeCategorical) {
      const dummies = encodeCategory(s.performance_category);
      return [...base, ...dummies];
    }
    return base;
  };

  const X_train = train.map(buildFeatures);
  const Y_train = train.map((s) => s.current_exam_percentage);

  // Compute Normal Equations: (X^T * X) * beta = (X^T * Y)
  const XT = MatrixMath.transpose(X_train);
  const XTX = MatrixMath.multiply(XT, X_train);
  const XTY = MatrixMath.multiplyVector(XT, Y_train);

  // Add small ridge regularization (L2 = 0.001) to diagonal for extreme collinearity stability
  for (let i = 0; i < XTX.length; i++) {
    XTX[i][i] += 0.001;
  }

  const beta = MatrixMath.solveLinearSystem(XTX, XTY);
  const intercept = beta[0];

  const predictRaw = (input: {
    study_hours: number;
    attendance?: number;
    sleep?: number;
    previous_pct?: number;
    assignment?: number;
    self_study?: number;
    category?: PerformanceCategory;
  }) => {
    let pred = beta[0];
    pred += beta[1] * input.study_hours;
    pred += beta[2] * (input.attendance ?? 80);
    pred += beta[3] * (input.sleep ?? 7.0);
    pred += beta[4] * (input.previous_pct ?? 70);

    let nextIdx = 5;
    if (includeAssignment) {
      pred += beta[nextIdx] * (input.assignment ?? 75);
      nextIdx++;
    }
    pred += beta[nextIdx] * (input.self_study ?? 2.5);
    nextIdx++;

    if (includeCategorical && input.category) {
      const dummies = encodeCategory(input.category);
      pred += beta[nextIdx] * dummies[0];
      pred += beta[nextIdx + 1] * dummies[1];
      pred += beta[nextIdx + 2] * dummies[2];
      pred += beta[nextIdx + 3] * dummies[3];
    }

    return Math.max(0, Math.min(100, pred));
  };

  // Evaluate on test data
  const testActuals = test.map((s) => s.current_exam_percentage);
  const testPredictions = test.map((s) =>
    predictRaw({
      study_hours: s.study_hours_per_day,
      attendance: s.attendance_percentage,
      sleep: s.sleep_hours,
      previous_pct: s.previous_exam_percentage,
      assignment: s.assignment_score,
      self_study: s.self_study_hours,
      category: s.performance_category,
    })
  );
  const metrics = calculateMetrics(testActuals, testPredictions);

  // Train metrics
  const trainActuals = train.map((s) => s.current_exam_percentage);
  const trainPredictions = train.map((s) =>
    predictRaw({
      study_hours: s.study_hours_per_day,
      attendance: s.attendance_percentage,
      sleep: s.sleep_hours,
      previous_pct: s.previous_exam_percentage,
      assignment: s.assignment_score,
      self_study: s.self_study_hours,
      category: s.performance_category,
    })
  );
  const trainMetrics = calculateMetrics(trainActuals, trainPredictions);

  const varNames = ['StudyHours', 'Attendance%', 'Sleep', 'PrevScore%'];
  if (includeAssignment) {
    varNames.push('Assignment');
  }
  varNames.push('SelfStudy');

  let equationStr = `Y = ${intercept.toFixed(2)}`;
  varNames.forEach((name, i) => {
    const coeff = beta[i + 1];
    const sign = coeff >= 0 ? '+' : '-';
    equationStr += ` ${sign} ${Math.abs(coeff).toFixed(2)}·(${name})`;
  });

  const coefficientsRecord: Record<string, number> = {
    study_hours: Number(beta[1].toFixed(4)),
    attendance: Number(beta[2].toFixed(4)),
    sleep: Number(beta[3].toFixed(4)),
    previous_pct: Number(beta[4].toFixed(4)),
  };

  let recordIdx = 5;
  if (includeAssignment) {
    coefficientsRecord['assignment'] = Number(beta[recordIdx].toFixed(4));
    recordIdx++;
  }
  coefficientsRecord['self_study'] = Number(beta[recordIdx].toFixed(4));
  recordIdx++;

  if (includeCategorical) {
    coefficientsRecord['cat_average'] = Number(beta[recordIdx].toFixed(4));
    coefficientsRecord['cat_good'] = Number(beta[recordIdx + 1].toFixed(4));
    coefficientsRecord['cat_excellent'] = Number(beta[recordIdx + 2].toFixed(4));
    coefficientsRecord['cat_top'] = Number(beta[recordIdx + 3].toFixed(4));
    equationStr += ' + [Categorical Dummies]';
  }

  const modelMetrics: ModelMetrics = {
    ...metrics,
    trainR2: trainMetrics.r2,
    trainMae: trainMetrics.mae,
    trainRmse: trainMetrics.rmse,
    nTrain: train.length,
    nTest: test.length,
    equation: equationStr,
    coefficients: coefficientsRecord,
    intercept: Number(intercept.toFixed(4)),
  };

  const modelName = includeAssignment
    ? (includeCategorical ? 'Multiple Linear Regression (Full + Dummies)' : 'Multiple Linear Regression')
    : (includeCategorical ? 'Multiple Linear Regression (No Assignment + Dummies)' : 'Multiple Linear Regression (Excluding Assignment)');

  return {
    name: modelName,
    key: 'multiple_linear',
    equation: equationStr,
    metrics: modelMetrics,
    predict: (input) => predictRaw(input),
    predictCurvePoints: (minX: number, maxX: number, pointsCount = 60) => {
      // Evaluate varying study hours with median profile for other features
      const step = (maxX - minX) / (pointsCount - 1);
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < pointsCount; i++) {
        const xVal = minX + i * step;
        const pred = predictRaw({
          study_hours: xVal,
          attendance: 84,
          sleep: 7.2,
          previous_pct: 72,
          assignment: 76,
          self_study: 3.0,
          category: 'Good',
        });
        points.push({ x: Number(xVal.toFixed(2)), y: Number(pred.toFixed(2)) });
      }
      return points;
    },
    testDataPredictions: test.map((s, idx) => ({
      id: s.id || `test-${idx}`,
      actual: s.current_exam_percentage,
      predicted: Number(testPredictions[idx].toFixed(2)),
    })),
  };
}

