/**
 * MARKIR - Informasi Pribadi Screen
 * Profile Management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/hooks';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';

export const InformasiPribadiScreen = ({ navigation }: any) => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '081234567890');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = () => {
    Vibration.vibrate(50);
    setIsSaving(true);
    
    // Mock save to Redux
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Berhasil!', 'Perubahan telah disimpan');
    }, 1000);
  };

  const handleChangePassword = () => {
    Vibration.vibrate(50);
    Alert.alert('Ganti Password', 'Fitur ganti password akan segera tersedia');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informasi Pribadi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color={PRIMARY} />
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera" size={16} color={PRIMARY} />
            <Text style={styles.changePhotoText}>Ganti Foto</Text>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Nama Lengkap */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={TEXT_GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={TEXT_GRAY}
              />
            </View>
          </View>

          {/* Email (Read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Ionicons name="mail-outline" size={20} color={TEXT_GRAY} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.disabledText]}
                value={user?.email || 'user@example.com'}
                editable={false}
                placeholder="Email"
                placeholderTextColor={TEXT_GRAY}
              />
              <Ionicons name="lock-closed" size={16} color={TEXT_GRAY} />
            </View>
            <Text style={styles.helperText}>Email tidak dapat diubah</Text>
          </View>

          {/* Nomor Telepon */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={TEXT_GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Masukkan nomor telepon"
                placeholderTextColor={TEXT_GRAY}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Ganti Password Button */}
          <TouchableOpacity 
            style={styles.changePasswordBtn}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <Ionicons name="key-outline" size={20} color={PRIMARY} />
            <Text style={styles.changePasswordText}>GANTI PASSWORD</Text>
            <Ionicons name="chevron-forward" size={20} color={PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSaveChanges}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <Text style={styles.saveButtonText}>Menyimpan...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={WHITE} />
                <Text style={styles.saveButtonText}>SIMPAN PERUBAHAN</Text>
              </>
            )}
          </TouchableOpacity>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: GRAY_LIGHT,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
    marginLeft: 6,
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: GRAY_LIGHT,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TEXT_DARK,
  },
  disabledText: {
    color: TEXT_GRAY,
  },
  helperText: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 6,
    marginLeft: 4,
  },
  changePasswordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: GRAY_LIGHT,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  changePasswordText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
    marginLeft: 12,
  },
  buttonSection: {
    padding: 20,
    paddingTop: 0,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
