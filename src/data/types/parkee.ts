/**
 * Parkee-style Extended Types
 */

// Vehicle Types
export interface Vehicle {
  id: string;
  userId: string;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  type: 'motorcycle' | 'car';
  nfcTagId?: string;
  isDefault: boolean;
  createdAt: string;
}

// Location Types
export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  availableSpots: number;
  totalSpots: number;
  pricePerHour: number;
  features: string[];
  rating: number;
  distance?: number;
  imageUrl?: string;
}

// Transaction Types (Extended)
export interface Transaction {
  id: string;
  userId: string;
  vehicleId: string;
  locationId: string;
  type: 'parking' | 'topup' | 'subscription' | 'penalty';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'promo' | 'parking' | 'topup' | 'system';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Promotion Types
export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  imageUrl: string;
  startDate: string;
  endDate: string;
  terms: string[];
  isActive: boolean;
}

// Voucher Types
export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

// Subscription Types
export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  durationType: 'day' | 'week' | 'month' | 'year';
  benefits: string[];
  isPopular: boolean;
}

// Payment Method Types
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'balance' | 'ewallet' | 'bank' | 'qris';
  icon: string;
  isActive: boolean;
  accountNumber?: string;
  accountName?: string;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
