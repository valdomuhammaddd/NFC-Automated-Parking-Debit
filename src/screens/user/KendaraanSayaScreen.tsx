/**
 * MARKIR - Kendaraan Saya Screen
 * Vehicle Management with CRUD
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Vehicle } from '../../types/vehicle';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const DANGER = '#EF4444';

export const KendaraanSayaScreen = ({ navigation }: any) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { 
      id: '1', 
      plateNumber: 'B 1234 XYZ', 
      type: 'Motor', 
      nfcTagId: 'NFC001',
      brand: 'Yamaha',
      model: 'NMAX',
      color: 'Hitam'
    },
    { 
      id: '2', 
      plateNumber: 'B 5678 ABC', 
      type: 'Mobil', 
      nfcTagId: 'NFC002',
      brand: 'Toyota',
      model: 'Avanza',
      color: 'Silver'
    },
    { 
      id: '3', 
      plateNumber: 'B 9012 DEF', 
      type: 'Motor', 
      nfcTagId: 'NFC003',
      brand: 'Honda',
      model: 'Beat',
      color: 'Merah'
    },
  ]);

  const handleAddVehicle = () => {
    Vibration.vibrate(50);
    navigation.navigate('Vehicles');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    Vibration.vibrate(50);
    Alert.alert('Edit Kendaraan', `Edit ${vehicle.plateNumber}`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Edit', onPress: () => navigation.navigate('Vehicles') },
    ]);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    Vibration.vibrate(50);
    Alert.alert(
      'Hapus Kendaraan',
      'Yakin ingin menghapus kendaraan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setVehicles(prev => prev.filter(v => v.id !== vehicleId));
            Alert.alert('Berhasil', 'Kendaraan berhasil dihapus');
          },
        },
      ]
    );
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => {
    const isMotor = item.type === 'Motor';
    
    return (
      <TouchableOpacity
        style={styles.vehicleCard}
        onPress={() => handleEditVehicle(item)}
        onLongPress={() => handleDeleteVehicle(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.vehicleIcon, isMotor ? styles.motorIcon : styles.mobilIcon]}>
          <Ionicons 
            name={isMotor ? 'bicycle' : 'car'} 
            size={32} 
            color={WHITE} 
          />
        </View>

        <View style={styles.vehicleInfo}>
          <Text style={styles.plateNumber}>{item.plateNumber}</Text>
          <View style={styles.vehicleDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="pricetag" size={14} color={TEXT_GRAY} />
              <Text style={styles.detailText}>{item.type}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="construct" size={14} color={TEXT_GRAY} />
              <Text style={styles.detailText}>{item.brand} {item.model}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="color-palette" size={14} color={TEXT_GRAY} />
              <Text style={styles.detailText}>{item.color}</Text>
            </View>
          </View>
          <View style={styles.nfcBadge}>
            <Ionicons name="wifi" size={12} color={PRIMARY} />
            <Text style={styles.nfcText}>NFC: {item.nfcTagId}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => handleEditVehicle(item)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={TEXT_GRAY} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-outline" size={80} color={TEXT_GRAY} />
      <Text style={styles.emptyTitle}>Belum Ada Kendaraan</Text>
      <Text style={styles.emptyText}>
        Tambahkan kendaraan Anda untuk memudahkan transaksi parkir
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={handleAddVehicle}
      >
        <Text style={styles.emptyButtonText}>Tambah Kendaraan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kendaraan Saya</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Vehicle Count */}
      <View style={styles.countSection}>
        <Text style={styles.countText}>
          {vehicles.length} Kendaraan Terdaftar
        </Text>
      </View>

      {/* Vehicles List */}
      <FlatList
        data={vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB - Add Vehicle */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddVehicle}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={WHITE} />
      </TouchableOpacity>

      {/* Helper Text */}
      <View style={styles.helperBox}>
        <Ionicons name="information-circle" size={16} color={PRIMARY} />
        <Text style={styles.helperText}>
          Tekan lama untuk menghapus kendaraan
        </Text>
      </View>
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
  countSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: GRAY_LIGHT,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_GRAY,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: GRAY_LIGHT,
  },
  vehicleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  motorIcon: {
    backgroundColor: PRIMARY,
  },
  mobilIcon: {
    backgroundColor: '#FF6B6B',
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  vehicleDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginLeft: 6,
  },
  nfcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    borderRadius: 12,
  },
  nfcText: {
    fontSize: 11,
    fontWeight: '600',
    color: PRIMARY,
    marginLeft: 4,
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: TEXT_GRAY,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  helperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: GRAY_LIGHT,
  },
  helperText: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginLeft: 6,
  },
});
