/**
 * MARKIR - User Home Screen
 * @author Valdo Muhammad
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, spacing, fontSize, borderRadius } from '../../theme';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { fetchUserProfile, fetchUserMotorcycles } from '../../redux/slices/userSlice';
import { logout } from '../../redux/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStackParamList } from '../../data/types';

type UserHomeScreenProps = {
  navigation: NativeStackNavigationProp<UserStackParamList, 'UserHome'>;
};

export const UserHomeScreen = ({ navigation }: UserHomeScreenProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, motorcycles, isLoading } = useAppSelector((state) => state.user);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile(user.id));
      dispatch(fetchUserMotorcycles(user.id));
    }
  }, [user, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await dispatch(fetchUserProfile(user.id));
      await dispatch(fetchUserMotorcycles(user.id));
    }
    setRefreshing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Halo, {user?.name} </Text>
            <Text style={styles.subgreeting}>Selamat datang kembali</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Card */}
        <Card style={styles.walletCard} elevated>
          <Text style={styles.walletLabel}>Saldo E-Wallet</Text>
          <Text style={styles.walletBalance}>
            Rp {(profile?.e_wallet_balance || 0).toLocaleString('id-ID')}
          </Text>
          
          {profile?.membership_status === 'ACTIVE' && (
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}> Member Aktif</Text>
              <Text style={styles.memberExpiry}>
                Berlaku hingga: {new Date(profile.membership_expires_at || '').toLocaleDateString('id-ID')}
              </Text>
            </View>
          )}

          <Button
            title=' Top Up Saldo'
            onPress={() => navigation.navigate('TopUp')}
            variant='secondary'
            fullWidth
            
          />
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.actionIcon}></Text>
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('RiwayatTransaksi')}>
            <Text style={styles.actionIcon}></Text>
            <Text style={styles.actionText}>Riwayat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('TopUp')}>
            <Text style={styles.actionIcon}></Text>
            <Text style={styles.actionText}>Top Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('About')}>
            <Text style={styles.actionIcon}>ℹ</Text>
            <Text style={styles.actionText}>About</Text>
          </TouchableOpacity>
        </View>

        {/* My Motorcycles */}
        <Card style={styles.motorcyclesCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}> Motor Saya</Text>
            <Text style={styles.motorCount}>
              {motorcycles.length} Motor
            </Text>
          </View>

          {motorcycles.length > 0 ? (
            motorcycles.map((motor) => (
              <View key={motor.id} style={styles.motorItem}>
                <View style={styles.motorIcon}>
                  <Text style={styles.motorEmoji}></Text>
                </View>
                <View style={styles.motorInfo}>
                  <Text style={styles.motorPlate}>{motor.plate_number}</Text>
                  <Text style={styles.motorDetails}>
                    {motor.brand} {motor.model}
                  </Text>
                  <Text style={styles.motorNFC}>NFC: {motor.nfc_tag_id}</Text>
                </View>
                {motor.membership_status === 'ACTIVE' && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.badgeText}>MEMBER</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}></Text>
              <Text style={styles.emptyText}>
                Belum ada motor terdaftar
              </Text>
              <Text style={styles.emptySubtext}>
                Hubungi admin untuk registrasi motor Anda
              </Text>
            </View>
          )}
        </Card>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}> Tips</Text>
          <Text style={styles.infoText}>
             Pastikan saldo e-wallet cukup untuk parkir{'\n'}
             Member aktif mendapat parkir gratis{'\n'}
             Top up saldo dapat dilakukan kapan saja{'\n'}
             Cek riwayat transaksi secara berkala
          </Text>
        </Card>
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
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.white,
  },
  subgreeting: {
    fontSize: fontSize.sm,
    color: colors.accentLight,
    marginTop: spacing.xs,
  },
  logoutBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
  },
  logoutText: {
    color: colors.primary,
    fontWeight: '600',
  },
  walletCard: {
    margin: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.primary,
  },
  walletLabel: {
    fontSize: fontSize.sm,
    color: colors.accentLight,
  },
  walletBalance: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.white,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  memberBadge: {
    backgroundColor: colors.warning,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  memberText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.white,
  },
  memberExpiry: {
    fontSize: fontSize.xs,
    color: colors.white,
    marginTop: spacing.xs,
  },
  topUpBtn: {
    backgroundColor: colors.white,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    paddingTop: 0,
  },
  actionButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.xs,
    color: colors.text,
    fontWeight: '600',
  },
  motorcyclesCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  motorCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  motorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  motorIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  motorEmoji: {
    fontSize: 24,
  },
  motorInfo: {
    flex: 1,
  },
  motorPlate: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  motorDetails: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  motorNFC: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  infoCard: {
    margin: spacing.lg,
    marginTop: 0,
    backgroundColor: colors.accentLight,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
