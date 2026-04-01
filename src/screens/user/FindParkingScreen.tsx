/**
 * MARKIR - Find Parking Screen (REAL LOCATION)
 * @author Valdo Muhammad
 * Fitur: Mencari lokasi parkir terdekat dengan GPS real-time
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
  Linking,
  Platform,
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
const WARNING = '#F59E0B';

interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  availableSpots: number;
  totalSpots: number;
  pricePerHour: number;
  distance?: number;
  facilities: string[];
  openHours: string;
}

// Mock parking locations (ganti dengan data real dari backend)
const MOCK_PARKING_LOCATIONS: ParkingLocation[] = [
  {
    id: 'P001',
    name: 'Parkiran Mall Central Park',
    address: 'Jl. Central Park No. 1, Jakarta Barat',
    latitude: -6.175110,
    longitude: 106.790443,
    availableSpots: 45,
    totalSpots: 200,
    pricePerHour: 5000,
    facilities: ['CCTV', '24 Jam', 'Covered', 'Security'],
    openHours: '24 Jam',
  },
  {
    id: 'P002',
    name: 'Kampus UIGM Parkir Utama',
    address: 'Universitas Indo Global Mandiri, Palembang',
    latitude: -2.990934,
    longitude: 104.756554,
    availableSpots: 120,
    totalSpots: 300,
    pricePerHour: 2000,
    facilities: ['CCTV', 'Outdoor', 'Security'],
    openHours: '06:00 - 22:00',
  },
  {
    id: 'P003',
    name: 'Stasiun Kereta Api - Parkir A',
    address: 'Jl. Stasiun No. 1, Jakarta Pusat',
    latitude: -6.214800,
    longitude: 106.845600,
    availableSpots: 30,
    totalSpots: 150,
    pricePerHour: 3000,
    facilities: ['CCTV', 'Covered', '24 Jam'],
    openHours: '24 Jam',
  },
  {
    id: 'P004',
    name: 'Bandara Soekarno-Hatta Terminal 2',
    address: 'Bandara Soekarno-Hatta, Tangerang',
    latitude: -6.125660,
    longitude: 106.655800,
    availableSpots: 200,
    totalSpots: 500,
    pricePerHour: 8000,
    facilities: ['CCTV', 'Covered', '24 Jam', 'Valet'],
    openHours: '24 Jam',
  },
  {
    id: 'P005',
    name: 'Plaza Senayan Basement',
    address: 'Jl. Asia Afrika, Jakarta Selatan',
    latitude: -6.225000,
    longitude: 106.799700,
    availableSpots: 80,
    totalSpots: 400,
    pricePerHour: 6000,
    facilities: ['CCTV', 'Covered', 'Lift', 'Security'],
    openHours: '09:00 - 22:00',
  },
];

export const FindParkingScreen = ({ navigation }: any) => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [parkingLocations, setParkingLocations] = useState<ParkingLocation[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');

      if (status === 'granted') {
        getUserLocation();
      } else {
        setIsLoadingLocation(false);
        Alert.alert(
          'Izin Lokasi Diperlukan',
          'Aplikasi memerlukan akses lokasi untuk menemukan parkir terdekat.',
          [
            { text: 'Batal', style: 'cancel' },
            { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Location Permission Error:', error);
      setIsLoadingLocation(false);
      setLocationPermission(false);
    }
  };

  const getUserLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation(location);
      calculateDistances(location);
    } catch (error) {
      console.error('Get Location Error:', error);
      Alert.alert('Error', 'Gagal mendapatkan lokasi Anda. Pastikan GPS aktif.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const calculateDistances = (userLoc: Location.LocationObject) => {
    const locationsWithDistance = MOCK_PARKING_LOCATIONS.map(parking => {
      const distance = calculateDistance(
        userLoc.coords.latitude,
        userLoc.coords.longitude,
        parking.latitude,
        parking.longitude
      );
      return { ...parking, distance };
    });

    // Sort by distance (nearest first)
    locationsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    setParkingLocations(locationsWithDistance);
  };

  // Haversine formula untuk menghitung jarak antara 2 koordinat GPS
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius bumi dalam km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };

  const openDirections = (parking: ParkingLocation) => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
      default: 'https://www.google.com/maps',
    });
    
    const url = Platform.select({
      ios: `${scheme}?daddr=${parking.latitude},${parking.longitude}`,
      android: `${scheme}${parking.latitude},${parking.longitude}?q=${parking.latitude},${parking.longitude}(${parking.name})`,
      default: `${scheme}?q=${parking.latitude},${parking.longitude}`,
    });

    Linking.openURL(url as string).catch(() => {
      Alert.alert('Error', 'Gagal membuka aplikasi maps.');
    });
  };

  const getAvailabilityColor = (available: number, total: number): string => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return SUCCESS;
    if (percentage > 20) return WARNING;
    return '#EF4444';
  };

  if (isLoadingLocation) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Mencari lokasi Anda...</Text>
          <Text style={styles.loadingSubtext}>Pastikan GPS aktif</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!locationPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Parking</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={80} color={TEXT_GRAY} />
          <Text style={styles.errorTitle}>Izin Lokasi Diperlukan</Text>
          <Text style={styles.errorText}>
            Aplikasi memerlukan akses lokasi untuk menemukan parkir terdekat dari Anda.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={requestLocationPermission}>
            <Text style={styles.retryButtonText}>Berikan Izin Lokasi</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Find Parking</Text>
        <TouchableOpacity onPress={getUserLocation} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Location Card */}
        {userLocation && (
          <View style={styles.locationCard}>
            <Ionicons name="location" size={24} color={PRIMARY} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Lokasi Anda Saat Ini</Text>
              <Text style={styles.locationCoords}>
                {userLocation.coords.latitude.toFixed(6)}, {userLocation.coords.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        )}

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={PRIMARY} />
          <Text style={styles.infoBannerText}>
            Menampilkan {parkingLocations.length} lokasi parkir terdekat
          </Text>
        </View>

        {/* Parking Locations List */}
        {parkingLocations.map((parking) => (
          <View key={parking.id} style={styles.parkingCard}>
            <View style={styles.parkingHeader}>
              <View style={styles.parkingTitleRow}>
                <Ionicons name="car-sport" size={24} color={PRIMARY} />
                <Text style={styles.parkingName}>{parking.name}</Text>
              </View>
              {parking.distance !== undefined && (
                <View style={styles.distanceBadge}>
                  <Ionicons name="navigate" size={14} color={WHITE} />
                  <Text style={styles.distanceText}>{parking.distance.toFixed(1)} km</Text>
                </View>
              )}
            </View>

            <Text style={styles.parkingAddress}>{parking.address}</Text>

            {/* Availability Bar */}
            <View style={styles.availabilityContainer}>
              <View style={styles.availabilityBar}>
                <View
                  style={[
                    styles.availabilityFill,
                    {
                      width: `${(parking.availableSpots / parking.totalSpots) * 100}%`,
                      backgroundColor: getAvailabilityColor(parking.availableSpots, parking.totalSpots),
                    },
                  ]}
                />
              </View>
              <Text style={styles.availabilityText}>
                {parking.availableSpots} / {parking.totalSpots} tersedia
              </Text>
            </View>

            {/* Info Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="cash-outline" size={16} color={TEXT_GRAY} />
                <Text style={styles.infoItemText}>Rp {parking.pricePerHour.toLocaleString()}/jam</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={16} color={TEXT_GRAY} />
                <Text style={styles.infoItemText}>{parking.openHours}</Text>
              </View>
            </View>

            {/* Facilities */}
            <View style={styles.facilitiesRow}>
              {parking.facilities.map((facility, index) => (
                <View key={index} style={styles.facilityBadge}>
                  <Text style={styles.facilityText}>{facility}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={() => openDirections(parking)}
              >
                <Ionicons name="navigate-outline" size={20} color={WHITE} />
                <Text style={styles.directionsButtonText}>Rute</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() =>
                  navigation.navigate('Booking', { parkingId: parking.id, parkingName: parking.name })
                }
              >
                <Ionicons name="calendar-outline" size={20} color={PRIMARY} />
                <Text style={styles.bookButtonText}>Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: TEXT_GRAY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginTop: 16,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
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
  refreshButton: {
    padding: 8,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'monospace',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 119, 182, 0.05)',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },
  infoBannerText: {
    marginLeft: 12,
    fontSize: 13,
    color: TEXT_DARK,
  },
  parkingCard: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  parkingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  parkingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  parkingName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginLeft: 12,
    flex: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  distanceText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  parkingAddress: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginBottom: 12,
    lineHeight: 18,
  },
  availabilityContainer: {
    marginBottom: 12,
  },
  availabilityBar: {
    height: 8,
    backgroundColor: GRAY_LIGHT,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  availabilityFill: {
    height: '100%',
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: TEXT_GRAY,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoItemText: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginLeft: 6,
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  facilityBadge: {
    backgroundColor: GRAY_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 11,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  directionsButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  bookButtonText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});
