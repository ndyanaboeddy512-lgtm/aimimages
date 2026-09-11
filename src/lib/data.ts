import { prisma } from './db';

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  client?: string;
  year: number;
  location: string;
  coverImage: string;
  videoUrl?: string;
  duration?: string;
  isVideo: boolean;
  featured: boolean;
  gallery: string[];
  deliverables: string[];
  gearUsed: string[];
}

export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  startingPrice: string;
  deliverables: string[];
  timeline: string;
  order: number;
}

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialUrl?: string;
  order: number;
}

export interface TestimonialData {
  id: string;
  clientName: string;
  roleOrEvent: string;
  comment: string;
  rating: number;
  avatar?: string;
  featured: boolean;
}

export const INITIAL_PROJECTS: ProjectData[] = [
  {
    id: 'proj-1',
    title: 'Aura & Silk: Haute Couture Collection',
    slug: 'aura-silk-haute-couture',
    category: 'Fashion',
    description: 'A high-contrast cinematic fashion campaign captured in Paris and Milan. Exploring organic silhouettes, sculptural draping, and dramatic chiaroscuro lighting.',
    client: 'Maison Éthérée Paris',
    year: 2024,
    location: 'Paris, France',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    duration: '02:45',
    isVideo: true,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop'
    ],
    deliverables: ['4K Cinema Campaign Film (02:45)', '60+ Retouched Lookbook Masters', '3x 9:16 Social Cutdowns', 'Billboard Print Assets'],
    gearUsed: ['ARRI Alexa Mini LF', 'Cooke Anamorphic /i Full Frame Plus', 'Aputure 1200d Pro', 'Easyrig Vario 5']
  },
  {
    id: 'proj-2',
    title: 'The Riviera Vows: Elena & Marc',
    slug: 'the-riviera-vows-elena-marc',
    category: 'Weddings',
    description: 'An intimate 3-day Mediterranean celebration perched above the cliffs of Amalfi. Cinematic narrative weaving natural golden hour light with timeless emotional realism.',
    client: 'Elena & Marc Vance',
    year: 2024,
    location: 'Amalfi Coast, Italy',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    duration: '06:18',
    isVideo: true,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1600&auto=format&fit=crop'
    ],
    deliverables: ['12-Minute 4K Feature Film', '60-Second Cinema Teaser', '850+ Master Color-Graded Stills', 'Bespoke Handcrafted Leather Heirloom Album'],
    gearUsed: ['Sony FX6 & FX3 Dual Rig', 'Leica Summicron-C Cinema Primes', 'DJI Mavic 3 Pro Cine', 'Sennheiser MKH 416 Audio']
  },
  {
    id: 'proj-3',
    title: 'Chronos Heritage: Master Horology',
    slug: 'chronos-heritage-master-horology',
    category: 'Commercial',
    description: 'Macro cinematography and tactile still life campaign unveiling the hand-assembled tourbillon escapement for an independent Swiss watchmaker.',
    client: 'Chronos Horlogerie Genève',
    year: 2024,
    location: 'Geneva, Switzerland',
    coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    duration: '01:30',
    isVideo: true,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1600&auto=format&fit=crop'
    ],
    deliverables: ['Broadcast 60s & 30s TVCs', 'Extreme 100mm Macro Photographic Series', 'Worldwide Digital OOH Displays'],
    gearUsed: ['RED V-Raptor 8K VV', 'Laowa 24mm T14 2X Periprobe', 'Broncolor Scoro 3200 RFS 2 Lighting']
  },
  {
    id: 'proj-4',
    title: 'Midnight Symphony: Neon & Solitude',
    slug: 'midnight-symphony-music-video',
    category: 'Music Videos',
    description: 'Atmospheric narrative music video set across the rain-slicked neon avenues of Shinjuku. Drenched in anamorphic flare and melancholic electronic soundscapes.',
    client: 'Velvet Horizon Records',
    year: 2023,
    location: 'Tokyo, Japan',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    duration: '04:12',
    isVideo: true,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop'
    ],
    deliverables: ['Official 4K Music Video', 'Director\'s Cut with Extended Intro', 'Behind-The-Scenes 35mm Film Still Series'],
    gearUsed: ['ARRI Alexa Mini', 'Atlas Orion 2x Anamorphic Primes', 'Steadicam M-2 System']
  },
  {
    id: 'proj-5',
    title: 'Vanguard Architecture: The Glass Pavilion',
    slug: 'vanguard-architecture-glass-pavilion',
    category: 'Brand Films',
    description: 'An architectural documentary portraying the dialogue between brutalist concrete and panoramic alpine vistas in the Engadin valley.',
    client: 'Atelier Kroll Architekten',
    year: 2024,
    location: 'St. Moritz, Switzerland',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    isVideo: false,
    featured: false,
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop'
    ],
    deliverables: ['Architectural Digest Feature Series', 'Monograph Print Stills', 'Curated Gallery Fine Art Prints'],
    gearUsed: ['Hasselblad H6D-100c', 'Schneider Kreuznach Tilt-Shift Optics', 'Gitzo Systematic Carbon Series']
  },
  {
    id: 'proj-6',
    title: 'Nordic Solitude: Arctic Archipelago',
    slug: 'nordic-solitude-arctic-archipelago',
    category: 'Travel',
    description: 'A photographic journey into the untamed elemental serenity of the Lofoten islands during the sub-polar blue hour.',
    client: 'Nordic Geographic Exploration',
    year: 2023,
    location: 'Lofoten, Norway',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    isVideo: false,
    featured: false,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop'
    ],
    deliverables: ['Expedition Hardcover Book Stills', 'Limited Edition Fine Art Prints', 'Documentary Feature Teaser'],
    gearUsed: ['Sony A1 50MP', 'Sony FE 70-200mm f/2.8 GM OSS II', 'Lee 100 Filter System']
  },
  {
    id: 'proj-7',
    title: 'Portraits of Resilience: The Founders',
    slug: 'portraits-of-resilience-the-founders',
    category: 'Portraits',
    description: 'Intimate, unvarnished black-and-white medium format portraits highlighting pioneering tech innovators and creative visionaries.',
    client: 'Wired & Tech Horizon',
    year: 2024,
    location: 'San Francisco, CA',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
    isVideo: false,
    featured: true,
    gallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop'
    ],
    deliverables: ['Cover & Editorial Feature Stills', 'Exhibition Ready Silver Gelatin Prints', 'Archival Digital Master Files'],
    gearUsed: ['Fujifilm GFX 100 II', 'Mitakon Speedmaster 65mm f/1.4', 'Profoto B10X Plus with 5ft Octa']
  },
  {
    id: 'proj-8',
    title: 'Echoes of Sound: Glastonbury Headliners',
    slug: 'echoes-of-sound-glastonbury-headliners',
    category: 'Events',
    description: 'High-octane live concert coverage and intimate green-room portraiture capturing the raw kinetic energy of iconic stadium performances.',
    client: 'BBC Music & Live Nation',
    year: 2024,
    location: 'Somerset, United Kingdom',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    duration: '03:15',
    isVideo: true,
    featured: false,
    gallery: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop'
    ],
    deliverables: ['4K Multi-Cam Festival Highlights', 'Live Social Press Feed', 'Artist Archive Portfolios'],
    gearUsed: ['Sony FX9 Dual System', 'Fujinon MK 18-55mm & 50-135mm Cinema Zooms', 'Hollyland Wireless Transmitters']
  }
];

