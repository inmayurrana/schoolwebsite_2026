const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncWings() {
  // 1. Pre-Primary
  const prePrimaryCustom = {
    accentColor: '#F59E0B',
    fontFamily: 'Inter',
    wingAgeGroup: 'Ages 3 to 5 Years',
    wingHeadline: 'The Joyful Foundation for Lifelong Learning',
    wingParagraph1: 'At Cambridge International School Mandi, our Pre-Primary wing provides a secure, loving, and intellectually rich sanctuary where young children transition happily from home to school.',
    wingParagraph2: 'Our curriculum seamlessly integrates early cognitive milestones, phonics, spatial awareness, musical rhythm, and social emotional intelligence through activity-based learning.',
    wingCtaText: 'Apply for Nursery / KG Admission',
    wingCtaLink: '/admissions/apply',
    highlights: [
      'Montessori & Experiential Play-Way Pedagogy',
      'Jolly Phonics Language & Early Literacy System',
      'Theme-based Sensory & Fine Motor Activity Corners',
      'Dedicated Child-Friendly Kindergarten Play Zone & Sandpit',
      'Air-Conditioned Colorful Smart Classrooms with Soft Flooring',
      'Nurturing Female Faculty with 1:12 Teacher-to-Child Ratio',
    ],
  };

  await prisma.pageContent.update({
    where: { slug: 'pre-primary' },
    data: {
      heroBadge: 'Early Years Foundation',
      heroTitle: 'Pre-Primary Wing (Nursery, LKG, UKG)',
      heroSubtitle: 'A vibrant, joyful wonderland where early curiosity is celebrated and foundational love for discovery is born.',
      heroImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
      sectionsJson: '[]',
      customStylesJson: JSON.stringify(prePrimaryCustom),
    },
  });
  console.log('Synced pre-primary');

  // 2. Primary
  const primaryCustom = {
    accentColor: '#3B82F6',
    fontFamily: 'Inter',
    wingAgeGroup: 'Ages 6 to 10 Years',
    wingHeadline: 'Building Solid Intellectual & Moral Foundations',
    wingParagraph1: 'In the Primary Wing of CIS Mandi, education transitions into structured inquiry. Students are encouraged to experiment, ask probing questions, and understand the real-world application of concepts.',
    wingParagraph2: 'Our 4K interactive smart classrooms, well-stocked junior library, and dedicated outdoor activity periods ensure that every child develops both high cognitive aptitude and physical stamina.',
    wingCtaText: 'Register for Grade 1-5 Admissions',
    wingCtaLink: '/admissions/apply',
    primarySubjects: [
      { name: 'English Language Arts', desc: 'Grammar, creative writing, public speaking, and reading comprehension' },
      { name: 'Mathematics & Logic', desc: 'Concept-first arithmetic, geometry, mental math, and Vedic tricks' },
      { name: 'Environmental Studies (EVS)', desc: 'Scientific curiosity, Himalayan flora & fauna, and conservation' },
      { name: 'Second Language (Hindi)', desc: 'Literature, poetry, grammar, and expressive articulation' },
      { name: 'Digital Coding & ICT', desc: 'Block coding with Scratch, digital safety, and typing fluency' },
      { name: 'Visual & Performing Arts', desc: 'Sketching, Indian classical music, theater drama, and folk dance' },
    ],
  };

  await prisma.pageContent.update({
    where: { slug: 'primary' },
    data: {
      heroBadge: 'Foundational Stage',
      heroTitle: 'Primary Wing (Grades 1 to 5)',
      heroSubtitle: 'Fostering academic confidence, conceptual clarity, and boundless creativity during the critical formative years.',
      heroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      sectionsJson: '[]',
      customStylesJson: JSON.stringify(primaryCustom),
    },
  });
  console.log('Synced primary');

  // 3. Middle School
  const middleCustom = {
    accentColor: '#10B981',
    fontFamily: 'Inter',
    wingAgeGroup: 'Ages 11 to 13 Years',
    wingHeadline: 'Inquiry, Innovation & Scientific Discovery',
    wingParagraph1: 'Middle School marks a vital developmental bridge where students transition into specialized disciplines. At CIS Mandi, science branches into dedicated Physics, Chemistry, and Biology laboratories, while mathematics expands into rigorous algebra and geometry.',
    wingParagraph2: 'Students begin weekly sessions in the Himalayan Robotics & AI Innovation Lab, participating in Hackathons, Model United Nations (MUN), and Olympiad training camps.',
    wingCtaText: 'Apply for Grade 6-8 Admissions',
    wingCtaLink: '/admissions/apply',
    middleFeatures: [
      { title: 'Hands-on Science Labs', desc: 'Individual lab stations for Physics, Chemistry, and Biology practicals every week.' },
      { title: 'Robotics & Arduino', desc: 'Students build obstacle-avoiding rovers, sensor circuits, and Python automation scripts.' },
      { title: 'Third Language Options', desc: 'Choice between Sanskrit and French to foster multilingual versatility.' },
    ],
  };

  await prisma.pageContent.update({
    where: { slug: 'middle-school' },
    data: {
      heroBadge: 'Preparatory & Middle Wing',
      heroTitle: 'Middle School (Grades 6 to 8)',
      heroSubtitle: 'Transitioning to advanced conceptual inquiry, laboratory experimentation, coding, and inter-school leadership.',
      heroImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      sectionsJson: '[]',
      customStylesJson: JSON.stringify(middleCustom),
    },
  });
  console.log('Synced middle-school');

  // 4. Senior Secondary
  const seniorCustom = {
    accentColor: '#8B5CF6',
    fontFamily: 'Inter',
    affiliationLabel: 'CBSE Senior Secondary Affiliation No. 630198',
    wingHeadline: '4 Dedicated Streams Crafted for Global Careers',
    wingParagraph1: "Our Senior Secondary wing is led by specialized Master's & Doctorate faculty with proven track records in guiding students to top percentiles in Class 10 & 12 Board examinations and national entrance tests.",
    seniorStreams: [
      {
        name: 'Science: Non-Medical (PCM)',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science / Python', 'English Core', 'Physical Education'],
        careers: 'IIT-JEE, Engineering, Architecture, Data Science, Aerospace, Defense (NDA)',
      },
      {
        name: 'Science: Medical (PCB)',
        subjects: ['Physics', 'Chemistry', 'Biology', 'Biotechnology / Psychology', 'English Core', 'Physical Education'],
        careers: 'NEET, MBBS, AIIMS, BDS, Veterinary, Biomedical Engineering, Pharmacy',
      },
      {
        name: 'Commerce Stream',
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Applied Mathematics / IP', 'English Core', 'Physical Education'],
        careers: 'Chartered Accountancy (CA), CS, B.Com (Hons), Finance, Corporate Law, Business Management',
      },
      {
        name: 'Humanities & Liberal Arts',
        subjects: ['Political Science', 'History', 'Psychology / Sociology', 'Economics', 'English Core', 'Fine Arts'],
        careers: 'Civil Services (UPSC), Law (CLAT), International Relations, Journalism, Public Policy',
      },
    ],
  };

  await prisma.pageContent.update({
    where: { slug: 'senior-secondary' },
    data: {
      heroBadge: 'Senior Wing & CBSE Boards',
      heroTitle: 'Senior Secondary (Grades 9 to 12)',
      heroSubtitle: 'Benchmark CBSE Board preparation across 4 specialized streams with integrated JEE/NEET coaching and university placement mentorship.',
      heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      sectionsJson: '[]',
      customStylesJson: JSON.stringify(seniorCustom),
    },
  });
  console.log('Synced senior-secondary');
}

syncWings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
