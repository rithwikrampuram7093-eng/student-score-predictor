import { Student, PerformanceCategory } from '../types';

export interface StudentMasterInfo {
  slNo: number;
  name: string;
  regNo: string;
}

export const MASTER_47_STUDENT_LIST: StudentMasterInfo[] = [
  { slNo: 1, name: 'Nayakoti Srihasini', regNo: '252U1R1167' },
  { slNo: 2, name: 'Neduri Venkata Surya Prakash', regNo: '252U1R1168' },
  { slNo: 3, name: 'Nirupadish Gouda', regNo: '252U1R1169' },
  { slNo: 4, name: 'Orsu Lokesh', regNo: '252U1R1170' },
  { slNo: 5, name: 'Pabbathi Vaishnava Reddy', regNo: '252U1R1171' },
  { slNo: 6, name: 'Padiga Sathwik', regNo: '252U1R1172' },
  { slNo: 7, name: 'Padipati Nithin Chowdary', regNo: '252U1R1173' },
  { slNo: 8, name: 'Paidi Sunhith Reddy', regNo: '252U1R1174' },
  { slNo: 9, name: 'Paka Gopinadh', regNo: '252U1R1175' },
  { slNo: 10, name: 'Paladugu Trisha', regNo: '252U1R1176' },
  { slNo: 11, name: 'Palem Srujana', regNo: '252U1R1177' },
  { slNo: 12, name: 'Pamujula Sujith Kumar', regNo: '252U1R1178' },
  { slNo: 13, name: 'Panakanti Anudeep', regNo: '252U1R1179' },
  { slNo: 14, name: 'Pandimukkula Narthik Goud', regNo: '252U1R1180' },
  { slNo: 15, name: 'Bodi Project', regNo: '252U1R1181' },
  { slNo: 16, name: 'Pannala Harshavardhan Reddy', regNo: '252U1R1182' },
  { slNo: 17, name: 'Pasala Abhinandhan Reddy', regNo: '252U1R1183' },
  { slNo: 18, name: 'Pasam Vinod Kumar', regNo: '252U1R1184' },
  { slNo: 19, name: 'Pasupuleti Shalini', regNo: '252U1R1185' },
  { slNo: 20, name: 'Pattipati Dhanusree', regNo: '252U1R1186' },
  { slNo: 21, name: 'Pavan Kumar Reddy Kuncha', regNo: '252U1R1187' },
  { slNo: 22, name: 'Pedapaga Rohan', regNo: '252U1R1188' },
  { slNo: 23, name: 'Peddi Amulya', regNo: '252U1R1189' },
  { slNo: 24, name: 'Peethani Sasrika', regNo: '252U1R1190' },
  { slNo: 25, name: 'Pendyala Manasa', regNo: '252U1R1191' },
  { slNo: 26, name: 'Pinisetti Sai Babu', regNo: '252U1R1192' },
  { slNo: 27, name: 'Pinjari Manoj', regNo: '252U1R1193' },
  { slNo: 28, name: 'Podugu Avinash', regNo: '252U1R1194' },
  { slNo: 29, name: 'Polanki Satwik', regNo: '252U1R1195' },
  { slNo: 30, name: 'Ponduri Gopi Krishna', regNo: '252U1R1196' },
  { slNo: 31, name: 'Pothireddy Sivaram', regNo: '252U1R1197' },
  { slNo: 32, name: 'Potnuru Dilleswara Rao', regNo: '252U1R1198' },
  { slNo: 33, name: 'Potru Sri Ramcharan', regNo: '252U1R1199' },
  { slNo: 34, name: 'Pottipati Prem Varshith', regNo: '252U1R1200' },
  { slNo: 35, name: 'Prajapathi Ravi', regNo: '252U1R1201' },
  { slNo: 36, name: 'Prakash Choudhary', regNo: '252U1R1202' },
  { slNo: 37, name: 'Pundra Navyasri', regNo: '252U1R1203' },
  { slNo: 38, name: 'Puneeth Sai Kurakalva', regNo: '252U1R1204' },
  { slNo: 39, name: 'Purimetla Sri Nandan', regNo: '252U1R1205' },
  { slNo: 40, name: 'Pusala Vaishnavi', regNo: '252U1R1206' },
  { slNo: 41, name: 'Pusukuri Rakesh', regNo: '252U1R1207' },
  { slNo: 42, name: 'Pyneni Preetham Chowdary', regNo: '252U1R1208' },
  { slNo: 43, name: 'R Sathyanarayana', regNo: '252U1R1209' },
  { slNo: 44, name: 'Rajamoni Naveen', regNo: '252U1R1210' },
  { slNo: 45, name: 'Ramachandruni Lasya', regNo: '252U1R1211' },
  { slNo: 46, name: 'Rambappagari Ashruth Rayudu', regNo: '252U1R1212' },
  { slNo: 47, name: 'Rampuram Rithwik', regNo: '252U1R1213' },
];

