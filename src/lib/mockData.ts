import { User, Worker, Job, Review } from './types';

export const mockCategories = [
  { id: '1', name: 'Electrician', icon: 'Zap' },
  { id: '2', name: 'Plumber', icon: 'Wrench' },
  { id: '3', name: 'Carpenter', icon: 'Hammer' },
  { id: '4', name: 'Painter', icon: 'Paintbrush' },
  { id: '5', name: 'AC Technician', icon: 'Wind' },
  { id: '6', name: 'Mechanic', icon: 'Car' },
  { id: '7', name: 'Cleaning', icon: 'Sparkles' },
  { id: '8', name: 'Moving', icon: 'Truck' },
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

export const mockWorkers: Worker[] = [
  {
    id: 'w1',
    name: 'Aslam Khan',
    category: 'Plumber',
    tags: ['Leak Expert', 'Pipe Fitting', 'Bathroom Fittings'],
    rating: 4.8,
    reviewsCount: 124,
    hourlyRate: 800,
    distance: 1.2,
    available: true,
    verified: true,
    backgroundVerified: true,
    isPro: true,
    responseTime: '15 min',
    responseRate: '99%',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop',
    bio: 'Professional plumber with certifications from local vocational institutes. Specialized in residential and industrial leak repairs.',
    gallery: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=400',
    ]
  },
  {
    id: 'w2',
    name: 'Mariam Ali',
    category: 'Beautician',
    tags: ['Bridal Makeup', 'Skincare', 'Mehendi'],
    rating: 4.9,
    reviewsCount: 89,
    hourlyRate: 1500,
    distance: 2.5,
    available: true,
    verified: true,
    backgroundVerified: true,
    isPro: true,
    responseTime: '10 min',
    responseRate: '98%',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Salon owner with 8 years of home-service experience. Bringing parlor-quality care to your doorstep.',
    gallery: []
  },
  {
    id: 'w3',
    name: 'Raza Shah',
    category: 'Electrician',
    tags: ['AC Maintenance', 'Wiring', 'Inverter Repair'],
    rating: 4.7,
    reviewsCount: 215,
    hourlyRate: 1000,
    distance: 0.8,
    available: true,
    verified: true,
    backgroundVerified: true,
    isPro: true,
    responseTime: '20 min',
    responseRate: '97%',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Certified energy technician. Specializing in efficient wiring and solar inverter setups.',
    gallery: []
  },
  {
    id: 'w7',
    name: 'Nadia Karim',
    category: 'Cleaner',
    tags: ['Deep Cleaning', 'Organization', 'Eco-Friendly'],
    rating: 4.9,
    reviewsCount: 302,
    hourlyRate: 600,
    distance: 1.5,
    available: true,
    verified: true,
    backgroundVerified: true,
    isPro: true,
    responseTime: '5 min',
    responseRate: '100%',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    bio: 'Providing trusted and thorough cleaning services for premium homes in Karachi.',
    gallery: []
  },
];

export const mockJobs: Job[] = [
  {
    id: 'j1',
    workerId: 'w1',
    userId: 'u1',
    title: 'Fix ceiling fan wiring',
    status: 'completed',
    date: '2023-10-12',
    price: 1500
  },
  {
    id: 'j2',
    workerId: 'w3',
    userId: 'u1',
    title: 'AC Gas leak fix',
    status: 'in_progress',
    date: '2023-10-25',
    price: 3500
  }
];
