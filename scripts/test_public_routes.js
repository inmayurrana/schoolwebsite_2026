const http = require('http');

const publicRoutes = [
  '/',
  '/about',
  '/about/chairman-message',
  '/about/principal-message',
  '/about/mission-vision',
  '/about/faculty',
  '/academics',
  '/admissions',
  '/facilities',
  '/student-life',
  '/gallery',
  '/admin/pages',
  '/admin/social-media',
  '/admin/header-footer'
];

async function testRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      console.log(`[HTTP ${res.statusCode}] ${path}`);
      resolve({ path, statusCode: res.statusCode });
    }).on('error', (err) => {
      console.log(`[HTTP Error] ${path}:`, err.message);
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log('--- Testing Public & Admin Web Routes ---');
  for (const r of publicRoutes) {
    await testRoute(r);
  }
}

run();
