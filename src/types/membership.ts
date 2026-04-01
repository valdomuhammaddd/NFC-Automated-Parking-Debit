/**
 * MARKIR - Membership Type Definitions
 */

export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'FREE';

export interface Membership {
  status: MembershipStatus;
  expiryDate: string;
  tier: 'Premium' | 'Standard';
  benefits: string[];
}
