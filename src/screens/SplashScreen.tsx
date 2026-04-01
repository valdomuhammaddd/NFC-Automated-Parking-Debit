/**
 * MARKIR - Splash Screen
 */

import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, fontSize } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/icon-test.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>MARKIR</Text>
        <Text style={styles.tagline}>Tap & Park with NFC</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
  alignItems: 'center',
  marginBottom: 12,
  },
  logoWrapper: {
  width: 220,
  height: 220,
  backgroundColor: colors.white,
  borderRadius: 110,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 18,
  shadowColor: colors.secondary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.18,
  shadowRadius: 16,
  elevation: 12,
  borderWidth: 5,
  borderColor: colors.secondary,
  },
  logo: {
  width: 170,
  height: 170,
  },
  appName: {
  fontSize: fontSize.xxxl,
  fontWeight: '700',
  color: colors.white,
  marginBottom: 2,
  letterSpacing: 2,
  textShadowColor: colors.secondaryDark,
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 6,
  },
  tagline: {
  fontSize: fontSize.md,
  color: colors.secondaryLight,
  marginTop: 2,
  fontWeight: '600',
  letterSpacing: 1,
  },
});
