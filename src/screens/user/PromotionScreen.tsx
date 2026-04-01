/**
 * MARKIR - Promotion Screen
 * @author Valdo Muhammad
 * Fitur: Menampilkan promo-promo MARKIR (membership, e-wallet, dll)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';
const GOLD = '#FFD700';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  terms: string[];
  color: string;
  icon: string;
  category: 'MEMBERSHIP' | 'E-WALLET' | 'PARKING' | 'REFERRAL';
}

const PROMOTIONS: Promotion[] = [
  {
    id: 'PROMO001',
    title: 'Membership 1 Tahun - Diskon 20%!',
    description: 'Beli membership premium 1 tahun sekarang dan dapatkan diskon 20%. Dari Rp 600.000 jadi hanya Rp 500.000!',
    discount: '20%',
    validUntil: '31 Desember 2025',
    terms: [
      'Berlaku untuk pembelian membership baru',
      'Tidak dapat digabung dengan promo lain',
      'Pembayaran harus lunas',
      'Membership aktif segera setelah pembelian',
    ],
    color: GOLD,
    icon: 'star',
    category: 'MEMBERSHIP',
  },
  {
    id: 'PROMO002',
    title: 'Pembayaran via DANA - Cashback 10%!',
    description: 'Bayar parkir dengan DANA dan dapatkan cashback 10% langsung ke DANA kamu. Maksimal cashback Rp 10.000.',
    discount: '10%',
    validUntil: '15 Desember 2025',
    terms: [
      'Minimal transaksi Rp 5.000',
      'Maksimal cashback Rp 10.000 per transaksi',
      'Cashback masuk dalam 1x24 jam',
      'Berlaku untuk semua pengguna DANA',
    ],
    color: '#118EEA',
    icon: 'wallet',
    category: 'E-WALLET',
  },
  {
    id: 'PROMO003',
    title: 'Gratis Parkir Pertama!',
    description: 'Pengguna baru MARKIR? Dapatkan GRATIS parkir untuk transaksi pertama kamu hingga 3 jam!',
    discount: 'GRATIS',
    validUntil: '31 Januari 2026',
    terms: [
      'Hanya untuk pengguna baru',
      'Maksimal gratis 3 jam',
      'Berlaku di semua lokasi MARKIR',
      'Gunakan kode: NEWUSER',
    ],
    color: SUCCESS,
    icon: 'gift',
    category: 'PARKING',
  },
  {
    id: 'PROMO004',
    title: 'Ajak Teman - Bonus Rp 50.000!',
    description: 'Ajak 5 teman daftar MARKIR dan dapatkan bonus saldo Rp 50.000! Teman kamu juga dapat Rp 10.000.',
    discount: 'Rp 50K',
    validUntil: '31 Maret 2026',
    terms: [
      'Minimal 5 referral yang berhasil',
      'Referral harus melakukan 1x transaksi',
      'Bonus masuk otomatis ke e-wallet',
      'Tidak ada batas maksimal referral',
    ],
    color: '#8B5CF6',
    icon: 'people',
    category: 'REFERRAL',
  },
  {
    id: 'PROMO005',
    title: 'Weekend Special - Diskon 15%!',
    description: 'Setiap weekend (Sabtu-Minggu) dapatkan diskon 15% untuk semua parkir di Mall dan Plaza!',
    discount: '15%',
    validUntil: 'Setiap Weekend',
    terms: [
      'Berlaku Sabtu-Minggu',
      'Hanya di Mall dan Plaza',
      'Tidak berlaku hari libur nasional',
      'Otomatis terpotong saat checkout',
    ],
    color: '#F59E0B',
    icon: 'calendar',
    category: 'PARKING',
  },
  {
    id: 'PROMO006',
    title: 'Pembayaran via GoPay - Promo 20%!',
    description: 'Bayar dengan GoPay dan dapatkan potongan 20%! Maksimal diskon Rp 15.000 per transaksi.',
    discount: '20%',
    validUntil: '20 Desember 2025',
    terms: [
      'Minimal transaksi Rp 10.000',
      'Maksimal potongan Rp 15.000',
      'Berlaku 3x per user',
      'Gunakan kode: GOPAY20',
    ],
    color: '#00AA13',
    icon: 'wallet',
    category: 'E-WALLET',
  },
];

export const PromotionScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'Semua', icon: 'apps' },
    { id: 'MEMBERSHIP', label: 'Membership', icon: 'star' },
    { id: 'E-WALLET', label: 'E-Wallet', icon: 'wallet' },
    { id: 'PARKING', label: 'Parkir', icon: 'car' },
    { id: 'REFERRAL', label: 'Referral', icon: 'people' },
  ];

  const filteredPromotions =
    selectedCategory === 'ALL'
      ? PROMOTIONS
      : PROMOTIONS.filter(p => p.category === selectedCategory);

  const handleClaimPromo = (promo: Promotion) => {
    Alert.alert(
      `Klaim Promo: ${promo.title}`,
      `Diskon: ${promo.discount}\n\nSyarat & Ketentuan:\n${promo.terms.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nLanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Klaim Sekarang',
          onPress: () => {
            Alert.alert('✅ Promo Diklaim!', `Promo "${promo.title}" berhasil diklaim. Gunakan sebelum ${promo.validUntil}.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promosi</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryButton, selectedCategory === cat.id && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon as any}
              size={20}
              color={selectedCategory === cat.id ? WHITE : TEXT_GRAY}
            />
            <Text style={[styles.categoryButtonText, selectedCategory === cat.id && styles.categoryButtonTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Promotions List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.promoList}>
        {filteredPromotions.map(promo => (
          <View key={promo.id} style={[styles.promoCard, { borderLeftColor: promo.color }]}>
            <View style={styles.promoHeader}>
              <View style={[styles.promoIcon, { backgroundColor: promo.color }]}>
                <Ionicons name={promo.icon as any} size={32} color={WHITE} />
              </View>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>{promo.discount}</Text>
              </View>
            </View>

            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoDescription}>{promo.description}</Text>

            <View style={styles.promoMeta}>
              <View style={styles.promoMetaItem}>
                <Ionicons name="time-outline" size={16} color={TEXT_GRAY} />
                <Text style={styles.promoMetaText}>Berlaku hingga {promo.validUntil}</Text>
              </View>
              <View style={styles.promoMetaItem}>
                <Ionicons name="pricetag-outline" size={16} color={TEXT_GRAY} />
                <Text style={styles.promoMetaText}>{promo.category}</Text>
              </View>
            </View>

            <View style={styles.promoTerms}>
              <Text style={styles.promoTermsTitle}>Syarat & Ketentuan:</Text>
              {promo.terms.slice(0, 2).map((term, index) => (
                <View key={index} style={styles.promoTermItem}>
                  <Text style={styles.promoTermBullet}>•</Text>
                  <Text style={styles.promoTermText}>{term}</Text>
                </View>
              ))}
              {promo.terms.length > 2 && (
                <Text style={styles.promoTermMore}>+{promo.terms.length - 2} lainnya...</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.claimButton, { backgroundColor: promo.color }]}
              onPress={() => handleClaimPromo(promo)}
            >
              <Ionicons name="checkmark-circle" size={20} color={WHITE} />
              <Text style={styles.claimButtonText}>Klaim Promo</Text>
            </TouchableOpacity>
          </View>
        ))}

        {filteredPromotions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="gift-outline" size={64} color={TEXT_GRAY} />
            <Text style={styles.emptyTitle}>Tidak Ada Promo</Text>
            <Text style={styles.emptyText}>
              Belum ada promo di kategori ini. Coba kategori lain!
            </Text>
          </View>
        )}
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
  categoryScroll: {
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: GRAY_LIGHT,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: PRIMARY,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_GRAY,
    marginLeft: 8,
  },
  categoryButtonTextActive: {
    color: WHITE,
  },
  promoList: {
    padding: 20,
  },
  promoCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  promoIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  promoBadgeText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
    lineHeight: 24,
  },
  promoDescription: {
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 20,
    marginBottom: 16,
  },
  promoMeta: {
    marginBottom: 16,
  },
  promoMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  promoMetaText: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginLeft: 8,
  },
  promoTerms: {
    backgroundColor: GRAY_LIGHT,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  promoTermsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  promoTermItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  promoTermBullet: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginRight: 6,
  },
  promoTermText: {
    fontSize: 12,
    color: TEXT_GRAY,
    flex: 1,
    lineHeight: 18,
  },
  promoTermMore: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: '600',
    marginTop: 4,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  claimButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
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
  },
});
