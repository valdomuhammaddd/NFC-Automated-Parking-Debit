/**
 * MARKIR - Manage Promotions Screen (CRUD)
 * @author Valdo Muhammad
 * @description Admin screen to manage promotions: Create, Read, Update, Delete
 * ✅ Connected to Backend API
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, spacing, fontSize } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import * as MarkirAPI from '../../data/api/markir-api';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  code: string;
  validUntil: string;
  isActive: boolean;
}

export const ManagePromotionsScreen = () => {
  const navigation = useNavigation();
  
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formDiscountType, setFormDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [formCode, setFormCode] = useState('');
  const [formValidUntil, setFormValidUntil] = useState('');

  // Load promotions from API
  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading promotions from API...');
      const response = await MarkirAPI.getPromotions();
      console.log('📥 API Response:', response);
      
      if (response.success && response.data) {
        // Transform API data to component format
        const transformedData = response.data.map((promo: any) => {
          const transformed = {
            id: promo.promotion_id?.toString() || promo.id?.toString(),
            title: promo.title,
            description: promo.description,
            discount: promo.discount_value,
            discountType: promo.discount_type,
            code: promo.code,
            validUntil: promo.valid_until?.split('T')[0] || '2025-12-31',
            isActive: promo.is_active !== undefined ? promo.is_active : true,
          };
          console.log('🔄 Transformed:', promo.promotion_id, '→', transformed.id, transformed.title);
          return transformed;
        });
        setPromotions(transformedData);
        console.log('✅ Loaded', transformedData.length, 'promotions:', transformedData.map((p: any) => `${p.id}:${p.title}`));
      }
    } catch (error) {
      console.error('❌ Error loading promotions:', error);
      Alert.alert('Error', 'Gagal memuat data promosi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredPromotions = promotions.filter((promo) =>
    promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    resetForm();
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (promo: Promotion) => {
    setSelectedPromo(promo);
    setFormTitle(promo.title);
    setFormDescription(promo.description);
    setFormDiscount(promo.discount.toString());
    setFormDiscountType(promo.discountType);
    setFormCode(promo.code);
    setFormValidUntil(promo.validUntil);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (promo: Promotion) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus promosi "${promo.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Deleting promotion ID:', promo.id, 'Type:', typeof promo.id);
              const promotionId = parseInt(promo.id);
              console.log('🗑️ Parsed ID:', promotionId);
              
              // Don't show loading during delete
              const response = await MarkirAPI.deletePromotion(promotionId);
              console.log('✅ Delete response:', response);
              
              // Manually remove from state instead of reloading
              setPromotions(prevPromotions => prevPromotions.filter(p => p.id !== promo.id));
              
              Alert.alert('✅ Berhasil', 'Promosi berhasil dihapus');
            } catch (error: any) {
              console.error('❌ Error deleting promotion:', error);
              console.error('❌ Error details:', error.response?.data || error.message);
              Alert.alert('Error', `Gagal menghapus promosi: ${error.response?.data?.message || error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (promo: Promotion) => {
    try {
      console.log('🔄 Toggling promotion status:', promo.id);
      
      // Optimistic update - update UI immediately
      setPromotions(prevPromotions =>
        prevPromotions.map(p =>
          p.id === promo.id ? { ...p, isActive: !p.isActive } : p
        )
      );
      
      // Then call API in background
      await MarkirAPI.updatePromotion(parseInt(promo.id), {
        is_active: !promo.isActive,
      });
      
      console.log('✅ Toggle completed');
    } catch (error) {
      console.error('❌ Error toggling promotion:', error);
      
      // Revert on error
      setPromotions(prevPromotions =>
        prevPromotions.map(p =>
          p.id === promo.id ? { ...p, isActive: promo.isActive } : p
        )
      );
      
      Alert.alert('Error', 'Gagal mengubah status promosi');
    }
  };

  const handleSave = async () => {
    if (!formTitle || !formDescription || !formDiscount || !formCode || !formValidUntil) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    try {
      setLoading(true);
      const promoData = {
        title: formTitle,
        description: formDescription,
        discount_value: parseFloat(formDiscount),
        discount_type: formDiscountType,
        code: formCode.toUpperCase(),
        valid_until: formValidUntil + 'T23:59:59Z',
        is_active: true,
      };

      if (editMode && selectedPromo) {
        // Update existing
        console.log('✏️ Updating promotion:', selectedPromo.id);
        const response = await MarkirAPI.updatePromotion(parseInt(selectedPromo.id), promoData);
        
        // Update in state
        setPromotions(prevPromotions =>
          prevPromotions.map(p =>
            p.id === selectedPromo.id
              ? {
                  ...p,
                  title: formTitle,
                  description: formDescription,
                  discount: parseFloat(formDiscount),
                  discountType: formDiscountType,
                  code: formCode.toUpperCase(),
                  validUntil: formValidUntil,
                }
              : p
          )
        );
        
        Alert.alert('✅ Berhasil', 'Promosi berhasil diupdate');
      } else {
        // Add new
        console.log('➕ Creating new promotion');
        const response = await MarkirAPI.createPromotion(promoData);
        
        // Add to state
        if (response.success && response.data) {
          const newPromo: Promotion = {
            id: response.data.promotion_id?.toString() || Date.now().toString(),
            title: formTitle,
            description: formDescription,
            discount: parseFloat(formDiscount),
            discountType: formDiscountType,
            code: formCode.toUpperCase(),
            validUntil: formValidUntil,
            isActive: true,
          };
          setPromotions(prevPromotions => [newPromo, ...prevPromotions]);
        }
        
        Alert.alert('✅ Berhasil', 'Promosi baru berhasil ditambahkan');
      }

      setShowModal(false);
      resetForm();
      // Don't reload - we already updated state
    } catch (error) {
      console.error('❌ Error saving promotion:', error);
      Alert.alert('Error', 'Gagal menyimpan promosi');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormDiscount('');
    setFormDiscountType('percentage');
    setFormCode('');
    setFormValidUntil('');
    setSelectedPromo(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Promosi</Text>
        <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari promosi atau kode..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      )}

      {/* Promotions List */}
      {!loading && (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{promotions.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.successText]}>
                {promotions.filter((p) => p.isActive).length}
              </Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.dangerText]}>
                {promotions.filter((p) => !p.isActive).length}
              </Text>
              <Text style={styles.statLabel}>Nonaktif</Text>
            </View>
          </View>

        {filteredPromotions.map((promo) => (
          <Card key={promo.id} style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <View style={styles.promoLeft}>
                <View
                  style={[
                    styles.promoIcon,
                    { backgroundColor: promo.isActive ? colors.successLight : colors.gray200 },
                  ]}
                >
                  <Ionicons
                    name="pricetag"
                    size={24}
                    color={promo.isActive ? colors.success : colors.textSecondary}
                  />
                </View>
                <View style={styles.promoInfo}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoCode}>Kode: {promo.code}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleToggleActive(promo)}
                style={styles.toggleButton}
              >
                <Ionicons
                  name={promo.isActive ? 'toggle' : 'toggle-outline'}
                  size={32}
                  color={promo.isActive ? colors.success : colors.gray300}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.promoDescription}>{promo.description}</Text>

            <View style={styles.promoDetails}>
              <View style={styles.promoDetailItem}>
                <Ionicons name="gift-outline" size={16} color={colors.primary} />
                <Text style={styles.promoDetailText}>
                  {promo.discountType === 'percentage'
                    ? `${promo.discount}% OFF`
                    : `Rp ${promo.discount.toLocaleString('id-ID')}`}
                </Text>
              </View>
              <View style={styles.promoDetailItem}>
                <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                <Text style={styles.promoDetailText}>
                  Valid: {new Date(promo.validUntil).toLocaleDateString('id-ID')}
                </Text>
              </View>
            </View>

            <View style={styles.promoActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(promo)}
              >
                <Ionicons name="create-outline" size={20} color={colors.primary} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              
              {/* Direct delete button for testing */}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.warning + '20' }]}
                onPress={() => {
                  console.log('⚡ DIRECT DELETE PRESSED for ID:', promo.id);
                  setPromotions(prev => {
                    const filtered = prev.filter(p => p.id !== promo.id);
                    console.log('⚡ Filtered:', filtered.length, 'items remaining');
                    return filtered;
                  });
                }}
              >
                <Ionicons name="flash-outline" size={20} color={colors.warning} />
                <Text style={{ color: colors.warning, fontSize: 12, fontWeight: '600' }}>Test</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(promo)}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
                <Text style={styles.deleteButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {filteredPromotions.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="pricetag-outline" size={64} color={colors.gray300} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Promosi tidak ditemukan' : 'Belum ada promosi'}
            </Text>
          </View>
        )}
      </ScrollView>
      )}

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Edit Promosi' : 'Tambah Promosi'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Judul Promosi *</Text>
              <TextInput
                style={styles.input}
                value={formTitle}
                onChangeText={setFormTitle}
                placeholder="Contoh: Diskon 50% First Timer"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.label}>Deskripsi *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formDescription}
                onChangeText={setFormDescription}
                placeholder="Jelaskan detail promosi..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Tipe Diskon *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setFormDiscountType('percentage')}
                >
                  <Ionicons
                    name={
                      formDiscountType === 'percentage'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.radioLabel}>Persentase (%)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setFormDiscountType('fixed')}
                >
                  <Ionicons
                    name={formDiscountType === 'fixed' ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.radioLabel}>Nominal (Rp)</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>
                Nilai Diskon * ({formDiscountType === 'percentage' ? '%' : 'Rp'})
              </Text>
              <TextInput
                style={styles.input}
                value={formDiscount}
                onChangeText={setFormDiscount}
                placeholder={formDiscountType === 'percentage' ? '50' : '10000'}
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Kode Promosi *</Text>
              <TextInput
                style={styles.input}
                value={formCode}
                onChangeText={(text) => setFormCode(text.toUpperCase())}
                placeholder="PROMO2025"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
              />

              <Text style={styles.label}>Berlaku Hingga * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={formValidUntil}
                onChangeText={setFormValidUntil}
                placeholder="2025-12-31"
                placeholderTextColor={colors.textSecondary}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Batal"
                onPress={() => setShowModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={editMode ? 'Update' : 'Simpan'}
                onPress={handleSave}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  successText: {
    color: colors.success,
  },
  dangerText: {
    color: colors.danger,
  },
  promoCard: {
    marginBottom: spacing.md,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  promoInfo: {
    flex: 1,
  },
  promoTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  promoCode: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  toggleButton: {
    padding: spacing.xs,
  },
  promoDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  promoDetails: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  promoDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  promoDetailText: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  promoActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
  },
  editButtonText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.dangerLight,
  },
  deleteButtonText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.danger,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    padding: spacing.lg,
    maxHeight: 500,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
  },
  radioLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
