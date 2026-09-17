const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.galleryAlbum.count();
  if (count === 0) {
    console.log('Seeding initial albums with photos...');
    
    // Album 1: Annual Day & Cultural Laurels
    await prisma.galleryAlbum.create({
      data: {
        title: 'Tarang Annual Day & Cultural Celebrations',
        slug: 'tarang-annual-day-2025',
        category: 'Annual Day',
        description: 'Spectacular musical theatrical performances, classical Indian dances, and student awards.',
        coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        isFeatured: true,
        items: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
              title: 'Lighting of the Ceremonial Lamp by Dignitaries',
              sortOrder: 1,
            },
            {
              url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=1200',
              title: 'Classical Himachali Nati Dance Ensemble',
              sortOrder: 2,
            },
            {
              url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
              title: 'Symphony Orchestra & Choir Performance',
              sortOrder: 3,
            },
            {
              url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200',
              title: 'Annual Academic Excellence Trophy Ceremony',
              sortOrder: 4,
            },
          ]
        }
      }
    });

    // Album 2: Olympic Sports Meet
    await prisma.galleryAlbum.create({
      data: {
        title: 'Inter-House Olympic Athletics & Aquatic Championship',
        slug: 'olympic-athletics-sports-meet-2025',
        category: 'Sports',
        description: 'Track and field records, swimming relays in heated indoor pool, and football finals.',
        coverImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
        isFeatured: true,
        items: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200',
              title: 'Swimming Relays at Heated Olympic Complex',
              sortOrder: 1,
            },
            {
              url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200',
              title: '100m Sprint Gold Medalists at the Finish Line',
              sortOrder: 2,
            },
            {
              url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
              title: 'Inter-House Football Final Match on FIFA Turf',
              sortOrder: 3,
            },
          ]
        }
      }
    });

    // Album 3: Robotics & STEM Innovation
    await prisma.galleryAlbum.create({
      data: {
        title: 'National Robotics & AI Innovation Summit',
        slug: 'national-robotics-ai-innovation-summit',
        category: 'Science & Robotics',
        description: 'Humanoid robotics demonstrations, 3D prototyping, and IoT smart Himalayan weather sensors.',
        coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
        isFeatured: true,
        items: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200',
              title: 'Student Team Calibrating Autonomous Drone Sensors',
              sortOrder: 1,
            },
            {
              url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
              title: '3D Printing of Biomechanical Prosthetic Models',
              sortOrder: 2,
            },
            {
              url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200',
              title: 'National Science Exhibition Keynote & Award Presentation',
              sortOrder: 3,
            }
          ]
        }
      }
    });

    console.log('Seeded 3 photo groups with 10 high-resolution images.');
  } else {
    console.log('Gallery already has', count, 'albums.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
