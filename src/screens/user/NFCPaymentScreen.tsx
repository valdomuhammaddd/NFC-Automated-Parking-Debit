/**
 * MARKIR - NFC Payment Screen (REAL NFC FUNCTIONALITY)
 * @author Valdo Muhammad
 * Fitur: Scan NFC tag untuk pembayaran parkir otomatis
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { deductBalance } from '../../redux/slices/userSlice';
import { addTransaction } from '../../redux/slices/transactionSlice';
import { updateUserBalance } from '../../redux/slices/authSlice_api';
import * as MarkirAPI from '../../data/api/markir-api';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';
const ERROR = '#EF4444';

export const NFCPaymentScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { balance } = useAppSelector((state) => state.user);
  const [isNFCSupported, setIsNFCSupported] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanAnimation] = useState(new Animated.Value(1));
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  useEffect(() => {
    checkNFCSupport();
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnimation.setValue(1);
    }
  }, [isScanning]);

  const checkNFCSupport = async () => {
    try {
      const supported = await NfcManager.isSupported();
      setIsNFCSupported(supported);
      
      if (supported) {
        await NfcManager.start();
      } else if (Platform.OS === 'web') {
        // Web fallback: simulate NFC support
        setIsNFCSupported(true);
      }
    } catch (error) {
      console.error('NFC Check Error:', error);
      setIsNFCSupported(false);
    }
  };

  const enableNFC = async () => {
    if (Platform.OS === 'android') {
      Alert.alert(
        'Aktifkan NFC',
        'Untuk menggunakan fitur pembayaran NFC, silakan aktifkan NFC di pengaturan perangkat Anda.',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Buka Pengaturan',
            onPress: () => {
              // In real app: Linking.openSettings()
              Alert.alert('Info', 'Buka Settings > Connected devices > Connection preferences > NFC');
            },
          },
        ]
      );
    } else {
      Alert.alert('NFC', 'NFC tidak didukung di platform ini. Gunakan perangkat Android dengan NFC.');
    }
  };

  const startNFCScan = async () => {
    if (!isNFCSupported) {
      Alert.alert('NFC Tidak Didukung', 'Perangkat Anda tidak mendukung NFC atau NFC belum diaktifkan.');
      return;
    }

    setIsScanning(true);

    try {
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Read NFC tag
      const tag = await NfcManager.getTag();
      
      if (tag) {
        await processNFCPayment(tag);
      }
    } catch (error: any) {
      console.log('NFC Scan Error:', error);
      
      if (error.toString().includes('cancelled')) {
        Alert.alert('Scan Dibatalkan', 'Anda membatalkan scan NFC.');
      } else {
        Alert.alert('Error', 'Gagal membaca NFC tag. Pastikan NFC aktif dan tag berada dekat dengan perangkat.');
      }
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  };

  const processNFCPayment = async (tag: any) => {
    try {
      console.log('🔹 Processing NFC Payment for tag:', tag.id);
      
      // Step 1: Scan NFC tag to get vehicle and owner data
      const nfcUid = tag.id || 'NFC-UID-001'; // Use tag.id or default for testing
      console.log('📡 Calling MarkirAPI.nfcScan with:', nfcUid);
      
      const scanResponse = await MarkirAPI.nfcScan(nfcUid);
      
      if (!scanResponse.success) {
        Alert.alert('❌ Kendaraan Tidak Terdaftar', scanResponse.message || 'NFC tag tidak ditemukan di database.');
        return;
      }
      
      const { vehicle, owner, last_transaction } = scanResponse.data;
      console.log('✅ NFC Scan Success:', { vehicle, owner });
      
      // Step 2: Generate parking fee and location
      const parkingFee = Math.floor(Math.random() * 5000) + 2000; // Rp 2000 - 7000
      const location = ['Parkiran Mall', 'Kampus UIGM', 'Stasiun Kereta', 'Bandara'][
        Math.floor(Math.random() * 4)
      ];
      
      // Get current balance from Redux (user's actual balance)
      const currentBalance = balance || owner.saldo_ewallet || 0;
      console.log('💰 Current balance:', currentBalance);
      
      // Step 3: Check if balance is sufficient
      const newBalance = currentBalance - parkingFee;
      const statusBayar = newBalance >= 0 ? 'LUNAS' : 'TERTUNGGAK';
      
      // LANGSUNG KURANGI SALDO di Redux terlebih dahulu
      if (statusBayar === 'LUNAS') {
        dispatch(updateUserBalance(newBalance));
        dispatch(deductBalance(parkingFee));
        console.log('✅ Saldo dikurangi:', parkingFee, 'Saldo baru:', newBalance);
      }
      
      // Step 4: Create transaction via backend
      console.log('💳 Creating transaction:', { nfcUid, parkingFee, location, currentBalance });
      
      const transactionResponse = await MarkirAPI.createTransaction({
        nfc_uid: nfcUid,
        petugas_id: typeof user?.id === 'number' ? user.id : 1, // Admin/petugas ID
        amount_charged: parkingFee,
        location: location,
      });
      
      if (!transactionResponse.success) {
        Alert.alert('❌ Transaksi Gagal', transactionResponse.message || 'Gagal membuat transaksi.');
        return;
      }
      
      const { transaction_id, status_bayar: backendStatus, initial_balance, final_balance, timestamp } = transactionResponse.data;
      console.log('✅ Transaction Created:', { transaction_id, backendStatus });
      
      // Step 5: Sync with backend balance jika berbeda
      if (backendStatus === 'LUNAS') {
        dispatch(updateUserBalance(final_balance));
      }
      
      // Step 6: Add transaction to Redux for local state
      const localTransaction = {
        id: `TRX${transaction_id}`,
        userId: user?.id || 'UNKNOWN',
        vehicleId: `VH${vehicle.motorcycle_id}`,
        locationId: 'LOC' + Math.floor(Math.random() * 1000),
        type: 'parking' as const,
        amount: parkingFee,
        status: statusBayar === 'LUNAS' ? 'completed' as const : 'failed' as const,
        paymentMethod: 'NFC',
        createdAt: timestamp,
        description: `${statusBayar} - Parkir di ${location}`,
        location: location,
      };
      
      dispatch(addTransaction(localTransaction));
      setLastTransaction(localTransaction);
      
      // Step 7: Show appropriate alert based on status
      if (statusBayar === 'LUNAS') {
        Alert.alert(
          '✅ Pembayaran Berhasil!',
          `Status: LUNAS\n\nKendaraan: ${vehicle.plat_nomor} (${vehicle.merk})\nPemilik: ${owner.name}\nLokasi: ${location}\nBiaya: Rp ${parkingFee.toLocaleString('id-ID')}\n\nSaldo Awal: Rp ${currentBalance.toLocaleString('id-ID')}\nSaldo Akhir: Rp ${newBalance.toLocaleString('id-ID')}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // TERTUNGGAK
        Alert.alert(
          '⚠️ Saldo Tidak Cukup',
          `Status: TERTUNGGAK\n\nKendaraan: ${vehicle.plat_nomor} (${vehicle.merk})\nPemilik: ${owner.name}\nSaldo: Rp ${currentBalance.toLocaleString('id-ID')}\nBiaya Parkir: Rp ${parkingFee.toLocaleString('id-ID')}\n\nKekurangan: Rp ${(parkingFee - currentBalance).toLocaleString('id-ID')}\n\nSilakan top-up saldo Anda.`,
          [
            { text: 'Batal', style: 'cancel' },
            { text: 'Top Up', onPress: () => navigation.navigate('TopUp') }
          ]
        );
      }
      
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat memproses pembayaran.';
      Alert.alert('❌ Pembayaran Gagal', errorMessage);
    }
  };

  const simulateNFCPayment = () => {
    Alert.alert(
      'Mode Simulasi',
      'Anda akan melakukan simulasi pembayaran NFC (tanpa tag fisik). Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Simulasi',
          onPress: async () => {
            setIsScanning(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await processNFCPayment({ id: 'SIMULATED_TAG' });
            setIsScanning(false);
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
        <Text style={styles.headerTitle}>NFC Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* NFC Status Card */}
        <View style={[styles.statusCard, !isNFCSupported && styles.statusCardError]}>
          <Ionicons
            name={isNFCSupported ? 'checkmark-circle' : 'close-circle'}
            size={40}
            color={isNFCSupported ? SUCCESS : ERROR}
          />
          <Text style={styles.statusTitle}>
            {isNFCSupported ? 'NFC Siap Digunakan' : 'NFC Tidak Aktif'}
          </Text>
          <Text style={styles.statusText}>
            {isNFCSupported
              ? 'Perangkat Anda mendukung NFC dan siap untuk pembayaran'
              : 'Aktifkan NFC di pengaturan perangkat untuk menggunakan fitur ini'}
          </Text>
          {!isNFCSupported && (
            <TouchableOpacity style={styles.enableButton} onPress={enableNFC}>
              <Text style={styles.enableButtonText}>Aktifkan NFC</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Anda</Text>
          <Text style={styles.balanceAmount}>
            Rp {(balance || 0).toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Scan Button */}
        <Animated.View style={{ transform: [{ scale: scanAnimation }] }}>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonActive]}
            onPress={startNFCScan}
            disabled={isScanning || !isNFCSupported}
          >
            {isScanning ? (
              <>
                <ActivityIndicator size="large" color={WHITE} />
                <Text style={styles.scanButtonText}>Menunggu NFC Tag...</Text>
                <Text style={styles.scanButtonSubtext}>Tempelkan tag NFC ke ponsel</Text>
              </>
            ) : (
              <>
                <Ionicons name="scan" size={64} color={WHITE} />
                <Text style={styles.scanButtonText}>Tap untuk Scan NFC</Text>
                <Text style={styles.scanButtonSubtext}>Tempelkan ponsel ke tag NFC parkir</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Simulate Button (untuk testing di web/device tanpa NFC) */}
        <TouchableOpacity style={styles.simulateButton} onPress={simulateNFCPayment}>
          <Ionicons name="play-circle-outline" size={20} color={PRIMARY} />
          <Text style={styles.simulateButtonText}>Mode Simulasi (Testing)</Text>
        </TouchableOpacity>

        {/* Last Transaction */}
        {lastTransaction && (
          <View style={styles.lastTransactionCard}>
            <Text style={styles.lastTransactionTitle}>Transaksi Terakhir</Text>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Lokasi:</Text>
              <Text style={styles.transactionValue}>{lastTransaction.location}</Text>
            </View>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Biaya:</Text>
              <Text style={styles.transactionValue}>
                Rp {lastTransaction.amount.toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Status:</Text>
              <Text style={[styles.transactionValue, styles.transactionSuccess]}>
                {lastTransaction.status}
              </Text>
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={PRIMARY} />
          <Text style={styles.infoText}>
            Pastikan NFC aktif dan tempelkan ponsel Anda ke tag NFC yang tersedia di area parkir.
            Pembayaran akan otomatis terpotong dari saldo Anda.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GRAY_LIGHT,
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
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: WHITE,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: SUCCESS,
  },
  statusCardError: {
    borderColor: ERROR,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginTop: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 20,
  },
  enableButton: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  enableButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: PRIMARY,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: WHITE,
  },
  scanButton: {
    backgroundColor: PRIMARY,
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonActive: {
    backgroundColor: '#005F8C',
  },
  scanButtonText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  scanButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  simulateButtonText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  lastTransactionCard: {
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  lastTransactionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionLabel: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  transactionSuccess: {
    color: SUCCESS,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 119, 182, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: TEXT_DARK,
    lineHeight: 20,
  },
});