interface RawProfile {
  hours: number;
  score: number;
  prevName: string;
  prevScore: number;
  currentExam: string;
  category: PerformanceCategory;
  attendance: number;
  assignment: number;
  selfStudy: number;
  sleep: number;
}

// Deterministic calibrated educational profile values for the 47 students
// Structured to represent realistic academic spreads with natural statistical variance
const PROFILES_47: RawProfile[] = [
  // 1: Nayakoti Srihasini
  { hours: 6.5, score: 86, prevName: 'Pre-Final Examination', prevScore: 82, currentExam: 'Final Examination', category: 'Excellent', attendance: 92, assignment: 88, selfStudy: 4.0, sleep: 7.5 },
  // 2: Neduri Venkata Surya Prakash
  { hours: 4.5, score: 72, prevName: 'Mid-Term Examination', prevScore: 68, currentExam: 'Final Examination', category: 'Good', attendance: 84, assignment: 75, selfStudy: 2.5, sleep: 7.0 },
  // 3: Nirupadish Gouda
  { hours: 7.5, score: 91, prevName: 'Pre-Final Examination', prevScore: 89, currentExam: 'Final Examination', category: 'Top Performer', attendance: 96, assignment: 94, selfStudy: 4.5, sleep: 7.0 },
  // 4: Orsu Lokesh
  { hours: 3.0, score: 58, prevName: 'Unit Test 2', prevScore: 54, currentExam: 'Mid-Term Examination', category: 'Average', attendance: 76, assignment: 64, selfStudy: 2.0, sleep: 8.0 },
  // 5: Pabbathi Vaishnava Reddy
  { hours: 5.5, score: 79, prevName: 'Pre-Final Examination', prevScore: 76, currentExam: 'Final Examination', category: 'Good', attendance: 88, assignment: 82, selfStudy: 3.5, sleep: 7.0 },
  // 6: Padiga Sathwik
  { hours: 2.0, score: 48, prevName: 'Unit Test 1', prevScore: 46, currentExam: 'Unit Test 2', category: 'Poor', attendance: 65, assignment: 52, selfStudy: 1.5, sleep: 8.5 },
  // 7: Padipati Nithin Chowdary
  { hours: 5.0, score: 75, prevName: 'Mid-Term Examination', prevScore: 71, currentExam: 'Pre-Final Examination', category: 'Good', attendance: 85, assignment: 78, selfStudy: 3.0, sleep: 7.5 },
  // 8: Paidi Sunhith Reddy
  { hours: 8.0, score: 94, prevName: 'Pre-Final Examination', prevScore: 92, currentExam: 'Final Examination', category: 'Top Performer', attendance: 97, assignment: 95, selfStudy: 5.0, sleep: 6.5 },
  // 9: Paka Gopinadh
  { hours: 3.5, score: 64, prevName: 'Unit Test 2', prevScore: 60, currentExam: 'Mid-Term Examination', category: 'Average', attendance: 78, assignment: 68, selfStudy: 2.5, sleep: 7.5 },
  // 10: Paladugu Trisha
  { hours: 6.0, score: 83, prevName: 'Mid-Term Examination', prevScore: 80, currentExam: 'Final Examination', category: 'Excellent', attendance: 90, assignment: 86, selfStudy: 3.5, sleep: 7.0 },
  // 11: Palem Srujana
  { hours: 7.0, score: 88, prevName: 'Pre-Final Examination', prevScore: 85, currentExam: 'Final Examination', category: 'Excellent', attendance: 94, assignment: 90, selfStudy: 4.0, sleep: 7.5 },
  // 12: Pamujula Sujith Kumar
  { hours: 4.0, score: 68, prevName: 'Unit Test 2', prevScore: 65, currentExam: 'Mid-Term Examination', category: 'Average', attendance: 80, assignment: 70, selfStudy: 2.5, sleep: 8.0 },
  // 13: Panakanti Anudeep
  { hours: 5.5, score: 78, prevName: 'Mid-Term Examination', prevScore: 74, currentExam: 'Final Examination', category: 'Good', attendance: 86, assignment: 80, selfStudy: 3.0, sleep: 7.0 },
  // 14: Pandimukkula Narthik Goud
  { hours: 8.5, score: 96, prevName: 'Pre-Final Examination', prevScore: 94, currentExam: 'Final Examination', category: 'Top Performer', attendance: 98, assignment: 96, selfStudy: 5.5, sleep: 7.0 },
  // 15: Bodi Project (252U1R1181)
  { hours: 7.0, score: 87, prevName: 'Mid-Term Examination', prevScore: 84, currentExam: 'Final Examination', category: 'Excellent', attendance: 93, assignment: 89, selfStudy: 4.0, sleep: 7.0 },
  // 16: Pannala Harshavardhan Reddy
  { hours: 4.5, score: 71, prevName: 'Unit Test 2', prevScore: 67, currentExam: 'Mid-Term Examination', category: 'Good', attendance: 82, assignment: 74, selfStudy: 3.0, sleep: 7.5 },
  // 17: Pasala Abhinandhan Reddy
  { hours: 6.0, score: 81, prevName: 'Mid-Term Examination', prevScore: 78, currentExam: 'Pre-Final Examination', category: 'Good', attendance: 89, assignment: 84, selfStudy: 3.5, sleep: 7.0 },
  // 18: Pasam Vinod Kumar
  { hours: 2.5, score: 52, prevName: 'Unit Test 1', prevScore: 50, currentExam: 'Unit Test 2', category: 'Poor', attendance: 68, assignment: 56, selfStudy: 1.5, sleep: 8.0 },
  // 19: Pasupuleti Shalini
  { hours: 7.5, score: 90, prevName: 'Pre-Final Examination', prevScore: 88, currentExam: 'Final Examination', category: 'Top Performer', attendance: 95, assignment: 93, selfStudy: 4.5, sleep: 7.5 },
  // 20: Pattipati Dhanusree
  { hours: 6.5, score: 84, prevName: 'Mid-Term Examination', prevScore: 81, currentExam: 'Final Examination', category: 'Excellent', attendance: 91, assignment: 87, selfStudy: 4.0, sleep: 7.0 },
  // 21: Pavan Kumar Reddy Kuncha
  { hours: 3.5, score: 62, prevName: 'Unit Test 2', prevScore: 59, currentExam: 'Mid-Term Examination', category: 'Average', attendance: 75, assignment: 66, selfStudy: 2.0, sleep: 8.0 },
  // 22: Pedapaga Rohan
  { hours: 5.0, score: 74, prevName: 'Mid-Term Examination', prevScore: 70, currentExam: 'Final Examination', category: 'Good', attendance: 83, assignment: 77, selfStudy: 3.0, sleep: 7.5 },
  // 23: Peddi Amulya
  { hours: 8.0, score: 93, prevName: 'Pre-Final Examination', prevScore: 91, currentExam: 'Final Examination', category: 'Top Performer', attendance: 97, assignment: 95, selfStudy: 5.0, sleep: 7.0 },
  // 24: Peethani Sasrika
  { hours: 6.0, score: 82, prevName: 'Pre-Final Examination', prevScore: 79, currentExam: 'Final Examination', category: 'Excellent', attendance: 90, assignment: 85, selfStudy: 3.5, sleep: 7.0 },
  // 25: Pendyala Manasa
  { hours: 7.0, score: 89, prevName: 'Mid-Term Examination', prevScore: 86, currentExam: 'Final Examination', category: 'Excellent', attendance: 94, assignment: 91, selfStudy: 4.0, sleep: 7.5 },
  // 26: Pinisetti Sai Babu
  { hours: 4.0, score: 66, prevName: 'Unit Test 2', prevScore: 63, currentExam: 'Mid-Term Examination', category: 'Average', attendance: 79, assignment: 71, selfStudy: 2.5, sleep: 7.5 },
  // 27: Pinjari Manoj
  { hours: 3.0, score: 56, prevName: 'Unit Test 1', prevScore: 52, currentExam: 'Unit Test 2', category: 'Average', attendance: 72, assignment: 62, selfStudy: 2.0, sleep: 8.0 },
  // 28: Podugu Avinash
  { hours: 5.5, score: 77, prevName: 'Mid-Term Examination', prevScore: 73, currentExam: 'Final Examination', category: 'Good', attendance: 87, assignment: 81, selfStudy: 3.5, sleep: 7.0 },
  // 29: Polanki Satwik
  { hours: 2.0, score: 49, prevName: 'Unit Test 1', prevScore: 45, currentExam: 'Unit Test 2', category: 'Poor', attendance: 66, assignment: 54, selfStudy: 1.5, sleep: 8.5 },
  // 30: Ponduri Gopi Krishna
  { hours: 6.5, score: 85, prevName: 'Pre-Final Examination', prevScore: 82, currentExam: 'Final Examination', category: 'Excellent', attendance: 92, assignment: 88, selfStudy: 4.0, sleep: 7.0 },
  // 31: Pothireddy Sivaram
  { hours: 4.5, score: 70, prevName: 'Unit Test 2', prevScore: 66, currentExam: 'Mid-Term Examination', category: 'Good', attendance: 81, assignment: 73, selfStudy: 2.5, sleep: 7.5 },
  // 32: Potnuru Dilleswara Rao
  { hours: 5.0, score: 73, prevName: 'Mid-Term Examination', prevScore: 69, currentExam: 'Pre-Final Examination', category: 'Good', attendance: 84, assignment: 76, selfStudy: 3.0, sleep: 7.0 },
  // 33: Potru Sri Ramcharan
  { hours: 7.5, score: 92, prevName: 'Pre-Final Examination', prevScore: 90, currentExam: 'Final Examination', category: 'Top Performer', attendance: 96, assignment: 94, selfStudy: 4.5, sleep: 7.0 },
  // 34: Pottipati Prem Varshith
  { hours: 3.5, score: 63, prevName: 'Unit Test 2', prevScore: 58, currentExam: 'Mid-Term Examination', category: 'Average', attendance: 77, assignment: 67, selfStudy: 2.0, sleep: 8.0 },
  // 35: Prajapathi Ravi
  { hours: 6.0, score: 80, prevName: 'Mid-Term Examination', prevScore: 77, currentExam: 'Final Examination', category: 'Good', attendance: 88, assignment: 83, selfStudy: 3.5, sleep: 7.5 },
  // 36: Prakash Choudhary
  { hours: 4.0, score: 67, prevName: 'Unit Test 2', prevScore: 64, currentExam: 'Mid-Term Examination', category: 'Average', attendance: 80, assignment: 69, selfStudy: 2.5, sleep: 7.0 },
  // 37: Pundra Navyasri
  { hours: 8.0, score: 95, prevName: 'Pre-Final Examination', prevScore: 93, currentExam: 'Final Examination', category: 'Top Performer', attendance: 98, assignment: 96, selfStudy: 5.0, sleep: 7.0 },
  // 38: Puneeth Sai Kurakalva
  { hours: 5.5, score: 76, prevName: 'Mid-Term Examination', prevScore: 72, currentExam: 'Final Examination', category: 'Good', attendance: 85, assignment: 79, selfStudy: 3.0, sleep: 7.5 },
  // 39: Purimetla Sri Nandan
  { hours: 6.5, score: 86, prevName: 'Pre-Final Examination', prevScore: 83, currentExam: 'Final Examination', category: 'Excellent', attendance: 93, assignment: 89, selfStudy: 4.0, sleep: 7.0 },
  // 40: Pusala Vaishnavi
  { hours: 7.0, score: 87, prevName: 'Pre-Final Examination', prevScore: 84, currentExam: 'Final Examination', category: 'Excellent', attendance: 92, assignment: 88, selfStudy: 4.0, sleep: 7.5 },
  // 41: Pusukuri Rakesh
  { hours: 2.5, score: 53, prevName: 'Unit Test 1', prevScore: 49, currentExam: 'Unit Test 2', category: 'Poor', attendance: 69, assignment: 57, selfStudy: 1.5, sleep: 8.0 },
  // 42: Pyneni Preetham Chowdary
  { hours: 5.0, score: 73, prevName: 'Unit Test 2', prevScore: 69, currentExam: 'Mid-Term Examination', category: 'Good', attendance: 83, assignment: 76, selfStudy: 3.0, sleep: 7.5 },
  // 43: R Sathyanarayana
  { hours: 4.5, score: 69, prevName: 'Mid-Term Examination', prevScore: 65, currentExam: 'Pre-Final Examination', category: 'Average', attendance: 82, assignment: 72, selfStudy: 2.5, sleep: 7.0 },
  // 44: Rajamoni Naveen
  { hours: 6.0, score: 81, prevName: 'Mid-Term Examination', prevScore: 78, currentExam: 'Final Examination', category: 'Good', attendance: 89, assignment: 84, selfStudy: 3.5, sleep: 7.5 },
  // 45: Ramachandruni Lasya
  { hours: 7.5, score: 91, prevName: 'Pre-Final Examination', prevScore: 89, currentExam: 'Final Examination', category: 'Top Performer', attendance: 95, assignment: 93, selfStudy: 4.5, sleep: 7.0 },
  // 46: Rambappagari Ashruth Rayudu
  { hours: 3.0, score: 57, prevName: 'Unit Test 1', prevScore: 53, currentExam: 'Unit Test 2', category: 'Average', attendance: 74, assignment: 63, selfStudy: 2.0, sleep: 8.0 },
  // 47: Rampuram Rithwik
  { hours: 8.5, score: 97, prevName: 'Pre-Final Examination', prevScore: 95, currentExam: 'Final Examination', category: 'Top Performer', attendance: 99, assignment: 97, selfStudy: 5.5, sleep: 7.0 },
];

