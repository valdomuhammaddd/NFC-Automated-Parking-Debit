/**
 * MARKIR - About Screen
 * @author Valdo Muhammad
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, fontSize } from '../theme';

export const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}></Text>
          </View>
          <Text style={styles.appName}>MARKIR</Text>
          <Text style={styles.appVersion}>E-Parking Management v1.0.0</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}> Developer</Text>
          <Text style={styles.name}>Valdo Muhammad</Text>
          <Text style={styles.institution}>Mahasiswa Sistem Komputer</Text>
          <Text style={styles.institution}>Universitas Indo Global Mandiri Palembang</Text>
          
          <TouchableOpacity
            onPress={() => Linking.openURL('https://instagram.com/valdomuhammadd')}
            style={styles.instagramBtn}>
            <Text style={styles.instagram}> @valdomuhammadd</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}> Tentang Aplikasi</Text>
          <Text style={styles.description}>
            MARKIR adalah aplikasi E-Parking Management yang menggunakan teknologi NFC untuk pengelolaan retribusi parkir.
            {'\n\n'}
            Fitur utama:{'\n'}
             NFC Read & Write{'\n'}
             E-Wallet Payment{'\n'}
             Membership System{'\n'}
             Transaction History{'\n'}
             Admin & User Roles
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}> Tech Stack</Text>
          <Text style={styles.tech}>React Native + TypeScript</Text>
          <Text style={styles.tech}>Redux Toolkit</Text>
          <Text style={styles.tech}>React Navigation</Text>
          <Text style={styles.tech}>NFC Manager</Text>
          <Text style={styles.tech}>Expo Framework</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.copyright}> 2025 Valdo Muhammad{'\n'}All Rights Reserved</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  header: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.primary },
  logo: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  logoText: { fontSize: 40 },
  appName: { fontSize: fontSize.xxxl, fontWeight: '700', color: colors.white, marginBottom: spacing.xs },
  appVersion: { fontSize: fontSize.sm, color: colors.primaryLight },
  card: { margin: spacing.lg },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  name: { fontSize: fontSize.xl, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  institution: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  instagramBtn: { marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center' },
  instagram: { fontSize: fontSize.md, fontWeight: '600', color: colors.white },
  description: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 22 },
  tech: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  copyright: { fontSize: fontSize.xs, color: colors.textSecondary, textAlign: 'center' },
});
