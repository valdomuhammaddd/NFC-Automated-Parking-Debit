/**
 * MARKIR - History Screen
 * @author Valdo Muhammad
 * Fitur: Melihat riwayat parkir dan biaya yang sudah dikeluarkan
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
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
const WARNING = '#F59E0B';
const ERROR = '#EF4444';

interface Transaction {
  id: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'FREE';
  vehicleType: string;
  paymentMethod: string;
}

// Mock transaction data (akan diganti dengan data real dari API)
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX001',
    date: '15 Nov 2025',
    time: '14:30',
    location: 'Mall Central Park',
    duration: '2 jam',
    amount: 10000,
    status: 'PAID',
    vehicleType: 'Motor',
    paymentMethod: 'DANA',
  },
  {
    id: 'TRX002',
    date: '15 Nov 2025',
    time: '09:15',
    location: 'Kampus UIGM',
    duration: '4 jam',
    amount: 8000,
    status: 'PAID',
    vehicleType: 'Motor',
    paymentMethod: 'NFC',
  },
  {
    id: 'TRX003',
    date: '14 Nov 2025',
    time: '16:45',
    location: 'Stasiun Kereta Api',
    duration: '1 jam',
    amount: 3000,
    status: 'PAID',
    vehicleType: 'Motor',
    paymentMethod: 'GoPay',
  },
  {
    id: 'TRX004',
    date: '14 Nov 2025',
    time: '11:00',
    location: 'Kampus UIGM',
    duration: '3 jam',
    amount: 0,
    status: 'FREE',
    vehicleType: 'Motor',
    paymentMethod: 'Membership',
  },
  {
    id: 'TRX005',
    date: '13 Nov 2025',
    time: '18:20',
    location: 'Plaza Senayan',
    duration: '2.5 jam',
    amount: 15000,
    status: 'PAID',
    vehicleType: 'Motor',
    paymentMethod: 'LinkAja',
  },
  {
    id: 'TRX006',
    date: '12 Nov 2025',
    time: '13:00',
    location: 'Bandara Soekarno-Hatta',
    duration: '6 jam',
    amount: 48000,
    status: 'PAID',
    vehicleType: 'Motor',
    paymentMethod: 'ShopeePay',
  },
  {
    id: 'TRX007',
    date: '11 Nov 2025',
    time: '10:30',
    location: 'Mall Central Park',
    duration: '1.5 jam',
    amount: 7500,
    status: 'PAID',
    vehicleType: 'Motor',
    paymentMethod: 'DANA',
  },
  {
    id: 'TRX008',
    date: '10 Nov 2025',
    time: '15:45',
    location: 'Kampus UIGM',
    duration: '5 jam',
    amount: 0,
    status: 'FREE',
    vehicleType: 'Motor',
    paymentMethod: 'Membership',
  },
];

export const HistoryScreen = ({ navigation }: any) => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PAID' | 'FREE'>('ALL');

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    if (selectedFilter === 'ALL') return true;
    return tx.status === selectedFilter;
  });

  const totalSpent = MOCK_TRANSACTIONS.filter(tx => tx.status === 'PAID').reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  const totalTransactions = MOCK_TRANSACTIONS.length;
  const freeTransactions = MOCK_TRANSACTIONS.filter(tx => tx.status === 'FREE').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return SUCCESS;
      case 'FREE':
        return PRIMARY;
      case 'UNPAID':
        return ERROR;
      default:
        return TEXT_GRAY;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Lunas';
      case 'FREE':
        return 'Gratis';
      case 'UNPAID':
        return 'Belum Bayar';
      default:
        return status;
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionCard} activeOpacity={0.7}>
      <View style={styles.transactionHeader}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color={PRIMARY} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={TEXT_GRAY} />
          <Text style={styles.detailText}>{item.date} • {item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={TEXT_GRAY} />
          <Text style={styles.detailText}>Durasi: {item.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="bicycle-outline" size={16} color={TEXT_GRAY} />
          <Text style={styles.detailText}>{item.vehicleType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="wallet-outline" size={16} color={TEXT_GRAY} />
          <Text style={styles.detailText}>{item.paymentMethod}</Text>
        </View>
      </View>

      <View style={styles.transactionFooter}>
        <Text style={styles.transactionId}>#{item.id}</Text>
        <Text style={styles.transactionAmount}>
          {item.amount === 0 ? 'GRATIS' : `Rp ${item.amount.toLocaleString('id-ID')}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Summary Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll}>
        <View style={[styles.summaryCard, { backgroundColor: PRIMARY }]}>
          <Ionicons name="cash-outline" size={28} color={WHITE} />
          <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
          <Text style={styles.summaryValue}>Rp {totalSpent.toLocaleString('id-ID')}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: SUCCESS }]}>
          <Ionicons name="checkmark-circle-outline" size={28} color={WHITE} />
          <Text style={styles.summaryLabel}>Total Transaksi</Text>
          <Text style={styles.summaryValue}>{totalTransactions}x</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: WARNING }]}>
          <Ionicons name="gift-outline" size={28} color={WHITE} />
          <Text style={styles.summaryLabel}>Gratis (Member)</Text>
          <Text style={styles.summaryValue}>{freeTransactions}x</Text>
        </View>
      </ScrollView>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'ALL' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('ALL')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'ALL' && styles.filterButtonTextActive]}>
            Semua ({MOCK_TRANSACTIONS.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'PAID' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('PAID')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'PAID' && styles.filterButtonTextActive]}>
            Lunas ({MOCK_TRANSACTIONS.filter(t => t.status === 'PAID').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'FREE' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('FREE')}
        >
          <Text style={[styles.filterButtonText, selectedFilter === 'FREE' && styles.filterButtonTextActive]}>
            Gratis ({MOCK_TRANSACTIONS.filter(t => t.status === 'FREE').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={TEXT_GRAY} />
            <Text style={styles.emptyTitle}>Belum Ada Transaksi</Text>
            <Text style={styles.emptyText}>
              Riwayat transaksi parkir Anda akan muncul di sini
            </Text>
          </View>
        }
      />
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
  summaryScroll: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  summaryCard: {
    width: 160,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: WHITE,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: WHITE,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  filterButtonTextActive: {
    color: WHITE,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: WHITE,
  },
  transactionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginLeft: 8,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  transactionId: {
    fontSize: 12,
    color: TEXT_GRAY,
    fontFamily: 'monospace',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: TEXT_GRAY,
    textAlign: 'center',
  },
});
