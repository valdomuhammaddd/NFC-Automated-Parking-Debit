import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';

interface Wallet {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
}

export const WalletScreen = ({ navigation }: any) => {
  const [wallets, setWallets] = useState<Wallet[]>([
    { id: 'dana', name: 'DANA', icon: 'wallet', color: '#118EEA', connected: false },
    { id: 'gopay', name: 'GoPay', icon: 'wallet', color: '#00AA13', connected: false },
    { id: 'linkaja', name: 'LinkAja', icon: 'wallet', color: '#E31E24', connected: false },
    { id: 'shopeepay', name: 'ShopeePay', icon: 'wallet', color: '#EE4D2D', connected: false },
  ]);

  const handleConnect = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    Alert.alert('Hubungkan E-Wallet', `Anda akan diarahkan untuk menghubungkan ${wallet?.name}`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hubungkan', onPress: () => {
          setWallets(prev => prev.map(w => w.id === walletId ? { ...w, connected: true } : w));
          Alert.alert('Berhasil', 'E-Wallet berhasil dihubungkan!');
        }
      },
    ]);
  };

  const handleDisconnect = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    Alert.alert('Putuskan Koneksi', `Yakin ingin memutuskan koneksi ${wallet?.name}?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Putuskan', style: 'destructive', onPress: () => {
          setWallets(prev => prev.map(w => w.id === walletId ? { ...w, connected: false } : w));
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Wallet</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={PRIMARY} />
          <Text style={styles.infoText}>Hubungkan e-wallet untuk pembayaran parkir yang lebih mudah</Text>
        </View>
        <View style={styles.walletsSection}>
          {wallets.map((wallet) => (
            <View key={wallet.id} style={styles.walletCard}>
              <View style={styles.walletInfo}>
                <View style={[styles.walletIcon, { backgroundColor: wallet.color }]}>
                  <Ionicons name={wallet.icon as any} size={28} color={WHITE} />
                </View>
                <View style={styles.walletDetails}>
                  <Text style={styles.walletName}>{wallet.name}</Text>
                  {wallet.connected ? (
                    <View style={styles.connectedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={SUCCESS} />
                      <Text style={styles.connectedText}> Terhubung</Text>
                    </View>
                  ) : (
                    <Text style={styles.notConnectedText}>Belum terhubung</Text>
                  )}
                </View>
              </View>
              {wallet.connected ? (
                <TouchableOpacity style={styles.disconnectButton} onPress={() => handleDisconnect(wallet.id)}>
                  <Text style={styles.disconnectText}>Putuskan</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.connectButton} onPress={() => handleConnect(wallet.id)}>
                  <Text style={styles.connectText}>Hubungkan</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomInfoText}> Tip: Hubungkan lebih dari satu e-wallet untuk kemudahan pembayaran</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: TEXT_DARK },
  infoCard: { flexDirection: 'row', backgroundColor: 'rgba(0, 119, 182, 0.05)', marginHorizontal: 20, marginTop: 20, marginBottom: 16, padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: PRIMARY },
  infoText: { flex: 1, marginLeft: 12, fontSize: 14, color: TEXT_DARK, lineHeight: 20 },
  walletsSection: { paddingHorizontal: 20 },
  walletCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: WHITE, padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0' },
  walletInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  walletIcon: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  walletDetails: { marginLeft: 16, flex: 1 },
  walletName: { fontSize: 16, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  connectedBadge: { flexDirection: 'row', alignItems: 'center' },
  connectedText: { fontSize: 13, color: SUCCESS, fontWeight: '600' },
  notConnectedText: { fontSize: 13, color: TEXT_GRAY },
  connectButton: { backgroundColor: PRIMARY, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  connectText: { color: WHITE, fontSize: 14, fontWeight: '600' },
  disconnectButton: { backgroundColor: GRAY_LIGHT, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  disconnectText: { color: TEXT_DARK, fontSize: 14, fontWeight: '600' },
  bottomInfo: { marginHorizontal: 20, marginTop: 16, marginBottom: 32, padding: 16, backgroundColor: GRAY_LIGHT, borderRadius: 12 },
  bottomInfoText: { fontSize: 14, color: TEXT_GRAY, lineHeight: 20, textAlign: 'center' },
});
