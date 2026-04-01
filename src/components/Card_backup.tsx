/**
 * MARKIR E-Parking - Card Component
 * @author Valdo Muhammad
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadow } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  elevated = true,
}) => {
  return (
    <View
      style={[
        styles.card,
        typeof spacing[padding] === 'number' ? { padding: spacing[padding] } : {},
        elevated && shadow.md,
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
});
