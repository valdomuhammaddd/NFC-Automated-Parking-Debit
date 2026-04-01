/**
 * Parkee-style Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing } from '../theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  const badgeStyle = [
    styles.base,
    styles[variant],
    styles[size],
    style,
  ];

  const badgeTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={badgeTextStyle}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  
  // Variants
  success: {
    backgroundColor: colors.successLight,
  },
  warning: {
    backgroundColor: colors.warningLight,
  },
  error: {
    backgroundColor: colors.errorLight,
  },
  info: {
    backgroundColor: colors.infoLight,
  },
  default: {
    backgroundColor: colors.gray[200],
  },
  
  // Sizes
  small: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  large: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  
  // Text Styles
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
  successText: {
    color: colors.success,
  },
  warningText: {
    color: colors.warning,
  },
  errorText: {
    color: colors.error,
  },
  infoText: {
    color: colors.info,
  },
  defaultText: {
    color: colors.gray[700],
  },
  smallText: {
    fontSize: typography.fontSize.xs,
  },
  mediumText: {
    fontSize: typography.fontSize.sm,
  },
  largeText: {
    fontSize: typography.fontSize.md,
  },
});
