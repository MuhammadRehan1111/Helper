export interface Address {
  id: string;
  label: string;
  address: string;
  iconType: 'home' | 'office' | 'heart' | 'other';
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'user' | 'worker' | 'admin';
  avatar?: string;
  favorites?: string[];
  savedAddresses?: Address[];
}

export interface Worker {
  id: string;
  name: string;
  category: string;
  tags: string[];
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  distance: number;
  available: boolean;
  verified: boolean;
  backgroundVerified?: boolean;
  isPro?: boolean;
  responseTime?: string;
  responseRate?: string;
  avatar: string;
  bio: string;
  gallery: string[];
  // New fields
  city?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  address?: string;
  completedJobs?: number;
}

export interface CartItem {
  workerId: string;
  date: string;
  time: string;
  address: string;
}

export interface Job {
  id: string;
  workerId: string;
  userId: string;
  title: string;
  status: 'pending' | 'confirmed' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'disputed' | 'reviewed' | 'provider_assigned' | 'on_the_way' | 'cancelled' | 'refunded';
  date: string;
  price?: number;
  promoCode?: string;
  invoiceGenerated?: boolean;
  address?: string;
  category?: string;
  createdAt?: string;
  estimatedArrival?: string;
  cancellationReason?: string;
  cancelledBy?: 'user' | 'worker';
  disputeReason?: string;
}

export interface Review {
  id: string;
  jobId: string;
  workerId: string;
  userId: string;
  rating: number;
  text: string;
  date: string;
  isVerified?: boolean;
}

export interface AgentLog {
  id: string;
  agentName: string;
  action: string;
  reasoning: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AiRequest {
  id: string;
  text: string;
  intent?: {
    service: string;
    location: string;
    time: string;
    urgency: string;
    budget?: string;
  };
  matches?: (Worker & { score?: number; reasoning?: string })[];
  rankingLogic?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
