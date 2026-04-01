/**
 * MARKIR - Pusat Bantuan Screen
 * Help Center with FAQ Accordion
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '0',
    question: '📘 Tata Cara Penggunaan Aplikasi MARKIR',
    answer: `Panduan lengkap menggunakan MARKIR E-Parking:

🔹 LANGKAH 1: Persiapan Akun & Saldo
Lakukan Login/Registrasi. Siapkan saldo dengan Top Up melalui menu Dompet (E-Wallet). Pastikan saldo mencukupi untuk transaksi parkir Anda.

🔹 LANGKAH 2: Daftar Kendaraan
Masuk ke menu Kendaraan Saya. Daftarkan Plat Nomor Anda dan inisiasi permintaan Tag NFC baru melalui aplikasi.

🔹 LANGKAH 3: Aktivasi NFC Fisik
Kunjungi Petugas/Pos MARKIR terdekat untuk men-'tap' Tag NFC fisik pada kendaraan Anda. Status NFC Anda di aplikasi akan berubah menjadi 'Terikat'.

🔹 LANGKAH 4: Transaksi (Tap & Done)
Ketika Anda parkir, Petugas akan men-'tap' Tag NFC Anda. Saldo akan dipotong otomatis secara real-time. Tidak perlu membuka aplikasi!

🔹 LANGKAH 5: Verifikasi
Cek notifikasi dan menu Riwayat Transaksi untuk memastikan pembayaran tercatat Lunas. Anda juga akan menerima bukti transaksi digital.

✨ Dengan sistem "Tap and Done", parkir menjadi lebih cepat dan efisien!`,
  },
  {
    id: '1',
    question: 'Bagaimana cara menggunakan NFC untuk parkir?',
    answer: 'Pastikan Tag NFC Anda sudah terikat dengan kendaraan melalui Pos MARKIR. Ketika parkir, Petugas akan men-tap Tag NFC pada kendaraan Anda. Sistem akan otomatis memotong saldo dan mencatat transaksi. Anda akan menerima notifikasi konfirmasi pembayaran.',
  },
  {
    id: '2',
    question: 'Apa itu Membership Premium dan apa keuntungannya?',
    answer: 'Membership Premium memberikan diskon 50% untuk semua transaksi parkir, layanan pelanggan prioritas, parkir gratis di area tertentu, dan laporan transaksi bulanan. Biaya hanya Rp 299.000/tahun. Hemat hingga 60% dari biaya parkir reguler!',
  },
  {
    id: '3',
    question: 'Bagaimana cara top-up saldo wallet?',
    answer: 'Buka menu Account → Wallet, pilih nominal top-up, lalu pilih metode pembayaran (Transfer Bank, E-Wallet, atau Kartu Kredit/Debit). Saldo akan terisi dalam 1-5 menit. Minimum top-up Rp 50.000.',
  },
  {
    id: '4',
    question: 'Apakah saya bisa mendaftarkan lebih dari 1 kendaraan?',
    answer: 'Ya! Anda bisa mendaftarkan hingga 5 kendaraan (motor atau mobil) dalam 1 akun. Buka menu Account → Kendaraan Saya, lalu tap tombol + untuk menambahkan kendaraan baru. Setiap kendaraan memerlukan Tag NFC unik.',
  },
  {
    id: '5',
    question: 'Bagaimana cara mendapatkan Tag NFC fisik?',
    answer: 'Setelah mendaftarkan kendaraan di aplikasi, kunjungi Pos MARKIR terdekat dengan membawa STNK kendaraan. Petugas akan memberikan Tag NFC dan mengaktifkannya. Tag NFC gratis untuk pengguna baru!',
  },
  {
    id: '6',
    question: 'Apakah data pribadi saya aman?',
    answer: 'Keamanan data Anda adalah prioritas kami. Semua data dienkripsi menggunakan standar industri (AES-256) dan disimpan di server aman. Kami tidak membagikan data pribadi Anda kepada pihak ketiga.',
  },
  {
    id: '7',
    question: 'Bagaimana cara menghubungi customer service?',
    answer: 'Anda bisa menghubungi kami melalui WhatsApp di nomor +62 812-3456-7890 atau email support@markir.com. Tim kami siap membantu Senin-Jumat pukul 08.00-17.00 WIB.',
  },
];

export const PusatBantuanScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    Vibration.vibrate(50);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactUs = () => {
    Vibration.vibrate(50);
    Alert.alert(
      'Hubungi Kami',
      'Pilih metode kontak:',
      [
        {
          text: 'WhatsApp',
          onPress: () => {
            Linking.openURL('https://wa.me/6281234567890').catch(() =>
              Alert.alert('Error', 'Tidak dapat membuka WhatsApp')
            );
          },
        },
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL('mailto:support@markir.com').catch(() =>
              Alert.alert('Error', 'Tidak dapat membuka Email')
            );
          },
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const filteredFAQ = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={TEXT_GRAY} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari pertanyaan..."
              placeholderTextColor={TEXT_GRAY}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={TEXT_GRAY} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Pertanyaan yang Sering Diajukan</Text>

          {filteredFAQ.length === 0 ? (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={60} color={TEXT_GRAY} />
              <Text style={styles.noResultsText}>
                Tidak ada hasil untuk "{searchQuery}"
              </Text>
            </View>
          ) : (
            filteredFAQ.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const isGuideItem = item.id === '0'; // Tata Cara item
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.faqItem,
                    index === 0 && styles.firstFaqItem,
                    index === filteredFAQ.length - 1 && styles.lastFaqItem,
                    isExpanded && styles.expandedFaqItem,
                    isGuideItem && styles.guideFaqItem,
                  ]}
                  onPress={() => handleToggleExpand(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqHeader}>
                    <Text style={[
                      styles.faqQuestion,
                      isGuideItem && styles.guideQuestion
                    ]}>
                      {item.question}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={isGuideItem ? PRIMARY : (isExpanded ? PRIMARY : TEXT_GRAY)}
                    />
                  </View>
                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={[
                        styles.faqAnswer,
                        isGuideItem && styles.guideAnswer
                      ]}>
                        {item.answer}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <View style={styles.contactHeader}>
            <Ionicons name="help-circle" size={24} color={PRIMARY} />
            <Text style={styles.contactTitle}>Masih Perlu Bantuan?</Text>
          </View>
          <Text style={styles.contactDescription}>
            Tim Customer Service kami siap membantu Anda dengan pertanyaan atau masalah
            yang Anda hadapi.
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactUs}>
            <Ionicons name="chatbubbles" size={20} color={WHITE} />
            <Text style={styles.contactButtonText}>HUBUNGI KAMI</Text>
          </TouchableOpacity>

          <View style={styles.contactInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
              <Text style={styles.infoText}>+62 812-3456-7890</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={18} color={PRIMARY} />
              <Text style={styles.infoText}>support@markir.com</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={18} color={TEXT_GRAY} />
              <Text style={styles.infoText}>Senin - Jumat, 08.00 - 17.00 WIB</Text>
            </View>
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>MARKIR E-Parking</Text>
          <Text style={styles.versionNumber}>Versi 1.0.0</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    padding: 20,
    backgroundColor: GRAY_LIGHT,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_DARK,
    marginLeft: 10,
  },
  faqSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY_LIGHT,
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  firstFaqItem: {
    borderTopWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  lastFaqItem: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  expandedFaqItem: {
    backgroundColor: 'rgba(0, 119, 182, 0.02)',
  },
  guideFaqItem: {
    backgroundColor: 'rgba(0, 119, 182, 0.08)',
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    lineHeight: 22,
    marginRight: 12,
  },
  guideQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY,
  },
  faqAnswerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: GRAY_LIGHT,
  },
  faqAnswer: {
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 21,
  },
  guideAnswer: {
    fontSize: 14,
    color: TEXT_DARK,
    lineHeight: 24,
    fontWeight: '500',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginTop: 16,
    textAlign: 'center',
  },
  contactSection: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 20,
    backgroundColor: GRAY_LIGHT,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginLeft: 10,
  },
  contactDescription: {
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
    marginLeft: 10,
  },
  contactInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginLeft: 12,
  },
  versionSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_GRAY,
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
});