export function generate47MasterDataset(): Student[] {
  return MASTER_47_STUDENT_LIST.map((studentMeta, index) => {
    const profile = PROFILES_47[index];
    const maxMarks = 100;
    const prevMaxMarks = 100;
    const currentExamPercentage = Number(((profile.score / maxMarks) * 100).toFixed(1));
    const previousExamPercentage = Number(((profile.prevScore / prevMaxMarks) * 100).toFixed(1));

    return {
      id: `stu-${studentMeta.regNo.toLowerCase()}`,
      student_id: studentMeta.regNo,
      student_name: studentMeta.name,
      study_hours_per_day: profile.hours,
      previous_exam_name: profile.prevName,
      previous_exam_score: profile.prevScore,
      previous_exam_max_marks: prevMaxMarks,
      previous_exam_percentage: previousExamPercentage,
      performance_category: profile.category,
      attendance_percentage: profile.attendance,
      previous_attendance_percentage: profile.attendance,
      assignment_score: profile.assignment,
      previous_assignment_score: profile.assignment,
      self_study_hours: profile.selfStudy,
      previous_self_study_hours: profile.selfStudy,
      sleep_hours: profile.sleep,
      previous_sleep_hours: profile.sleep,

      // Target examination actual outcome (known post-exam in historical dataset)
      target_exam_name: profile.currentExam,
      actual_target_exam_score: profile.score,
      actual_target_exam_max_marks: maxMarks,
      actual_target_exam_percentage: currentExamPercentage,

      // Aliases
      current_exam_name: profile.currentExam,
      current_exam_score: profile.score,
      current_exam_max_marks: maxMarks,
      current_exam_percentage: currentExamPercentage,

      created_at: new Date(Date.now() - (47 - index) * 3600000 * 4).toISOString(),
    };
  });
}

export const SYNTHETIC_STUDENTS_DATA: Student[] = generate47MasterDataset();
