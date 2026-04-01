/**
 * MARKIR - Status Membership Screen
 * Membership Management & Benefits
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '../../redux/hooks';

const PRIMARY = '#0077B6';
const PRIMARY_DARK = '#005F8C';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';
const GRAY = '#A3A3A3';

export const StatusMembershipScreen = ({ navigation }: any) => {
  const { user } = useAppSelector((state) => state.auth);
  
  const isActive = user?.membership_status === 'ACTIVE';
  const expiryDate = '01 Januari 2026';
  
  const benefits = [
    { id: 1, title: 'Diskon 50% Parkir', description: 'Di semua lokasi MARKIR', icon: 'pricetag' },
    { id: 2, title: 'Prioritas Layanan', description: 'Customer support 24/7', icon: 'headset' },
    { id: 3, title: 'Parkir Gratis', description: '10x parkir gratis per bulan', icon: 'car-sport' },
    { id: 4, title: 'Laporan Bulanan', description: 'Statistik parkir lengkap', icon: 'stats-chart' },
  ];

  const handleUpgrade = () => {
    Vibration.vibrate(50);
    navigation.navigate('Subscription');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Status Membership</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Membership Card */}
        <View style={styles.cardSection}>
          <LinearGradient
            colors={isActive ? [PRIMARY, PRIMARY_DARK] : [GRAY, '#6B7280']}
            style={styles.membershipCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="diamond" size={32} color={WHITE} />
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {isActive ? 'MEMBER AKTIF' : 'FREE USER'}
                </Text>
              </View>
            </View>

            <Text style={styles.memberName}>{user?.name || 'User'}</Text>
            <Text style={styles.memberEmail}>{user?.email}</Text>

            <View style={styles.cardDivider} />

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.footerLabel}>Member Since</Text>
                <Text style={styles.footerValue}>November 2025</Text>
              </View>
              {isActive && (
                <View style={styles.expirySection}>
                  <Text style={styles.footerLabel}>Berlaku Hingga</Text>
                  <Text style={styles.footerValue}>{expiryDate}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>
            {isActive ? '✨ Keuntungan Premium' : '🎁 Keuntungan Jika Upgrade'}
          </Text>
          
          {benefits.map((benefit) => (
            <View key={benefit.id} style={styles.benefitItem}>
              <View style={[styles.benefitIcon, isActive && styles.benefitIconActive]}>
                <Ionicons 
                  name={benefit.icon as any} 
                  size={24} 
                  color={isActive ? SUCCESS : TEXT_GRAY} 
                />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
              {isActive && (
                <Ionicons name="checkmark-circle" size={24} color={SUCCESS} />
              )}
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          {isActive ? (
            <>
              <TouchableOpacity 
                style={styles.renewButton}
                onPress={handleUpgrade}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh-circle" size={20} color={WHITE} />
                <Text style={styles.renewButtonText}>PERPANJANG MEMBERSHIP</Text>
              </TouchableOpacity>
              
              <Text style={styles.ctaHelper}>
                Perpanjang sekarang dan dapatkan diskon 20%
              </Text>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={handleUpgrade}
                activeOpacity={0.8}
              >
                <Ionicons name="star" size={20} color={WHITE} />
                <Text style={styles.upgradeButtonText}>UPGRADE KE PREMIUM</Text>
              </TouchableOpacity>
              
              <Text style={styles.ctaHelper}>
                Hanya Rp 299.000/tahun - Hemat hingga 60%
              </Text>
            </>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={PRIMARY} />
          <Text style={styles.infoText}>
            Membership dapat dibatalkan kapan saja. Dana yang tersisa akan dikembalikan secara proporsional.
          </Text>
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
    borderBottomColor: GRAY_LIGHT,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  cardSection: {
    padding: 20,
  },
  membershipCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: WHITE,
    letterSpacing: 1,
  },
  memberName: {
    fontSize: 24,
    fontWeight: '700',
    color: WHITE,
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expirySection: {
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: WHITE,
  },
  benefitsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GRAY_LIGHT,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitIconActive: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  ctaSection: {
    padding: 20,
    paddingTop: 0,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  renewButton: {
    flexDirection: 'row',
    backgroundColor: SUCCESS,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: SUCCESS,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  renewButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  ctaHelper: {
    fontSize: 14,
    color: TEXT_GRAY,
    textAlign: 'center',
    marginTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 119, 182, 0.05)',
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: TEXT_DARK,
    marginLeft: 12,
    lineHeight: 20,
  },
});
