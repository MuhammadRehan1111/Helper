import { User, Worker, Job } from './types';

export const mockCategories = [
  { id: '1', name: 'Electrician', icon: 'Zap' },
  { id: '2', name: 'Plumber', icon: 'Wrench' },
  { id: '3', name: 'Carpenter', icon: 'Hammer' },
  { id: '4', name: 'Painter', icon: 'Paintbrush' },
  { id: '5', name: 'AC Technician', icon: 'Wind' },
  { id: '6', name: 'Driver', icon: 'Car' },
  { id: '7', name: 'Cook', icon: 'Sparkles' },
  { id: '8', name: 'Gardner', icon: 'Flower2' },
  { id: '9', name: 'Beautician', icon: 'Flower2' },
  { id: '10', name: 'Tutor', icon: 'GraduationCap' },
];

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Hamza Ahmed',
    phone: '+92 300 1234567',
    role: 'user',
    email: 'hamza@example.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
    favorites: ['w1', 'w7'],
    points: 250,
    savedAddresses: [
      { id: '1', label: 'Home', address: 'DHA Phase 6, Karachi', iconType: 'home' },
      { id: '2', label: 'Office', address: 'I.I Chundrigar Rd, Karachi', iconType: 'office' }
    ]
  },
];

// ─── City data for 300 workers ───────────────────────────────────────────────
const CATEGORIES = ['Electrician','Plumber','AC Technician','Carpenter','Painter','Tutor','Beautician','Driver','Cook','Gardner'] as const;

const TAGS: Record<string, string[]> = {
  'Electrician': ['Wiring', 'Inverter Repair', 'LED Setup', 'Fan Installation', 'Circuit Board'],
  'Plumber': ['Leak Expert', 'Pipe Fitting', 'Bathroom Fittings', 'Water Tank', 'Sewage'],
  'AC Technician': ['Gas Refill', 'Compressor', 'Split AC', 'Inverter AC', 'Central Cooling'],
  'Carpenter': ['Wood Work', 'Furniture', 'Door Fixing', 'Shelving', 'Cabinet Making'],
  'Painter': ['Wall Paint', 'Texture', 'Waterproofing', 'POP Work', 'Exterior Finish'],
  'Tutor': ['Math', 'Science', 'English', 'Quran', 'Computer Science'],
  'Beautician': ['Bridal Makeup', 'Skincare', 'Mehendi', 'Hair Styling', 'Facial'],
  'Driver': ['City Ride', 'Airport Transfer', 'Wedding', 'Monthly Contract', 'Long Route'],
  'Cook': ['Desi Food', 'Chinese', 'BBQ', 'Catering', 'Daily Meals'],
  'Gardner': ['Lawn Care', 'Tree Trimming', 'Plant Setup', 'Landscaping', 'Roof Garden'],
};

const BIOS: Record<string, string> = {
  'Electrician': 'Certified electrician with extensive residential and commercial wiring experience.',
  'Plumber': 'Professional plumber specializing in leak repairs, pipe fitting, and bathroom renovations.',
  'AC Technician': 'Expert AC technician for split, inverter, and window units. Quick diagnostics guaranteed.',
  'Carpenter': 'Skilled carpenter crafting custom furniture, cabinetry, and woodwork to perfection.',
  'Painter': 'Premium wall painter offering texture, waterproofing, and modern finishes.',
  'Tutor': 'Qualified tutor with proven track record in improving student academic performance.',
  'Beautician': 'Professional beautician providing salon-quality services at your doorstep.',
  'Driver': 'Licensed professional driver for safe and comfortable city and long-distance travel.',
  'Cook': 'Experienced cook specializing in authentic desi cuisine and catering services.',
  'Gardner': 'Expert gardener offering complete lawn care, landscaping, and plant maintenance.',
};

interface CityArea { name: string; lat: number; lng: number; }

