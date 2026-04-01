/**
 * MARKIR - Help & Support Screen
 * @author Valdo Muhammad
 * Fitur: Panduan lengkap penggunaan aplikasi + customer service
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'FAQ001',
    question: 'Bagaimana cara menggunakan MARKIR?',
    answer: '1. Daftar/Login ke aplikasi\n2. Isi saldo e-wallet atau beli membership\n3. Scan NFC tag di parkiran atau pilih lokasi parkir\n4. Pembayaran otomatis terpotong dari saldo\n5. Selesai! Lihat riwayat di menu History',
    category: 'Umum',
  },
  {
    id: 'FAQ002',
    question: 'Apa itu NFC dan bagaimana cara menggunakannya?',
    answer: 'NFC (Near Field Communication) adalah teknologi untuk pembayaran contactless. Cara pakai:\n1. Aktifkan NFC di pengaturan HP\n2. Buka menu "Scan NFC" di MARKIR\n3. Tempelkan HP ke tag NFC di parkiran\n4. Pembayaran otomatis langsung terpotong',
    category: 'NFC',
  },
  {
    id: 'FAQ003',
    question: 'Bagaimana cara top up saldo?',
    answer: 'Saat ini top up bisa dilakukan melalui:\n1. Transfer bank (BCA, Mandiri, BNI)\n2. E-wallet (DANA, GoPay, OVO)\n3. Minimarket (Alfamart, Indomaret)\n\nKode pembayaran akan muncul setelah Anda pilih metode top up di menu Wallet.',
    category: 'Pembayaran',
  },
  {
    id: 'FAQ004',
    question: 'Apa keuntungan membership premium?',
    answer: 'Keuntungan membership:\n• Parkir GRATIS unlimited di semua lokasi MARKIR\n• Tidak ada biaya admin\n• Priority customer service 24/7\n• Akses priority parking spot\n• Bonus voucher dan diskon\n\nHarga: Rp 50.000/bulan atau Rp 500.000/tahun (hemat 100k!)',
    category: 'Membership',
  },
  {
    id: 'FAQ005',
    question: 'Bagaimana cara booking parkir?',
    answer: '1. Buka menu "Booking"\n2. Pilih lokasi parkir yang tersedia\n3. Pilih durasi parkir (1-8 jam)\n4. Konfirmasi booking\n5. Datang sesuai jadwal, sistem akan detect otomatis\n\nBooking hanya tersedia untuk lokasi tertentu.',
    category: 'Booking',
  },
  {
    id: 'FAQ006',
    question: 'Bagaimana jika NFC tidak berfungsi?',
    answer: 'Solusi:\n1. Pastikan NFC aktif di pengaturan HP\n2. Restart aplikasi MARKIR\n3. Tempelkan HP lebih dekat ke tag NFC\n4. Coba gunakan mode simulasi untuk testing\n5. Jika masih error, hubungi CS kami\n\nAlternatif: Gunakan metode booking atau manual payment.',
    category: 'Troubleshooting',
  },
  {
    id: 'FAQ007',
    question: 'Bagaimana cara menambah kendaraan?',
    answer: '1. Buka menu "Vehicles"\n2. Klik tombol + di pojok kanan atas\n3. Isi data kendaraan (plat, merk, model, tahun, warna)\n4. Simpan\n5. Set kendaraan aktif untuk transaksi\n\nAnda bisa menambahkan unlimited kendaraan.',
    category: 'Kendaraan',
  },
  {
    id: 'FAQ008',
    question: 'Bagaimana cara refund jika salah bayar?',
    answer: 'Untuk refund:\n1. Screenshot bukti transaksi\n2. Hubungi CS via WhatsApp/Email\n3. Jelaskan kronologi kesalahan\n4. CS akan proses refund dalam 1x24 jam\n\nRefund akan masuk ke saldo e-wallet MARKIR Anda.',
    category: 'Pembayaran',
  },
];

export const HelpScreen = ({ navigation }: any) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Umum', 'NFC', 'Pembayaran', 'Membership', 'Booking', 'Kendaraan', 'Troubleshooting'];

  const filteredFAQ =
    selectedCategory === 'Semua'
      ? FAQ_DATA
      : FAQ_DATA.filter(faq => faq.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactCS = (method: 'whatsapp' | 'email' | 'phone') => {
    switch (method) {
      case 'whatsapp':
        Linking.openURL('https://wa.me/6281234567890?text=Halo%20MARKIR,%20saya%20butuh%20bantuan');
        break;
      case 'email':
        Linking.openURL('mailto:support@markir.com?subject=Bantuan%20MARKIR');
        break;
      case 'phone':
        Linking.openURL('tel:+6281234567890');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bantuan & Dukungan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <View style={styles.appIconContainer}>
            <Ionicons name="car-sport" size={48} color={PRIMARY} />
          </View>
          <Text style={styles.appName}>MARKIR</Text>
          <Text style={styles.appTagline}>Smart Parking Management System</Text>
          <View style={styles.appMetaRow}>
            <View style={styles.appMetaItem}>
              <Ionicons name="calendar-outline" size={16} color={TEXT_GRAY} />
              <Text style={styles.appMetaText}>Dibuat: November 2025</Text>
            </View>
            <View style={styles.appMetaItem}>
              <Ionicons name="person-outline" size={16} color={TEXT_GRAY} />
              <Text style={styles.appMetaText}>Valdo Muhammad</Text>
            </View>
          </View>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Quick Contact Card */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Hubungi Customer Service</Text>
          <Text style={styles.contactSubtitle}>Tersedia 24/7 untuk membantu Anda</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: '#25D366' }]}
              onPress={() => handleContactCS('whatsapp')}
            >
              <Ionicons name="logo-whatsapp" size={24} color={WHITE} />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: PRIMARY }]}
              onPress={() => handleContactCS('email')}
            >
              <Ionicons name="mail" size={24} color={WHITE} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: '#EF4444' }]}
              onPress={() => handleContactCS('phone')}
            >
              <Ionicons name="call" size={24} color={WHITE} />
              <Text style={styles.contactButtonText}>Telepon</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactInfo}>
            <View style={styles.contactInfoRow}>
              <Ionicons name="logo-whatsapp" size={16} color={TEXT_GRAY} />
              <Text style={styles.contactInfoText}>+62 812-3456-7890</Text>
            </View>
            <View style={styles.contactInfoRow}>
              <Ionicons name="mail-outline" size={16} color={TEXT_GRAY} />
              <Text style={styles.contactInfoText}>support@markir.com</Text>
            </View>
            <View style={styles.contactInfoRow}>
              <Ionicons name="globe-outline" size={16} color={TEXT_GRAY} />
              <Text style={styles.contactInfoText}>www.markir.com</Text>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions (FAQ)</Text>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ List */}
        <View style={styles.faqContainer}>
          {filteredFAQ.map((faq, index) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqQuestionLeft}>
                  <View style={styles.faqNumber}>
                    <Text style={styles.faqNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                </View>
                <Ionicons
                  name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={TEXT_GRAY}
                />
              </TouchableOpacity>
              {expandedId === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  <View style={styles.faqCategory}>
                    <Ionicons name="pricetag-outline" size={14} color={PRIMARY} />
                    <Text style={styles.faqCategoryText}>{faq.category}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Developer Info */}
        <View style={styles.developerCard}>
          <Text style={styles.developerTitle}>Tentang Developer</Text>
          <View style={styles.developerInfo}>
            <Ionicons name="person-circle" size={60} color={PRIMARY} />
            <View style={styles.developerDetails}>
              <Text style={styles.developerName}>Valdo Muhammad</Text>
              <Text style={styles.developerRole}>Full-Stack Developer</Text>
              <Text style={styles.developerUniversity}>Universitas Indo Global Mandiri</Text>
              <Text style={styles.developerMajor}>Jurusan Sistem Komputer</Text>
            </View>
          </View>
          <View style={styles.developerSocial}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://instagram.com/valdomuhammadd')}
            >
              <Ionicons name="logo-instagram" size={20} color={PRIMARY} />
              <Text style={styles.socialButtonText}>@valdomuhammadd</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL('mailto:valdo@markir.com')}
            >
              <Ionicons name="mail-outline" size={20} color={PRIMARY} />
              <Text style={styles.socialButtonText}>valdo@markir.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 MARKIR - Smart Parking System</Text>
          <Text style={styles.footerSubtext}>Developed with ❤️ by Valdo Muhammad</Text>
          <Text style={styles.footerVersion}>Version 1.0.0 (Build 2025.11.15)</Text>
        </View>
      </ScrollView>
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
  appInfoCard: {
    backgroundColor: WHITE,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 16,
  },
  appMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  appMetaText: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginLeft: 6,
  },
  versionBadge: {
    backgroundColor: GRAY_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  versionText: {
    fontSize: 12,
    color: TEXT_DARK,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  contactButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  contactButtonText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  contactInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactInfoText: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: WHITE,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoryChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  categoryChipTextActive: {
    color: WHITE,
  },
  faqContainer: {
    paddingHorizontal: 20,
  },
  faqItem: {
    backgroundColor: WHITE,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  faqNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    flex: 1,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 22,
    marginBottom: 12,
  },
  faqCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  faqCategoryText: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: '600',
    marginLeft: 6,
  },
  developerCard: {
    backgroundColor: WHITE,
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  developerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 16,
  },
  developerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  developerDetails: {
    marginLeft: 16,
    flex: 1,
  },
  developerName: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  developerRole: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
    marginBottom: 4,
  },
  developerUniversity: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginBottom: 2,
  },
  developerMajor: {
    fontSize: 13,
    color: TEXT_GRAY,
  },
  developerSocial: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 119, 182, 0.05)',
    borderRadius: 10,
    marginBottom: 8,
  },
  socialButtonText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginBottom: 8,
  },
  footerVersion: {
    fontSize: 11,
    color: TEXT_GRAY,
    fontFamily: 'monospace',
  },
});
