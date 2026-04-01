/**
 * MARKIR Application
 * @author Valdo Muhammad
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, View, Image, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
// import NFCService from './src/utils/nfcService'; // Disabled for web
import { colors, spacing, fontSize } from './src/theme';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Animate splash
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start();

        // Initialize NFC (only on native platforms)
        if (Platform.OS !== 'web') {
          try {
            // await NFCService.init();
            console.log('✅ NFC initialized successfully');
          } catch (error) {
            console.log('⚠️ NFC not available (expected in Expo Go)');
          }
        } else {
          console.log('ℹ️ NFC not supported on web platform');
        }

        // Wait minimum 2 seconds for splash
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Still continue to app even if there's an error
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
        <Animated.View
          style={[
            styles.splashContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('./assets/icon-test.png')}
              style={styles.splashLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.splashTitle}>MARKIR</Text>
          <Text style={styles.splashTagline}>Tap & Park with NFC</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 200,
    height: 200,
    backgroundColor: colors.white,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  splashLogo: {
    width: 180,
    height: 180,
  },
  splashTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
    letterSpacing: 2,
  },
  splashTagline: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
