import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Aim Images CMS database seeding...');

  // 1. Seed Initial Superadmin
  const adminEmail = 'admin@aimimages.com';
  const hashedPassword = await bcrypt.hash('aimimages2024', 10);

  const superadmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.SUPERADMIN,
      passwordHash: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: 'Aim Images Director',
      passwordHash: hashedPassword,
      role: Role.SUPERADMIN,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Superadmin initialized: ${superadmin.email} (Role: ${superadmin.role})`);

  // 2. Seed Default Site Settings
  const defaultSettings = [
    {
      key: 'site_identity',
      category: 'GENERAL',
      label: 'Studio Brand & Identity',
      description: 'Core brand titles, studio slogan, and hero headline.',
      value: {
        studioName: 'Aim Images HD Studio',
        tagline: 'With God We Always Work Professionally',
        heroHeadline: 'Where Light Meets Timeless Storytelling',
        heroSubheadline:
          'Aim Images HD crafts breathtaking wedding documentaries, high-fashion editorial campaigns, and cinematic commercial films across the globe.',
      },
    },
    {
      key: 'booking_availability',
      category: 'BOOKINGS',
      label: 'Booking Status & Availability',
      description: 'Availability status badge and reservation banner notice.',
      value: {
        isBookingsOpen: true,
        statusBadge: 'Worldwide Studio • Bookings Open',
        statusText: 'Bookings Open',
        statusSubtext: 'Dates are strictly limited to ensure uncompromising creative attention for each client.',
        calloutNote: 'Private dates reserved on a first-confirmed basis',
      },
    },
    {
      key: 'studio_coordinates',
      category: 'CONTACT',
      label: 'Studio Coordinates & WhatsApp',
      description: 'Primary studio headquarters address and WhatsApp hotline.',
      value: {
        address: 'Rugarama Road, Kabale, Uganda',
        city: 'Kabale',
        country: 'Uganda',
        phone: '+256 764 709 563',
        whatsapp: '+256 764 709 563',
        whatsappNumberOnly: '256764709563',
        email: 'aimugimages@gmail.com',
        hours: 'Mon - Sat: 08:00 - 19:00 EAT',
        coverage: 'Available throughout Uganda & Worldwide Commissions',
      },
    },
    {
      key: 'maps_navigation',
      category: 'MAPS',
      label: 'Google Maps Location & Directions',
      description: 'Interactive map embed link and Google Maps directions URL.',
      value: {
        directionsUrl: 'https://maps.google.com/?q=Rugarama+Road,+Kabale,+Uganda',
        embedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.87979606132!2d29.9866!3d-1.2536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc6a3f12345678%3A0xabcdef1234567890!2sKabale%2C%20Uganda!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug',
      },
    },
    {
      key: 'social_profiles',
      category: 'GENERAL',
      label: 'Social Media Accounts',
      description: 'Direct links to official studio social channels.',
      value: {
        instagram: 'https://instagram.com/aimimages_hd_photography',
        youtube: 'https://youtube.com/@AimImagesphotography',
        whatsapp: 'https://wa.me/256764709563',
      },
    },
    {
      key: 'seo_meta',
      category: 'SEO',
      label: 'Search Engine Optimization (SEO)',
      description: 'Global meta tags, OpenGraph sharing info, and keywords.',
      value: {
        metaTitle: 'Aim Images | Luxury Cinema & Creative Photography Studio',
        metaDescription:
          'Aim Images HD is a world-class creative studio specializing in luxury wedding cinema, high-fashion editorial lookbooks, commercial advertising, and executive portraiture.',
        keywords:
          'photography studio, cinematography, luxury wedding videography, editorial fashion, commercial brand films, aim images, kabale uganda photography',
        ogImageUrl: '/logo.png',
      },
    },
  ];

  for (const s of defaultSettings) {
    const existing = await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {
        value: s.value,
        label: s.label,
        description: s.description,
        updatedById: superadmin.id,
      },
      create: {
        key: s.key,
        category: s.category,
        label: s.label,
        description: s.description,
        value: s.value,
        updatedById: superadmin.id,
      },
    });

    // Record initial version 1
    await prisma.settingRevision.create({
      data: {
        settingId: existing.id,
        value: s.value,
        version: 1,
        changeReason: 'Initial CMS system seed',
        createdById: superadmin.id,
      },
    });
  }
  console.log(`✅ ${defaultSettings.length} site settings initialized with revision history.`);

  // 3. Seed Showcase Projects
  const projects = [
    {
      slug: 'aura-silk-haute-couture',
      title: 'Aura & Silk: Haute Couture Collection',
      category: 'Fashion',
      description:
        'A high-contrast cinematic fashion campaign captured in Paris and Milan. Exploring organic silhouettes, sculptural draping, and dramatic chiaroscuro lighting.',
      client: 'Maison Éthérée Paris',
      year: 2024,
      location: 'Paris, France',
      coverImage:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-fashion-show-42998-large.mp4',
      duration: '02:45',
      isVideo: true,
      featured: true,
      order: 1,
      gallery: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
      ],
      deliverables: ['4K Anamorphic Hero Film', '60s Social Cuts', '40 Retouched Editorial Plates'],
      gearUsed: ['ARRI Alexa Mini LF', 'Cooke Anamorphic /i', 'Astera Titan Tubes'],
    },
    {
      slug: 'the-riviera-vows-elena-marc',
      title: 'The Riviera Vows: Elena & Marc',
      category: 'Weddings',
      description:
        'An intimate 3-day Mediterranean celebration perched above the cliffs of Amalfi. Cinematic narrative weaving natural golden hour light with timeless emotional realism.',
      client: 'Elena & Marc Vance',
      year: 2024,
      location: 'Amalfi Coast, Italy',
      coverImage:
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-groom-putting-on-cufflinks-43003-large.mp4',
      duration: '06:18',
      isVideo: true,
      featured: true,
      order: 2,
      gallery: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
      ],
      deliverables: ['20-minute Feature Doc', '6-minute Cinematic Trailer', '750 Curated Proofs'],
      gearUsed: ['Sony FX6 & FX3', 'Leica Summicron-C Primes', 'DJI Ronin 4D'],
    },
    {
      slug: 'chronos-heritage-master-horology',
      title: 'Chronos Heritage: Master Horology',
      category: 'Commercial',
      description:
        'Macro cinematography and tactile still life campaign unveiling the hand-assembled tourbillon escapement for an independent Swiss watchmaker.',
      client: 'Chronos Horlogerie Genève',
      year: 2024,
      location: 'Geneva, Switzerland',
      coverImage:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-putting-on-a-watch-close-up-43004-large.mp4',
      duration: '01:30',
      isVideo: true,
      featured: true,
      order: 3,
      gallery: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop',
      ],
      deliverables: ['Global TV Commercial (30s & 60s)', 'Macro Billboard Stills'],
      gearUsed: ['RED V-Raptor 8K VV', 'Laowa 24mm Probe Lens', 'Aputure 1200d Pro'],
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✅ ${projects.length} showcase projects initialized.`);

  // 4. Seed Services & Packages
  const services = [
    {
      slug: 'luxury-wedding-cinema',
      title: 'Luxury Wedding Cinema',
      tagline: 'Multi-cam cinematic documentary for distinguished unions.',
      description: 'Uncompromising coverage preserving the raw emotion, grandeur, and spontaneous magic of your celebration.',
      icon: 'Camera',
      startingPrice: '$4,800',
      timeline: '4 - 6 Weeks',
      order: 1,
      deliverables: [
        'Lead Director + 2 Associate Cinematographers',
        'Full 4K Ultra HD Multi-Angle Coverage',
        'Cinematic Highlight Trailer (4 - 7 mins)',
        'Full-Length Documentary Feature (30 - 60 mins)',
        'Drone Aerial Footage (FAA Certified Pilots)',
        'Bespoke Gold-Plated USB Keepsake & Cloud Vault',
      ],
    },
    {
      slug: 'haute-couture-fashion-lookbooks',
      title: 'Haute Couture & Fashion Lookbooks',
      tagline: 'High-contrast editorial narratives for luxury fashion houses.',
      description: 'Art-directed fashion films and lookbook spreads designed to elevate designer collections and brand presence.',
      icon: 'Sparkles',
      startingPrice: '$3,500',
      timeline: '2 - 3 Weeks',
      order: 2,
      deliverables: [
        'Creative Director + Lighting Master',
        'Studio or Global Destination Staging',
        'High-End Skin Retouching & Color Grading',
        '40 Curated Magazine-Ready Master Stills',
        '60-second 4K Vertical Campaign Cut',
        'Full Commercial Licensing Rights',
      ],
    },
    {
      slug: 'commercial-brand-films',
      title: 'Commercial Brand Films',
      tagline: 'Cinematic brand films and architectural showcases.',
      description: 'High-impact promotional media that positions brands at the pinnacle of their respective industries.',
      icon: 'Film',
      startingPrice: '$6,200',
      timeline: '3 - 5 Weeks',
      order: 3,
      deliverables: [
        'Complete Pre-Production & Storyboarding',
        'RED / ARRI Cinema Camera Rigging',
        'Bespoke Sound Design & Original Score',
        'Broadcast Master (ProRes 4444)',
        'Comprehensive Social Cut Package (9:16, 1:1, 16:9)',
        'Full Buyout for Global Distribution',
      ],
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`✅ ${services.length} services initialized.`);

  // 5. Seed Testimonials
  const testimonials = [
    {
      clientName: 'Elena & Marc Vance',
      roleOrEvent: 'Amalfi Coast Destination Wedding',
      comment:
        'Aim Images turned our three-day Italian celebration into an absolute cinematic masterpiece. Eddy and his crew moved like ghosts—completely unobtrusive yet capturing every tear, look, and sunset with masterwork precision.',
      rating: 5,
      featured: true,
      order: 1,
    },
    {
      clientName: 'Maison Éthérée Paris',
      roleOrEvent: 'Autumn/Winter Lookbook Campaign',
      comment:
        'The lighting design and understanding of haute couture silhouettes exceeded every standard of our Parisian creative team. Aim Images delivers international caliber art direction.',
      rating: 5,
      featured: true,
      order: 2,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✅ ${testimonials.length} testimonials initialized.`);

  // 6. Record Initial Audit Log
  await prisma.auditLog.create({
    data: {
      action: 'CREATE',
      entityType: 'SiteSetting',
      entityTitle: 'System Initialization',
      afterValues: {
        admin: adminEmail,
        settingsSeeded: defaultSettings.length,
        projectsSeeded: projects.length,
      },
      userId: superadmin.id,
      userName: superadmin.name,
      userEmail: superadmin.email,
      userRole: superadmin.role,
      metadata: { seedRun: true, timestamp: new Date().toISOString() },
    },
  });

  console.log('🎉 Aim Images CMS Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
