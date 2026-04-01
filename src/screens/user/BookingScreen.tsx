/**
 * MARKIR - Booking Screen
 * @author Valdo Muhammad
 * Fitur: Booking tempat parkir terdekat dengan real location
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const PRIMARY = '#0077B6';
const WHITE = '#FFFFFF';
const GRAY_LIGHT = '#F5F5F5';
const TEXT_DARK = '#171717';
const TEXT_GRAY = '#757575';
const SUCCESS = '#2ecc71';

interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  availableSpots: number;
  distance?: number;
  pricePerHour: number;
}

const MOCK_PARKING_SPOTS: ParkingSpot[] = [
  { id: 'P001', name: 'Mall Central Park', address: 'Jl. Central Park No. 1', availableSpots: 45, pricePerHour: 5000 },
  { id: 'P002', name: 'Kampus UIGM', address: 'Universitas Indo Global Mandiri', availableSpots: 120, pricePerHour: 2000 },
  { id: 'P003', name: 'Stasiun Kereta', address: 'Jl. Stasiun No. 1', availableSpots: 30, pricePerHour: 3000 },
];

export const BookingScreen = ({ navigation, route }: any) => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(MOCK_PARKING_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [duration, setDuration] = useState(2); // hours

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    } catch (error) {
      console.error('Location Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedSpot) {
      Alert.alert('Error', 'Pilih lokasi parkir terlebih dahulu!');
      return;
    }

    const totalCost = selectedSpot.pricePerHour * duration;
    Alert.alert(
      '✅ Booking Berhasil!',
      `Lokasi: ${selectedSpot.name}\nDurasi: ${duration} jam\nTotal: Rp ${totalCost.toLocaleString('id-ID')}\n\nBooking ID: BK${Date.now()}\n\nSilakan datang sesuai jadwal.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Mencari parkir terdekat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Parkir</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="calendar" size={24} color={PRIMARY} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Booking untuk Hari Ini</Text>
            <Text style={styles.infoSubtitle}>{bookingDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
        </View>

        <View style={styles.durationSelector}>
          <Text style={styles.sectionTitle}>Durasi Parkir</Text>
          <View style={styles.durationButtons}>
            {[1, 2, 3, 4, 6, 8].map(hours => (
              <TouchableOpacity
                key={hours}
                style={[styles.durationButton, duration === hours && styles.durationButtonActive]}
                onPress={() => setDuration(hours)}
              >
                <Text style={[styles.durationButtonText, duration === hours && styles.durationButtonTextActive]}>
                  {hours} jam
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pilih Lokasi Parkir</Text>
        {parkingSpots.map(spot => (
          <TouchableOpacity
            key={spot.id}
            style={[styles.spotCard, selectedSpot?.id === spot.id && styles.spotCardSelected]}
            onPress={() => setSelectedSpot(spot)}
          >
            <View style={styles.spotHeader}>
              <Ionicons name="location" size={24} color={selectedSpot?.id === spot.id ? PRIMARY : TEXT_GRAY} />
              <View style={styles.spotInfo}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <Text style={styles.spotAddress}>{spot.address}</Text>
              </View>
              {selectedSpot?.id === spot.id && (
                <Ionicons name="checkmark-circle" size={28} color={SUCCESS} />
              )}
            </View>
            <View style={styles.spotDetails}>
              <View style={styles.spotDetailItem}>
                <Ionicons name="car-sport-outline" size={16} color={TEXT_GRAY} />
                <Text style={styles.spotDetailText}>{spot.availableSpots} tersedia</Text>
              </View>
              <View style={styles.spotDetailItem}>
                <Ionicons name="cash-outline" size={16} color={TEXT_GRAY} />
                <Text style={styles.spotDetailText}>Rp {spot.pricePerHour.toLocaleString()}/jam</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {selectedSpot && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Ringkasan Booking</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Lokasi:</Text>
              <Text style={styles.summaryValue}>{selectedSpot.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Durasi:</Text>
              <Text style={styles.summaryValue}>{duration} jam</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Biaya per jam:</Text>
              <Text style={styles.summaryValue}>Rp {selectedSpot.pricePerHour.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryTotalLabel}>Total:</Text>
              <Text style={styles.summaryTotalValue}>Rp {(selectedSpot.pricePerHour * duration).toLocaleString()}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Ionicons name="checkmark-circle" size={24} color={WHITE} />
          <Text style={styles.bookButtonText}>Konfirmasi Booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GRAY_LIGHT,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: TEXT_GRAY,
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    margin: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  durationSelector: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: WHITE,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  durationButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  durationButtonTextActive: {
    color: WHITE,
  },
  spotCard: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  spotCardSelected: {
    borderColor: PRIMARY,
  },
  spotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  spotInfo: {
    flex: 1,
    marginLeft: 12,
  },
  spotName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  spotAddress: {
    fontSize: 13,
    color: TEXT_GRAY,
  },
  spotDetails: {
    flexDirection: 'row',
  },
  spotDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  spotDetailText: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginLeft: 6,
  },
  summaryCard: {
    backgroundColor: WHITE,
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  summaryTotal: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY,
  },
  footer: {
    padding: 20,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bookButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
