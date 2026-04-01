/**
 * MARKIR 2.0 - Complete Theme System
 * Parkee-inspired design with NFC tech branding
 */

// Import everything first
import { colors } from './colors';
import { typography } from './typography';
import { spacing as spacingOriginal, shadows, borderRadius } from './spacing';

// Create enhanced spacing with borderRadius and shadow for backwards compatibility
const spacing = {
  ...spacingOriginal,
  borderRadius,
  shadow: shadows,
};

// Now export them - this ensures proper module loading on web
export { colors, typography, spacing, shadows, borderRadius };

export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing, BorderRadius, Shadows } from './spacing';

export const fontSize = typography.fontSize;
export const fontWeight = typography.fontWeight;
export const shadow = shadows;

// Combined theme object
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
};

export type Theme = typeof theme;

