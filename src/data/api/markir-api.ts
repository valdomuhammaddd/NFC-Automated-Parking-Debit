/**
 * MARKIR API Service
 * Centralized API calls to backend
 */

import axios, { AxiosInstance } from 'axios';

// Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // ✅ Using localhost for development
  : 'https://your-production-api.com/api';

const API_TIMEOUT = 10000;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
api.interceptors.request.use(
  (config) => {
    const token = ''; // TODO: Get from AsyncStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Handle logout
      console.log('🔒 Unauthorized - Token expired');
    }
    return Promise.reject(error);
  }
);

// =====================================================
// AUTH ENDPOINTS
// =====================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      user_id: number;
      email: string;
      name: string;
      phone?: string;
      role: string;
      saldo_ewallet: number;
      membership_status: string;
    };
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// =====================================================
// NFC ENDPOINTS (KUNCI KRITIS)
// =====================================================

export interface NFCScanResponse {
  success: boolean;
  message: string;
  data: {
    vehicle: {
      motorcycle_id: number;
      plat_nomor: string;
      nfc_uid: string;
      jenis_kendaraan: string;
      merk?: string;
      warna?: string;
    };
    owner: {
      user_id: number;
      name: string;
      email: string;
      phone?: string;
      saldo_ewallet: number;
      membership_status: string;
    };
    last_transaction?: {
      status_bayar: string;
      amount_charged: number;
      timestamp: string;
    };
  };
}

export const nfcScan = async (nfc_uid: string): Promise<NFCScanResponse> => {
  const response = await api.post<NFCScanResponse>('/nfc/scan', { nfc_uid });
  return response.data;
};

export const nfcRegister = async (data: {
  user_id: number;
  plat_nomor: string;
  nfc_uid: string;
  jenis_kendaraan: string;
  merk?: string;
  warna?: string;
}) => {
  const response = await api.post('/nfc/register', data);
  return response.data;
};

export const nfcUpdate = async (nfc_uid: string, data: {
  plat_nomor?: string;
  jenis_kendaraan?: string;
  merk?: string;
  warna?: string;
  is_active?: boolean;
}) => {
  const response = await api.put(`/nfc/update/${nfc_uid}`, data);
  return response.data;
};

// =====================================================
// TRANSACTION ENDPOINTS
// =====================================================

export interface CreateTransactionRequest {
  nfc_uid: string;
  petugas_id: number;
  amount_charged: number;
  location?: string;
  notes?: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: {
    transaction_id: number;
    nfc_uid: string;
    plat_nomor: string;
    amount_charged: number;
    status_bayar: 'LUNAS' | 'TERTUNGGAK' | 'PENDING';
    initial_balance: number;
    final_balance: number;
    timestamp: string;
    location?: string;
  };
}

export const createTransaction = async (data: CreateTransactionRequest): Promise<TransactionResponse> => {
  const response = await api.post<TransactionResponse>('/transactions', data);
  return response.data;
};

export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  status_bayar?: string;
  user_id?: number;
  petugas_id?: number;
  start_date?: string;
  end_date?: string;
}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const getTransactionById = async (id: number) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

// =====================================================
// USER ENDPOINTS
// =====================================================

export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  role?: string;
  membership_status?: string;
  is_active?: boolean;
  search?: string;
}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const topUpBalance = async (user_id: number, amount: number, payment_method: string) => {
  const response = await api.post(`/users/${user_id}/topup`, {
    amount,
    payment_method,
  });
  return response.data;
};

export const updateUser = async (id: number, data: {
  name?: string;
  phone?: string;
  membership_status?: string;
  is_active?: boolean;
}) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

// =====================================================
// MOTORCYCLE ENDPOINTS
// =====================================================

export const getMotorcycles = async (params?: {
  page?: number;
  limit?: number;
  user_id?: number;
  jenis_kendaraan?: string;
  is_active?: boolean;
  search?: string;
}) => {
  const response = await api.get('/motorcycles', { params });
  return response.data;
};

export const getMotorcycleById = async (id: number) => {
  const response = await api.get(`/motorcycles/${id}`);
  return response.data;
};

export const deleteMotorcycle = async (id: number) => {
  const response = await api.delete(`/motorcycles/${id}`);
  return response.data;
};

// =====================================================
// PROMOTION ENDPOINTS
// =====================================================

export interface Promotion {
  promotion_id?: number;
  title: string;
  description?: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_until?: string;
  is_active: boolean;
}

export const getPromotions = async (params?: {
  is_active?: boolean;
  search?: string;
}) => {
  const response = await api.get('/promotions', { params });
  return response.data;
};

export const createPromotion = async (data: Promotion) => {
  const response = await api.post('/promotions', data);
  return response.data;
};

export const updatePromotion = async (id: number, data: Partial<Promotion>) => {
  const response = await api.put(`/promotions/${id}`, data);
  return response.data;
};

export const deletePromotion = async (id: number) => {
  const response = await api.delete(`/promotions/${id}`);
  return response.data;
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Export axios instance for custom requests
export default api;