const KARACHI_AREAS: CityArea[] = [
  { name: 'DHA Phase 1', lat: 24.7931, lng: 67.0599 },
  { name: 'DHA Phase 2', lat: 24.8040, lng: 67.0580 },
  { name: 'DHA Phase 5', lat: 24.7852, lng: 67.0589 },
  { name: 'DHA Phase 6', lat: 24.7950, lng: 67.0491 },
  { name: 'DHA Phase 8', lat: 24.7735, lng: 67.0660 },
  { name: 'Clifton Block 2', lat: 24.8155, lng: 67.0268 },
  { name: 'Clifton Block 5', lat: 24.8200, lng: 67.0340 },
  { name: 'Clifton Block 9', lat: 24.8110, lng: 67.0290 },
  { name: 'Gulshan-e-Iqbal Block 1', lat: 24.9262, lng: 67.0933 },
  { name: 'Gulshan-e-Iqbal Block 6', lat: 24.9200, lng: 67.0870 },
  { name: 'Gulshan-e-Iqbal Block 13', lat: 24.9310, lng: 67.1050 },
  { name: 'North Nazimabad Block H', lat: 24.9420, lng: 67.0340 },
  { name: 'North Nazimabad Block L', lat: 24.9380, lng: 67.0290 },
  { name: 'Nazimabad No.3', lat: 24.9180, lng: 67.0280 },
  { name: 'Korangi Sector 33', lat: 24.8320, lng: 67.1320 },
  { name: 'PECHS Block 2', lat: 24.8620, lng: 67.0640 },
  { name: 'PECHS Block 6', lat: 24.8580, lng: 67.0720 },
  { name: 'Saddar', lat: 24.8560, lng: 67.0220 },
  { name: 'FB Area', lat: 24.9310, lng: 67.0520 },
  { name: 'Malir Cantt', lat: 24.8930, lng: 67.2070 },
];

const LAHORE_AREAS: CityArea[] = [
  { name: 'Gulberg III', lat: 31.5160, lng: 74.3520 },
  { name: 'Gulberg V', lat: 31.5200, lng: 74.3480 },
  { name: 'DHA Phase 1', lat: 31.4750, lng: 74.3910 },
  { name: 'DHA Phase 3', lat: 31.4620, lng: 74.3780 },
  { name: 'DHA Phase 5', lat: 31.4510, lng: 74.3700 },
  { name: 'DHA Phase 6', lat: 31.4430, lng: 74.3680 },
  { name: 'Johar Town Block A', lat: 31.4680, lng: 74.2700 },
  { name: 'Johar Town Block E', lat: 31.4720, lng: 74.2620 },
  { name: 'Johar Town Block G', lat: 31.4590, lng: 74.2580 },
  { name: 'Model Town Block C', lat: 31.4890, lng: 74.3280 },
  { name: 'Model Town Block L', lat: 31.4830, lng: 74.3210 },
  { name: 'Garden Town', lat: 31.5010, lng: 74.3490 },
  { name: 'Faisal Town', lat: 31.4960, lng: 74.2960 },
  { name: 'Township Sector B', lat: 31.4530, lng: 74.2900 },
  { name: 'Bahria Town Sector C', lat: 31.3820, lng: 74.2030 },
  { name: 'Bahria Town Sector E', lat: 31.3760, lng: 74.2080 },
  { name: 'Iqbal Town', lat: 31.4830, lng: 74.2630 },
  { name: 'Cantt Area', lat: 31.5250, lng: 74.3600 },
  { name: 'Allama Iqbal Town', lat: 31.4780, lng: 74.2600 },
  { name: 'Wapda Town', lat: 31.4560, lng: 74.2830 },
];

const ISLAMABAD_AREAS: CityArea[] = [
  { name: 'F-6 Markaz', lat: 33.7270, lng: 73.0700 },
  { name: 'F-7 Markaz', lat: 33.7190, lng: 73.0590 },
  { name: 'F-8 Markaz', lat: 33.7100, lng: 73.0480 },
  { name: 'F-10 Markaz', lat: 33.6960, lng: 73.0220 },
  { name: 'F-11 Markaz', lat: 33.6880, lng: 73.0120 },
  { name: 'G-6', lat: 33.7270, lng: 73.0840 },
  { name: 'G-8 Markaz', lat: 33.7090, lng: 73.0610 },
  { name: 'G-9 Markaz', lat: 33.7010, lng: 73.0420 },
  { name: 'G-10 Markaz', lat: 33.6910, lng: 73.0260 },
  { name: 'G-11 Markaz', lat: 33.6820, lng: 73.0150 },
  { name: 'I-8 Markaz', lat: 33.6690, lng: 73.0730 },
  { name: 'I-9 Industrial', lat: 33.6600, lng: 73.0550 },
  { name: 'I-10 Markaz', lat: 33.6530, lng: 73.0300 },
  { name: 'Blue Area', lat: 33.7130, lng: 73.0890 },
  { name: 'E-7', lat: 33.7330, lng: 73.0630 },
  { name: 'E-11', lat: 33.6860, lng: 72.9790 },
  { name: 'DHA Phase 1', lat: 33.5160, lng: 73.1010 },
  { name: 'DHA Phase 2', lat: 33.5090, lng: 73.0960 },
  { name: 'Bahria Town Phase 7', lat: 33.5340, lng: 73.1160 },
  { name: 'PWD Society', lat: 33.6190, lng: 73.0960 },
];

