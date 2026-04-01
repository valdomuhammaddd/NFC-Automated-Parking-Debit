/**
 * MARKIR - Enhanced Admin Dashboard
 * @author Valdo Muhammad
 * @description Complete admin dashboard with CRUD management features
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, spacing, fontSize } from '../../theme';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../data/types';

type AdminHomeScreenProps = {
  navigation: NativeStackNavigationProp<AdminStackParamList, 'AdminHome'>;
};

export const AdminHomeScreen = ({ navigation }: AdminHomeScreenProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { transactions } = useAppSelector((state) => state.transaction);

  const todayTransactions = transactions.filter(
    (t) => new Date(t.createdAt).toDateString() === new Date().toDateString()
  );
  const totalToday = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
  const lunas = todayTransactions.filter((t) => t.status === 'completed').length;
  const tunggakan = todayTransactions.filter(
    (t) => t.status === 'pending' || t.status === 'failed'
  ).length;

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', onPress: () => dispatch(logout()), style: 'destructive' },
      ]
    );
  };

  // Management menu items with navigation
  const managementMenus = [
    {
      id: 1,
      title: 'Kelola Promosi',
      subtitle: 'Tambah, edit, hapus promosi',
      icon: 'pricetag',
      color: '#FF6B6B',
      onPress: () => Alert.alert('Kelola Promosi', 'Fitur sedang dalam pengembangan'),
    },
    {
      id: 2,
      title: 'Kelola User',
      subtitle: 'Lihat dan kelola akun user',
      icon: 'people',
      color: '#4ECDC4',
      onPress: () => Alert.alert('Kelola User', 'Fitur sedang dalam pengembangan'),
    },
    {
      id: 3,
      title: 'Kelola Transaksi',
      subtitle: 'Lihat semua transaksi',
      icon: 'receipt',
      color: '#45B7D1',
      onPress: () => Alert.alert('Kelola Transaksi', 'Total: ' + transactions.length + ' transaksi'),
    },
    {
      id: 4,
      title: 'Kelola Kendaraan',
      subtitle: 'Lihat kendaraan terdaftar',
      icon: 'car',
      color: '#96CEB4',
      onPress: () => Alert.alert('Kelola Kendaraan', 'Fitur sedang dalam pengembangan'),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Admin Dashboard</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={styles.statCardSmall}>
              <Ionicons name="cash-outline" size={32} color={colors.primary} />
              <Text style={styles.statValue}>
                Rp {(totalToday / 1000).toFixed(0)}K
              </Text>
              <Text style={styles.statLabel}>Pendapatan</Text>
            </Card>

            <Card style={styles.statCardSmall}>
              <Ionicons name="checkmark-circle-outline" size={32} color={colors.success} />
              <Text style={[styles.statValue, styles.successText]}>{lunas}</Text>
              <Text style={styles.statLabel}>Lunas</Text>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={styles.statCardSmall}>
              <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
              <Text style={[styles.statValue, styles.dangerText]}>{tunggakan}</Text>
              <Text style={styles.statLabel}>Tunggakan</Text>
            </Card>

            <Card style={styles.statCardSmall}>
              <Ionicons name="receipt-outline" size={32} color={colors.secondary} />
              <Text style={styles.statValue}>{todayTransactions.length}</Text>
              <Text style={styles.statLabel}>Transaksi</Text>
            </Card>
          </View>
        </View>

        {/* Management Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Manajemen Data</Text>
          </View>

          <View style={styles.managementGrid}>
            {managementMenus.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={styles.managementCard}
                onPress={menu.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.managementIcon, { backgroundColor: menu.color + '20' }]}>
                  <Ionicons name={menu.icon as any} size={32} color={menu.color} />
                </View>
                <Text style={styles.managementTitle}>{menu.title}</Text>
                <Text style={styles.managementSubtitle}>{menu.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NFC Operations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="radio-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Operasi NFC</Text>
          </View>

          <Card style={styles.nfcCard}>
            <TouchableOpacity
              style={styles.nfcButton}
              onPress={() => navigation.navigate('Penagihan')}
              activeOpacity={0.7}
            >
              <View style={styles.nfcButtonLeft}>
                <View style={[styles.nfcIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="card-outline" size={28} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.nfcTitle}>Penagihan Parkir</Text>
                  <Text style={styles.nfcSubtitle}>Scan tag NFC untuk bayar</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.nfcButton}
              onPress={() => navigation.navigate('WriteNFC')}
              activeOpacity={0.7}
            >
              <View style={styles.nfcButtonLeft}>
                <View style={[styles.nfcIcon, { backgroundColor: colors.successLight }]}>
                  <Ionicons name="create-outline" size={28} color={colors.success} />
                </View>
                <View>
                  <Text style={styles.nfcTitle}>Tulis Tag NFC</Text>
                  <Text style={styles.nfcSubtitle}>Daftarkan kendaraan baru</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.nfcButton}
              onPress={() => navigation.navigate('RegistrasiMotor')}
              activeOpacity={0.7}
            >
              <View style={styles.nfcButtonLeft}>
                <View style={[styles.nfcIcon, { backgroundColor: colors.secondaryLight }]}>
                  <Ionicons name="bicycle-outline" size={28} color={colors.secondary} />
                </View>
                <View>
                  <Text style={styles.nfcTitle}>Registrasi Motor</Text>
                  <Text style={styles.nfcSubtitle}>Form registrasi manual</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
          </View>

          <Card style={styles.transactionsCard}>
            {todayTransactions.slice(0, 5).map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name={
                        transaction.status === 'completed'
                          ? 'checkmark-circle'
                          : 'alert-circle'
                      }
                      size={24}
                      color={
                        transaction.status === 'completed' ? colors.success : colors.danger
                      }
                    />
                  </View>
                  <View>
                    <Text style={styles.transactionTag}>
                      {transaction.locationId || 'Location'}
                    </Text>
                    <Text style={styles.transactionTime}>
                      {new Date(transaction.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>
                    {transaction.amount === 0
                      ? 'GRATIS'
                      : `Rp ${transaction.amount.toLocaleString('id-ID')}`}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      transaction.status === 'completed' && styles.successBadge,
                      transaction.status === 'pending' && styles.warningBadge,
                      transaction.status === 'failed' && styles.dangerBadge,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {transaction.status === 'completed'
                        ? 'LUNAS'
                        : transaction.status === 'pending'
                        ? 'PENDING'
                        : 'GAGAL'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {todayTransactions.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={64} color={colors.gray300} />
                <Text style={styles.emptyText}>Belum ada transaksi hari ini</Text>
              </View>
            )}
          </Card>
        </View>

        {/* About Button */}
        <View style={styles.section}>
          <Button
            title="ℹ️  Tentang Aplikasi"
            onPress={() => navigation.navigate('About')}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.white,
    marginTop: spacing.xs,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    padding: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statCardSmall: {
    flex: 1,
    marginHorizontal: spacing.xs,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  successText: {
    color: colors.success,
  },
  dangerText: {
    color: colors.danger,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  managementCard: {
    width: '50%',
    padding: spacing.xs,
  },
  managementIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  managementTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  managementSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  nfcCard: {
    padding: 0,
  },
  nfcButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  nfcButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nfcIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  nfcTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  nfcSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginHorizontal: spacing.lg,
  },
  transactionsCard: {
    padding: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    marginRight: spacing.md,
  },
  transactionTag: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  transactionTime: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  successBadge: {
    backgroundColor: colors.success,
  },
  warningBadge: {
    backgroundColor: colors.warning,
  },
  dangerBadge: {
    backgroundColor: colors.danger,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.white,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.md,
  },
});
