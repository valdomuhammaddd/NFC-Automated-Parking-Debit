/**
 * MARKIR - Vehicles Screen
 * @author Valdo Muhammad
 * Fitur: Kelola data kendaraan dengan CRUD operations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';

interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  type: 'Motor' | 'Mobil';
  color: string;
  isActive: boolean;
}

// Mock vehicle data
const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'V001',
    plateNumber: 'B 1234 ABC',
    brand: 'Honda',
    model: 'Beat',
    year: 2021,
    type: 'Motor',
    color: 'Hitam',
    isActive: true,
  },
  {
    id: 'V002',
    plateNumber: 'B 5678 XYZ',
    brand: 'Yamaha',
    model: 'NMAX',
    year: 2022,
    type: 'Motor',
    color: 'Putih',
    isActive: false,
  },
];

export const VehiclesScreen = ({ navigation }: any) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  // Form state
  const [plateNumber, setPlateNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vehicleType, setVehicleType] = useState<'Motor' | 'Mobil'>('Motor');
  const [color, setColor] = useState('');

  const openAddModal = () => {
    resetForm();
    setEditingVehicle(null);
    setIsModalVisible(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setPlateNumber(vehicle.plateNumber);
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setYear(vehicle.year.toString());
    setVehicleType(vehicle.type);
    setColor(vehicle.color);
    setIsModalVisible(true);
  };

  const resetForm = () => {
    setPlateNumber('');
    setBrand('');
    setModel('');
    setYear('');
    setVehicleType('Motor');
    setColor('');
  };

  const handleSave = () => {
    if (!plateNumber || !brand || !model || !year || !color) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    if (editingVehicle) {
      // Update existing vehicle
      setVehicles(prev =>
        prev.map(v =>
          v.id === editingVehicle.id
            ? {
                ...v,
                plateNumber,
                brand,
                model,
                year: parseInt(year),
                type: vehicleType,
                color,
              }
            : v
        )
      );
      Alert.alert('Berhasil', 'Data kendaraan berhasil diupdate!');
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: `V${Date.now()}`,
        plateNumber,
        brand,
        model,
        year: parseInt(year),
        type: vehicleType,
        color,
        isActive: false,
      };
      setVehicles(prev => [...prev, newVehicle]);
      Alert.alert('Berhasil', 'Kendaraan baru berhasil ditambahkan!');
    }

    setIsModalVisible(false);
    resetForm();
  };

  const handleDelete = (vehicleId: string) => {
    Alert.alert(
      'Hapus Kendaraan',
      'Apakah Anda yakin ingin menghapus kendaraan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setVehicles(prev => prev.filter(v => v.id !== vehicleId));
            Alert.alert('Berhasil', 'Kendaraan berhasil dihapus!');
          },
        },
      ]
    );
  };

  const handleSetActive = (vehicleId: string) => {
    setVehicles(prev =>
      prev.map(v => ({
        ...v,
        isActive: v.id === vehicleId,
      }))
    );
    Alert.alert('Berhasil', 'Kendaraan aktif berhasil diubah!');
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleIcon}>
          <Ionicons
            name={item.type === 'Motor' ? 'bicycle' : 'car'}
            size={32}
            color={item.isActive ? PRIMARY : TEXT_GRAY}
          />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.plateNumber}>{item.plateNumber}</Text>
          <Text style={styles.vehicleModel}>
            {item.brand} {item.model} ({item.year})
          </Text>
          <View style={styles.vehicleMeta}>
            <View style={[styles.colorDot, { backgroundColor: item.color === 'Hitam' ? '#000' : item.color === 'Putih' ? '#FFF' : PRIMARY }]} />
            <Text style={styles.metaText}>{item.color}</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaText}>{item.type}</Text>
          </View>
        </View>
        {item.isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Aktif</Text>
          </View>
        )}
      </View>

      <View style={styles.vehicleActions}>
        {!item.isActive && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetActive(item.id)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={SUCCESS} />
            <Text style={[styles.actionButtonText, { color: SUCCESS }]}>Set Aktif</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="create-outline" size={20} color={PRIMARY} />
          <Text style={[styles.actionButtonText, { color: PRIMARY }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kendaraan Saya</Text>
        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-sport-outline" size={64} color={TEXT_GRAY} />
            <Text style={styles.emptyTitle}>Belum Ada Kendaraan</Text>
            <Text style={styles.emptyText}>
              Tambahkan kendaraan Anda untuk memudahkan transaksi parkir
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
              <Ionicons name="add" size={20} color={WHITE} />
              <Text style={styles.emptyButtonText}>Tambah Kendaraan</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add/Edit Vehicle Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingVehicle ? 'Edit Kendaraan' : 'Tambah Kendaraan'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={TEXT_DARK} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Plat Nomor *</Text>
              <TextInput
                style={styles.input}
                placeholder="B 1234 ABC"
                value={plateNumber}
                onChangeText={setPlateNumber}
                autoCapitalize="characters"
              />

              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeButton, vehicleType === 'Motor' && styles.typeButtonActive]}
                  onPress={() => setVehicleType('Motor')}
                >
                  <Ionicons name="bicycle" size={24} color={vehicleType === 'Motor' ? WHITE : TEXT_GRAY} />
                  <Text style={[styles.typeButtonText, vehicleType === 'Motor' && styles.typeButtonTextActive]}>
                    Motor
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, vehicleType === 'Mobil' && styles.typeButtonActive]}
                  onPress={() => setVehicleType('Mobil')}
                >
                  <Ionicons name="car" size={24} color={vehicleType === 'Mobil' ? WHITE : TEXT_GRAY} />
                  <Text style={[styles.typeButtonText, vehicleType === 'Mobil' && styles.typeButtonTextActive]}>
                    Mobil
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Merk *</Text>
              <TextInput
                style={styles.input}
                placeholder="Honda, Yamaha, Toyota, dll"
                value={brand}
                onChangeText={setBrand}
              />

              <Text style={styles.inputLabel}>Model *</Text>
              <TextInput
                style={styles.input}
                placeholder="Beat, NMAX, Avanza, dll"
                value={model}
                onChangeText={setModel}
              />

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Tahun *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2023"
                    value={year}
                    onChangeText={setYear}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Warna *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Hitam, Putih, dll"
                    value={color}
                    onChangeText={setColor}
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    padding: 4,
  },
  listContainer: {
    padding: 20,
  },
  vehicleCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  vehicleModel: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 6,
  },
  vehicleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  metaText: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEXT_GRAY,
    marginHorizontal: 8,
  },
  activeBadge: {
    backgroundColor: SUCCESS,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: WHITE,
  },
  vehicleActions: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  input: {
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY_LIGHT,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  typeButtonActive: {
    backgroundColor: PRIMARY,
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_GRAY,
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: WHITE,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  modalActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: WHITE,
  },
});
