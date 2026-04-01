/**
 * Parkee-style Transaction History/Activity Screen
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '../../redux/hooks';
import { colors, typography, spacing } from '../../theme';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';

const FILTER_OPTIONS = ['All', 'Parking', 'Top Up', 'Subscription'];

export const RiwayatTransaksiScreen = ({ navigation }: any) => {
  const { transactions } = useAppSelector((state) => state.transaction);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'parking':
        return '🅿️';
      case 'topup':
        return '💰';
      case 'subscription':
        return '📅';
      default:
        return '📄';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === 'All') return true;
    return transaction.type.toLowerCase() === selectedFilter.toLowerCase().replace(' ', '');
  });

  const renderTransaction = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        // Navigate to transaction detail
      }}
      activeOpacity={0.7}
    >
      <Card variant="outlined" style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionLeft}>
            <View style={styles.iconContainer}>
              <Text style={styles.transactionIcon}>{getTransactionIcon(item.type)}</Text>
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>
                {item.type === 'parking' ? 'Parking Fee' : item.type === 'topup' ? 'Top Up' : 'Subscription'}
              </Text>
              <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
              {item.locationId && (
                <Text style={styles.transactionLocation}>📍 Location #{item.locationId}</Text>
              )}
            </View>
          </View>
          <View style={styles.transactionRight}>
            <Text style={[
              styles.transactionAmount,
              item.type === 'topup' ? styles.amountPositive : styles.amountNegative,
            ]}>
              {item.type === 'topup' ? '+' : '-'}Rp {item.amount.toLocaleString('id-ID')}
            </Text>
            <Badge
              label={item.status}
              variant={getStatusBadgeVariant(item.status)}
              size="small"
              style={styles.statusBadge}
            />
          </View>
        </View>
        
        {item.duration && (
          <View style={styles.transactionDetail}>
            <Text style={styles.detailText}>⏱️ Duration: {item.duration} hours</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={colors.gradientPrimary} style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <Text style={styles.filterIconText}>⚙️</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_OPTIONS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === filter && styles.filterTabTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryContainer}
        contentContainerStyle={styles.summaryScroll}
      >
        <Card variant="elevated" style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Parking</Text>
          <Text style={styles.summaryValue}>
            {transactions.filter((t) => t.type === 'parking').length}
          </Text>
          <Text style={styles.summarySubtext}>sessions</Text>
        </Card>
        <Card variant="elevated" style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>
            Rp {transactions
              .filter((t) => t.type === 'parking')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </Text>
          <Text style={styles.summarySubtext}>this month</Text>
        </Card>
        <Card variant="elevated" style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Avg. Duration</Text>
          <Text style={styles.summaryValue}>2.5h</Text>
          <Text style={styles.summarySubtext}>per session</Text>
        </Card>
      </ScrollView>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </Text>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Transactions</Text>
            <Text style={styles.emptyText}>
              {selectedFilter === 'All'
                ? 'Start parking to see your activity here'
                : `No ${selectedFilter.toLowerCase()} transactions yet`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 64,
    paddingBottom: 28,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 10,
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
  filterIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconText: {
    fontSize: 28,
    color: colors.white,
  },
  filterContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterScroll: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  filterTab: {
    paddingHorizontal: spacing.lg + 2,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.gray[100],
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.white,
  },
  summaryContainer: {
    marginVertical: spacing.lg,
  },
  summaryScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  summaryCard: {
    width: 150,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.xl + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xxs,
  },
  summarySubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  listTitle: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  transactionCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primaryAlpha,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  transactionIcon: {
    fontSize: 28,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: typography.fontSize.md + 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  transactionDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  transactionLocation: {
    fontSize: typography.fontSize.xs,
    color: colors.info,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: typography.fontSize.md + 1,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  amountPositive: {
    color: colors.success,
  },
  amountNegative: {
    color: colors.text,
  },
  statusBadge: {
    alignSelf: 'flex-end',
  },
  transactionDetail: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  detailText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.huge,
  },
  emptyIcon: {
    fontSize: 70,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