export const CATEGORIES = [
  'All',
  'Weddings',
  'Fashion',
  'Commercial',
  'Events',
  'Portraits',
  'Travel',
  'Music Videos',
  'Brand Films'
];

export const SERVICES: ServiceData[] = [
  {
    id: 'srv-1',
    title: 'Luxury Wedding Cinema & Photography',
    slug: 'luxury-wedding-cinema',
    tagline: 'Timeless heirloom storytelling crafted with cinema-grade glass and emotional reverence.',
    description: 'Complete multi-day destination and luxury celebration coverage. We craft breathtaking documentary films and fine art imagery that honor your legacy for generations.',
    icon: 'Camera',
    startingPrice: '$4,800',
    deliverables: [
      'Up to 3 multi-camera cinematographers & 2 master photographers',
      'Full 10-15 minute 4K cinematic feature documentary',
      '60-second teaser for social & private family preview within 72 hours',
      '800+ fully retouched high-resolution stills with printing license',
      'Bespoke Italian linen or Italian leather album'
    ],
    timeline: '3 - 5 Weeks Delivery',
    order: 1
  },
  {
    id: 'srv-2',
    title: 'High Fashion & Editorial Campaigns',
    slug: 'high-fashion-editorial',
    tagline: 'Art-directed high fashion, seasonal lookbooks, and high-impact visual campaigns.',
    description: 'Collaborating with couture labels, modeling agencies, and magazine editors to formulate unmistakable visual aesthetics with exacting color science and lighting mastery.',
    icon: 'Sparkles',
    startingPrice: '$3,500',
    deliverables: [
      'Full-day or multi-day creative studio or remote location shoot',
      'Pre-production concept deck, moodboards, and location scouting',
      'High-end skin retouching and high-resolution master TIFF delivery',
      'Cinematic 9:16 vertical reels and widescreen campaign films',
      'Global commercial licensing'
    ],
    timeline: '10 - 14 Business Days',
    order: 2
  },
  {
    id: 'srv-3',
    title: 'Commercial & Brand Advertising Films',
    slug: 'commercial-brand-films',
    tagline: 'Dynamic broadcast commercials and digital advertising that convert audiences into devoted patrons.',
    description: 'From luxury horology to automotive and tech innovators, we produce cinematic brand stories with theatrical ARRI and RED cinema cameras.',
    icon: 'Film',
    startingPrice: '$6,000',
    deliverables: [
      'Concept development, scriptwriting, and professional storyboarding',
      'Union-grade production crew, gaffers, and professional sound engineers',
      'Broadcast-ready color grade (DaVinci Resolve Studio)',
      'Custom sound design, foley, and fully licensed master score',
      'Formats: 16:9 4K Cinema, 1:1 Social, 9:16 Mobile formats'
    ],
    timeline: '3 - 4 Weeks',
    order: 3
  },
  {
    id: 'srv-4',
    title: 'Executive & Celebrity Portraiture',
    slug: 'executive-portraiture',
    tagline: 'Commanding, authentic portraits for visionary founders, artists, and leaders.',
    description: 'Executed in our private studio or on-site in corporate headquarters. Designed to evoke presence, poise, and sophistication across Fortune 500 features and personal brands.',
    icon: 'UserCheck',
    startingPrice: '$1,800',
    deliverables: [
      '2 to 4 hour session with multiple wardrobe and lighting setups',
      'On-site hair and makeup artist (optional add-on)',
      'Tethered live review on calibrated 4K monitors during shooting',
      '15 master retouched digital portraits with unlimited usage rights'
    ],
    timeline: '5 - 7 Business Days',
    order: 4
  },
  {
    id: 'srv-5',
    title: 'Music Videos & Creative Direction',
    slug: 'music-videos-creative-direction',
    tagline: 'Visual masterpieces amplifying sonic identities with anamorphic imagery and visceral style.',
    description: 'We turn songs into cinematic universes. From indie breakthroughs to international stadium headliners, our directors create visuals that capture cult followings.',
    icon: 'Disc',
    startingPrice: '$5,500',
    deliverables: [
      'Full treatment design and directorial vision board',
      'Location management, permits, talent casting, and art department',
      '4K Anamorphic cinema camera capture with vintage lens character',
      'Precision VFX, stylized color grading, and speed ramping'
    ],
    timeline: '2 - 3 Weeks',
    order: 5
  },
  {
    id: 'srv-6',
    title: 'Live Cultural Events & Galas',
    slug: 'live-cultural-events',
    tagline: 'Unobtrusive, comprehensive capture of galas, festivals, and world-class summits.',
    description: 'Multi-crew real-time photography and cinematography that preserves the scale, atmosphere, and key moments of prestigious private and public events.',
    icon: 'Calendar',
    startingPrice: '$2,800',
    deliverables: [
      'Full event documentation with synchronized dual photo & video teams',
      'Same-night press kit delivery (15-20 key hero stills)',
      '2-3 minute fast-paced cinematic event sizzle reel',
      'Comprehensive password-protected online client gallery'
    ],
    timeline: 'Same-night highlights, 10 days full archive',
    order: 6
  }
];

