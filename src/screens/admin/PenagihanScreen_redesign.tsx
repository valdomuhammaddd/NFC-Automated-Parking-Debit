/**
 * MARKIR - Penagihan Screen (NFC Read) - Professional Design
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
  Animated,
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
const WARNING = '#F59E0B';

export const PenagihanScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.transaction);
  const [nfcReady, setNfcReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [tagData, setTagData] = useState<any>(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    checkNFCSupport();
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

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

  const handleScanNFC = async () => {
    setScanning(true);
    setTagData(null);

    try {
      dispatch(setLoading(true));
      
      let tagId = '';
      
      if (nfcReady) {
        try {
          const result = await NFCService.readTag();
          tagId = result.id;
        } catch (nfcError) {
          console.log('NFC read failed, using mock:', nfcError);
          tagId = `NFC${Math.floor(Math.random() * 1000)}`;
        }
      } else {
        tagId = `NFC${Math.floor(Math.random() * 1000)}`;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockTransaction = {
        id: `txn${Date.now()}`,
        userId: 'user1',
        vehicleId: 'vehicle1',
        locationId: 'loc1',
        type: 'parking' as const,
        amount: 2000,
        status: 'completed' as const,
        paymentMethod: 'E_WALLET' as const,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        nfcTagId: tagId,
        vehicleInfo: 'Honda Beat - B 1234 XYZ',
      };

      setTagData(mockTransaction);
      dispatch(addTransaction(mockTransaction));

      Alert.alert(
        '✅ Pembayaran Berhasil',
        `Tag NFC: ${tagId}\nKendaraan: ${mockTransaction.vehicleInfo}\nBiaya: Rp ${mockTransaction.amount.toLocaleString('id-ID')}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setTagData(null);
              setScanning(false);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('❌ Error', error.message || 'Terjadi kesalahan saat membaca NFC');
    } finally {
      dispatch(setLoading(false));
      setScanning(false);
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
          <Text style={styles.headerTitle}>Penagihan Parkir</Text>
          <Text style={styles.headerSubtitle}>Scan NFC untuk tagihan</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* NFC Scan Card */}
        <View style={styles.scanCard}>
          <View style={styles.scanIconContainer}>
            <Animated.View style={[styles.scanIconOuter, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.scanIconInner}>
                <Text style={styles.nfcIcon}>📱</Text>
              </View>
            </Animated.View>
          </View>

          <Text style={styles.scanTitle}>
            {scanning ? 'Menunggu Tag NFC...' : 'Siap untuk Scan'}
          </Text>
          <Text style={styles.scanSubtitle}>
            {scanning 
              ? 'Tempelkan ponsel ke tag NFC motor' 
              : 'Tekan tombol dan tempelkan ke tag NFC'}
          </Text>

          {/* Scan Button */}
          <TouchableOpacity
            style={[styles.scanButton, (scanning || loading) && styles.scanButtonDisabled]}
            onPress={handleScanNFC}
            disabled={scanning || loading}
          >
            <LinearGradient
              colors={scanning || loading ? [GRAY, GRAY] : [PRIMARY, PRIMARY_DARK]}
              style={styles.scanButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {scanning || loading ? (
                <ActivityIndicator color={WHITE} size="small" />
              ) : (
                <Text style={styles.scanButtonText}>🔍 Scan NFC</Text>
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
        </View>

        {/* Transaction Result Card */}
        {tagData && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.successBadge}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
              <Text style={styles.resultTitle}>Pembayaran Berhasil</Text>
            </View>

            <View style={styles.resultDivider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Tag NFC</Text>
              <Text style={styles.resultValue}>{tagData.nfcTagId}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Kendaraan</Text>
              <Text style={styles.resultValue}>{tagData.vehicleInfo}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Biaya Parkir</Text>
              <Text style={styles.resultAmount}>
                Rp {tagData.amount.toLocaleString('id-ID')}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Status</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{tagData.status}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📖 Cara Penggunaan</Text>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>Tekan tombol "Scan NFC"</Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>Tempelkan ponsel ke tag NFC motor</Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>Sistem akan otomatis membaca dan memproses pembayaran</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  scanCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },
  scanIconContainer: {
    marginBottom: 20,
  },
  scanIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIconInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: PRIMARY,
  },
  nfcIcon: {
    fontSize: 48,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  scanSubtitle: {
    fontSize: 14,
    color: TEXT_GRAY,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  scanButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  scanButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  scanButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: WHITE,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SUCCESS,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY,
  },
  resultCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successIcon: {
    fontSize: 28,
    color: WHITE,
    fontWeight: 'bold',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  resultDivider: {
    height: 1,
    backgroundColor: GRAY,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultLabel: {
    fontSize: 14,
    color: TEXT_GRAY,
    flex: 1,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    flex: 1,
    textAlign: 'right',
  },
  resultAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  statusPill: {
    backgroundColor: PRIMARY_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: 'bold',
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
