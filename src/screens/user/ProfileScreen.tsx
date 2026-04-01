/**
 * Parkee-style Profile/Account Screen
 */

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { colors, typography, spacing } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';

export const ProfileScreen = ({ navigation }: any) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const { vehicles } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Login');
  };

  type MenuItem = 
    | { icon: string; label: string; onPress: () => void; value?: string; toggle?: never; onToggle?: never }
    | { icon: string; label: string; toggle: true; value: boolean; onToggle: (value: boolean) => void; onPress?: never };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Edit Profile', onPress: () => {} },
        { icon: '🔒', label: 'Change Password', onPress: () => {} },
        { icon: '📧', label: 'Email Settings', value: currentUser?.email, onPress: () => {} },
        { icon: '📱', label: 'Phone Number', value: currentUser?.phone || 'Add phone', onPress: () => {} },
      ],
    },
    {
      title: 'Vehicles',
      items: [
        {
          icon: '🏍️',
          label: 'My Vehicles',
          value: `${vehicles.length} registered`,
          onPress: () => {},
        },
        { icon: '➕', label: 'Add New Vehicle', onPress: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: '🔔',
          label: 'Push Notifications',
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: '📍',
          label: 'Location Services',
          toggle: true,
          value: locationEnabled,
          onToggle: setLocationEnabled,
        },
        { icon: '🌐', label: 'Language', value: 'Indonesia', onPress: () => {} },
        { icon: '🌙', label: 'Dark Mode', value: 'Off', onPress: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: '❓', label: 'Help Center', onPress: () => {} },
        { icon: '📄', label: 'Terms & Conditions', onPress: () => {} },
        { icon: '🔐', label: 'Privacy Policy', onPress: () => {} },
        { icon: '⭐', label: 'Rate MARKIR', onPress: () => {} },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient colors={colors.gradientPrimary} style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </LinearGradient>

      {/* Profile Card */}
      <View style={styles.contentContainer}>
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {currentUser?.avatar ? (
                <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <Text style={styles.editAvatarIcon}>📷</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{currentUser?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{currentUser?.email}</Text>
              <Badge
                label={currentUser?.role === 'admin' ? 'Admin' : 'Member'}
                variant="info"
                size="small"
                style={styles.roleBadge}
              />
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                Rp {(currentUser?.balance || currentUser?.e_wallet_balance || 0).toLocaleString('id-ID')}
              </Text>
              <Text style={styles.statLabel}>Balance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicles.length}</Text>
              <Text style={styles.statLabel}>Vehicles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>32</Text>
              <Text style={styles.statLabel}>Parkings</Text>
            </View>
          </View>
        </Card>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card variant="elevated" style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {item.toggle ? (
                    <View style={styles.menuItem}>
                      <View style={styles.menuItemLeft}>
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                      </View>
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{
                          false: colors.gray[300],
                          true: colors.primaryLight,
                        }}
                        thumbColor={item.value ? colors.primary : colors.gray[400]}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={item.onPress}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemLeft}>
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <View style={styles.menuTextContainer}>
                          <Text style={styles.menuLabel}>{item.label}</Text>
                          {item.value && (
                            <Text style={styles.menuValue}>{item.value}</Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                  )}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.menuDivider} />
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>MARKIR v2.0.0 (Parkee Edition)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 36,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    marginBottom: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    letterSpacing: 1.2,
    textShadowColor: colors.primaryDark,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  profileCard: {
    marginBottom: spacing.xl,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  editAvatarIcon: {
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: typography.fontSize.xl + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 2,
    letterSpacing: 1.1,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.fontSize.lg + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xxs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 10,
    marginLeft: 18,
    letterSpacing: 1,
  },
  menuCard: {
    padding: 0,
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 26,
    marginRight: spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  menuValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 28,
    color: colors.gray[400],
    fontWeight: typography.fontWeight.bold,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 64,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 20,
    borderRadius: 32,
    marginTop: 40,
    marginBottom: 36,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutIcon: {
    fontSize: 22,
    marginRight: spacing.sm,
    color: colors.white,
  },
  logoutText: {
    fontSize: typography.fontSize.md + 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  versionText: {
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginBottom: spacing.xl,
    marginTop: -16,
  },
});
