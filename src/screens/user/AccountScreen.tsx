/**
 * MARKIR - Account Screen
 * @author Valdo Muhammad
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';

export const AccountScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: () => dispatch(logout())
        },
      ]
    );
  };

  const menuItems = [
    { 
      icon: 'person-outline', 
      label: 'Informasi Pribadi', 
      onPress: () => {
        console.log('🔹 Account: Navigating to InformasiPribadi');
        Vibration.vibrate(50);
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('InformasiPribadi');
        } else {
          console.error('❌ Parent not found for InformasiPribadi');
        }
      }
    },
    { 
      icon: 'card-outline', 
      label: 'Status Membership', 
      onPress: () => {
        console.log('🔹 Account: Navigating to StatusMembership');
        Vibration.vibrate(50);
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('StatusMembership');
        } else {
          console.error('❌ Parent not found for StatusMembership');
        }
      }
    },
    { 
      icon: 'car-outline', 
      label: 'Kendaraan Saya', 
      onPress: () => {
        console.log('🔹 Account: Navigating to KendaraanSaya');
        Vibration.vibrate(50);
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('KendaraanSaya');
        } else {
          console.error('❌ Parent not found for KendaraanSaya');
        }
      }
    },
    { 
      icon: 'wallet-outline', 
      label: 'E-Wallet', 
      onPress: () => {
        console.log('🔹 Account: Navigating to Wallet (Tab level)');
        Vibration.vibrate(50);
        navigation.navigate('Wallet');
      }
    },
    { 
      icon: 'notifications-outline', 
      label: 'Notifikasi', 
      onPress: () => {
        console.log('🔹 Account: Navigating to Notifikasi');
        Vibration.vibrate(50);
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('Notifikasi');
        } else {
          console.error('❌ Parent not found for Notifikasi');
        }
      }
    },
    { 
      icon: 'help-circle-outline', 
      label: 'Pusat Bantuan', 
      onPress: () => {
        console.log('🔹 Account: Navigating to PusatBantuan');
        Vibration.vibrate(50);
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('PusatBantuan');
        } else {
          console.error('❌ Parent not found for PusatBantuan');
        }
      }
    },
    { 
      icon: 'information-circle-outline', 
      label: 'Tentang Aplikasi', 
      onPress: () => {
        console.log('🔹 Account: Navigating to About');
        Vibration.vibrate(50);
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('About');
        } else {
          console.error('❌ Parent not found for About');
        }
      }
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={PRIMARY} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <View style={styles.membershipBadge}>
            <Ionicons 
              name={user?.membership_status === 'ACTIVE' ? 'star' : 'star-outline'} 
              size={16} 
              color={user?.membership_status === 'ACTIVE' ? SUCCESS : TEXT_GRAY} 
            />
            <Text style={[
              styles.membershipText,
              user?.membership_status === 'ACTIVE' && styles.membershipActive
            ]}>
              {user?.membership_status === 'ACTIVE' ? 'Member Premium' : 'Member Free'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => Alert.alert('Edit Profile', 'Fitur edit profil akan segera hadir!')}
        >
          <Ionicons name="create-outline" size={22} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={22} color={PRIMARY} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={TEXT_GRAY} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>MARKIR Version 1.0.0</Text>
          <Text style={styles.versionText}> 2025 Valdo Muhammad</Text>
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GRAY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: TEXT_GRAY,
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: GRAY_LIGHT,
    borderRadius: 12,
  },
  membershipText: {
    fontSize: 12,
    color: TEXT_GRAY,
    fontWeight: '600',
    marginLeft: 4,
  },
  membershipActive: {
    color: SUCCESS,
  },
  editButton: {
    padding: 8,
  },
  menuSection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: '500',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginBottom: 4,
  },
});
