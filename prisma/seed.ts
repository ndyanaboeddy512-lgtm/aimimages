import { PrismaClient } from '@prisma/client';
import { INITIAL_PROJECTS, SERVICES, TEAM_MEMBERS, TESTIMONIALS } from '../src/lib/data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Aim Images database with luxury studio portfolio & services...');

  // 1. Projects
  for (const proj of INITIAL_PROJECTS) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {
        title: proj.title,
        category: proj.category,
        description: proj.description,
        client: proj.client,
        year: proj.year,
        location: proj.location,
        coverImage: proj.coverImage,
        videoUrl: proj.videoUrl,
        duration: proj.duration,
        isVideo: proj.isVideo,
        featured: proj.featured,
        gallery: proj.gallery,
        deliverables: proj.deliverables,
        gearUsed: proj.gearUsed
      },
      create: {
        title: proj.title,
        slug: proj.slug,
        category: proj.category,
        description: proj.description,
        client: proj.client,
        year: proj.year,
        location: proj.location,
        coverImage: proj.coverImage,
        videoUrl: proj.videoUrl,
        duration: proj.duration,
        isVideo: proj.isVideo,
        featured: proj.featured,
        gallery: proj.gallery,
        deliverables: proj.deliverables,
        gearUsed: proj.gearUsed
      }
    });
  }
  console.log(`Seeded ${INITIAL_PROJECTS.length} portfolio projects.`);

  // 2. Services
  for (const s of SERVICES) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        icon: s.icon,
        startingPrice: s.startingPrice,
        deliverables: s.deliverables,
        timeline: s.timeline,
        order: s.order
      },
      create: {
        title: s.title,
        slug: s.slug,
        tagline: s.tagline,
        description: s.description,
        icon: s.icon,
        startingPrice: s.startingPrice,
        deliverables: s.deliverables,
        timeline: s.timeline,
        order: s.order
      }
    });
  }
  console.log(`Seeded ${SERVICES.length} studio packages.`);

  // 3. Team
  for (const tm of TEAM_MEMBERS) {
    await prisma.teamMember.upsert({
      where: { id: tm.id },
      update: {
        name: tm.name,
        role: tm.role,
        bio: tm.bio,
        image: tm.image,
        order: tm.order
      },
      create: {
        id: tm.id,
        name: tm.name,
        role: tm.role,
        bio: tm.bio,
        image: tm.image,
        order: tm.order
      }
    });
  }
  console.log(`Seeded ${TEAM_MEMBERS.length} team members.`);

  // 4. Testimonials
  for (const t of TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {
        clientName: t.clientName,
        roleOrEvent: t.roleOrEvent,
        comment: t.comment,
        rating: t.rating,
        avatar: t.avatar,
        featured: t.featured
      },
      create: {
        id: t.id,
        clientName: t.clientName,
        roleOrEvent: t.roleOrEvent,
        comment: t.comment,
        rating: t.rating,
        avatar: t.avatar,
        featured: t.featured
      }
    });
  }
  console.log(`Seeded ${TESTIMONIALS.length} client testimonials.`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
