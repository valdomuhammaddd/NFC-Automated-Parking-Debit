/**
 * MARKIR - About Screen
 * Professional redesign with better spacing, elevation, and typography
 * @author Valdo Muhammad
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { colors, spacing, fontSize } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🅿️</Text>
          </View>
          <Text style={styles.appName}>MARKIR E-Parking</Text>
          <Text style={styles.tagline}>Tap, Park, Done.</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.0</Text>
          </View>
        </View>

        {/* Vision & Philosophy */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Visi & Filosofi</Text>
          </View>
          <Text style={styles.cardText}>
            MARKIR hadir untuk mentransformasi sistem retribusi parkir tepi jalan (informal) menjadi ekosistem digital yang modern, efisien, dan terpercaya.
          </Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightText}>
              <Text style={styles.boldText}>Tap and Done</Text> - Setiap transaksi akuntabel, transparan, bebas dari masalah uang kembalian, memberdayakan juru parkir, dan memberikan kepastian hukum bagi pengguna.
            </Text>
          </View>
        </Card>

        {/* Key Features */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="key" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Fitur Kunci</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="phone-portrait" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>NFC Tap-to-Pay</Text>
              <Text style={styles.featureDesc}>Pembayaran retribusi parkir non-tunai melalui tapping Tag NFC kendaraan.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="people" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Role-Based System</Text>
              <Text style={styles.featureDesc}>Pemisahan fungsionalitas untuk Petugas (Admin) dan Pengguna (User).</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="wallet" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Integrated Wallet</Text>
              <Text style={styles.featureDesc}>Manajemen saldo dan koneksi ke E-Wallet (simulasi) untuk pembayaran otomatis.</Text>
            </View>
          </View>
        </Card>

        {/* Developer Info */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Informasi Pengembang</Text>
          </View>
          <Text style={styles.developerRole}>Lead Developer & Full Stack Engineer</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nama</Text>
              <Text style={styles.infoValue}>Valdo Muhammad</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Institusi</Text>
              <Text style={styles.infoValue}>Mahasiswa Sistem Komputer{'\n'}Universitas Indo Global Mandiri{'\n'}Palembang</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Kontak</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com/valdomuhammadd')}>
                <View style={styles.contactButton}>
                  <Ionicons name="logo-instagram" size={20} color={colors.white} />
                  <Text style={styles.contactText}>@valdomuhammadd</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Technical Details */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="code-slash" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Detail Teknis & Lisensi</Text>
          </View>
          
          <View style={styles.techGrid}>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Versi Aplikasi</Text>
              <Text style={styles.techValue}>1.0 (Development Build)</Text>
            </View>
            
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Platform</Text>
              <Text style={styles.techValue}>React Native (TypeScript)</Text>
            </View>
            
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Keterangan</Text>
              <Text style={styles.techValue}>Real NFC API + mock backend simulasi</Text>
            </View>
          </View>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2025 MARKIR E-Parking</Text>
          <Text style={styles.footerText}>All Rights Reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    fontSize: 60,
  },
  appName: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  versionBadge: {
    backgroundColor: colors.primaryAlpha,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  versionText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  // Card Styles
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  cardText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  highlightBox: {
    backgroundColor: colors.primaryAlpha,
    padding: spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  highlightText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '700',
    color: colors.primary,
  },
  // Feature Styles
  featureItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryAlpha,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  // Developer Info
  developerRole: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  infoGrid: {
    gap: spacing.lg,
  },
  infoItem: {
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  // Technical Details
  techGrid: {
    gap: spacing.md,
  },
  techItem: {
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  techLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  techValue: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  copyright: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  footerText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
