/**
 * MARKIR - Mock API
 */

import axios from 'axios';
import {
  User,
  Motorcycle,
  TransactionResult,
  TopUpRequest,
  TopUpResponse,
  LoginResponse,
} from '../types';

// Mock Data
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Admin MARKIR',
    email: 'admin@markir.com',
    role: 'admin',
    e_wallet_balance: 100000,
  },
  {
    id: 'user2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    e_wallet_balance: 50000,
    membership_status: 'ACTIVE',
    membership_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockMotorcycles: Motorcycle[] = [
  {
    id: 'motor1',
    user_id: 'user2',
    nfc_tag_id: 'NFC001',
    plate_number: 'B 1234 ABC',
    brand: 'Honda',
    model: 'Beat',
    color: 'Hitam',
    membership_status: 'ACTIVE',
    created_at: new Date().toISOString(),
  },
  {
    id: 'motor2',
    user_id: 'user2',
    nfc_tag_id: 'NFC002',
    plate_number: 'B 5678 XYZ',
    brand: 'Yamaha',
    model: 'Mio',
    color: 'Putih',
    created_at: new Date().toISOString(),
  },
];

export const mockGoogleLogin = async (googleToken: string): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  
  return {
    user: randomUser,
    token: `mock-token-${Date.now()}`,
  };
};

export const mockTagCheck = async (nfc_tag_id: string): Promise<TransactionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const motorcycle = mockMotorcycles.find((m) => m.nfc_tag_id === nfc_tag_id);
  
  if (!motorcycle) {
    throw new Error('Motor tidak terdaftar');
  }
  
  const user = mockUsers.find((u) => u.id === motorcycle.user_id);
  const isMember = user?.membership_status === 'ACTIVE';
  
  return {
    nfc_tag_id,
    vehicle_info: `${motorcycle.brand} ${motorcycle.model} - ${motorcycle.plate_number}`,
    amount: isMember ? 0 : 2000,
    status: isMember ? 'MEMBER_GRATIS' : 'LUNAS',
    timestamp: new Date().toISOString(),
    membership_expires_at: user?.membership_expires_at,
  };
};

export const mockRegisterMotor = async (data: {
  nfc_tag_id: string;
  plate_number: string;
  brand: string;
  model?: string;
  color?: string;
  owner_name: string;
}): Promise<Motorcycle> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const newMotor: Motorcycle = {
    id: `motor${Date.now()}`,
    user_id: 'user2',
    nfc_tag_id: data.nfc_tag_id,
    plate_number: data.plate_number,
    brand: data.brand,
    model: data.model,
    color: data.color,
    created_at: new Date().toISOString(),
  };
  
  mockMotorcycles.push(newMotor);
  
  return newMotor;
};

export const mockGetProfile = async (userId: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

export const mockTopUp = async (data: TopUpRequest): Promise<TopUpResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const user = mockUsers.find((u) => u.id === data.user_id);
  if (!user) {
    throw new Error('User not found');
  }
  
  user.e_wallet_balance += data.amount;
  
  return {
    success: true,
    new_balance: user.e_wallet_balance,
    transaction_id: `txn${Date.now()}`,
  };
};

export const mockGetUserMotorcycles = async (userId: string): Promise<Motorcycle[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return mockMotorcycles.filter((m) => m.user_id === userId);
};
