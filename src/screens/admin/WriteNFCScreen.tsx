/**
 * MARKIR - Write NFC Screen (Admin Only)
 * Allows admin to register vehicles by writing UID + data to NFC Tag
 * @author Valdo Muhammad
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Vibration,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';
const ERROR = '#EF4444';

export const WriteNFCScreen = ({ navigation }: any) => {
  const [isNFCSupported, setIsNFCSupported] = useState<boolean | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  
  // Form data
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  useEffect(() => {
    checkNFCSupport();
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  const checkNFCSupport = async () => {
    try {
      const supported = await NfcManager.isSupported();
      setIsNFCSupported(supported);
      
      if (supported) {
        await NfcManager.start();
        console.log('✅ NFC Manager initialized');
      }
    } catch (error) {
      console.error('❌ NFC init error:', error);
      setIsNFCSupported(false);
    }
  };

  const validateForm = () => {
    if (!plateNumber.trim()) {
      Alert.alert('Validasi Error', 'Nomor plat kendaraan harus diisi!');
      return false;
    }
    if (!vehicleBrand.trim()) {
      Alert.alert('Validasi Error', 'Merk kendaraan harus diisi!');
      return false;
    }
    if (!ownerName.trim()) {
      Alert.alert('Validasi Error', 'Nama pemilik harus diisi!');
      return false;
    }
    return true;
  };

  const writeNFCTag = async () => {
    if (!validateForm()) return;
    if (!isNFCSupported) {
      Alert.alert('NFC Error', 'NFC tidak didukung atau tidak aktif.');
      return;
    }

    try {
      setIsWriting(true);
      Vibration.vibrate(50);

      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);
      console.log('🔹 NFC Technology requested');

      // Prepare data to write
      const vehicleData = {
        plateNumber: plateNumber.trim().toUpperCase(),
        brand: vehicleBrand.trim(),
        model: vehicleModel.trim(),
        color: vehicleColor.trim(),
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        registeredAt: new Date().toISOString(),
        registeredBy: 'ADMIN',
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(vehicleData);
      
      // Create NDEF message
      const bytes = Ndef.encodeMessage([
        Ndef.textRecord(jsonString),
      ]);

      if (!bytes) {
        throw new Error('Failed to encode NDEF message');
      }

      // Write to NFC tag
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      console.log('✅ NFC data written successfully');

      // Get tag UID
      const tag = await NfcManager.getTag();
      const tagUID = tag?.id || 'UNKNOWN';

      Vibration.vibrate([0, 100, 50, 100]);

      Alert.alert(
        '✅ Registrasi Berhasil!',
        `Kendaraan berhasil terdaftar!\n\nPlat: ${vehicleData.plateNumber}\nTag UID: ${tagUID}\n\nTag NFC sudah dapat digunakan untuk pembayaran parkir.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setPlateNumber('');
              setVehicleBrand('');
              setVehicleModel('');
              setVehicleColor('');
              setOwnerName('');
              setOwnerPhone('');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Write NFC error:', error);
      
      if (error.toString().includes('cancelled')) {
        Alert.alert('Dibatalkan', 'Proses write NFC dibatalkan.');
      } else if (error.toString().includes('read only')) {
        Alert.alert('Error', 'Tag NFC ini read-only dan tidak dapat ditulis.');
      } else {
        Alert.alert('Error', 'Gagal menulis ke NFC tag. Pastikan tag berada dekat dengan perangkat dan tag dapat ditulis (writable).');
      }
    } finally {
      setIsWriting(false);
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  };

  const simulateWriteNFC = () => {
    if (!validateForm()) return;

    Alert.alert(
      'Mode Simulasi',
      'Anda akan melakukan simulasi registrasi NFC (tanpa tag fisik). Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Simulasi',
          onPress: async () => {
            setIsWriting(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const vehicleData = {
              plateNumber: plateNumber.trim().toUpperCase(),
              brand: vehicleBrand.trim(),
              model: vehicleModel.trim(),
              color: vehicleColor.trim(),
              ownerName: ownerName.trim(),
              ownerPhone: ownerPhone.trim(),
            };

            Alert.alert(
              '✅ Simulasi Berhasil!',
              `Kendaraan berhasil "terdaftar" (simulasi)!\n\nPlat: ${vehicleData.plateNumber}\nTag UID: SIMULATED_${Date.now()}\n\nCatatan: Ini adalah simulasi. Gunakan perangkat Android dengan NFC untuk registrasi real.`,
              [{ text: 'OK', onPress: () => {
                setPlateNumber('');
                setVehicleBrand('');
                setVehicleModel('');
                setVehicleColor('');
                setOwnerName('');
                setOwnerPhone('');
              }}]
            );
            
            setIsWriting(false);
          },
        },
      ]
    );
  };

  if (isNFCSupported === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Memeriksa dukungan NFC...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrasi Kendaraan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* NFC Status Card */}
        <View style={[styles.statusCard, !isNFCSupported && styles.statusCardError]}>
          <Ionicons
            name={isNFCSupported ? 'checkmark-circle' : 'close-circle'}
            size={32}
            color={isNFCSupported ? SUCCESS : ERROR}
          />
          <Text style={styles.statusTitle}>
            {isNFCSupported ? 'NFC Siap' : 'NFC Tidak Aktif'}
          </Text>
          <Text style={styles.statusText}>
            {isNFCSupported
              ? 'Siap menulis data ke Tag NFC'
              : 'Aktifkan NFC di pengaturan perangkat'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Data Kendaraan</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nomor Plat *</Text>
            <TextInput
              style={styles.input}
              placeholder="B 1234 ABC"
              value={plateNumber}
              onChangeText={setPlateNumber}
              autoCapitalize="characters"
              maxLength={15}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Merk Kendaraan *</Text>
            <TextInput
              style={styles.input}
              placeholder="Honda"
              value={vehicleBrand}
              onChangeText={setVehicleBrand}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Model</Text>
            <TextInput
              style={styles.input}
              placeholder="Beat"
              value={vehicleModel}
              onChangeText={setVehicleModel}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Warna</Text>
            <TextInput
              style={styles.input}
              placeholder="Hitam"
              value={vehicleColor}
              onChangeText={setVehicleColor}
            />
          </View>

          <Text style={styles.formTitle}>Data Pemilik</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Pemilik *</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={ownerName}
              onChangeText={setOwnerName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>No. Telepon</Text>
            <TextInput
              style={styles.input}
              placeholder="08123456789"
              value={ownerPhone}
              onChangeText={setOwnerPhone}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {isNFCSupported ? (
            <TouchableOpacity
              style={[styles.writeButton, isWriting && styles.writeButtonDisabled]}
              onPress={writeNFCTag}
              disabled={isWriting}
            >
              {isWriting ? (
                <>
                  <ActivityIndicator size="small" color={WHITE} style={{ marginRight: 8 }} />
                  <Text style={styles.writeButtonText}>Menulis ke Tag NFC...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="create" size={20} color={WHITE} />
                  <Text style={styles.writeButtonText}>Tulis ke Tag NFC</Text>
                </>
              )}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.simulateButton}
            onPress={simulateWriteNFC}
            disabled={isWriting}
          >
            <Ionicons name="flask" size={20} color={PRIMARY} />
            <Text style={styles.simulateButtonText}>Mode Simulasi (Testing)</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={PRIMARY} />
          <Text style={styles.infoText}>
            Pastikan Tag NFC dapat ditulis (writable). Tempelkan ponsel ke Tag NFC saat proses write dimulai.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: TEXT_GRAY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: GRAY_LIGHT,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusCardError: {
    backgroundColor: '#FEE2E2',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginTop: 12,
  },
  statusText: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginTop: 4,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  input: {
    backgroundColor: GRAY_LIGHT,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: TEXT_DARK,
  },
  actionContainer: {
    gap: 12,
    marginBottom: 24,
  },
  writeButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeButtonDisabled: {
    opacity: 0.6,
  },
  writeButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  simulateButton: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  simulateButtonText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
    lineHeight: 20,
    marginLeft: 12,
  },
});
