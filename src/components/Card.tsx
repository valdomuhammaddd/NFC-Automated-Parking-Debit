/**
 * Parkee-style Card Component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../theme';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  onPress,
  style,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
  borderRadius: 16,
    padding: spacing.md,
  },
  elevated: {
    backgroundColor: colors.white,
  boxShadow: '0px 4px 16px rgba(0,0,0,0.10)',
  },
  outlined: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filled: {
    backgroundColor: colors.gray[50],
  },
});
