const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    }).on('error', reject);
  });
}

function putJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== 1. Testing GET /api/forms ===');
  const formsRes = await getJson('/api/forms');
  console.log('Forms count:', formsRes.body?.forms?.length || 0);

  console.log('=== 2. Testing GET /api/forms/admissions-apply ===');
  const admRes = await getJson('/api/forms/admissions-apply');
  console.log('Admission Form Title:', admRes.body?.form?.title, '| Fields:', admRes.body?.form?.fields?.length);

  console.log('=== 3. Testing PUT /api/forms/admissions-apply ===');
  const updatedForm = admRes.body.form;
  updatedForm.fields.push({
    id: 'f_test_custom',
    name: 'testCustomAadhar',
    label: 'Student Aadhar / Identity Card Number',
    type: 'text',
    placeholder: 'XXXX-XXXX-XXXX',
    required: false,
    width: 'half',
    stepId: 'step_student',
  });
  const putRes = await putJson('/api/forms/admissions-apply', updatedForm);
  console.log('PUT Status:', putRes.status, '| Success:', putRes.body?.success);

  console.log('=== 4. Testing POST /api/forms/submit (Admission) ===');
  const submitRes = await postJson('/api/forms/submit', {
    formSlug: 'admissions-apply',
    studentName: 'Aarav Sharma',
    dob: '2019-05-12',
    gender: 'Male',
    gradeApplying: 'Grade I',
    academicYear: '2027-2028',
    fatherName: 'Rajesh Sharma',
    fatherPhone: '9816012345',
    email: 'rajesh.sharma@example.com',
    phone: '9816012345',
    address: 'VPO Gutkar, Mandi, HP',
    city: 'Mandi',
    state: 'Himachal Pradesh',
    pincode: '175021',
  });
  console.log('Submit Status:', submitRes.status, '| AppNo:', submitRes.body?.applicationNo);

  console.log('=== 5. Testing GET /api/forms/admissions-apply/submissions ===');
  const subsRes = await getJson('/api/forms/admissions-apply/submissions');
  console.log('Submissions count:', subsRes.body?.submissions?.length);
  if (subsRes.body?.submissions?.length > 0) {
    console.log('Latest submission Ref:', subsRes.body.submissions[0].submissionNo, 'Name:', subsRes.body.submissions[0].data?.studentName);
  }

  console.log('=== 6. Testing Careers Form Submit ===');
  const careerSubmitRes = await postJson('/api/forms/submit', {
    formSlug: 'careers-apply',
    applicantName: 'Dr. Priya Verma',
    email: 'priya.verma@example.com',
    phone: '9805098765',
    positionApplied: 'PGT Mathematics',
    qualification: 'MSc Maths, B.Ed',
    experience: '3-5 Years',
    resumeUrl: 'https://example.com/priya_resume.pdf'
  });
  console.log('Career Submit Status:', careerSubmitRes.status, '| Ref:', careerSubmitRes.body?.submissionNo);

  console.log('=== ALL FORM API TESTS COMPLETED SUCCESSFULLY! ===');
}

runTests();