const FIRST_NAMES_MALE = [
  'Ahmed','Ali','Hassan','Usman','Bilal','Fahad','Imran','Kashif','Tariq','Zubair',
  'Kamran','Naveed','Shahid','Waqar','Asif','Junaid','Naeem','Rizwan','Salman','Waseem',
  'Faisal','Hamza','Jawad','Omer','Saad','Aamir','Daniyal','Farhan','Irfan','Khalid',
  'Mansoor','Qaiser','Rehan','Sohail','Tanveer','Adeel','Babar','Ehsan','Ghulam','Haris',
  'Ismail','Javed','Latif','Moiz','Nadeem','Pervaiz','Rafiq','Sajjad','Tahir','Umar',
];

const FIRST_NAMES_FEMALE = [
  'Ayesha','Fatima','Sana','Zainab','Rabia','Nadia','Saima','Amina','Kiran','Hira',
  'Mariam','Sara','Noor','Bushra','Anam','Sidra','Maheen','Farah','Uzma','Samina',
];

const LAST_NAMES = [
  'Khan','Ahmed','Ali','Shah','Malik','Hussain','Raza','Butt','Chaudhry','Sheikh',
  'Iqbal','Mirza','Qureshi','Siddiqui','Abbasi','Baig','Dar','Gill','Hayat','Javed',
  'Karim','Lodhi','Mughal','Niazi','Pasha','Rana','Saeed','Usmani','Yousuf','Zafar',
];

const AVATARS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
];

// Seeded pseudo-random for deterministic output
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateWorkers(): Worker[] {
  const workers: Worker[] = [];
  const rand = seededRandom(42);

  const cities: { name: string; areas: CityArea[] }[] = [
    { name: 'Karachi', areas: KARACHI_AREAS },
    { name: 'Lahore', areas: LAHORE_AREAS },
    { name: 'Islamabad', areas: ISLAMABAD_AREAS },
  ];

  let id = 1;

  for (const city of cities) {
    for (let i = 0; i < 100; i++) {
      const catIdx = i % CATEGORIES.length;
      const category = CATEGORIES[catIdx];
      const area = city.areas[i % city.areas.length];

      // Name generation
      const isFemale = category === 'Beautician' || (category === 'Tutor' && rand() > 0.5) || (category === 'Cook' && rand() > 0.7);
      const firstNames = isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE;
      const firstName = firstNames[Math.floor(rand() * firstNames.length)];
      const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
      const name = `${firstName} ${lastName}`;

      // Stats
      const rating = parseFloat((3.5 + rand() * 1.5).toFixed(1));
      const reviewsCount = Math.floor(20 + rand() * 400);
      const hourlyRate = Math.floor(400 + rand() * 2100);
      const completedJobs = Math.floor(10 + rand() * 600);
      const distance = parseFloat((0.3 + rand() * 15).toFixed(1));
      const available = rand() > 0.15;
      const verified = rand() > 0.2;
      const isPro = rating >= 4.5 && verified;

      // Slight coordinate jitter for realism
      const lat = area.lat + (rand() - 0.5) * 0.01;
      const lng = area.lng + (rand() - 0.5) * 0.01;

      const tags = TAGS[category] || [];
      const workerTags = tags.filter(() => rand() > 0.4);
      const phone = `+92 3${Math.floor(rand() * 5)}${Math.floor(rand() * 10)} ${Math.floor(1000000 + rand() * 8999999)}`;

      workers.push({
        id: `w${id}`,
        name,
        category,
        tags: workerTags.length > 0 ? workerTags : [tags[0]],
        rating,
        reviewsCount,
        hourlyRate,
        distance,
        available,
        verified,
        backgroundVerified: verified && rand() > 0.3,
        isPro,
        responseTime: `${Math.floor(5 + rand() * 25)} min`,
        responseRate: `${Math.floor(85 + rand() * 15)}%`,
        avatar: AVATARS[Math.floor(rand() * AVATARS.length)],
        bio: BIOS[category] || 'Skilled professional ready to serve you.',
        gallery: [],
        city: city.name,
        lat,
        lng,
        phone,
        completedJobs,
      });
      id++;
    }
  }

  return workers;
}

export const mockWorkers: Worker[] = generateWorkers();

export const mockJobs: Job[] = [
  {
    id: 'j1',
    workerId: 'w1',
    userId: 'u1',
    title: 'Fix ceiling fan wiring',
    status: 'completed',
    date: '2026-05-10',
    price: 1500
  },
  {
    id: 'j2',
    workerId: 'w3',
    userId: 'u1',
    title: 'AC Gas leak fix',
    status: 'in_progress',
    date: '2026-05-18',
    price: 3500
  },
  {
    id: 'j3',
    workerId: 'w2',
    userId: 'u1',
    title: 'Kitchen faucet installation',
    status: 'disputed',
    date: '2026-05-19',
    price: 1800,
    disputeReason: 'Worker damaged the pipe under the sink and walked away. Water is leaking.'
  }
];
