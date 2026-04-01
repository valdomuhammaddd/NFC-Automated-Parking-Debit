/**
 * MARKIR - About Screen
 * @author Valdo Muhammad
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';

export const AboutScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      {/* Header */}
      <View style={styles.header}>
        {navigation && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="car-sport" size={48} color={PRIMARY} />
          </View>
          <Text style={styles.appName}>MARKIR</Text>
          <Text style={styles.appTagline}>E-Parking Management System</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Developer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={24} color={PRIMARY} />
            <Text style={styles.cardTitle}>Developer</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.devName}>Valdo Muhammad</Text>
            <Text style={styles.devInfo}>Mahasiswa Sistem Komputer</Text>
            <Text style={styles.devInfo}>Universitas Indo Global Mandiri (UIGM)</Text>
            <Text style={styles.devInfo}>Palembang, Indonesia</Text>
            
            <TouchableOpacity
              style={styles.instagramButton}
              onPress={() => Linking.openURL('https://instagram.com/valdomuhammadd')}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-instagram" size={20} color={WHITE} />
              <Text style={styles.instagramText}>@valdomuhammadd</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About App Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={24} color={PRIMARY} />
            <Text style={styles.cardTitle}>Tentang Aplikasi</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.description}>
              MARKIR adalah aplikasi E-Parking Management yang menggunakan teknologi NFC untuk pengelolaan retribusi parkir secara digital dan efisien.
            </Text>
          </View>
        </View>

        {/* Features Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="rocket-outline" size={24} color={PRIMARY} />
            <Text style={styles.cardTitle}>Fitur Utama</Text>
          </View>
          <View style={styles.cardContent}>
            {[
              { icon: 'scan-outline', text: 'NFC Read & Write' },
              { icon: 'wallet-outline', text: 'E-Wallet Payment' },
              { icon: 'card-outline', text: 'Membership System' },
              { icon: 'time-outline', text: 'Transaction History' },
              { icon: 'people-outline', text: 'Admin & User Roles' },
              { icon: 'car-outline', text: 'Vehicle Management' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name={feature.icon as any} size={18} color={PRIMARY} />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tech Stack Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="code-slash-outline" size={24} color={PRIMARY} />
            <Text style={styles.cardTitle}>Technology Stack</Text>
          </View>
          <View style={styles.cardContent}>
            {[
              'React Native + TypeScript',
              'Redux Toolkit',
              'React Navigation',
              'NFC Manager',
              'Expo Framework',
            ].map((tech, index) => (
              <View key={index} style={styles.techItem}>
                <View style={styles.techDot} />
                <Text style={styles.techText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2025 Valdo Muhammad</Text>
          <Text style={styles.copyright}>All Rights Reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: WHITE,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: GRAY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: PRIMARY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 15,
    color: TEXT_GRAY,
    marginBottom: 8,
  },
  version: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontWeight: '600',
  },
  card: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: GRAY_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginLeft: 8,
  },
  cardContent: {
    padding: 16,
  },
  devName: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 8,
  },
  devInfo: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 4,
    lineHeight: 20,
  },
  instagramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  instagramText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: TEXT_DARK,
    marginLeft: 12,
    fontWeight: '500',
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  techDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY,
    marginRight: 12,
  },
  techText: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  copyright: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginBottom: 4,
  },
});
