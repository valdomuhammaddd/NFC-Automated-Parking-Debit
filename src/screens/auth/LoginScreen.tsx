/**
 * MARKIR - Login Screen
 * Enhanced with Loading Overlay and Haptic Feedback
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginWithGoogle, loginWithEmail } from '../../redux/slices/authSlice';
import { LoadingOverlay } from '../../components/LoadingOverlay';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';

export const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Haptic feedback
    Vibration.vibrate(50);
    
    try {
      const result = await dispatch(loginWithEmail({ email, password })).unwrap();
      Alert.alert('Login Berhasil!', `Selamat datang, ${result.user.name}!`);
    } catch (error: any) {
      Alert.alert('Login Gagal', error || 'Kredensial tidak valid.');
    }
  };

  const handleGoogleLogin = async () => {
    // Haptic feedback
    Vibration.vibrate(50);
    
    // DISABLED: Google OAuth belum terintegrasi
    Alert.alert(
      'Fitur Belum Tersedia',
      'Login dengan Google akan segera hadir. Silakan gunakan email dan password.',
      [{ text: 'OK' }]
    );
    return;
    
    /* 
    // Future: Implement real Google OAuth
    try {
      setIsGoogleLoading(true);
      const result = await dispatch(loginWithGoogle()).unwrap();
      Alert.alert('Login Berhasil!', `Selamat datang, ${result.user.name}!`);
    } catch (error) {
      Alert.alert('Login Gagal', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsGoogleLoading(false);
    }
    */
  };

  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Fitur registrasi akan segera hadir!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../../assets/icon-test.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>MARKIR</Text>
            <Text style={styles.appTagline}>Tap & Park with NFC</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={TEXT_GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={TEXT_GRAY}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={TEXT_GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={TEXT_GRAY}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={TEXT_GRAY}
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity onPress={handleSignUp} style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.line} />
            </View>

            {/* Login with Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              <Ionicons name="logo-google" size={20} color={PRIMARY} />
              <Text style={styles.googleButtonText}>
                {isGoogleLoading ? 'Loading...' : 'Login with Google'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Developed by Valdo Muhammad</Text>
            <Text style={styles.instagram}>@valdomuhammadd</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Loading Overlay */}
      <LoadingOverlay visible={isLoading || isGoogleLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: GRAY_LIGHT,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 4,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_GRAY,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TEXT_DARK,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: PRIMARY,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  signUpContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  signUpLink: {
    color: PRIMARY,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: TEXT_GRAY,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginBottom: 4,
  },
  instagram: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
  },
});
