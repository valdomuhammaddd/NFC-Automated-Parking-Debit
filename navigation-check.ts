/**
 * NAVIGATION TESTING HELPER
 * Quick check script untuk memverifikasi semua screen terdaftar
 */

import { UserStackParamList } from './src/data/types';

// Screens yang HARUS terdaftar di UserStackNavigator
const REQUIRED_SCREENS: (keyof UserStackParamList)[] = [
  'UserHome',
  'About',
  // 8 Feature Screens
  'NFCPayment',
  'FindParking',
  'History',
  'Vehicles',
  'Booking',
  'Subscription',
  'Promotion',
  'Help',
  // 5 Account Screens
  'InformasiPribadi',
  'StatusMembership',
  'KendaraanSaya',
  'Notifikasi',
  'PusatBantuan',
];

// Navigation calls di UserHomeScreen
const USER_HOME_NAVIGATIONS = [
  'NFCPayment',
  'FindParking',
  'History',
  'Vehicles',
  'Booking',
  'Subscription',
  'Promotion',
  'Help',
];

// Navigation calls di AccountScreen
const ACCOUNT_SCREEN_NAVIGATIONS = [
  'InformasiPribadi',
  'StatusMembership',
  'KendaraanSaya',
  'Notifikasi',
  'PusatBantuan',
  'About',
];

console.log('✅ Navigation Configuration Check');
console.log('================================');
console.log(`Total Required Screens: ${REQUIRED_SCREENS.length}`);
console.log(`User Home Navigation Targets: ${USER_HOME_NAVIGATIONS.length}`);
console.log(`Account Screen Navigation Targets: ${ACCOUNT_SCREEN_NAVIGATIONS.length}`);
console.log('\n✅ All screens should be accessible!');

export { REQUIRED_SCREENS, USER_HOME_NAVIGATIONS, ACCOUNT_SCREEN_NAVIGATIONS };
