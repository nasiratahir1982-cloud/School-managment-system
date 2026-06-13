const fs = require('fs');
const content = fs.readFileSync('frontend/src/pages/UnifiedDashboard.tsx', 'utf-8');

const features = [
  'My Classes', 'Lesson Planner', 'Class Diary', 'Attendance Entry',
  'Assignment Creation', 'Quiz Creation', 'Grade Book', 'Student Remarks',
  'Parent Communication', 'Teacher Leave Requests'
];

features.forEach(f => {
  const hasModal = content.includes("activeFeature === '" + f + "'") || 
                   content.includes("'" + f + "'");
  const hasCase = content.includes("case '" + f + "':");
  console.log(
    hasModal ? 'MODAL:YES' : 'MODAL:NO ',
    '|',
    hasCase ? 'CASE:YES' : 'CASE:NO ',
    '|', f
  );
});
