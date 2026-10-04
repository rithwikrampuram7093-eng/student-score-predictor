import { Student, PredictionRecord } from '../types';
import { SYNTHETIC_STUDENTS_DATA } from '../data/syntheticStudents';

const STUDENTS_STORAGE_KEY = 'ssps_students_v2_47_master';
const PREDICTIONS_STORAGE_KEY = 'ssps_predictions_v3_target_eval';

export class StorageService {
  static getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(SYNTHETIC_STUDENTS_DATA));
        return SYNTHETIC_STUDENTS_DATA;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(SYNTHETIC_STUDENTS_DATA));
        return SYNTHETIC_STUDENTS_DATA;
      }
      const hasOldIdentities = parsed.some((s: any) => s.student_id?.startsWith('STU-2024') || s.student_name === 'Aarav Sharma');
      if (hasOldIdentities || parsed.length > 55) {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(SYNTHETIC_STUDENTS_DATA));
        return SYNTHETIC_STUDENTS_DATA;
      }
      return parsed;
    } catch {
      return SYNTHETIC_STUDENTS_DATA;
    }
  }

  static saveStudents(students: Student[]): void {
    try {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }

  static addStudent(data: Omit<Student, 'id' | 'created_at'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...data,
      id: 'stu-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString(),
    };
    students.unshift(newStudent);
    this.saveStudents(students);
    return newStudent;
  }

  static updateStudent(updated: Student): Student {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === updated.id);
    if (idx !== -1) {
      students[idx] = updated;
      this.saveStudents(students);
    }
    return updated;
  }

  static deleteStudent(id: string): void {
    const students = this.getStudents();
    const filtered = students.filter((s) => s.id !== id);
    this.saveStudents(filtered);
  }

  static resetToSynthetic(): Student[] {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(SYNTHETIC_STUDENTS_DATA));
    return SYNTHETIC_STUDENTS_DATA;
  }

  static resetToMaster47(): Student[] {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(SYNTHETIC_STUDENTS_DATA));
    return SYNTHETIC_STUDENTS_DATA;
  }

  static getPredictions(): PredictionRecord[] {
    try {
      const data = localStorage.getItem(PREDICTIONS_STORAGE_KEY);
      if (!data) {
        // Initial sample predictions using master students demonstrating past inputs -> predicted target score
        const initialPredictions: PredictionRecord[] = [
          {
            id: 'pred-sample-1',
            student_id: '252U1R1180',
            student_name: 'Pandimukkula Narthik Goud',
            model_name: 'Multiple Linear Regression',
            model_key: 'multiple_linear',
            predicted_score: 95.8,
            predicted_percentage: 95.8,
            actual_score: 96,
            actual_percentage: 96,
            prediction_error: 0.2,
            r2: 0.9412,
            mae: 2.18,
            rmse: 2.85,
            equation: 'Y = 16.24 + 3.12·(StudyHours) + 0.38·(PrevScore%) + 0.16·(Attendance%) + 0.12·(Assignment) + 0.85·(SelfStudy) - 0.35·(Sleep)',
            input_values: {
              study_hours_per_day: 8.5,
              target_exam_name: 'Final Examination',
              target_exam_max_marks: 100,
              previous_exam_name: 'Pre-Final Examination',
              previous_exam_score: 94,
              previous_exam_max_marks: 100,
              previous_exam_percentage: 94,
              performance_category: 'Top Performer',
              attendance_percentage: 98,
              assignment_score: 96,
              self_study_hours: 5.5,
              sleep_hours: 7.0,
            },
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            actual_score_entered_at: new Date(Date.now() - 3600000 * 1).toISOString(),
          },
          {
            id: 'pred-sample-2',
            student_id: '252U1R1181',
            student_name: 'Bodi Project',
            model_name: 'Simple Linear Regression',
            model_key: 'simple_linear',
            predicted_score: 86.4,
            predicted_percentage: 86.4,
            actual_score: 87,
            actual_percentage: 87,
            prediction_error: 0.6,
            r2: 0.8845,
            mae: 3.42,
            rmse: 4.25,
            equation: 'Y = 32.45 + 7.82 · X',
            input_values: {
              study_hours_per_day: 7.0,
              target_exam_name: 'Final Examination',
              target_exam_max_marks: 100,
              previous_exam_name: 'Mid-Term Examination',
              previous_exam_score: 84,
              previous_exam_max_marks: 100,
              previous_exam_percentage: 84,
              performance_category: 'Excellent',
              attendance_percentage: 93,
              assignment_score: 89,
              self_study_hours: 4.0,
              sleep_hours: 7.0,
            },
            created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
            actual_score_entered_at: new Date(Date.now() - 3600000 * 10).toISOString(),
          },
          {
            id: 'pred-sample-3',
            student_id: '252U1R1167',
            student_name: 'Nayakoti Srihasini',
            model_name: 'Multiple Linear Regression',
            model_key: 'multiple_linear',
            predicted_score: 85.2,
            predicted_percentage: 85.2,
            actual_score: null, // Pending exam completion
            actual_percentage: null,
            prediction_error: null,
            r2: 0.9412,
            mae: 2.18,
            rmse: 2.85,
            equation: 'Y = 16.24 + 3.12·(StudyHours) + 0.38·(PrevScore%) + 0.16·(Attendance%) + 0.12·(Assignment) + 0.85·(SelfStudy) - 0.35·(Sleep)',
            input_values: {
              study_hours_per_day: 6.5,
              target_exam_name: 'Pre-Final Examination',
              target_exam_max_marks: 100,
              previous_exam_name: 'Mid-Term Examination',
              previous_exam_score: 82,
              previous_exam_max_marks: 100,
              previous_exam_percentage: 82,
              performance_category: 'Excellent',
              attendance_percentage: 92,
              assignment_score: 88,
              self_study_hours: 4.0,
              sleep_hours: 7.5,
            },
            created_at: new Date(Date.now() - 3600000 * 44).toISOString(),
          }
        ];
        localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(initialPredictions));
        return initialPredictions;
      }
      const parsed: PredictionRecord[] = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      const valid = parsed.filter(
        (p) =>
          (p.model_key === 'simple_linear' || p.model_key === 'multiple_linear') &&
          !p.student_id?.startsWith('STU-2024')
      );
      if (valid.length !== parsed.length) {
        localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(valid));
      }
      return valid;
    } catch {
      return [];
    }
  }

  static savePrediction(data: Omit<PredictionRecord, 'id' | 'created_at'>): PredictionRecord {
    const predictions = this.getPredictions();
    const newRecord: PredictionRecord = {
      ...data,
      id: 'pred-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString(),
    };
    predictions.unshift(newRecord);
    try {
      localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(predictions));
    } catch (e) {
      console.error('Failed to save prediction record', e);
    }
    return newRecord;
  }

  static updatePredictionActualScore(id: string, actualScore: number, maxMarks = 100): PredictionRecord | null {
    const predictions = this.getPredictions();
    const idx = predictions.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const rec = predictions[idx];
      const error = Number(Math.abs(actualScore - rec.predicted_score).toFixed(1));
      const actualPct = Number(((actualScore / maxMarks) * 100).toFixed(1));
      const updated: PredictionRecord = {
        ...rec,
        actual_score: actualScore,
        actual_percentage: actualPct,
        prediction_error: error,
        actual_score_entered_at: new Date().toISOString(),
      };
      predictions[idx] = updated;
      try {
        localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(predictions));
      } catch (e) {
        console.error('Failed to update prediction actual score', e);
      }
      return updated;
    }
    return null;
  }

  static deletePrediction(id: string): void {
    const predictions = this.getPredictions();
    const filtered = predictions.filter((p) => p.id !== id);
    try {
      localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete prediction record', e);
    }
  }

  static clearAllPredictions(): void {
    try {
      localStorage.removeItem(PREDICTIONS_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear predictions', e);
    }
  }
}
