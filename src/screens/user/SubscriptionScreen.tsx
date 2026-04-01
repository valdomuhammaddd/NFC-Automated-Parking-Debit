/**
 * MARKIR - Subscription Screen
 * @author Valdo Muhammad
 * Fitur: Menampilkan saldo dan status membership
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/hooks';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';
const GOLD = '#FFD700';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
  color: string;
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: 50000,
    duration: '1 Bulan',
    benefits: [
      'Parkir gratis di semua lokasi MARKIR',
      'Tidak ada biaya admin',
      'Priority customer service',
      'Akses parkir 24/7',
    ],
    color: PRIMARY,
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    price: 500000,
    duration: '1 Tahun',
    benefits: [
      'Parkir gratis di semua lokasi MARKIR',
      'Tidak ada biaya admin',
      'Priority customer service 24/7',
      'Akses parkir 24/7',
      'Bonus voucher 100k',
      'Hemat 100k dibanding bulanan!',
    ],
    color: GOLD,
  },
];

export const SubscriptionScreen = ({ navigation }: any) => {
  const { user } = useAppSelector((state) => state.auth);
  const isActiveMember = user?.membership_status === 'ACTIVE';
  const balance = user?.e_wallet_balance || 0;

  const handleSubscribe = (plan: MembershipPlan) => {
    Alert.alert(
      `Subscribe ${plan.name}?`,
      `Biaya: Rp ${plan.price.toLocaleString('id-ID')}\nDurasi: ${plan.duration}\n\nLanjutkan pembelian?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Beli Sekarang',
          onPress: () => {
            // Simulate purchase
            Alert.alert(
              '✅ Pembelian Berhasil!',
              `Selamat! Anda sekarang adalah member ${plan.name}.\n\nMulai berlaku dari hari ini.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Status Card */}
        <View style={[styles.statusCard, isActiveMember ? styles.statusCardActive : styles.statusCardInactive]}>
          <View style={styles.statusHeader}>
            <Ionicons
              name={isActiveMember ? 'star' : 'star-outline'}
              size={48}
              color={isActiveMember ? GOLD : TEXT_GRAY}
            />
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>
                {isActiveMember ? 'Member Premium' : 'Member Free'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isActiveMember ? 'Aktif hingga 31 Des 2025' : 'Upgrade untuk benefit lebih'}
              </Text>
            </View>
          </View>
          {isActiveMember && (
            <View style={styles.activeBenefits}>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color={SUCCESS} />
                <Text style={styles.benefitText}>Parkir Gratis Unlimited</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color={SUCCESS} />
                <Text style={styles.benefitText}>Priority Support 24/7</Text>
              </View>
            </View>
          )}
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet" size={28} color={PRIMARY} />
            <Text style={styles.balanceTitle}>Saldo E-Wallet</Text>
          </View>
          <Text style={styles.balanceAmount}>Rp {balance.toLocaleString('id-ID')}</Text>
          <TouchableOpacity style={styles.topUpButton} onPress={() => Alert.alert('Top Up', 'Fitur top up akan segera hadir!')}>
            <Ionicons name="add-circle-outline" size={20} color={PRIMARY} />
            <Text style={styles.topUpButtonText}>Top Up Saldo</Text>
          </TouchableOpacity>
        </View>

        {/* Membership Plans */}
        <Text style={styles.sectionTitle}>Pilihan Membership</Text>
        {MEMBERSHIP_PLANS.map((plan) => (
          <View key={plan.id} style={[styles.planCard, { borderLeftColor: plan.color, borderLeftWidth: 4 }]}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDuration}>{plan.duration}</Text>
              </View>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>Rp {plan.price.toLocaleString('id-ID')}</Text>
              </View>
            </View>

            <View style={styles.benefitsList}>
              <Text style={styles.benefitsTitle}>Benefits:</Text>
              {plan.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={18} color={SUCCESS} />
                  <Text style={styles.benefitItemText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.subscribeButton, { backgroundColor: plan.color }]}
              onPress={() => handleSubscribe(plan)}
            >
              <Ionicons name="cart" size={20} color={WHITE} />
              <Text style={styles.subscribeButtonText}>Beli Sekarang</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={PRIMARY} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Mengapa jadi Member Premium?</Text>
            <Text style={styles.infoText}>
              • Hemat biaya parkir hingga 80%{'\n'}
              • Tidak perlu repot bayar manual{'\n'}
              • Akses priority di semua lokasi{'\n'}
              • Customer service 24/7
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GRAY_LIGHT,
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
  statusCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusCardActive: {
    backgroundColor: '#FFF8DC',
    borderWidth: 2,
    borderColor: GOLD,
  },
  statusCardInactive: {
    backgroundColor: WHITE,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  activeBenefits: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: TEXT_DARK,
    marginLeft: 8,
    fontWeight: '500',
  },
  balanceCard: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginLeft: 12,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 16,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  topUpButtonText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  planDuration: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY,
  },
  benefitsList: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  benefitItemText: {
    fontSize: 13,
    color: TEXT_DARK,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  subscribeButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 119, 182, 0.05)',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: TEXT_DARK,
    lineHeight: 20,
  },
});
