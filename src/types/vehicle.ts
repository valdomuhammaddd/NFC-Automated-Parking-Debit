/**
 * MARKIR - Vehicle Type Definitions
 */

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'Motor' | 'Mobil';
  nfcTagId: string;
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
}
