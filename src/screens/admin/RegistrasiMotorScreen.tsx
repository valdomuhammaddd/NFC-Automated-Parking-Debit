/**
 * MARKIR - Registrasi Motor Screen (NFC Write) - Professional Design
 * Tema: Biru (#0077B6) & Putih - Compact & Modern
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addTransaction, setLoading } from '../../redux/slices/transactionSlice';
import NFCService from '../../utils/nfcService';

const PRIMARY = '#0077B6';
const PRIMARY_DARK = '#005F8C';
const PRIMARY_LIGHT = '#E6F4F9';
const WHITE = '#FFFFFF';
const GRAY = '#F5F5F5';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const SUCCESS = '#10B981';
const ERROR = '#EF4444';

export const RegistrasiMotorScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.transaction);
  
  const [nfcReady, setNfcReady] = useState(false);
  const [writing, setWriting] = useState(false);
  
  // Form state
  const [platNumber, setPlatNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    checkNFCSupport();
  }, []);

  const checkNFCSupport = async () => {
    try {
      await NFCService.init();
      const supported = await NFCService.isSupported();
      if (!supported) {
        Alert.alert(
          '⚠️ NFC Tidak Tersedia',
          'Device Anda tidak mendukung NFC atau sedang dalam mode web. Menggunakan mode simulasi.',
          [{ text: 'OK' }]
        );
      }
      setNfcReady(true);
    } catch (error) {
      console.error('NFC init error:', error);
      setNfcReady(true); // Allow simulation mode
    }
  };

  const validateForm = () => {
    if (!platNumber.trim()) {
      Alert.alert('⚠️ Peringatan', 'Nomor plat harus diisi');
      return false;
    }
    if (!brand.trim()) {
      Alert.alert('⚠️ Peringatan', 'Merek motor harus diisi');
      return false;
    }
    if (!ownerName.trim()) {
      Alert.alert('⚠️ Peringatan', 'Nama pemilik harus diisi');
      return false;
    }
    return true;
  };

  const handleWriteNFC = async () => {
    if (!validateForm()) return;

    setWriting(true);
    
    try {
      dispatch(setLoading(true));

      const nfcTagId = `NFC${Date.now()}`;
      const vehicleData = `${brand} ${model} - ${platNumber}`;

      if (nfcReady) {
        try {
          await NFCService.writeTag(vehicleData);
        } catch (nfcError) {
          console.log('NFC write failed, using mock:', nfcError);
        }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockTransaction = {
        id: `txn${Date.now()}`,
        userId: 'user1',
        vehicleId: 'vehicle1',
        locationId: 'loc1',
        type: 'parking' as const,
        amount: 0,
        status: 'completed' as const,
        paymentMethod: 'E_WALLET' as const,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        nfcTagId: nfcTagId,
        vehicleInfo: vehicleData,
      };

      dispatch(addTransaction(mockTransaction));

      Alert.alert(
        '✅ Registrasi Berhasil',
        `Motor berhasil didaftarkan!\n\nTag NFC: ${nfcTagId}\nKendaraan: ${vehicleData}\nPemilik: ${ownerName}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setPlatNumber('');
              setBrand('');
              setModel('');
              setColor('');
              setOwnerName('');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('❌ Error', error.message || 'Terjadi kesalahan saat menulis NFC');
    } finally {
      dispatch(setLoading(false));
      setWriting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Gradient */}
      <LinearGradient colors={[PRIMARY, PRIMARY_DARK]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Registrasi Motor</Text>
          <Text style={styles.headerSubtitle}>Daftarkan motor dengan NFC</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formIcon}>🏍️</Text>
              <Text style={styles.formTitle}>Data Kendaraan</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor Plat *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: B 1234 ABC"
                value={platNumber}
                onChangeText={setPlatNumber}
                autoCapitalize="characters"
                placeholderTextColor={TEXT_GRAY}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Merek Motor *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Honda"
                value={brand}
                onChangeText={setBrand}
                autoCapitalize="words"
                placeholderTextColor={TEXT_GRAY}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Model Motor</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Beat"
                value={model}
                onChangeText={setModel}
                autoCapitalize="words"
                placeholderTextColor={TEXT_GRAY}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Warna</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Hitam"
                value={color}
                onChangeText={setColor}
                autoCapitalize="words"
                placeholderTextColor={TEXT_GRAY}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Pemilik *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: John Doe"
                value={ownerName}
                onChangeText={setOwnerName}
                autoCapitalize="words"
                placeholderTextColor={TEXT_GRAY}
              />
            </View>
          </View>

          {/* Write Button */}
          <TouchableOpacity
            style={[styles.writeButton, (writing || loading) && styles.writeButtonDisabled]}
            onPress={handleWriteNFC}
            disabled={writing || loading}
          >
            <LinearGradient
              colors={writing || loading ? [GRAY, GRAY] : [PRIMARY, PRIMARY_DARK]}
              style={styles.writeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {writing || loading ? (
                <ActivityIndicator color={WHITE} size="small" />
              ) : (
                <>
                  <Text style={styles.writeButtonIcon}>✍️</Text>
                  <Text style={styles.writeButtonText}>Tulis ke NFC Tag</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Status Badge */}
          {nfcReady && (
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>NFC Ready</Text>
            </View>
          )}

          {/* Instructions Card */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>📖 Cara Penggunaan</Text>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Isi semua data kendaraan yang diperlukan (ditandai dengan *)
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Tekan tombol "Tulis ke NFC Tag"
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Tempelkan ponsel ke tag NFC yang akan didaftarkan
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>4</Text>
              </View>
              <Text style={styles.instructionText}>
                Sistem akan otomatis menulis data ke tag NFC
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GRAY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: WHITE,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: WHITE,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  formCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  formIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  input: {
    backgroundColor: GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: TEXT_DARK,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  writeButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  writeButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  writeButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  writeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: WHITE,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SUCCESS,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY,
  },
  instructionsCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_DARK,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: WHITE,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 20,
  },
});
