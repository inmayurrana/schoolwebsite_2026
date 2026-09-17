const http = require('http');

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function verify() {
  const facultyHtml = await fetch('http://localhost:3000/about/faculty');
  console.log('--- FACULTY PAGE CHECKS ---');
  console.log('Contains "Distinguished Educators":', facultyHtml.includes('Distinguished Educators'));
  console.log('Contains "Faculty & Academic Mentors" (or &amp;):', facultyHtml.includes('Faculty &amp; Academic Mentors') || facultyHtml.includes('Faculty & Academic Mentors'));
  console.log('Contains "58+":', facultyHtml.includes('58+'));
  console.log('Contains "Teacher-Student Ratio":', facultyHtml.includes('Teacher-Student Ratio'));

  const academicsHtml = await fetch('http://localhost:3000/academics');
  console.log('--- ACADEMICS PAGE CHECKS ---');
  console.log('Contains "Academic Curriculum":', academicsHtml.includes('Academic Curriculum'));
  console.log('Contains "Welcome to Academic Curriculum":', academicsHtml.includes('Welcome to Academic Curriculum'));
  console.log('Contains "CBSE Affiliation No. 630198":', academicsHtml.includes('CBSE Affiliation No. 630198'));
  console.log('Contains "Pre-Primary (Early Years)":', academicsHtml.includes('Pre-Primary (Early Years)'));
  console.log('Contains "Primary Wing (Grades 1-5)":', academicsHtml.includes('Primary Wing (Grades 1-5)'));
  console.log('Contains "Middle School (Grades 6-8)":', academicsHtml.includes('Middle School (Grades 6-8)'));
  console.log('Contains "Senior Secondary (Grades 9-12)":', academicsHtml.includes('Senior Secondary (Grades 9-12)'));
  console.log('Does NOT contain broken image "acad_sec_1":', !academicsHtml.includes('acad_sec_1'));
}

verify().catch(console.error);
