export const colors = {
  // Primary - Biru Laut (Blue Ocean)
  primary: '#0077B6',
  primaryLight: '#48CAE4',
  primaryDark: '#005F8C',
  primaryAlpha: 'rgba(0, 119, 182, 0.1)',
  
  // Secondary & Accent
  accent: '#48CAE4',
  secondary: '#0096C7',
  secondaryLight: '#90E0EF',
  secondaryDark: '#0077B6',
  secondaryAlpha: 'rgba(0, 150, 199, 0.1)',
  
  // Success & Status
  success: '#2ecc71',
  successLight: 'rgba(46, 204, 113, 0.1)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.1)',
  info: '#48CAE4',
  infoLight: 'rgba(72, 202, 228, 0.1)',
  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.1)',
  
  // Payment Status Colors
  paid: '#2ecc71',
  unpaid: '#F59E0B',
  memberFree: '#48CAE4',
  
  // Grayscale
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F7F7F7',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  gray50: '#FAFAFA',
  gray100: '#F7F7F7',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F7F7F7',
  surface: '#FFFFFF',
  
  // Text
  text: '#171717',
  textSecondary: '#737373',
  textLight: '#A3A3A3',
  textInverse: '#FFFFFF',
  
  // Borders & Dividers
  border: '#E5E5E5',
  borderLight: '#F7F7F7',
  divider: '#E5E5E5',
  
  // Shadow
  shadow: '#000000',
  
  // Gradients (Tuples)
  gradientPrimary: ['#0077B6', '#0096C7'] as [string, string],
  gradientSuccess: ['#2ecc71', '#27ae60'] as [string, string],
  gradientSecondary: ['#48CAE4', '#0096C7'] as [string, string],
};

export type Colors = typeof colors;
