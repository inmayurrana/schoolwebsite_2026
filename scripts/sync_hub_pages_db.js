const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sync() {
  // 1. Sync Faculty
  const facultyCustom = {
    accentColor: '#F59E0B',
    fontFamily: 'Inter',
    stat1Value: '58+',
    stat1Label: 'Faculty Members',
    stat2Value: '100%',
    stat2Label: 'Post-Graduate Certified',
    stat3Value: '14+ Yrs',
    stat3Label: 'Avg Lead Experience',
    stat4Value: '1 : 15',
    stat4Label: 'Teacher-Student Ratio',
  };

  await prisma.pageContent.update({
    where: { slug: 'faculty' },
    data: {
      heroBadge: 'Distinguished Educators',
      heroTitle: 'Faculty & Academic Mentors',
      heroSubtitle: 'Meet the passionate teachers, subject specialists, and academic leaders fostering curiosity, scientific rigor, and character development at Cambridge Mandi.',
      sectionsJson: '[]',
      customStylesJson: JSON.stringify(facultyCustom),
    }
  });
  console.log('Faculty DB row updated successfully');

  // 2. Sync Academics
  const academicsCustom = {
    accentColor: '#F59E0B',
    fontFamily: 'Inter',
    affiliationLabel: 'CBSE Affiliation No. 630198',
    storyHeadline: 'Welcome to Academic Curriculum',
    mainStory: 'Integrated CBSE & Cambridge framework. Cambridge International School Mandi fosters an engaging, safe, and academically rigorous environment where every learner thrives.',
    wing1Badge: 'NURSERY - UKG',
    wing1Title: 'Pre-Primary (Early Years)',
    wing1Desc: 'Montessori-inspired play and sensory discovery for Nursery to UKG.',
    wing1Link: '/academics/pre-primary',
    wing2Badge: 'GRADES 1-5',
    wing2Title: 'Primary Wing (Grades 1-5)',
    wing2Desc: 'Foundational conceptual mastery in numeracy, languages, and sciences.',
    wing2Link: '/academics/primary',
    wing3Badge: 'GRADES 6-8',
    wing3Title: 'Middle School (Grades 6-8)',
    wing3Desc: 'STEM innovation, analytical reasoning, and interdisciplinary projects.',
    wing3Link: '/academics/middle-school',
    wing4Badge: 'GRADES 9-12',
    wing4Title: 'Senior Secondary (Grades 9-12)',
    wing4Desc: 'Rigorous board preparation in Medical, Non-Med, Commerce, and Humanities.',
    wing4Link: '/academics/senior-secondary',
    pedagogyBadge: 'Pedagogical Edge',
    pedagogyTitle: 'Integrated Competitive Exam Coaching & Research Focus',
    pedagogySubtitle: 'Tailored preparation seamlessly embedded within the regular school timetable.',
  };

  await prisma.pageContent.update({
    where: { slug: 'academics' },
    data: {
      heroBadge: 'Academic Curriculum • Cambridge International School',
      heroTitle: 'Academic Curriculum',
      heroSubtitle: 'Integrated CBSE & Cambridge framework',
      sectionsJson: '[]',
      customStylesJson: JSON.stringify(academicsCustom),
    }
  });
  console.log('Academics DB row updated successfully');
}

sync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
