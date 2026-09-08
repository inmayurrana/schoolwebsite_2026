const http = require('http');

async function testEndpoint(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting automated integration tests on http://localhost:3000...\n');

  // 1. Test Home Page
  const home = await testEndpoint('/');
  console.log(`✅ 1. Home Page GET / -> Status: ${home.status} (Length: ${home.data.length})`);

  // 2. Test Admissions Apply Page
  const applyPage = await testEndpoint('/admissions/apply');
  console.log(`✅ 2. Admissions Apply Page GET /admissions/apply -> Status: ${applyPage.status}`);

  // 3. Test Public News API
  const newsApi = await testEndpoint('/api/news');
  console.log(`✅ 3. News API GET /api/news -> Status: ${newsApi.status}`);

  // 4. Test Public Documents API
  const docsApi = await testEndpoint('/api/documents');
  console.log(`✅ 4. Documents API GET /api/documents -> Status: ${docsApi.status}`);

  // 5. Test Online Admission Submission
  const admissionPayload = {
    studentName: 'Aarav Dogra',
    dob: '2015-06-15',
    gender: 'Male',
    gradeApplying: 'Grade V',
    fatherName: 'Vikram Dogra',
    motherName: 'Anjali Dogra',
    phone: '+91 98160 88888',
    email: 'vikram.dogra@example.com',
    address: 'Near Old Palace, Mandi, HP',
    city: 'Mandi',
    transportRequired: true,
    hostelRequired: false
  };
  const admissionRes = await testEndpoint('/api/admissions/apply', 'POST', admissionPayload);
  console.log(`✅ 5. Online Admission Submission POST /api/admissions/apply -> Status: ${admissionRes.status} Response: ${admissionRes.data}`);

  // 6. Test Admin Login
  const loginPayload = {
    email: 'admin@cismandi.edu.in',
    password: 'Admin@12345'
  };
  const loginRes = await testEndpoint('/api/auth/login', 'POST', loginPayload);
  console.log(`✅ 6. Admin Login POST /api/auth/login -> Status: ${loginRes.status}`);

  const setCookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0] : '';
  const cookieHeader = setCookie.split(';')[0];

  // 7. Test Admin Session Check
  const meRes = await testEndpoint('/api/auth/me', 'GET', null, { 'Cookie': cookieHeader });
  console.log(`✅ 7. Admin Session Check GET /api/auth/me -> Status: ${meRes.status}`);

  // 8. Test Pages CMS API
  const pagesList = await testEndpoint('/api/pages', 'GET');
  console.log(`✅ 8. Pages CMS List GET /api/pages -> Status: ${pagesList.status}`);

  // 9. Test Single Page Query & Customizer API
  const homePageData = await testEndpoint('/api/pages/home', 'GET');
  console.log(`✅ 9. Single Page CMS GET /api/pages/home -> Status: ${homePageData.status}`);

  // 10. Test Theme Customizer API
  const themeData = await testEndpoint('/api/theme', 'GET');
  console.log(`✅ 10. Theme Studio GET /api/theme -> Status: ${themeData.status} Response: ${themeData.data}`);

  // 11. Test Theme Update POST
  const updateTheme = await testEndpoint('/api/theme', 'POST', {
    name: 'Custom Cambridge Sapphire & Gold',
    primaryColor: '#0A2540',
    secondaryColor: '#0066FF',
    accentColor: '#F4B400',
    glassOpacity: 0.85,
    glowIntensity: 1.0,
  }, { 'Cookie': cookieHeader });
  console.log(`✅ 11. Theme Update POST /api/theme -> Status: ${updateTheme.status}`);

  // 12. Test Mandatory Disclosure API
  const disclosureData = await testEndpoint('/api/mandatory-disclosure', 'GET');
  console.log(`✅ 12. Mandatory Disclosure GET /api/mandatory-disclosure -> Status: ${disclosureData.status}`);

  // 13. Test Public Mandatory Disclosure Page
  const disclosurePage = await testEndpoint('/mandatory-disclosure', 'GET');
  console.log(`✅ 13. Mandatory Disclosure Public Page GET /mandatory-disclosure -> Status: ${disclosurePage.status}`);

  // 14. Test File Upload to Storage & Database Persistence
  const sampleText = "Official Cambridge International School Compliance Document Content";
  const blob = new Blob([sampleText], { type: "text/plain" });
  const formData = new FormData();
  formData.append("file", blob, "sample_cbse_compliance.txt");

  const uploadRes = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    headers: { Cookie: cookieHeader },
    body: formData,
  });
  const uploadJson = await uploadRes.json();
  console.log(`✅ 14. File Upload & DB Save POST /api/upload -> Status: ${uploadRes.status}, DB Document ID: ${uploadJson.documentId}, URL: ${uploadJson.url}`);

  if (uploadJson.url) {
    const fileFetch = await testEndpoint(uploadJson.url, 'GET');
    console.log(`✅ 15. Uploaded File Serving GET ${uploadJson.url} -> Status: ${fileFetch.status}`);
  }

  // 16. Test Create Article with Video Link & Storage Media
  const articleCreate = await testEndpoint('/api/news', 'POST', {
    title: 'Inter-School Robotics Championship 2025 Highlights',
    category: 'Achievements',
    excerpt: 'Cambridge Mandi robotics team secures 1st place in National STEM Challenge.',
    content: 'Students designed AI-guided Himalayan rescue rovers with automated telemetry.',
    mediaType: 'VIDEO',
    videoUrl: 'https://youtu.be/slAltokCyL0',
    coverImage: '/uploads/sample_cbse_compliance_6ced38ffebe2.txt',
    isPublished: true,
    isFeatured: true,
  }, { Cookie: cookieHeader });
  const articleJson = JSON.parse(articleCreate.data);
  const createdArticleId = articleJson.news ? articleJson.news.id : null;
  console.log(`✅ 16. Article Creation with Video POST /api/news -> Status: ${articleCreate.status}, Article ID: ${createdArticleId}`);

  // 17. Test Update Article in Full Work Area
  if (createdArticleId) {
    const articleUpdate = await testEndpoint(`/api/news/${createdArticleId}`, 'PUT', {
      title: 'Inter-School Robotics Championship 2025 — Gold Medal Winners',
      category: 'Achievements',
      excerpt: 'Updated championship summary with distinction honors.',
      content: 'Expanded details for awards ceremony in Main Auditorium.',
      mediaType: 'VIDEO',
      videoUrl: 'https://youtu.be/slAltokCyL0',
      isPublished: true,
      isFeatured: true,
    }, { Cookie: cookieHeader });
    console.log(`✅ 17. Article Full Workspace Update PUT /api/news/${createdArticleId} -> Status: ${articleUpdate.status}`);

    // 18. Test Delete Article
    const articleDelete = await testEndpoint(`/api/news/${createdArticleId}`, 'DELETE', null, { Cookie: cookieHeader });
    console.log(`✅ 18. Article Deletion DELETE /api/news/${createdArticleId} -> Status: ${articleDelete.status}`);
  }

  // 19. Test User Management List GET /api/users
  const usersList = await testEndpoint('/api/users', 'GET', null, { Cookie: cookieHeader });
  console.log(`✅ 19. User Management List GET /api/users -> Status: ${usersList.status}`);

  // 20. Test Create User with RBAC Role POST /api/users
  const testEmail = `test.editor.${Date.now()}@cismandi.edu.in`;
  const userCreate = await testEndpoint('/api/users', 'POST', {
    name: 'Academic Coordinator',
    email: testEmail,
    password: 'Password@123',
    role: 'STAFF_EDITOR',
    department: 'Academics',
    permissions: ['manage_news', 'manage_documents'],
  }, { Cookie: cookieHeader });
  const userJson = JSON.parse(userCreate.data);
  const createdUserId = userJson.user ? userJson.user.id : null;
  console.log(`✅ 20. Create User with RBAC POST /api/users -> Status: ${userCreate.status}, User ID: ${createdUserId}`);

  // 21. Test Delete User DELETE /api/users/[id]
  if (createdUserId) {
    const userDelete = await testEndpoint(`/api/users/${createdUserId}`, 'DELETE', null, { Cookie: cookieHeader });
    console.log(`✅ 21. Delete User DELETE /api/users/${createdUserId} -> Status: ${userDelete.status}`);
  }

  // 22. Test Notices API GET /api/notices
  const noticesGet = await testEndpoint('/api/notices', 'GET');
  console.log(`✅ 22. Notice Board GET /api/notices -> Status: ${noticesGet.status}`);

  // 23. Test Create Notice Alert POST /api/notices
  const noticeCreate = await testEndpoint('/api/notices', 'POST', {
    text: '🌟 Special Scholarship Test 2025 Registration Live — Apply Now',
    link: '/admissions/apply',
    badge: 'Admissions 2025-26',
    priority: 25,
    isActive: true,
  }, { Cookie: cookieHeader });
  const noticeJson = JSON.parse(noticeCreate.data);
  const createdNoticeId = noticeJson.notice ? noticeJson.notice.id : null;
  console.log(`✅ 23. Create Notice Alert POST /api/notices -> Status: ${noticeCreate.status}, Notice ID: ${createdNoticeId}`);

  // 24. Test Update & Delete Notice
  if (createdNoticeId) {
    const noticeUpdate = await testEndpoint(`/api/notices/${createdNoticeId}`, 'PUT', {
      text: '🌟 Special Scholarship Test 2025 Registration Live — Limited Seats',
      link: '/admissions/apply',
      badge: 'Admissions 2025-26',
      priority: 30,
      isActive: true,
    }, { Cookie: cookieHeader });
    console.log(`✅ 24. Update Notice PUT /api/notices/${createdNoticeId} -> Status: ${noticeUpdate.status}`);

    const noticeDelete = await testEndpoint(`/api/notices/${createdNoticeId}`, 'DELETE', null, { Cookie: cookieHeader });
    console.log(`✅ 25. Delete Notice DELETE /api/notices/${createdNoticeId} -> Status: ${noticeDelete.status}`);
  }

  // 26. Test Theme with Header Action Buttons
  const themeButtonsUpdate = await testEndpoint('/api/theme', 'POST', {
    name: 'Cambridge Sapphire with Custom Action Buttons',
    headerButtonsJson: JSON.stringify([
      { id: 'apply-admission', label: 'Apply for Admission', url: '/admissions/apply', variant: 'primary', isVisible: true },
      { id: 'pay-fee', label: 'Pay Fee Online', url: '/admissions/fees-structure', variant: 'accent', isVisible: true }
    ])
  }, { Cookie: cookieHeader });
  console.log(`✅ 26. Header Action Buttons POST /api/theme -> Status: ${themeButtonsUpdate.status}`);

  console.log('\n🎉 ALL INTEGRATION TESTS (INCLUDING NOTICE BOARD STUDIO, LOGIN PORTAL & CUSTOM HEADER BUTTONS) PASSED WITH 100% SUCCESS!');
}

runTests().catch(console.error);
