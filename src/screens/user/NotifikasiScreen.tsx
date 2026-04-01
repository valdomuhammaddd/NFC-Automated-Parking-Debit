/**
 * MARKIR - Notifikasi Screen
 * Notification History with Mark-All-Read
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Switch,
  Vibration,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Notification, NotificationType } from '../../types/notification';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';
const WARNING = '#f39c12';
const ERROR = '#e74c3c';

export const NotifikasiScreen = ({ navigation }: any) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Parkir Berhasil',
      message: 'Anda telah parkir di Area A12. Durasi: 2 jam.',
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      title: 'Saldo Wallet Terisi',
      message: 'Top up Rp 100.000 berhasil. Saldo Anda sekarang Rp 350.000.',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: '3',
      title: 'Membership Berakhir',
      message: 'Membership Premium Anda akan berakhir dalam 7 hari. Perpanjang sekarang!',
      type: 'warning',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: '4',
      title: 'Promo Spesial!',
      message: 'Diskon 50% untuk parkir di Mall Palembang. Berlaku hingga akhir bulan.',
      type: 'info',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
    {
      id: '5',
      title: 'Parkir Selesai',
      message: 'Total biaya parkir: Rp 15.000. Sisa saldo: Rp 335.000.',
      type: 'info',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
    },
  ]);

  const groupNotificationsByDate = () => {
    const today: Notification[] = [];
    const thisWeek: Notification[] = [];
    const older: Notification[] = [];

    const now = Date.now();
    const oneDayAgo = now - 86400000;
    const oneWeekAgo = now - 604800000;

    notifications.forEach((notif) => {
      const timestamp = new Date(notif.timestamp).getTime();
      if (timestamp > oneDayAgo) {
        today.push(notif);
      } else if (timestamp > oneWeekAgo) {
        thisWeek.push(notif);
      } else {
        older.push(notif);
      }
    });

    const sections = [];
    if (today.length > 0) sections.push({ title: 'Hari Ini', data: today });
    if (thisWeek.length > 0) sections.push({ title: 'Minggu Ini', data: thisWeek });
    if (older.length > 0) sections.push({ title: 'Lebih Lama', data: older });

    return sections;
  };

  const handleMarkAllRead = () => {
    Vibration.vibrate(50);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    Alert.alert('Berhasil', 'Semua notifikasi ditandai sudah dibaca');
  };

  const handleToggleNotifications = (value: boolean) => {
    Vibration.vibrate(50);
    setNotificationsEnabled(value);
    Alert.alert(
      value ? 'Notifikasi Diaktifkan' : 'Notifikasi Dinonaktifkan',
      value 
        ? 'Anda akan menerima notifikasi dari aplikasi'
        : 'Anda tidak akan menerima notifikasi dari aplikasi'
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Berhasil', 'Notifikasi telah diperbarui');
    }, 1500);
  };

  const handleNotificationPress = (notification: Notification) => {
    Vibration.vibrate(50);
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Navigate based on type
    if (notification.type === 'warning' && notification.title.includes('Membership')) {
      navigation.navigate('StatusMembership');
    } else if (notification.type === 'info' && notification.title.includes('Promo')) {
      navigation.navigate('Promotion');
    }
  };

  const getIconConfig = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle' as const, color: SUCCESS };
      case 'warning':
        return { name: 'warning' as const, color: WARNING };
      case 'error':
        return { name: 'close-circle' as const, color: ERROR };
      case 'info':
      default:
        return { name: 'information-circle' as const, color: PRIMARY };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const iconConfig = getIconConfig(item.type);

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.read && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${iconConfig.color}20` }]}>
          <Ionicons name={iconConfig.name} size={24} color={iconConfig.color} />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Controls */}
      <View style={styles.controlsSection}>
        <View style={styles.controlRow}>
          <View style={styles.controlLeft}>
            <Ionicons name="notifications" size={20} color={PRIMARY} />
            <Text style={styles.controlLabel}>Notifikasi</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#D1D5DB', true: PRIMARY }}
            thumbColor={WHITE}
          />
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
            <Ionicons name="checkmark-done" size={18} color={PRIMARY} />
            <Text style={styles.markAllText}>Tandai Sudah Dibaca Semua ({unreadCount})</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <SectionList
        sections={groupNotificationsByDate()}
        renderItem={renderNotificationItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[PRIMARY]}
            tintColor={PRIMARY}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={80} color={TEXT_GRAY} />
            <Text style={styles.emptyTitle}>Belum Ada Notifikasi</Text>
            <Text style={styles.emptyText}>
              Notifikasi akan muncul di sini
            </Text>
          </View>
        }
      />
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
  controlsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: GRAY_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginLeft: 10,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
    marginLeft: 6,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_GRAY,
    textTransform: 'uppercase',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_LIGHT,
  },
  unreadCard: {
    backgroundColor: 'rgba(0, 119, 182, 0.03)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: TEXT_GRAY,
    lineHeight: 20,
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 20,
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