export const TEAM_MEMBERS: TeamMemberData[] = [
  {
    id: 'team-1',
    name: 'Eddy Ndyanabo',
    role: 'Founder & Principal Cinematographer',
    bio: 'With over 12 years behind the camera, Eddy brings an editorial eye and an unwavering passion for natural light and authentic emotion. His work has been recognized internationally across fine art and commercial publications.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    order: 1
  },
  {
    id: 'team-2',
    name: 'Sophia Laurent',
    role: 'Creative Director & Lead Fashion Stylist',
    bio: 'Former Paris Fashion Week visual consultant, Sophia directs brand identity and artistic vision across our editorial and luxury commercial productions.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    order: 2
  },
  {
    id: 'team-3',
    name: 'Marcus Vance',
    role: 'Head of Post-Production & Senior Colorist',
    bio: 'DaVinci Resolve certified colorist specializing in film emulation, delicate skin tones, and rich organic cinema palettes that define the Aim Images look.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    order: 3
  },
  {
    id: 'team-4',
    name: 'Aria Sterling',
    role: 'Aerial Cinematographer & Lighting Tech',
    bio: 'FAA licensed Part 107 drone pilot and master gaffer, Aria weaves dynamic spatial perspectives and sophisticated lighting architecture into every shoot.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    order: 4
  }
];

