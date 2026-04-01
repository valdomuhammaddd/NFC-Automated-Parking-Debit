/**
 * MARKIR - TypeScript Type Definitions
 */

// Re-export Parkee types
export * from './parkee';

// User Types
export type UserRole = 'admin' | 'user';
export type PaymentStatus = 'LUNAS' | 'TERTUNGGAK' | 'MEMBER_GRATIS';
export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
export type EWalletProvider = 'GOPAY' | 'DANA' | 'LINKAJA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  e_wallet_balance: number;
  balance?: number; // Parkee-style balance
  phone?: string;
  avatar?: string;
  membership_status?: MembershipStatus;
  membership_expires_at?: string;
}

export interface Motorcycle {
  id: string;
  user_id: string;
  nfc_tag_id: string;
  plate_number: string;
  brand: string;
  model?: string;
  color?: string;
  membership_status?: MembershipStatus;
  created_at: string;
}

export interface TransactionResult {
  nfc_tag_id: string;
  vehicle_info: string;
  amount: number;
  status: PaymentStatus;
  timestamp: string;
  membership_expires_at?: string;
}

export interface TopUpRequest {
  user_id: string;
  amount: number;
  provider: EWalletProvider;
}

export interface TopUpResponse {
  success: boolean;
  new_balance: number;
  transaction_id: string;
}

export interface NFCTagData {
  id: string;
  data?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface APIError {
  message: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface UserState {
  profile: User | null;
  motorcycles: Motorcycle[];
  isLoading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: TransactionResult[];
  isLoading: boolean;
  error: string | null;
  lastTransaction: TransactionResult | null;
}

export type RootStackParamList = {
  Login: undefined;
  AdminStack: undefined;
  UserStack: undefined;
};

export type AdminStackParamList = {
  AdminHome: undefined;
  Penagihan: undefined;
  RegistrasiMotor: undefined;
  WriteNFC: undefined;
  ManagePromotions: undefined;
  About: undefined;
};

export type UserStackParamList = {
  UserHome: undefined;
  Profile: undefined;
  TopUp: undefined;
  RiwayatTransaksi: undefined;
  About: undefined;
  // 8 Feature Screens
  NFCPayment: undefined;
  FindParking: undefined;
  History: undefined;
  Vehicles: undefined;
  Booking: undefined;
  Subscription: undefined;
  Promotion: undefined;
  Help: undefined;
  // 5 Account Management Screens
  InformasiPribadi: undefined;
  StatusMembership: undefined;
  KendaraanSaya: undefined;
  Notifikasi: undefined;
  PusatBantuan: undefined;
};
