/**
 * MARKIR - Modern Admin Dashboard
 * @author Valdo Muhammad  
 * @description Beautiful admin dashboard with modern gradient UI
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
    Alert.alert('Konfirmasi Logout', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', onPress: () => dispatch(logout()), style: 'destructive' },
    ]);
  };

  const managementMenus = [
    {
      id: 1,
      title: 'Kelola Promosi',
      subtitle: 'Tambah, edit, hapus',
      icon: 'pricetag',
      gradient: ['#FF6B6B', '#EE5A6F'],
      onPress: () => (navigation as any).navigate('ManagePromotions'),
    },
    {
      id: 2,
      title: 'Kelola User',
      subtitle: 'Manage akun user',
      icon: 'people',
      gradient: ['#4ECDC4', '#44A08D'],
      onPress: () => Alert.alert('Kelola User', 'Fitur sedang dalam pengembangan'),
    },
    {
      id: 3,
      title: 'Transaksi',
      subtitle: 'Lihat riwayat',
      icon: 'receipt',
      gradient: ['#45B7D1', '#3A9FBC'],
      onPress: () =>
        Alert.alert('Kelola Transaksi', 'Total: ' + transactions.length + ' transaksi'),
    },
    {
      id: 4,
      title: 'Kendaraan',
      subtitle: 'Data kendaraan',
      icon: 'car',
      gradient: ['#96CEB4', '#7CB342'],
      onPress: () => Alert.alert('Kelola Kendaraan', 'Fitur sedang dalam pengembangan'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#0077B6', '#00A8E8', '#0096C7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="shield-checkmark" size={28} color="#FFD700" />
                </View>
                <View>
                  <Text style={styles.greeting}>Welcome Back 👋</Text>
                  <Text style={styles.userName}>{user?.name}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <View style={styles.statIconWrapper}>
                    <Ionicons name="cash-outline" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.statValue}>Rp {(totalToday / 1000).toFixed(0)}K</Text>
                  <Text style={styles.statLabel}>Pendapatan</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconWrapper, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                  </View>
                  <Text style={[styles.statValue, { color: '#4CAF50' }]}>{lunas}</Text>
                  <Text style={styles.statLabel}>Lunas</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <View style={[styles.statIconWrapper, { backgroundColor: '#FFEBEE' }]}>
                    <Ionicons name="alert-circle-outline" size={24} color="#F44336" />
                  </View>
                  <Text style={[styles.statValue, { color: '#F44336' }]}>{tunggakan}</Text>
                  <Text style={styles.statLabel}>Tunggakan</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={[styles.statIconWrapper, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="receipt-outline" size={24} color="#2196F3" />
                  </View>
                  <Text style={[styles.statValue, { color: '#2196F3' }]}>
                    {todayTransactions.length}
                  </Text>
                  <Text style={styles.statLabel}>Transaksi</Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Management Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Manajemen Data</Text>
            <Text style={styles.sectionSubtitle}>Kelola semua data aplikasi</Text>
          </View>

          <View style={styles.managementGrid}>
            {managementMenus.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={styles.managementCard}
                onPress={menu.onPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={menu.gradient as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.managementCardGradient}
                >
                  <View style={styles.managementIconContainer}>
                    <Ionicons name={menu.icon as any} size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.managementTitle}>{menu.title}</Text>
                  <Text style={styles.managementSubtitle}>{menu.subtitle}</Text>
                  <View style={styles.arrowContainer}>
                    <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* NFC Operations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Operasi NFC</Text>
            <Text style={styles.sectionSubtitle}>Scan & Write tag NFC</Text>
          </View>

          <TouchableOpacity
            style={styles.nfcCard}
            onPress={() => navigation.navigate('Penagihan')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nfcCardGradient}
            >
              <View style={styles.nfcLeft}>
                <View style={styles.nfcIconBg}>
                  <Ionicons name="card-outline" size={28} color="#667eea" />
                </View>
                <View>
                  <Text style={styles.nfcTitle}>Penagihan Parkir</Text>
                  <Text style={styles.nfcSubtitle}>Scan tag untuk proses bayar</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={28} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nfcCard}
            onPress={() => navigation.navigate('WriteNFC')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nfcCardGradient}
            >
              <View style={styles.nfcLeft}>
                <View style={styles.nfcIconBg}>
                  <Ionicons name="create-outline" size={28} color="#f093fb" />
                </View>
                <View>
                  <Text style={styles.nfcTitle}>Tulis Tag NFC</Text>
                  <Text style={styles.nfcSubtitle}>Daftarkan kendaraan baru</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={28} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nfcCard}
            onPress={() => navigation.navigate('RegistrasiMotor')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nfcCardGradient}
            >
              <View style={styles.nfcLeft}>
                <View style={styles.nfcIconBg}>
                  <Ionicons name="bicycle-outline" size={28} color="#4facfe" />
                </View>
                <View>
                  <Text style={styles.nfcTitle}>Registrasi Motor</Text>
                  <Text style={styles.nfcSubtitle}>Form registrasi manual</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={28} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
            <Text style={styles.sectionSubtitle}>Hari ini</Text>
          </View>

          <View style={styles.transactionsCard}>
            {todayTransactions.slice(0, 5).map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIconBg,
                      {
                        backgroundColor:
                          transaction.status === 'completed' ? '#E8F5E9' : '#FFEBEE',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        transaction.status === 'completed' ? 'checkmark-circle' : 'alert-circle'
                      }
                      size={24}
                      color={transaction.status === 'completed' ? '#4CAF50' : '#F44336'}
                    />
                  </View>
                  <View>
                    <Text style={styles.transactionTag}>{transaction.locationId || 'Location'}</Text>
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
                      {
                        backgroundColor:
                          transaction.status === 'completed'
                            ? '#4CAF50'
                            : transaction.status === 'pending'
                            ? '#FF9800'
                            : '#F44336',
                      },
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
                <View style={styles.emptyIconBg}>
                  <Ionicons name="receipt-outline" size={48} color="#B0BEC5" />
                </View>
                <Text style={styles.emptyText}>Belum ada transaksi hari ini</Text>
                <Text style={styles.emptySubtext}>Transaksi akan muncul di sini</Text>
              </View>
            )}
          </View>
        </View>

        {/* About Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.aboutButton}
            onPress={() => navigation.navigate('About')}
            activeOpacity={0.8}
          >
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.aboutButtonText}>Tentang Aplikasi</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingBottom: spacing.xl,
  },
  headerContent: {
    paddingHorizontal: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  greeting: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.white,
  },
  logoutBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
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
  managementCardGradient: {
    borderRadius: 20,
    padding: spacing.lg,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  managementIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  managementTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  managementSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
  },
  nfcCard: {
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  nfcCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  nfcLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nfcIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  nfcTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  nfcSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  transactionsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionTag: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  transactionTime: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
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
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  aboutButtonText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.md,
  },
});