export const TESTIMONIALS: TestimonialData[] = [
  {
    id: 'test-1',
    clientName: 'Julian & Camilla Thorne',
    roleOrEvent: 'Lake Como Destination Wedding',
    comment: 'Aim Images captured our celebration with such effortless poetry. When we watched our wedding film for the first time, we were moved to tears. They felt less like a camera crew and more like old friends who cared deeply about our memories.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'test-2',
    clientName: 'Claire Beaumont',
    roleOrEvent: 'VP of Marketing, Maison Éthérée Paris',
    comment: 'Their team produced our spring haute couture campaign with impeccable aesthetic precision. The lighting, movement, and color grading elevated our brand to an entirely new tier. Truly world-class creative partners.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'test-3',
    clientName: 'David K. Lindqvist',
    roleOrEvent: 'CEO, Chronos Horlogerie Genève',
    comment: 'Capturing hand-finished micro-movements requires exceptional technical prowess. Aim Images delivered a commercial campaign that honored 200 years of Swiss heritage while feeling strikingly modern.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'test-4',
    clientName: 'Seraphina Cruz',
    roleOrEvent: 'Recording Artist, Velvet Horizon Records',
    comment: 'They listened to my music and translated its exact emotional frequency into pure visual poetry. The music video exceeded all my expectations and charted within 24 hours of release.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    featured: false
  }
];

export const FAQS = [
  {
    q: 'How far in advance should we reserve our date?',
    a: 'For luxury weddings and large commercial productions, we recommend reaching out 6 to 12 months in advance, especially for prime dates between May and October. Editorial shoots and studio portraits can frequently be accommodated with 2 to 4 weeks notice.'
  },
  {
    q: 'Do you travel internationally for destination projects?',
    a: 'Absolutely. Over 60% of our commissions are international. Our studio handles all necessary carnets, equipment logistics, insurance, and transit arrangements worldwide.'
  },
  {
    q: 'What is your turnaround timeline for deliverables?',
    a: 'We deliver curated teaser trailers and social preview stills within 72 hours of your production. Full master galleries and cinematic feature edits are typically delivered within 3 to 5 weeks, hand-graded and fully finished.'
  },
  {
    q: 'Can we customize our production package?',
    a: 'Every love story and brand campaign is unique. While our packages provide clear foundational tiers, we customize camera configurations, crew sizes, drone coverage, and print deliverables for every single client.'
  },
  {
    q: 'How do you preserve and back up our footage?',
    a: 'We implement redundant dual-card recording on set. Footage is immediately backed up onto encrypted RAID systems and offsite cold cloud storage before our team departs the location.'
  },
  {
    q: 'What are your payment and booking milestones?',
    a: 'To secure your production date on our studio calendar, we require a 30% retainer and a signed digital agreement. 40% is due prior to the shoot date, and the remaining 30% upon final delivery.'
  }
];

export const STATS = [
  { label: 'Years of Excellence', value: '12+' },
  { label: 'Cinematic Films & Projects', value: '450+' },
  { label: 'Global Destinations Visited', value: '28' },
  { label: 'Client Satisfaction Rate', value: '99.8%' }
];

export const BTS_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    title: 'Precision Focus Pulling',
    subtitle: 'On set in Lake Como'
  },
  {
    src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop',
    title: 'Color Grading Suite',
    subtitle: 'DaVinci Resolve 4K HDR Suite'
  },
  {
    src: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop',
    title: 'Drone Cinematography',
    subtitle: 'Aerial sunrise over Amalfi'
  },
  {
    src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    title: 'Studio Lighting Setup',
    subtitle: 'Haute couture editorial shoot'
  }
];

const dbUrl = process.env.DATABASE_URL;
const hasActiveDatabase = Boolean(
  dbUrl &&
  !dbUrl.includes('localhost') &&
  !dbUrl.includes('127.0.0.1') &&
  !dbUrl.includes('dummy')
);

// Hybrid Repository Functions (PostgreSQL via Prisma with seamless fallback)
export async function getProjects(): Promise<ProjectData[]> {
  if (hasActiveDatabase) {
    try {
      const dbProjects = await prisma.project.findMany({
        orderBy: { year: 'desc' }
      });
      if (dbProjects && dbProjects.length > 0) {
        return dbProjects as unknown as ProjectData[];
      }
    } catch (err) {
      console.warn('Prisma getProjects query failed, falling back to static studio data:', err);
    }
  }
  return INITIAL_PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
  if (hasActiveDatabase) {
    try {
      const dbProject = await prisma.project.findUnique({
        where: { slug }
      });
      if (dbProject) {
        return dbProject as unknown as ProjectData;
      }
    } catch (err) {
      console.warn('Prisma getProjectBySlug failed for ' + slug + ', falling back:', err);
    }
  }
  const match = INITIAL_PROJECTS.find(p => p.slug === slug);
  return match || null;
}

export async function getFeaturedProjects(): Promise<ProjectData[]> {
  const projects = await getProjects();
  return projects.filter(p => p.featured);
}
