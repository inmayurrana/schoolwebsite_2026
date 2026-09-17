const { getPageDefault, DEFAULT_PAGE_REGISTRY } = require('../src/lib/pageRegistry');

console.log('has smart-classrooms:', !!DEFAULT_PAGE_REGISTRY['smart-classrooms']);
console.log('has science-labs:', !!DEFAULT_PAGE_REGISTRY['science-labs']);
console.log('getPageDefault smart-classrooms:', getPageDefault('smart-classrooms', '🖥️ Smart Classrooms', '4K interactive digital podiums & panels'));
console.log('getPageDefault science-labs:', getPageDefault('science-labs', '🧪 Science & AI Labs', 'Physics, Chemistry, Biology & Biotech labs'));
