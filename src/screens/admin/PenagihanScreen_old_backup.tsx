/**
 * MARKIR - Penagihan Screen (NFC Read)
 * @author Valdo Muhammad
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, spacing, fontSize, shadow } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addTransaction, setLoading } from '../../redux/slices/transactionSlice';
import NFCService from '../../utils/nfcService';

export const PenagihanScreen = () => {
  const dispatch = useAppDispatch();
  const { loading, transactions } = useAppSelector(
    (state) => state.transaction
  );
  const lastTransaction = transactions.length > 0 ? transactions[0] : null;
  const [nfcReady, setNfcReady] = useState(false);
  const [scanning, setScanning] = useState(false);

  const checkNFCSupport = async () => {
    const supported = await NFCService.isSupported();
    if (!supported) {
      Alert.alert(
        'NFC Tidak Didukung',
        'Device Anda tidak mendukung NFC atau NFC tidak aktif.'
      );
    } else {
      await NFCService.init();
      setNfcReady(true);
    }
  };

  React.useEffect(() => {
    checkNFCSupport();
  }, []);

  const handleScanNFC = async () => {
    try {
      setScanning(true);
      
      let tagId: string | null = null;
      
      if (nfcReady) {
        try {
          const result = await NFCService.readTag();
          tagId = result.id;
        } catch (nfcError) {
          console.log('NFC read failed, using mock:', nfcError);
        }
      }
      
      if (!tagId) {
        tagId = `NFC${Math.floor(Math.random() * 1000)}`;
      }

      // Mock transaction creation
      const mockTransaction: any = {
        id: 'TRX' + Date.now(),
        userId: 'user-1',
        vehicleId: 'vehicle-' + Math.floor(Math.random() * 100),
        locationId: tagId,
        amount: Math.floor(Math.random() * 20000) + 5000,
        status: Math.random() > 0.3 ? 'completed' : 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addTransaction(mockTransaction));

      if (mockTransaction.status === 'completed') {
        Alert.alert(
          'Pembayaran Lunas',
          `Tag NFC: ${tagId}\nJumlah: Rp ${mockTransaction.amount.toLocaleString(
            'id-ID'
          )}\nStatus: LUNAS`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Tunggakan',
          `Tag NFC: ${tagId}\nJumlah: Rp ${mockTransaction.amount.toLocaleString(
            'id-ID'
          )}\nStatus: BELUM BAYAR`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal membaca tag NFC');
    } finally {
      setScanning(false);
      NFCService.cancel();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.instructionCard}>
          <Text style={styles.title}>Scan Tag NFC</Text>
          <Text style={styles.instruction}>
            Dekatkan smartphone ke Tag NFC pada motor untuk melakukan penagihan
            retribusi parkir.
          </Text>

          {nfcReady ? (
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, styles.activeDot]} />
              <Text style={styles.statusText}>NFC Aktif</Text>
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, styles.inactiveDot]} />
              <Text style={styles.statusText}>NFC Tidak Aktif (Mode Mock)</Text>
            </View>
          )}

          <Button
            title={scanning ? 'Scanning...' : 'Scan Tag NFC'}
            onPress={handleScanNFC}
            loading={scanning || loading}
            disabled={scanning || loading}
            fullWidth
            
          />
        </Card>

        {lastTransaction && (
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Transaksi Terakhir</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Tag NFC:</Text>
              <Text style={styles.resultValue}>{lastTransaction.locationId}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Transaksi ID:</Text>
              <Text style={styles.resultValue}>{lastTransaction.id}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Jumlah:</Text>
              <Text
                style={[
                  styles.resultValue,
                  styles.amountText,
                  lastTransaction.amount === 0 && styles.greenText,
                ]}>
                {lastTransaction.amount === 0
                  ? 'GRATIS'
                  : `Rp ${lastTransaction.amount.toLocaleString('id-ID')}`}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  lastTransaction.status === 'completed' && styles.successBadge,
                  lastTransaction.status === 'pending' && styles.dangerBadge,
                  lastTransaction.status === 'cancelled' && styles.infoBadge,
                ]}>
                <Text style={styles.badgeText}>
                  {lastTransaction.status === 'completed' ? 'LUNAS' : 
                   lastTransaction.status === 'pending' ? 'PENDING' : 
                   lastTransaction.status === 'failed' ? 'GAGAL' : 'BATAL'}
                </Text>
              </View>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Waktu:</Text>
              <Text style={styles.resultValue}>
                {new Date(lastTransaction.createdAt).toLocaleString('id-ID')}
              </Text>
            </View>
          </Card>
        )}

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informasi</Text>
          <Text style={styles.infoText}>
             Member aktif: Parkir GRATIS{'\n'}
             Non-member: Rp 2.000 per kunjungan{'\n'}
             Motor terdaftar: Penagihan otomatis{'\n'}
             Motor tidak terdaftar: Arahkan ke registrasi
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  instructionCard: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  instruction: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  activeDot: {
    backgroundColor: colors.success,
  },
  inactiveDot: {
    backgroundColor: colors.warning,
  },
  statusText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  scanBtn: {
    marginTop: spacing.sm,
  },
  resultCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.successLight,
  },
  resultTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  resultValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    flex: 2,
    textAlign: 'right',
  },
  amountText: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
  greenText: {
    color: colors.success,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  borderRadius: 8,
  },
  successBadge: {
    backgroundColor: colors.success,
  },
  dangerBadge: {
    backgroundColor: colors.danger,
  },
  infoBadge: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.white,
  },
  infoCard: {
    backgroundColor: colors.primaryLight,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
