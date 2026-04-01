/**
 * Input Component
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  style,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <TextInput
          style={[
            styles.input,
            style
          ]}
          placeholderTextColor={colors.textSecondary}
          {...rest}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.danger,
  },
  iconContainer: {
    position: 'absolute',
    left: spacing.sm,
    zIndex: 1,
  },
  input: {
    flex: 1,
    padding: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
