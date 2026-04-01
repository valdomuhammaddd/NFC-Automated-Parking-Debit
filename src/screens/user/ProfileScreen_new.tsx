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

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Edit Profile', onPress: () => {} },
        { icon: '🔒', label: 'Change Password', onPress: () => {} },
        { icon: '📧', label: 'Email Settings', value: currentUser?.email },
        { icon: '📱', label: 'Phone Number', value: currentUser?.phone || 'Add phone' },
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
                  {('toggle' in item && item.toggle && typeof item.value === 'boolean' && typeof item.onToggle === 'function') ? (
                    <View style={styles.menuItem}>
                      <View style={styles.menuItemLeft}>
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                      </View>
                      <Switch
                        value={!!item.value}
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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  profileCard: {
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
  },
  editAvatarIcon: {
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  roleBadge: {
    alignSelf: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
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
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    padding: 0,
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
    fontSize: 24,
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
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
  borderRadius: 16,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  logoutText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.danger,
  },
  versionText: {
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginBottom: spacing.xl,
  },
});
