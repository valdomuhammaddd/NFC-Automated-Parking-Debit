/**
 * MARKIR - Registrasi Motor Screen (NFC Write)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { colors, spacing, fontSize } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addTransaction, setLoading } from '../../redux/slices/transactionSlice';
import NFCService from '../../utils/nfcService';

export const RegistrasiMotorScreen = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.transaction);
  
  const [formData, setFormData] = useState({
    ownerName: '',
    plateNumber: '',
    brand: '',
    model: '',
    color: '',
  });
  
  const [nfcTagId, setNfcTagId] = useState('');
  const [nfcReady, setNfcReady] = useState(false);
  const [writing, setWriting] = useState(false);

  const checkNFCSupport = async () => {
    const supported = await NFCService.isSupported();
    if (supported) {
      await NFCService.init();
      setNfcReady(true);
    }
  };

  React.useEffect(() => {
    checkNFCSupport();
  }, []);

  const handleWriteNFC = async () => {
    if (!formData.ownerName || !formData.plateNumber) {
      Alert.alert('Error', 'Nama Pemilik dan Nomor Plat harus diisi!');
      return;
    }

    try {
      setWriting(true);
      let tagId: string | null = null;
      
      if (nfcReady) {
        try {
          const dataToWrite = JSON.stringify({
            plate: formData.plateNumber,
            owner: formData.ownerName,
          });
          
          await NFCService.writeTag(dataToWrite);
          const result = await NFCService.readTag();
          tagId = result.id;
          
          Alert.alert('NFC Berhasil Ditulis', `Tag ID: ${tagId}`);
        } catch (nfcError) {
          console.log('NFC write failed, using mock:', nfcError);
        }
      }
      
      if (!tagId) {
        tagId = `NFC${Date.now()}`;
        Alert.alert('Mode Mock', `Tag ID Generated: ${tagId}`);
      }

      setNfcTagId(tagId);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal menulis NFC');
    } finally {
      setWriting(false);
      NFCService.cancel();
    }
  };

  const handleRegister = async () => {
    if (!nfcTagId) {
      Alert.alert('Error', 'Silakan tulis Tag NFC terlebih dahulu!');
      return;
    }

    if (!formData.ownerName || !formData.plateNumber || !formData.brand) {
      Alert.alert('Error', 'Nama, Plat, dan Merek harus diisi!');
      return;
    }

    try {
      // Create mock vehicle registration transaction
      const mockTransaction: any = {
        id: 'REG' + Date.now(),
        userId: 'user-1',
        vehicleId: 'vehicle-' + Date.now(),
        locationId: nfcTagId,
        amount: 0, // Registration is free
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addTransaction(mockTransaction));

      Alert.alert(
        'Registrasi Berhasil!',
        `Motor ${formData.plateNumber} telah terdaftar dengan Tag NFC ${nfcTagId}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                ownerName: '',
                plateNumber: '',
                brand: '',
                model: '',
                color: '',
              });
              setNfcTagId('');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal registrasi motor');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card style={styles.nfcCard}>
            <Text style={styles.cardTitle}>Tulis Tag NFC</Text>
            <Text style={styles.instruction}>
              Langkah 1: Tulis data ke Tag NFC kosong
            </Text>

            {nfcReady ? (
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, styles.activeDot]} />
                <Text style={styles.statusText}>NFC Siap</Text>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, styles.inactiveDot]} />
                <Text style={styles.statusText}>NFC Tidak Aktif (Mode Mock)</Text>
              </View>
            )}

            <Button
              title={writing ? 'Menulis...' : 'Tulis Tag NFC'}
              onPress={handleWriteNFC}
              loading={writing}
              disabled={writing || !formData.ownerName || !formData.plateNumber || !!nfcTagId}
              fullWidth
            />

            {nfcTagId && (
              <View style={styles.tagIdContainer}>
                <Text style={styles.tagIdLabel}>Tag ID:</Text>
                <Text style={styles.tagIdValue}>{nfcTagId}</Text>
              </View>
            )}
          </Card>

          <Card style={styles.formCard}>
            <Text style={styles.cardTitle}>Data Motor</Text>
            <Text style={styles.instruction}>Langkah 2: Isi informasi kendaraan</Text>

            <Input
              label='Nama Pemilik *'
              placeholder='Masukkan nama pemilik'
              value={formData.ownerName}
              onChangeText={(text) => setFormData({ ...formData, ownerName: text })}
            />

            <Input
              label='Nomor Plat *'
              placeholder='B 1234 XYZ'
              value={formData.plateNumber}
              onChangeText={(text) => setFormData({ ...formData, plateNumber: text.toUpperCase() })}
              autoCapitalize='characters'
            />

            <Input
              label='Merek *'
              placeholder='Honda, Yamaha, Suzuki, dll'
              value={formData.brand}
              onChangeText={(text) => setFormData({ ...formData, brand: text })}
            />

            <Input
              label='Model'
              placeholder='Beat, Vario, Mio, dll'
              value={formData.model}
              onChangeText={(text) => setFormData({ ...formData, model: text })}
            />

            <Input
              label='Warna'
              placeholder='Hitam, Putih, Merah, dll'
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
            />

            <Button
              title='Daftarkan Motor'
              onPress={handleRegister}
              loading={loading}
              disabled={loading || !nfcTagId}
              fullWidth
              variant='primary'
              
            />
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Informasi Registrasi</Text>
            <Text style={styles.infoText}>
              1. Pastikan Tag NFC kosong atau siap untuk ditulis{'\n'}
              2. Isi data pemilik dan nomor plat terlebih dahulu{'\n'}
              3. Klik "Tulis Tag NFC" dan dekatkan ke tag{'\n'}
              4. Setelah berhasil, lengkapi data motor{'\n'}
              5. Klik "Daftarkan Motor" untuk menyimpan{'\n\n'}
              Field dengan tanda * wajib diisi
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  content: { padding: spacing.lg },
  nfcCard: { marginBottom: spacing.lg },
  formCard: { marginBottom: spacing.lg },
  cardTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  instruction: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  activeDot: { backgroundColor: colors.success },
  inactiveDot: { backgroundColor: colors.warning },
  statusText: { fontSize: fontSize.sm, color: colors.textSecondary },
  tagIdContainer: { marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.successLight, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagIdLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  tagIdValue: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
  registerBtn: { marginTop: spacing.md },
  infoCard: { backgroundColor: colors.primaryLight },
  infoTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  infoText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
});
