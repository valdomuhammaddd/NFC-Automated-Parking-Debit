/**
 * Parkee-style User Home Screen
 * Complete redesign with all features
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { colors, typography, spacing } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import {
  mockUsers,
  mockVehicles,
  mockLocations,
  mockTransactions,
  mockPromotions,
} from '../../data/mockData';
import {
  setCurrentUser,
  setVehicles,
  setPaymentMethods,
} from '../../redux/slices/userSlice';
import {
  setTransactions,
  setParkingLocations,
  setPromotions,
} from '../../redux/slices/transactionSlice';

const { width } = Dimensions.get('window');
const PROMO_WIDTH = width * 0.85;

export const UserHomeScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { currentUser, balance, vehicles } = useAppSelector((state) => state.user);
  const { activeParking, promotions, parkingLocations, transactions } = useAppSelector(
    (state) => state.transaction
  );

  const [selectedVehicle, setSelectedVehicle] = useState(0);

  useEffect(() => {
    // Initialize mock data
    const user = mockUsers.user;
    if (user) {
      dispatch(setCurrentUser(user as any));
    }
    // dispatch(setVehicles(mockVehicles));
    // dispatch(setParkingLocations(mockLocations));
    // dispatch(setTransactions(mockTransactions));
    // dispatch(setPromotions(mockPromotions));
  }, [dispatch]);

  const renderBalanceCard = () => (
    <LinearGradient
      colors={colors.gradientPrimary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      <View style={styles.balanceHeader}>
        <View>
          <Text style={styles.balanceLabel}>MARKIR Balance</Text>
          <Text style={styles.balanceAmount}>
            Rp {(balance || 0).toLocaleString('id-ID')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.topUpButton}
          onPress={() => navigation.navigate('TopUp')}
        >
          <Text style={styles.topUpButtonText}>Top Up</Text>
        </TouchableOpacity>
      </View>

      {activeParking && (
        <View style={styles.activeParkingContainer}>
          <View style={styles.activeParkingIndicator} />
          <View style={styles.activeParkingInfo}>
            <Text style={styles.activeParkingText}>Active Parking</Text>
            <Text style={styles.activeParkingLocation}>
              {parkingLocations.find((l) => l.id === activeParking.locationId)?.name ||
                'Location'}
            </Text>
          </View>
          <TouchableOpacity style={styles.viewParkingButton}>
            <Text style={styles.viewParkingButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );

  const quickActions = [
    {
      id: 'scan-nfc',
      title: 'Scan NFC',
      icon: '📱',
      color: colors.secondary,
      onPress: () => navigation.navigate('Pay'),
    },
    {
      id: 'find-parking',
      title: 'Find Parking',
      icon: '📍',
      color: colors.primary,
      onPress: () => navigation.navigate('FindParking'),
    },
    {
      id: 'history',
      title: 'History',
      icon: '📋',
      color: colors.info,
      onPress: () => navigation.navigate('RiwayatTransaksi'),
    },
    {
      id: 'vehicles',
      title: 'Vehicles',
      icon: '🏍️',
      color: colors.success,
      onPress: () => navigation.navigate('Vehicles'),
    },
    {
      id: 'booking',
      title: 'Booking',
      icon: '📅',
      color: colors.warning,
      onPress: () => navigation.navigate('Booking'),
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: '🎫',
      color: colors.primaryDark,
      onPress: () => navigation.navigate('Subscription'),
    },
    {
      id: 'promotions',
      title: 'Promotions',
      icon: '🎁',
      color: colors.danger,
      onPress: () => navigation.navigate('Promotions'),
    },
    {
      id: 'help',
      title: 'Help',
      icon: '❓',
      color: colors.gray[600],
      onPress: () => navigation.navigate('Help'),
    },
  ];

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionItem}
            onPress={action.onPress}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
              <Text style={styles.quickActionEmoji}>{action.icon}</Text>
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPromotions = () => (
    <View style={styles.promotionsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Promotions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Promotions')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={promotions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.promoCard} onPress={() => {}}>
            <View
              style={[styles.promoImage, { backgroundColor: colors.primary + '20' }]}
            >
              <Text style={styles.promoEmoji}>🎉</Text>
            </View>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.promoDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Badge
                label={`${item.discount}${item.discountType === 'percentage' ? '%' : 'K'} OFF`}
                variant="success"
                size="small"
                style={styles.promoBadge}
              />
            </View>
          </Card>
        )}
        contentContainerStyle={styles.promoList}
      />
    </View>
  );

  const renderSuggestedLocations = () => (
    <View style={styles.locationsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Parking</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FindParking')}>
          <Text style={styles.seeAllText}>View Map</Text>
        </TouchableOpacity>
      </View>
      {parkingLocations.slice(0, 3).map((location) => (
        <Card key={location.id} style={styles.locationCard} onPress={() => {}}>
          <View style={styles.locationHeader}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationEmoji}>🅿️</Text>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {location.address}
              </Text>
            </View>
            {location.distance && (
              <View style={styles.locationDistance}>
                <Text style={styles.locationDistanceText}>
                  {location.distance.toFixed(1)} km
                </Text>
              </View>
            )}
          </View>
          <View style={styles.locationFooter}>
            <View style={styles.locationSpots}>
              <Text style={styles.locationSpotsAvailable}>
                {location.availableSpots} spots
              </Text>
              <Text style={styles.locationSpotsTotal}>/ {location.totalSpots}</Text>
            </View>
            <Text style={styles.locationPrice}>
              Rp {location.pricePerHour.toLocaleString('id-ID')}/hr
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );

  const renderRecentActivity = () => {
    const recentTransactions = transactions.slice(0, 3);
    if (recentTransactions.length === 0) return null;

    return (
      <View style={styles.activityContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RiwayatTransaksi')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentTransactions.map((transaction) => {
          const location = parkingLocations.find((l) => l.id === transaction.locationId);
          return (
            <Card key={transaction.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View
                  style={[
                    styles.activityIcon,
                    {
                      backgroundColor:
                        transaction.type === 'parking'
                          ? colors.primary + '20'
                          : colors.success + '20',
                    },
                  ]}
                >
                  <Text style={styles.activityEmoji}>
                    {transaction.type === 'parking' ? '🅿️' : '💰'}
                  </Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>
                    {transaction.type === 'parking' ? location?.name || 'Parking' : 'Top Up'}
                  </Text>
                  <Text style={styles.activityDate}>
                    {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View style={styles.activityAmount}>
                  <Text
                    style={[
                      styles.activityAmountText,
                      transaction.type === 'topup' && styles.activityAmountPositive,
                    ]}
                  >
                    {transaction.type === 'topup' ? '+' : '-'}Rp{' '}
                    {transaction.amount.toLocaleString('id-ID')}
                  </Text>
                  <Badge
                    label={transaction.status}
                    variant={
                      transaction.status === 'completed'
                        ? 'success'
                        : transaction.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {renderBalanceCard()}
        {renderQuickActions()}
        {renderPromotions()}
        {renderSuggestedLocations()}
        {renderRecentActivity()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.huge,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginTop: spacing.xxs,
  },
  notificationButton: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: spacing.md,
  },
  balanceCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  borderRadius: 16,
    padding: spacing.lg,
  boxShadow: '0px 4px 16px rgba(0,0,0,0.10)',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  topUpButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  borderRadius: 12,
  },
  topUpButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
  activeParkingContainer: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeParkingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  activeParkingInfo: {
    flex: 1,
  },
  activeParkingText: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    opacity: 0.9,
  },
  activeParkingLocation: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
    marginTop: 2,
  },
  viewParkingButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  borderRadius: 8,
  },
  viewParkingButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  quickActionsContainer: {
    marginBottom: spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
  },
  quickActionItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  quickActionEmoji: {
    fontSize: 28,
  },
  quickActionTitle: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  promotionsContainer: {
    marginBottom: spacing.xl,
  },
  promoList: {
    paddingHorizontal: spacing.lg,
  },
  promoCard: {
    width: PROMO_WIDTH,
    marginRight: spacing.md,
  },
  promoImage: {
    width: '100%',
    height: 120,
  borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  promoEmoji: {
    fontSize: 48,
  },
  promoContent: {
    paddingHorizontal: spacing.sm,
  },
  promoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  promoDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  promoBadge: {
    alignSelf: 'flex-start',
  },
  locationsContainer: {
    marginBottom: spacing.xl,
  },
  locationCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationIcon: {
    width: 48,
    height: 48,
  borderRadius: 12,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  locationEmoji: {
    fontSize: 24,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  locationAddress: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  locationDistance: {
    backgroundColor: colors.secondary + '20',
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
  borderRadius: 8,
  },
  locationDistanceText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.secondary,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationSpots: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  locationSpotsAvailable: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  locationSpotsTotal: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xxs,
  },
  locationPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  activityContainer: {
    marginBottom: spacing.xl,
  },
  activityCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 48,
    height: 48,
  borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  activityDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityAmountText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  activityAmountPositive: {
    color: colors.success,
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});
